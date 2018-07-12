import chalk from 'chalk'
import fs from 'fs-extra'
import handlebars from 'handlebars'
import path from 'path'

import { config, ICommand, IVars } from './config'

export class ScarfEngine {
  public gen(command: string, vars: any) {
    const templateCommand = config.scaffolding[command]
    const templateFolder = config.templateFolder || 'templates'

    if (!templateCommand) {
      throw new Error(`Scaffolding command '${command}' does not exist in scarfold file`)
    }

    const renderItems = templateCommand.render

    // check
    this.assertUniqueDestPaths(templateCommand)
    this.processVars(templateCommand.vars, vars)
    for (const renderItem of renderItems) {
      const templatePath = path.join(templateFolder, renderItem.template)
      const destinationPath = this.renderTemplate(renderItem.dest, vars)

      this.assertExistTemplate(templatePath)
      this.overrideProtect(destinationPath)
    }

    // execution
    for (const renderItem of renderItems) {
      const templatePath = path.join(templateFolder, renderItem.template)
      const destinationPath = this.renderTemplate(renderItem.dest, vars)
      const rendered = this.renderTemplate(this.loadTemplate(templatePath), vars)
      this.writeTemplate(rendered, destinationPath)
      console.log(chalk.green(`+ ${destinationPath}`))
    }
  }

  private assertExistTemplate(templatePath: string) {
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template file '${templatePath}' does not exists`)
    }
  }

  private overrideProtect(protectedPath: string) {
    if (fs.existsSync(protectedPath)) {
      throw new Error(`Rendering destination '${protectedPath}' already exists, stopping.`)
    }
  }

  private processVars(varDefs: IVars, vars: any) {
    // loop through "vars" section in config
    for (const varNameDef in varDefs) {
      if (typeof varDefs[varNameDef].default === 'undefined' &&
        typeof vars[varNameDef] === 'undefined') {
      // does not have default, not provided in CLI parameter

        throw new Error(`Var '${varNameDef}' does not have \
default value and must be provided as CLI parameter '--${varNameDef} <value>'`)

      } else if (typeof varDefs[varNameDef].default !== 'undefined' &&
        // has default, not provided in CLI parameter

        typeof vars[varNameDef] === 'undefined') {
        // use default value
        vars[varNameDef] = varDefs[varNameDef].default
      }
    }
  }

  private assertUniqueDestPaths(cmd: ICommand) {
    const dupes: string[] = []
    const dests = cmd.render.map((rnd) => rnd.dest)
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

  private loadTemplate(templatePath: string): string {
    return fs.readFileSync(templatePath, { encoding: 'utf-8' })
  }

  private renderTemplate(templateContents: string, vars: any): string {
    return handlebars.compile(templateContents)(vars)
  }

  private writeTemplate(rendered: string, destPath: string) {
    fs.mkdirpSync(path.dirname(destPath))
    fs.writeFileSync(destPath, rendered)
  }
}
