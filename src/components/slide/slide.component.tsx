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
        "h-full w-screen flex justify-center items-center"
      }
    >
      <div className="relative h-full w-full">
        <Image
          src={slide.imageUrl}
          alt={slide.name}
          fill
          sizes="100vw"
          priority
          quality={100}
          className="object-cover object-center brightness-90 pointer-events-none"
        />
      </div>
      {/* Info box */}
      <div
        title={"Click to browse " + slide.name}
        className="absolute"
      >
        <Link href={"categories/" + slide.name}>
          <div className="rounded-lg border h-24 w-32 flex flex-col justify-center items-center cursor-pointer z-10 text-center">
            <h3 className="capitalize">{slide.name}</h3>
            <p>Shop now</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Slide;
