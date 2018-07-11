import fs from 'fs'

import { Validator, Schema, ValidatorResult } from 'jsonschema'

export interface IConfig {
  templateFolder: string
  graceful: boolean
  scaffolding: {
    [command: string]: ICommand
  }
}

export interface ICommand {
  render: IRenderItem[]
  vars: IVars
}

export interface IRenderItem {
  template: string,
  dest: string
}

export interface IVars {
  [name: string]: {
    default?: string | number | boolean | null
  }
}

const rootSchema: Schema = {
  id: '/root',
  type: 'object',
  additionalProperties: false,
  properties: {
    templateFolder: { type: 'string' },
    graceful: { type: 'boolean' },
    scaffolding: {
      type: 'object',
      additionalProperties: {
        type: 'object',
        additionalProperties: false,
        properties: {
          render: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: { type: 'string' }
            }
          },
          vars: { 
            type: 'object',
            additionalProperties: {
              type: 'object',
              additionalProperties: false,
              properties: {
                default: { type: ['string', 'number', 'boolean', 'null']}
              }
            }
          }
        }
      }
    }
  }
}

export let config: IConfig;

export function loadConfig() {
  const contents = fs.readFileSync('scarfold.json', { encoding: 'utf-8' })
  let cfg: any

  cfg = JSON.parse(contents)

  const result = validateConfig(cfg)
  if (result.errors && result.errors.length) {
    let errStr = 'Invalid scarfold config file:\n'

    errStr = result.errors
      .map(err => `${err.property} ${err.message}`)
      .join('\n')

    throw new Error(errStr)
  }

  config = cfg
}

function validateConfig(cfg: any): ValidatorResult {
  const v = new Validator()
  return v.validate(cfg, rootSchema, { propertyName: 'scarfold' })
}
