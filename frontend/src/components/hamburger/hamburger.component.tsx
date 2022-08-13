interface IHamburger {
  openModal: boolean;
  handleClick: () => void;
}

function Hamburger({ openModal, handleClick }: IHamburger) {
  return (
    <button
      onClick={handleClick}
      className="z-30 fixed bottom-32 right-10 md:hidden"
    >
      <div
        className={`flex overflow-hidden items-center justify-center rounded-full w-[50px] h-[50px] transform transition-all bg-slate-700 ring-0 ring-gray-300 ${
          openModal &&
          "ring-4 ring-opacity-30 duration-200 shadow-md"
        }`}
      >
        <div
          className={`flex flex-col justify-between w-[20px] h-[20px] transform transition-all duration-500 origin-center overflow-hidden ${
            openModal && " rotate-180"
          }`}
        >
          <div
            className={`bg-white h-[2px] w-7 transform transition-all duration-500${
              openModal && " -rotate-45 -translate-x-1"
            }`}
          ></div>
          <div className="bg-white h-[2px] w-7 rounded transform transition-all duration-500 "></div>
          <div
            className={`bg-white h-[2px] w-7 transform transition-all duration-500${
              openModal && " rotate-45 -translate-x-1"
            }`}
          ></div>
        </div>
      </div>
    </button>
  );
}

export default Hamburger;
