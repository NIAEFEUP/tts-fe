import { describe, expect, it } from 'bun:test'
import { normalizeNmec } from './nmec'

describe('normalizeNmec', () => {
  it('strips the display "up" prefix', () => {
    expect(normalizeNmec('up202207150')).toBe('202207150')
    expect(normalizeNmec('UP202207150')).toBe('202207150')
  })

  it('leaves bare digits untouched and trims whitespace', () => {
    expect(normalizeNmec('202207150')).toBe('202207150')
    expect(normalizeNmec(' 202207150 ')).toBe('202207150')
  })
})
