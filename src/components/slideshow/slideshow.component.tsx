import {
  useState,
  useEffect,
  useCallback,
  TouchEvent,
  MouseEvent,
  PointerEvent,
} from "react";

import Slide, { slide } from "../slide/slide.component";

interface ISlideshow {
  slides: (slide & { id: number })[];
}

const Slideshow = ({ slides }: ISlideshow) => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [slideDiff, setSlideDiff] = useState(0.0);
  const [pointerPosition, setPointerPosition] = useState<
    number | null
  >(null);
  const [mouseDown, setMouseDown] = useState(false);
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

  // Slideshow auto swipe timer
  useEffect(() => {
    const timer = setInterval(() => {
      if (autoSwipe && Date.now() - pausingEvent >= 2500) {
        handleNextSlide();
      }
    }, 3500);
    return () => clearInterval(timer);
  }, [autoSwipe, pausingEvent, handleNextSlide]);

  const handleTouchStart = (event: TouchEvent) => {
    const touchDown = event.touches[0].clientX;
    setPointerPosition(touchDown);
    setAutoSwipe(false);
  };
  const handleTouchMove = (event: TouchEvent) => {
    if (!pointerPosition) return;

    const { clientWidth } =
      globalThis.document.documentElement;

    setSlideDiff(
      (pointerPosition - event.touches[0].clientX) /
        clientWidth,
    );
  };
  const handleTouchEnd = (event: TouchEvent) => {
    const { clientWidth } =
      globalThis.document.documentElement;

    if (pointerPosition === null) {
      return;
    }

    const currentTouch = event.changedTouches[0].clientX;
    const diff = pointerPosition - currentTouch;

    if (diff > clientWidth / 4) {
      handleNextSlide();
    }
    if (diff < -(clientWidth / 4)) {
      handlePreviousSlide();
    }

    setAutoSwipe(true);
    setSlideDiff(0.0);
    setPointerPosition(null);
  };

  const handleMouseOver = () => {
    setPausingEvent(Date.now());
    setAutoSwipe(false);
  };
  const handleMouseLeave = () => {
    setPausingEvent(Date.now());
    setAutoSwipe(true);
  };
  const handleMouseDown = (event: MouseEvent) => {
    setMouseDown(true);
    setPointerPosition(event.clientX);
  };
  const handlePointerMove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    if (!mouseDown || !pointerPosition) return;

    const { clientWidth } =
      globalThis.document.documentElement;

    setSlideDiff(
      (pointerPosition - event.clientX) / clientWidth,
    );
  };
  const handleMouseUp = (event: MouseEvent) => {
    const { clientWidth } =
      globalThis.document.documentElement;

    if (pointerPosition === null) {
      return;
    }

    const diff = pointerPosition - event.clientX;

    if (diff > clientWidth / 4) {
      handleNextSlide();
    }
    if (diff < -(clientWidth / 4)) {
      handlePreviousSlide();
    }

    setMouseDown(false);
    setSlideDiff(0.0);
    setPointerPosition(null);
  };

  const handleTransitionEnd = () => {
    if (currentSlide <= 0) {
      setAnimateSlides(false);
      setCurrentSlide(slides.length);
    } else if (currentSlide >= slides.length + 1) {
      setAnimateSlides(false);
      setCurrentSlide(1);
    }
  };

  return (
    <div
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onPointerMove={handlePointerMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      className="relative h-[65vh] select-none overflow-hidden bg-gray-200 text-white dark:bg-slate-500 md:h-[80vh]"
      style={{
        cursor: mouseDown ? "grabbing" : "grab",
      }}
    >
      {/* Slides container */}
      <div
        onTransitionEnd={handleTransitionEnd}
        className="inline-flex h-full"
        style={{
          transform: `translateX(-${
            (currentSlide + slideDiff) * 100
          }vw)`,
          transition: `${
            animateSlides ? "transform" : "none"
          } ${pointerPosition ? "0ms" : "500ms"} ease`,
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
          className="cursor-pointer px-7 py-4 text-2xl"
        >
          &#10094;
        </span>
      </div>
      <div className="absolute inset-y-0 right-0 flex flex-col justify-center">
        <span
          onClick={handleNextSlide}
          title={"Click to go to the next slide"}
          className="cursor-pointer px-7 py-4 text-2xl"
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
