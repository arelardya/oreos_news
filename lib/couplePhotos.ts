export const COUPLE_PHOTOS = [
  '/assets/couple-1.jpeg',
  '/assets/couple-2.jpeg',
  '/assets/couple-3.jpeg',
  '/assets/couple-4.jpeg',
  '/assets/couple-5.jpeg',
];

export function pickTwoDistinct(photos: string[]): [string, string] {
  const a = Math.floor(Math.random() * photos.length);
  let b = Math.floor(Math.random() * photos.length);
  while (b === a && photos.length > 1) {
    b = Math.floor(Math.random() * photos.length);
  }
  return [photos[a], photos[b]];
}
