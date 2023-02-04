import Link from "next/link";
import Image from "next/image";

export type slide = { name: string; imageUrl: string };
interface ISlide {
  slide: slide;
}

const Slide = ({ slide }: ISlide) => {
  return (
    <div
      className={
        "flex h-full w-screen items-center justify-center"
      }
    >
      <div className="relative h-full w-full">
        <Image
          src={slide.imageUrl}
          alt={slide.name}
          fill
          sizes="100vw"
          quality={100}
          className="pointer-events-none object-cover object-center brightness-90"
        />
      </div>
      {/* Info box */}
      <div
        title={"Click to browse " + slide.name}
        className="absolute"
      >
        <Link href={"categories/" + slide.name}>
          <div className="z-10 flex h-24 w-32 cursor-pointer flex-col items-center justify-center rounded-lg border text-center">
            <h3 className="capitalize">{slide.name}</h3>
            <p>Shop now</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Slide;
