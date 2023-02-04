import {
  useState,
  useEffect,
  useCallback,
  TouchEvent,
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
  const [autoSwipe, setAutoSwipe] = useState(true);
  const [pausingEvent, setPausingEvent] = useState(0);

  const handleNextSlide = useCallback(() => {
    if (currentSlide <= slides.length) {
      setAnimateSlides(true);
      setPausingEvent(Date.now());
      setCurrentSlide((prev) => prev + 1);
    }
  }, [currentSlide, slides.length]);
  const handlePreviousSlide = () => {
    if (currentSlide > 0) {
      setAnimateSlides(true);
      setPausingEvent(Date.now());
      setCurrentSlide((prev) => prev - 1);
    }
  };
  const handleSlideChange = (index: number) => {
    setAnimateSlides(true);
    setPausingEvent(Date.now());
    setCurrentSlide(index);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      //console.log("interval");
      if (autoSwipe && Date.now() - pausingEvent >= 2500) {
        handleNextSlide();
      }
    }, 3500);
    return () => clearInterval(timer);
  }, [autoSwipe, pausingEvent, handleNextSlide]);

  const handleTouchStart = (event: TouchEvent) => {
    //console.log("onTouchStart");
    const touchDown = event.touches[0].clientX;
    setTouchPosition(touchDown);
  };
  const handleTouchEnd = (event: TouchEvent) => {
    //console.log("onTouchEnd");
    const touchDown = touchPosition;

    if (touchDown === null) {
      return;
    }

    const currentTouch = event.changedTouches[0].clientX;
    const diff = touchDown - currentTouch;

    if (diff > 5) {
      handleNextSlide();
    }
    if (diff < -5) {
      handlePreviousSlide();
    }

    setTouchPosition(null);
  };

  const handleMouseOver = () => {
    //console.log("mouseOver");
    setPausingEvent(Date.now());
    setAutoSwipe(false);
  };
  const handleMouseLeave = () => {
    //console.log("mouseLeave");
    setPausingEvent(Date.now());
    setAutoSwipe(true);
  };

  const handleTransitionEnd = () => {
    if (currentSlide <= 0) {
      // console.log("currentSlide <= 0");
      setAnimateSlides(false);
      setCurrentSlide(slides.length);
    } else if (currentSlide >= slides.length + 1) {
      // console.log("currentSlide >= slides.length + 1");
      setAnimateSlides(false);
      setCurrentSlide(1);
    }
  };

  return (
    <div
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative h-[65vh] select-none overflow-hidden bg-gray-200 text-white dark:bg-slate-500 md:h-[80vh]"
    >
      {/* Slides container */}
      <div
        onTransitionEnd={handleTransitionEnd}
        className="inline-flex h-full"
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
      {/* Next and previous */}
      <div className="absolute inset-y-0 left-0 flex flex-col justify-center">
        <span
          onClick={handlePreviousSlide}
          title={"Click to go to the previous slide"}
          className="cursor-pointer py-4 px-7 text-2xl"
        >
          &#10094;
        </span>
      </div>
      <div className="absolute inset-y-0 right-0 flex flex-col justify-center">
        <span
          onClick={handleNextSlide}
          title={"Click to go to the next slide"}
          className="cursor-pointer py-4 px-7 text-2xl"
        >
          &#10095;
        </span>
      </div>
      {/* Specific slide */}
      <div className="absolute bottom-0 flex w-full items-center justify-center py-2 text-white">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            onClick={() => {
              handleSlideChange(index + 1);
            }}
            title={`Click to go to ${slide.name} slide`}
            className="mx-2 cursor-pointer py-2"
          >
            <div
              className={`w-7 border-b${
                index + 1 === currentSlide
                  ? " border-b-2"
                  : ""
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
export default Slideshow;
