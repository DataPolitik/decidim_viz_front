/** Upper-cases the first letter, so every chart axis title reads the same way ("Comments", not "comments"). */
export function capitalizeFirst(text: string | undefined | null): string {
  if (!text) {
    return '';
  }
  return text.charAt(0).toLocaleUpperCase() + text.slice(1);
}
