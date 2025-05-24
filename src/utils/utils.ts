export const normalizeForFilePath = (input: string): string => {
  if (!input) return '';
  
  return input
    .toLowerCase()
    .replace(/\s+/g, "-")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]/g, "");
};