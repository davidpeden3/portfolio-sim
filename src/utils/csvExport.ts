/**
 * Utility functions for CSV export
 */

/**
 * Formats a number to have at most 4 decimal places
 */
function formatNumber(value: number): string {
  if (Number.isInteger(value)) {
    return value.toString();
  }
  return value.toFixed(4);
}

/**
 * Converts data to CSV format and triggers download
 * @param data Array of objects to convert to CSV
 * @param filename Name of the file to download
 * @param columns Optional array of column definitions with keys and headers
 */
export function downloadCSV<T extends object>(
  data: T[], 
  filename: string, 
  columns?: { key: keyof T; header: string }[]
): void {
  if (!data || data.length === 0) {
    console.warn('No data provided for CSV export');
    return;
  }

  // If columns are not specified, generate them from the first data item
  const cols = columns || Object.keys(data[0] as object).map(key => ({
    key: key as keyof T,
    header: key as string
  }));

  // Create CSV header row
  const headerRow = cols.map(col => `"${col.header}"`).join(',');

  // Create CSV data rows
  const csvRows = data.map(item => {
    return cols.map(col => {
      const value = item[col.key];
      
      // Handle different types of values
      if (value === null || value === undefined) {
        return '""';
      } 
      
      // Use type assertions to silence warnings while preserving type safety
      const valueType = typeof value;
      
      if (valueType === 'string') {
        // Escape quotes in strings with proper type handling
        const strValue = value as string;
        return `"${strValue.replace(/"/g, '""')}"`;
      } 
      
      if (valueType === 'number') {
        // Format numbers with limited decimal places
        const numValue = value as number;
        return formatNumber(numValue);
      } 
      
      // Handle any other type by converting to string
      return `"${String(value)}"`;
    }).join(',');
  });

  // Combine header and data rows
  const csvContent = [headerRow, ...csvRows].join('\n');
  
  // Create a blob with the CSV data
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create a URL for the blob
  const url = URL.createObjectURL(blob);
  
  // Create a link element to trigger the download
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.display = 'none';
  
  // Add the link to the document, click it, and remove it
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL
  URL.revokeObjectURL(url);
}