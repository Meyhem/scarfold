import fs from 'fs-extra'
import chalk from 'chalk'

import { DEFAULT_CONFIG } from './config'

export default {
  lowercaseKeys(obj: any) {
    let key, keys = Object.keys(obj);
    let n = keys.length;
    let newobj: any = {}
    while (n--) {
      key = keys[n];
      newobj[key.toLowerCase()] = obj[key];
    }
    return newobj
  },

  createEnvironment() {
    try {
      if (!fs.existsSync('scarfold.json')) {
        fs.writeFileSync('scarfold.json', JSON.stringify(DEFAULT_CONFIG, null, 2))
        console.log(chalk.green('+ scarfold.json'))
      } else {
        console.log(chalk.green('\'scarfold.json\' already exists'))
      }
    } catch (e) {
      console.error(chalk.red(`Unable to create 'scarfold.json': ${e.message}`))
    }
    try {
      if (!fs.existsSync('templates')) {
        fs.mkdirSync('templates')
        console.log(chalk.green('+ templates/'))
      } else {
        console.log(chalk.green('\'templates\' folder already exists'))
      }

    } catch (e) {
      console.error(chalk.red(`Unable to create 'templates' folder: ${e.message}`))
    }
  }

}