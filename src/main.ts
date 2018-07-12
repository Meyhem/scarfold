import * as yargs from 'yargs'
import chalk from 'chalk'

import { loadConfig } from './config'
import { ScarfEngine } from './engine'
import util from './util';

function engine() {
  try {
    loadConfig()
  } catch (e) {
    console.error(chalk.red(e.message))
    process.exit(1)
  }
  
  const engine = new ScarfEngine()
  try {
    let vars = {
      ...cli
    }
    delete vars._
    delete vars['$0']

    engine.gen(cli._[0], vars)
    
  } catch (e) {
    console.error(chalk.red(e.message))
  }
}

const cli = yargs.usage('Usage: $0 <template> [options] [variables]')
  .demandCommand(1)
  .help('h')
  .alias('h', 'help')
  .example('$0', 'some_template --var1 4 --var2 7')
  .argv

switch (cli._[0]) {
  case 'init': 
    util.createEnvironment()
    break
  default: 
    engine()
    break
}