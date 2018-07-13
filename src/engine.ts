import chalk from 'chalk'
import fs from 'fs-extra'
import handlebars from 'handlebars'
import path from 'path'

import { config, ICommand, IVars } from './config'

interface IScarfEngineOptions {
  override: boolean
}

export class ScarfEngine {
  private options: IScarfEngineOptions

  constructor(options?: IScarfEngineOptions) {
    // merge with default options
    this.options = {
      override: false,
      ...options,
    }
  }

  /**
   * @param command string command, which engine will look up in scarfold.json file, loads it and executes it
   * @param vars dict that contains user defined variables for template
   * @throws Error object whether there is validation error
   */
  public gen(command: string, vars: any) {
    // get command from config
    const templateCommand = config.scaffolding[command]

    // determine template folder, defaults to 'templates'
    const templateFolder = config.templateFolder || 'templates'

    if (!templateCommand) {
      throw new Error(`Scaffolding command '${command}' does not exist in scarfold file`)
    }

    // inidividual rendering items (mapping from which template to what destination)
    const renderItems = templateCommand.render

    // checks
    // check whether there is a render destination colliding with another
    // that way they will override each other (latter wins)
    this.assertUniqueDestPaths(templateCommand)

    // validate and expand default vars
    this.processVars(templateCommand.vars, vars)
    for (const renderItem of renderItems) {
      const templatePath = path.join(templateFolder, renderItem.template)

      // render destination path
      const destinationPath = this.renderTemplate(renderItem.dest, vars)

      // check whether template file exists
      this.assertExistTemplate(templatePath)

      if (!this.options.override) {
        // check whether destination file already exists (check disabled by --override option)
        this.overrideProtect(destinationPath)
      }
    }

    // execution
    for (const renderItem of renderItems) {
      const templatePath = path.join(templateFolder, renderItem.template)
      const destinationPath = this.renderTemplate(renderItem.dest, vars)

      // load and render template
      const rendered = this.renderTemplate(this.loadTemplate(templatePath), vars)

      // write to file
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
    const errors: string[] = []
    // loop through "vars" section in config
    for (const varNameDef in varDefs) {
      if (typeof varDefs[varNameDef].default === 'undefined' &&
        typeof vars[varNameDef] === 'undefined') {

        // does not have default value, not provided in CLI parameter
        errors.push(`Var '${varNameDef}' does not have \
default value and must be provided as CLI parameter '--${varNameDef} <value>'`)

      } else if (typeof varDefs[varNameDef].default !== 'undefined' &&
        // has default value, not provided in CLI parameter

        typeof vars[varNameDef] === 'undefined') {
        // use default value
        vars[varNameDef] = varDefs[varNameDef].default
      }
    }
    if (errors.length) {
      // report all required missing vars
      throw new Error(errors.join('\n'))
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
    // create folder structure recursively is it does not exist
    fs.mkdirpSync(path.dirname(destPath))
    fs.writeFileSync(destPath, rendered)
  }
}
