import path from 'path'
import fs from 'fs-extra'
import { config, IVars, ICommand } from './config'

function assertExistTemplate(templatePath: string) {
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template file '${templatePath}' does not exists`)
  }
}

function overrideProtect(path: string) {
  if (fs.existsSync(path)) {
    throw new Error(`Rendering destination '${path}' already exists, stopping.`)
  }
}

function processVars(varDefs: IVars, vars: any) {
  // loop through "vars" section in config
  for (const varNameDef in varDefs) {
    // does not have default, not provided in CLI parameter
    if (typeof varDefs[varNameDef].default === 'undefined' &&
      typeof vars[varNameDef] === 'undefined') {

      throw new Error(`Var '${varNameDef}' does not have \
default value and must be provided as CLI parameter '--${varNameDef} <value>'`)

    } 
    // has default, not provided in CLI parameter
    else if(typeof varDefs[varNameDef].default !== 'undefined') {
      // use default value
      vars[varNameDef] = varDefs[varNameDef].default
    }
  }

}

function assertUniqueDestPaths(cmd: ICommand) {
  const dupes: string[] = []
  const dests = cmd.render.map(rnd => rnd.dest)
  dests.map((dest, i) => {
    if (dests.lastIndexOf(dest) !== i) {
      dupes.push(dest)
    }
  })
  if (dupes.length) {
    throw new Error(`Found duplicate 'dest' paths in 'render', \
preventing accidental overrides during generation of: ${dupes.join(', ')}`)
  }
}

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
  gen(command: string, vars: any) {
    const templateCommand = config.scaffolding[command]
    const templateFolder = config.templateFolder || 'templates'

    if (!templateCommand) {
      throw new Error(`Scaffolding command '${command}' does not exist in scarfold file`)
    }

    const renderItems = templateCommand.render

    // check
    assertUniqueDestPaths(templateCommand)
    for (const renderItem of renderItems) {
      const templatePath = path.join(templateFolder, renderItem.template)
      const destinationPath = renderTemplate(renderItem.dest, vars)

      assertExistTemplate(templatePath)
      overrideProtect(destinationPath)
      processVars(templateCommand.vars, vars)
    }

    // execution
    for (const renderItem of renderItems) {
      const templatePath = path.join(templateFolder, renderItem.template)
      const destinationPath = renderTemplate(renderItem.dest, vars)
      const rendered = renderTemplate(loadTemplate(templatePath), vars)
      //writeTemplate(rendered, destinationPath)
    }
  }
}
