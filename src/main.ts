import chalk from 'chalk'
import * as yargs from 'yargs'

import { loadConfig } from './config'
import { ScarfEngine } from './engine'
import util from './util';

/**
 * @description Main functionality, runs scaffolding engine for given template and vars
 */
function runEngine() {
  try {
    // load scarfold.json
    loadConfig()

    // initialize engine
    const engine = new ScarfEngine({
      override: cli.override,
    })

    // dupe cli arguments from yargs
    const vars = {
      ...cli,
    }

    // remove properties provided by yargs, and reserved options
    delete vars._
    delete vars.$0
    delete vars.override

    // run generation
    engine.gen(cli._[0], vars)

  } catch (e) {
    console.error(chalk.red(e.message))
    process.exit(1)
  }
}

const cli = yargs.usage('Usage: $0 <template> [options] [variables]')
  .command('init', 'initialize the scarfold environment (create scarfold.json and templates folder)')
  .command('<template>', 'scaffold a <template>', (args) => {
    return args.demandCommand()
  })
  .demandCommand(1)
  .option('override', {
    coerce: Boolean,
    default: false,
    description: 'turns off existing file protection (can override existing files). !DATA LOSS DANGER!',
  })
  .help('h')
  .alias('h', 'help')
  .example('$0', 'some_template --var1 4 --var2 7')
  .argv

switch (cli._[0]) {
  case 'init':
    util.createEnvironment()
    break
  default:
    runEngine()
    break
}
