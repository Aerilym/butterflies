export function capitaliseWords(string: string): string {
  const words = string.split(' ');
  const capitalisedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  return capitalisedWords.join(' ');
}
