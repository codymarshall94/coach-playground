export const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const pct = (x: number) => `${Math.round(clamp(x, 0, 1) * 100)}%`;
