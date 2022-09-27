import Slide, { slide } from "../slide/slide.component";

interface ISlideshow {
  slides: (slide & { id: number })[];
}

const Slideshow = ({ slides }: ISlideshow) => {
  return (
    <div className="relative bg-gray-200 dark:bg-slate-500 h-[65vh] overflow-x-hidden">
      {/* Slides container */}
      <div className="h-full inline-flex">
        {slides.map((slide) => (
          <Slide key={slide.id} slide={slide} />
        ))}
      </div>
      {/* The buttons to change slides */}
      <div className="absolute w-full inset-x-0 top-2/4 flex justify-between bg-red-600">
        <div className="cursor-pointer">Back</div>
        <div className="cursor-pointer">Next</div>
      </div>
      <div className="absolute bottom-0 w-full flex justify-center items-center">
        <p>button</p>
        <p>button</p>
        <p>button</p>
      </div>
    </div>
  );
};

export default Slideshow;
