import { useState, useEffect } from "react";

import Slide, { slide } from "../slide/slide.component";

interface ISlideshow {
  slides: (slide & { id: number })[];
}

const getTranslate = (slide: number) => {
  return -slide * 100;
};

const Slideshow = ({ slides }: ISlideshow) => {
  const [currentSlide, setCurrentSlide] = useState(1);
  // const [currentSlideID, setCurrentSlideID] = useState(1);
  const [currentTranslate, setcurrentTranslate] = useState(
    getTranslate(currentSlide)
  );

  useEffect(() => {
    const timer = setInterval(handleNextSlide, 3000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    setcurrentTranslate(getTranslate(currentSlide));
    if (currentSlide <= 0) setCurrentSlide(slides.length);
    if (currentSlide >= slides.length + 1)
      setCurrentSlide(1);
  }, [currentSlide, slides.length]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => prev + 1);
  };
  const handlePreviousSlide = () => {
    setCurrentSlide((prev) => prev - 1);
  };

  return (
    <div className="relative bg-gray-200 dark:bg-slate-500 text-white h-[65vh] overflow-hidden">
      {/* Slides container */}
      <div
        className="h-full inline-flex"
        style={{
          transform: `translateX(${currentTranslate}vw)`,
        }}
      >
        <Slide slide={slides[slides.length - 1]} />
        {slides.map((slide) => (
          <Slide key={slide.id} slide={slide} />
        ))}
        <Slide slide={slides[0]} />
      </div>
      {/* The buttons to change slides */}
      <div className="absolute w-full inset-0 flex justify-between items-center text-2xl">
        <span
          onClick={handlePreviousSlide}
          className="cursor-pointer py-4 px-7"
        >
          &#10094;
        </span>
        <span
          onClick={handleNextSlide}
          className="cursor-pointer py-4 px-7"
        >
          &#10095;
        </span>
      </div>
      <div className="absolute bottom-0 w-full flex justify-center items-center text-white py-2">
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="cursor-pointer py-2 mx-2"
          >
            <div className="h-1 w-7 border-b" />
          </div>
        ))}
      </div>
    </div>
  );
};
export default Slideshow;
