import Link from "next/link";

type slide = { name: string; imageURL: string };
interface ISlide {
  slide: slide;
}

const Slide = ({ slide }: ISlide) => {
  const imageURL = `bg-[url(\'${slide.imageURL}')]`;
  return (
    <div
      className={
        "h-full flex justify-between items-center bg-center bg-cover " +
        imageURL
      }
    >
      <div>Back</div>
      {/* Info box */}
      <Link href={"categories/" + slide.name}>
        <div className="border h-16">
          <h3 className="capitalize">{slide.name}</h3>
          <p>Shop now</p>
        </div>
      </Link>
      <div>Next</div>
    </div>
  );
};

export default Slide;
