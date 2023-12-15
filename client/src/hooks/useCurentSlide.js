import { useState } from "react";

const useCurentSlide = (imgLength) => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent(current === imgLength - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? imgLength - 1 : current - 1);
  };
  return { nextSlide, prevSlide, current };
};

export default useCurentSlide;
