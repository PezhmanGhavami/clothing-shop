function Slide({ imgUrl }: { imgUrl: string }) {
  return (
    <div className="w-screen ">
      <img
        className="w-full h-full object-none"
        src={imgUrl}
        alt=""
      />
    </div>
  );
}
export default Slide;
