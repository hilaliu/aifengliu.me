import moment from 'moment'
/**
 * Format date
 * @param date - The date to format
 * @returns The formatted date
 */
export function formatDate(date: string) {
  return moment(date).format('dddd, MMMM Do YYYY')
}

/**
 * Deduplicate array
 * @param array - The array to deduplicate
 * @returns The deduplicated array
 */
export function deduplicateArray<T>(array: T[]) {
  return [...new Set(array)]
}
