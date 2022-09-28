import { useState } from "react";

import Slide, { slide } from "../slide/slide.component";

interface ISlideshow {
  slides: (slide & { id: number })[];
}

const Slideshow = ({ slides }: ISlideshow) => {
  const [currentSlide, setCurrentSlide] = useState(
    slides[0].id
  );
  return (
    <div className="relative bg-gray-200 dark:bg-slate-500 text-white h-[65vh] overflow-hidden">
      {/* Slides container */}
      <div className="h-full inline-flex">
        {slides.map((slide) => (
          <Slide key={slide.id} slide={slide} />
        ))}
      </div>
      {/* The buttons to change slides */}
      <div className="absolute w-full inset-0 flex justify-between items-center text-2xl">
        <span className="cursor-pointer py-4 px-7">
          &#10094;
        </span>
        <span className="cursor-pointer py-4 px-7">
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
