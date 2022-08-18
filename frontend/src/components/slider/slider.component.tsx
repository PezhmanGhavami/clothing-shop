function Slider() {
  return (
    <div className="overflow-x-hidden">
      <div className="h-80 inline-flex transform translate-x-0 cursor-grab">
        <div className="w-screen ">
          <img
            src="https://images.unsplash.com/photo-1542219550-2da790bf52e9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1025&q=80"
            alt=""
          />
        </div>
        <div className="w-screen">
          <p>Slide B</p>
        </div>
        <div className="w-screen">
          <p>Slide C</p>
        </div>
        <div className="w-screen">
          <p>Slide D</p>
        </div>
        <div className="w-screen">
          <p>Slide E</p>
        </div>
      </div>
    </div>
  );
}
export default Slider;
