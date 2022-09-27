interface IHamburger {
  openModal: boolean;
  handleClick: () => void;
}

const lineClasses =
  "bg-slate-900 dark:bg-white h-[2px] w-7 transform transition-transform duration-500";

function Hamburger({ openModal, handleClick }: IHamburger) {
  return (
    <button
      onClick={handleClick}
      className="z-50 fixed bottom-32 right-10 md:hidden"
    >
      <div
        className={`flex overflow-hidden items-center justify-center rounded-full w-[50px] h-[50px] transform transition-all bg-neutral-200 dark:bg-slate-700 ring-0 ring-slate-900 dark:ring-white shadow-2xl ${
          openModal &&
          "ring-4 ring-opacity-60 duration-200 shadow-md"
        }`}
      >
        <div
          className={`flex flex-col justify-between w-[20px] h-[20px] transform transition-all duration-500 origin-center overflow-hidden ${
            openModal && " rotate-180"
          }`}
        >
          <div
            className={`${lineClasses}${
              openModal && " -rotate-45 -translate-x-1"
            }`}
          ></div>
          <div className={lineClasses}></div>
          <div
            className={`${lineClasses}${
              openModal && " rotate-45 -translate-x-1"
            }`}
          ></div>
        </div>
      </div>
    </button>
  );
}

export default Hamburger;
