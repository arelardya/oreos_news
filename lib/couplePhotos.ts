export const COUPLE_PHOTOS = [
  '/assets/couple-1.jpeg',
  '/assets/couple-2.jpeg',
  '/assets/couple-3.jpeg',
  '/assets/couple-4.jpeg',
  '/assets/couple-5.jpeg',
];

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Four photos so the two flanking pairs never repeat one -- falls back to
 * cycling with repeats only if the pool has fewer than four photos. */
export function pickFourDistinct(photos: string[]): [string, string, string, string] {
  const shuffled = shuffle(photos);
  const pick = (i: number) => shuffled[i % shuffled.length];
  return [pick(0), pick(1), pick(2), pick(3)];
}
