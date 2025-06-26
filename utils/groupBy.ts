export function groupBy<T, K extends string>(
  arr: T[],
  keyGetter: (item: T) => K
): Record<K, T[]> {
  return arr.reduce((acc, item) => {
    const key = keyGetter(item);
    acc[key] = acc[key] || [];
    acc[key].push(item);
    return acc;
  }, {} as Record<K, T[]>);
}
