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
        "h-full w-screen flex justify-center items-center bg-center bg-cover"
      }
    >
      <div className="absolute h-full w-full">
        <Image
          src={slide.imageUrl}
          alt={slide.name}
          layout="fill"
          priority
          quality={100}
          className="object-cover object-center dark:brightness-90"
        />
      </div>
      {/* Info box */}
      <Link href={"categories/" + slide.name}>
        <div className="border h-24 w-32 flex flex-col justify-center items-center cursor-pointer z-10">
          <h3 className="capitalize">{slide.name}</h3>
          <p>Shop now</p>
        </div>
      </Link>
    </div>
  );
};

export default Slide;
