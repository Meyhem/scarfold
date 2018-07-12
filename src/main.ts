import * as yargs from 'yargs'
import chalk from 'chalk'

import { loadConfig } from './config'
import { ScarfEngine } from './engine'
import util from './util';

try {
  loadConfig()
} catch (e) {
  console.error(chalk.red(e.message))
  process.exit(1)
}

const cli = yargs.usage('Usage: $0 <template> [options] [variables]')
  .demandCommand(1)
  .help('h')
  .alias('h', 'help')
  .example('$0', 'some_template --var1 4 --var2 7')
  .argv

const engine = new ScarfEngine()
try {
  let vars = {
    ...cli
  }

  delete vars._
  delete vars['$0']
  vars = util.lowercaseKeys(vars)
  engine.gen(cli._[0], vars)
} catch (e) {
  console.error(chalk.red(e.message))
}

// cli.command('gen <template>')
//   .allowUnknownOption()
//   .option('--vars <variables>')
//   .action(function (template: string) {
//     console.dir(cli)
//     const engine = new ScarfEngine()
//     try {
//       engine.gen(template)
//     } catch (e) {
//       console.error(chalk.red(e.message))
//     }
//   })
