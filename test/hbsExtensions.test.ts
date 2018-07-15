import { expect } from 'chai'

import { camelCase, noCase, pascalCase } from '../src/hbsExtensions'

describe('hbsExtensions.camelCase', () => {
  it('handles nulls', () => {
    expect(camelCase(null, undefined)).to.equal('')
  })

  it('converts single word', () => {
    expect(camelCase('Camel')).to.equal('camel')
  })

  it('converts multiple words', () => {
    expect(camelCase('Camel Is Best yo'))
      .to.equal('camel is best yo')
  })

  it('converts dashes to camel case', () => {
    expect(camelCase('i-will-be-back'))
      .to.equal('iWillBeBack')
  })

  it('converts dashes to camel case with multiple words', () => {
    expect(camelCase('one-does-not-simply walz into-mordor'))
      .to.equal('oneDoesNotSimply walz intoMordor')
  })
})

describe('hbsExtensions.pascalCase', () => {
  it('handles nulls', () => {
    expect(pascalCase(null, undefined)).to.equal('')
  })

  it('converts single word', () => {
    expect(pascalCase('pascal')).to.equal('Pascal')
  })

  it('converts multiple words', () => {
    expect(pascalCase('pascal is Best yo'))
      .to.equal('Pascal Is Best Yo')
  })

  it('converts dashes to pascal case', () => {
    expect(pascalCase('i-will-be-back'))
      .to.equal('IWillBeBack')
  })

  it('converts dashes to pascal case with multiple words', () => {
    expect(pascalCase('one-does-not-simply walz into-mordor'))
      .to.equal('OneDoesNotSimply Walz IntoMordor')
  })
})

describe('hbsExtensions.noCase', () => {
  it('handles nulls', () => {
    expect(noCase(null, undefined)).to.equal('')
  })

  it('converts single word', () => {
    expect(noCase('pascal')).to.equal('pascal')
  })

  it('converts multiple words', () => {
    expect(noCase('none is best yo'))
      .to.equal('none is best yo')
  })

  it('converts dashes to no case', () => {
    expect(noCase('I-Will-be-back'))
      .to.equal('IWillbeback')
  })

  it('converts dashes to pascal case with multiple words', () => {
    expect(noCase('one-does-not-simply Walz into-Mordor'))
      .to.equal('onedoesnotsimply Walz intoMordor')
  })
})
