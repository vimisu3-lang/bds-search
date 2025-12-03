import { QnA } from './types';

/**
 * Parses a raw CSV string into an array of QnA objects.
 * Handles quoted fields containing commas and escaped quotes.
 */
export const parseCSV = (csvText: string): QnA[] => {
  // Clean up BOM if present
  const cleanText = csvText.replace(/^\uFEFF/, '');
  
  const rawLines = cleanText.split(/\r?\n/);
  const result: QnA[] = [];

  // Improved Regex to match CSV fields: 
  // 1. Single quoted string: '...'
  // 2. Double quoted string: "..." (handles escaped "" inside)
  // 3. Unquoted string: anything except , ' " \r \n
  const reValue = /(?!\s*$)\s*(?:'([^']*)'|"((?:[^"]|"")*)"|([^,'"\r\n]*))\s*(?:,|$)/g;

  let idCounter = 1;

  for (let i = 1; i < rawLines.length; i++) { // Skip header
    const line = rawLines[i].trim();
    if (!line) continue;

    // Return a list of values
    const values: string[] = [];
    let match;
    // Reset lastIndex for the regex loop
    reValue.lastIndex = 0;
    
    while ((match = reValue.exec(line)) !== null) {
      // match[1] is single quoted
      // match[2] is double quoted (may contain "")
      // match[3] is unquoted
      let val = match[1] || match[2] || match[3] || '';
      
      // Unescape double quotes: "" -> "
      val = val.replace(/""/g, '"'); 
      values.push(val);
    }

    if (values.length >= 2) {
      const question = values[0];
      // Join the rest as answer in case there were extra columns parsed or just take the second column
      // For this specific dataset which is strictly 2 columns, values[1] is the answer.
      // We join mainly as a fallback if the parsing logic split the answer unexpectedly, 
      // though the regex should handle commas inside quotes correctly now.
      const answer = values.slice(1).join(", "); 
      
      if (question || answer) {
          result.push({
            id: idCounter++,
            question: question.trim(),
            answer: answer.trim()
          });
      }
    }
  }
  return result;
};

/**
 * Normalizes text for search (removes accents, lowercase).
 */
export const normalizeText = (str: string): string => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
};