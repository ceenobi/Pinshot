import { useRef, useState } from "react";

export default function useScroll() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollRef = useRef();

  const scroll = (scrollAmount) => {
    // // Calculate the new scroll position
    const newScrollPosition = scrollPosition + scrollAmount;

    // Update the state with the new scroll position
    setScrollPosition(newScrollPosition);

    // Access the container element and set its scrollLeft property
    scrollRef.current.scrollLeft = newScrollPosition;
  };
  return { scroll, scrollRef };
}
