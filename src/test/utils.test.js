import { describe, it, expect } from 'vitest'
import {
  formatFileSize,
  formatCurrency,
  calcBillableHours,
  calcInvoiceTotal,
} from '../utils.js'

// ─── formatFileSize ───────────────────────────────────────────────────────────

describe('formatFileSize', () => {
  it('returns "0 B" for zero bytes', () => {
    expect(formatFileSize(0)).toBe('0 B')
  })

  it('formats bytes', () => {
    expect(formatFileSize(500)).toBe('500 B')
  })

  it('formats kilobytes', () => {
    expect(formatFileSize(1024)).toBe('1 KB')
  })

  it('formats megabytes', () => {
    expect(formatFileSize(1024 * 1024)).toBe('1 MB')
  })

  it('formats gigabytes', () => {
    expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB')
  })

  it('rounds to one decimal place', () => {
    expect(formatFileSize(1536)).toBe('1.5 KB')
  })
})

// ─── formatCurrency ───────────────────────────────────────────────────────────

describe('formatCurrency', () => {
  it('formats whole dollar amounts', () => {
    expect(formatCurrency(100)).toBe('$100.00')
  })

  it('formats cents', () => {
    expect(formatCurrency(99.99)).toBe('$99.99')
  })

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0.00')
  })

  it('formats large amounts with commas', () => {
    expect(formatCurrency(1500)).toBe('$1,500.00')
  })
})

// ─── calcBillableHours ────────────────────────────────────────────────────────

describe('calcBillableHours', () => {
  it('returns 0 for empty events', () => {
    expect(calcBillableHours([])).toBe(0)
  })

  it('sums only billable events', () => {
    const events = [
      { billable: true,  duration: 2 },
      { billable: false, duration: 1 },
      { billable: true,  duration: 3 },
    ]
    expect(calcBillableHours(events)).toBe(5)
  })

  it('returns 0 when no events are billable', () => {
    const events = [
      { billable: false, duration: 2 },
      { billable: false, duration: 4 },
    ]
    expect(calcBillableHours(events)).toBe(0)
  })
})

// ─── calcInvoiceTotal ─────────────────────────────────────────────────────────

describe('calcInvoiceTotal', () => {
  it('calculates total from rate and hours', () => {
    expect(calcInvoiceTotal(150, 10)).toBe(1500)
  })

  it('deducts pro bono hours', () => {
    expect(calcInvoiceTotal(150, 10, 2)).toBe(1200)
  })

  it('returns 0 when all hours are pro bono', () => {
    expect(calcInvoiceTotal(150, 5, 5)).toBe(0)
  })

  it('does not go below 0 for excessive pro bono', () => {
    expect(calcInvoiceTotal(150, 3, 10)).toBe(0)
  })
})
