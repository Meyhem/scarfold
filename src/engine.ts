import path from 'path'
import fs from 'fs-extra'
import { config } from './config'

function assertExistTemplate(templatePath: string) {
  if(!fs.existsSync(templatePath)) {
    throw new Error(`Template file '${templatePath}' does not exists`)
  }
}

function overrideProtect(path: string) {
  if (fs.existsSync(path)) {
    throw new Error(`Rendering destination '${path}' already exists, stopping.`)
  }
}

// function processVars(vars: any) {

// }

function loadTemplate(templatePath: string): string {
  return fs.readFileSync(templatePath, { encoding: 'utf-8' })
}

function renderTemplate(templateContents: string, vars: any): string {
  for (const varName in vars) {
    const reg = new RegExp(`##${varName}##`, 'gmi')
    const varValue = vars[varName]
    templateContents = templateContents.replace(reg, varValue)
  }
  return templateContents
}

function writeTemplate(rendered: string, destPath: string) {
  fs.mkdirpSync(path.dirname(destPath))
  fs.writeFileSync(destPath, rendered)
}

export class ScarfEngine {
  gen(template: string, vars: any) {
    const templateCommand = config.scaffolding[template]
    const templateFolder = config.templateFolder || 'templates'
   
    if (!templateCommand) {
      throw new Error(`Template '${template}' does not exist in scarfold file`)
    }

    const renderKeys = Object.keys(templateCommand.render)

    // check
    for (const renderKey of renderKeys) {
      const templatePath = path.join(templateFolder, renderKey)
      const destinationPath = renderTemplate(templateCommand.render[renderKey], vars)

      assertExistTemplate(templatePath)
      overrideProtect(destinationPath)
    }

    // execution
    for (const renderKey of renderKeys) {
      const templatePath = path.join(templateFolder, renderKey)
      const destinationPath = renderTemplate(templateCommand.render[renderKey], vars)
      const rendered = renderTemplate(loadTemplate(templatePath), vars)
      writeTemplate(rendered, destinationPath)
    }

  }
}
