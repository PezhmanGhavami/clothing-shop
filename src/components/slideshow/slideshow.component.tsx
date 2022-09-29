import {
  useState,
  useEffect,
  TouchEvent,
  MouseEvent,
} from "react";

import Slide, { slide } from "../slide/slide.component";

interface ISlideshow {
  slides: (slide & { id: number })[];
}

const Slideshow = ({ slides }: ISlideshow) => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [touchPosition, setTouchPosition] = useState<
    number | null
  >(null);
  const [animateSlides, setAnimateSlides] = useState(true);

  useEffect(() => {
    const timer = setInterval(handleNextSlide, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleNextSlide = () => {
    if (currentSlide <= slides.length) {
      setAnimateSlides(true);
      setCurrentSlide((prev) => prev + 1);
    }
  };
  const handlePreviousSlide = () => {
    if (currentSlide > 0) {
      setAnimateSlides(true);
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const handleTouchStart = (event: MouseEvent) => {
    const touchDown = event.clientX;
    setTouchPosition(touchDown);
  };
  const handleTouchMove = (event: TouchEvent) => {
    const touchDown = touchPosition;

    if (touchDown === null) {
      return;
    }

    const currentTouch = event.touches[0].clientX;
    const diff = touchDown - currentTouch;

    if (diff > 5) {
      handleNextSlide();
    }

    if (diff < -5) {
      handlePreviousSlide();
    }

    setTouchPosition(null);
  };

  const handleTransitionEnd = () => {
    if (currentSlide === 0) {
      console.log("currentSlide === 0");
      setAnimateSlides(false);
      setCurrentSlide(slides.length);
    } else if (currentSlide === slides.length + 1) {
      console.log("currentSlide === slides.length + 1");
      setAnimateSlides(false);
      setCurrentSlide(1);
    }
  };

  return (
    <div
      onMouseDown={handleTouchStart}
      onTouchMove={handleTouchMove}
      className="relative bg-gray-200 dark:bg-slate-500 text-white h-[65vh] overflow-hidden"
    >
      {/* Slides container */}
      <div
        onTransitionEnd={handleTransitionEnd}
        className="h-full inline-flex"
        style={{
          transform: `translateX(-${currentSlide * 100}vw)`,
          transition: `${
            animateSlides ? "transform" : "none"
          } 500ms ease`,
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
