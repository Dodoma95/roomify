import { useState } from "react";

interface UseCarouselReturn {
  index: number;
  prev: () => void;
  next: () => void;
  goTo: (i: number) => void;
  count: number;
}

export function useCarousel(count: number, initialIndex = 0): UseCarouselReturn {
  const [index, setIndex] = useState(initialIndex);
  return {
    index,
    count,
    prev: () => setIndex((i) => (i - 1 + count) % count),
    next: () => setIndex((i) => (i + 1) % count),
    goTo: (i: number) => setIndex(i),
  };
}
