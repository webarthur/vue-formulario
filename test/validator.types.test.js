import { expect, describe, it, test } from 'vitest'
import validator from '../src/validator'

describe('String format', () => {
  const validValues = [
    '',
    ' ',
    'hello',
    '42',
    new String('hello'),
  ]
  const invalidValues = [
    null,
    undefined,
    0,
    false,
  ]

  describe('valid strings', () => {
    test.each(validValues)('valid value: %p', (validValue) => {
      const result = validator({ type: 'string' }, { data: validValue })
      expect(result.valid).toBe(true)
    })
  })

  describe('invalid strings', () => {
    test.each(invalidValues)('valid value: %p', (invalidValue) => {
      const result = validator({ type: 'string' }, { data: invalidValue })
      expect(result.valid).toBe(true)
    })
  })

})
