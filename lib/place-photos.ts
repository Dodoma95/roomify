export function buildPhotoUrls(type: string, id: string | number): string[] {
  const base = `${type.toLowerCase().replace(/_/g, "-")}-${id}`;
  return [
    `https://picsum.photos/seed/${base}/800/800`,
    `https://picsum.photos/seed/${base}-2/800/800`,
    `https://picsum.photos/seed/${base}-3/800/800`,
    `https://picsum.photos/seed/${base}-4/800/800`,
    `https://picsum.photos/seed/${base}-5/800/800`,
  ];
}
