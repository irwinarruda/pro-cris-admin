export function removeLastSlash(path: string): string {
  if (path[path.length - 1] === '/') {
    return path.replace(/\/$/, '');
  }
  return path;
}
