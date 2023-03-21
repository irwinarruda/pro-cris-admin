export function areSimilar(str1: string, str2: string) {
  return str1.toLowerCase().replace(/\s/g, '').includes(str2.toLowerCase().replace(/\s/g, ''));
}
