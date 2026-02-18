/**
 * Shared billing utilities — importable by both the app and tests
 */

/**
 * Format a file size in bytes to human-readable string
 * e.g. 1024 → "1 KB"
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

/**
 * Format a dollar amount as USD currency
 * e.g. 150 → "$150.00"
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

/**
 * Calculate total billable hours from a list of calendar events
 * Only counts events where billable === true
 */
export function calcBillableHours(events) {
  return events
    .filter(e => e.billable)
    .reduce((sum, e) => sum + (Number(e.duration) || 0), 0)
}

/**
 * Calculate invoice total from rate, hours, and optional pro bono deduction
 */
export function calcInvoiceTotal(rate, hours, proBonoHours = 0) {
  const billable = Math.max(0, hours - proBonoHours)
  return rate * billable
}
