import { SURNAME_DB, getGenericInsight } from '../surnameData';

// Replaced the live API call with a static local lookup
// This ensures 0 runtime cost, no API keys, and instant results.

export const getSurnameInsight = async (surname: string): Promise<string> => {
  // We keep the async signature to minimize changes in App.tsx, 
  // but it resolves effectively instantly.
  
  const entry = SURNAME_DB[surname] || getGenericInsight(surname);
  
  // Format with bracketed headers and clear line breaks
  // This structure is parsed by App.tsx to apply custom styling
  return `【起源】\n${entry.origin}\n【寄语】\n${entry.poem}`;
};