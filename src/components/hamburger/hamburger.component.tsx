interface IHamburger {
  openModal: boolean;
  handleClick: () => void;
}

const lineClasses =
  "bg-slate-900 dark:bg-white h-[2px] w-7 transform transition-transform duration-500";

function Hamburger({ openModal, handleClick }: IHamburger) {
  return (
    <button
      title="Click to open Navigation menu"
      onClick={handleClick}
      className="fixed bottom-32 right-10 z-50 md:hidden"
    >
      <div
        className={`flex h-[50px] w-[50px] transform items-center justify-center overflow-hidden rounded-full bg-neutral-200 shadow-2xl ring-0 ring-slate-900 transition-all dark:bg-slate-700 dark:ring-white ${
          openModal && "shadow-md ring-4 ring-opacity-60 duration-200"
        }`}
      >
        <div
          className={`flex h-[20px] w-[20px] origin-center transform flex-col justify-between overflow-hidden transition-all duration-500 ${
            openModal && " rotate-180"
          }`}
        >
          <div
            className={`${lineClasses}${
              openModal && " -translate-x-1 -rotate-45"
            }`}
          ></div>
          <div className={lineClasses}></div>
          <div
            className={`${lineClasses}${
              openModal && " -translate-x-1 rotate-45"
            }`}
          ></div>
        </div>
      </div>
    </button>
  );
}

export default Hamburger;
