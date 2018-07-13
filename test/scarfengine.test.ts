import { expect } from 'chai'

import { IConfig } from '../src/config'
import { ScarfEngine } from '../src/engine'
import { IFsUtil } from '../src/fsUtil'

// tslint:disable:no-unused-expression

function stubConfig(): IConfig {
  return {
    scaffolding: {
      testcmd: {
        render: [
        ],
        vars: {
        },
      },
    },
    templateFolder: 'templates',
  }
}

describe('scarfengine', () => {
  it('instantiates', () => {
    const depFs = {} as IFsUtil
    const depConf = {} as IConfig
    new ScarfEngine(depFs, depConf, { override: false })
  })

  it('throws on missing command', () => {
    const cfg = stubConfig()
    delete cfg.scaffolding.testcmd

    const depFs = {} as IFsUtil
    const eng = new ScarfEngine(depFs, cfg, { override: false })
    expect(() => {
      eng.gen('404', {})
    }).to.throw('Scaffolding command \'404\' does not exist in scarfold file')
  })

  it('assertUniqueDestPaths() asserts unique destination paths', () => {
    const cfg = stubConfig()

    cfg.scaffolding.testcmd.render.push({template: '', dest: 'dest.txt'})
    cfg.scaffolding.testcmd.render.push({template: '', dest: 'dest.txt'})

    const depFs = {} as IFsUtil
    const eng = new ScarfEngine(depFs, cfg, { override: false })
    expect(() => {
      eng.gen('testcmd', {})
    }).to.throw('dest.txt')
  })

  it('processVars() checks for missing vars', () => {
    const cfg = stubConfig()

    cfg.scaffolding.testcmd.render.push({template: '', dest: 'dest.txt'})
    cfg.scaffolding.testcmd.vars.requiredVar = { }

    const depFs = {} as IFsUtil
    const eng = new ScarfEngine(depFs, cfg, { override: false })
    expect(() => {
      eng.gen('testcmd', {})
    }).to.throw('requiredVar')
  })

  it('assertExistTemplate() checks if template exists', () => {
    const cfg = stubConfig()

    cfg.scaffolding.testcmd.render.push({template: 'huehue.hue', dest: 'dest.txt'})

    const depFs = {
      exists: (_: string) => false,
    } as IFsUtil

    const eng = new ScarfEngine(depFs, cfg, { override: false })
    expect(() => {
      eng.gen('testcmd', {})
    }).to.throw('huehue.hue')
  })

  it('overrideProtect() prevents accidental override', () => {
    const cfg = stubConfig()

    cfg.scaffolding.testcmd.render.push({template: 'huehue.hue', dest: 'dest.txt'})

    const depFs = {
      exists: (_: string) => true,
    } as IFsUtil

    const eng = new ScarfEngine(depFs, cfg, { override: false })
    expect(() => {
      eng.gen('testcmd', {})
    }).to.throw('dest.txt')
  })

  it('renders template correctly', () => {
    const cfg = stubConfig()
    let renderred: {contents: string, path: string}

    cfg.scaffolding.testcmd.render.push({template: 'templ.hbs', dest: '{{name}}.txt'})

    const depFs = {
      exists: (path: string) => {
        return path.indexOf('templ.hbs') !== -1 // fake template existence but nothing else
      },
      gFileWrite: (contents: string, path: string) => {
        renderred = { contents, path } // for later consumption
      },
      loadFile: () => {
        return '{{name}}-Bacon Ipsum'
      },
    } as IFsUtil

    const eng = new ScarfEngine(depFs, cfg, { override: false })
    expect(() => {
      eng.gen('testcmd', {name: 'MAGIC-STRING'})
    }).not.to.throw()
    expect(renderred!.contents).to.equal('MAGIC-STRING-Bacon Ipsum')
    expect(renderred!.path).to.contain('MAGIC-STRING.txt')
  })
})
