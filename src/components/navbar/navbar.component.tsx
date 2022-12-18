import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Link from "next/link";
import {
  FaUser,
  FaSearch,
  FaShoppingCart,
} from "react-icons/fa";

import Hamburger from "../hamburger/hamburger.component";
import Overlay from "../overlay/overlay.component";

import useUser from "../../hooks/useUser";
import useCart from "../../hooks/useCart";

const navLinks = {
  liClasses:
    "h-1/12 w-full md:h-auto my-1 md:my-0 md:mx-2 lg:mx-4 2xl:mx-8 flex justify-center items-center",
  linkClasses:
    "block text-lg py-1 w-10/12 md:w-full md:min-w-max text-center border-b border-transparent hover:border-b-slate-900 dark:hover:border-b-white ",
  iconClasses:
    "flex justify-center items-center cursor-pointer p-3 lg:p-4 text-lg",
  userClasses:
    "border border-transparent hover:border-b-slate-900 dark:hover:border-b-white",
  links: [
    { name: "Home", to: "/" },
    {
      name: "Men's",
      to: "/categories/mens",
    },
    {
      name: "Women's",
      to: "/categories/womens",
    },
    {
      name: "Categories",
      to: "/categories",
    },
    {
      name: "Special Offers",
      to: "/offers",
    },
  ],
};

const Navbar = () => {
  const [openModal, setOpenModal] = useState(false);
  const [loaderWidth, setLoaderWidth] = useState<
    0 | 60 | 100
  >(0);
  const [duration, setDuration] = useState<0 | 200 | 3000>(
    3000
  );
  const { user } = useUser();
  const { cart } = useCart();

  const router = useRouter();
  // NOTE - I'm using router.asPath which might not work because it won't be availble unitle router.isReady

  const startLoading = () => {
    setLoaderWidth(60);
    setDuration(3000);
  };
  const stopLoading = () => {
    setLoaderWidth(100);
    setDuration(200);
  };
  const handleLoadingError = () => {
    setLoaderWidth(100);
    setDuration(200);
    toast.error("Coudln't load page; Please try again");
  };

  useEffect(() => {
    router.events.on("routeChangeStart", startLoading);
    router.events.on("routeChangeComplete", stopLoading);
    router.events.on(
      "routeChangeError",
      handleLoadingError
    );

    return () => {
      router.events.off("routeChangeStart", startLoading);
      router.events.off("routeChangeComplete", stopLoading);
      router.events.off(
        "routeChangeError",
        handleLoadingError
      );
    };
  }, [router]);

  const handleTransitionEnd = () => {
    if (loaderWidth === 100) {
      setDuration(0);
      setLoaderWidth(0);
    }
  };

  const toggleModal = () => {
    setOpenModal((prev) => !prev);
  };
  const closeModal = () => {
    setOpenModal(false);
  };

  return (
    <header className="sticky top-0 z-20 bg-white dark:bg-slate-900 shadow-md h-20 pt-1">
      {openModal && <Overlay handleClick={closeModal} />}
      <Hamburger
        openModal={openModal}
        handleClick={toggleModal}
      />
      <nav className="w-full h-full flex justify-between items-center">
        {/* Navbar logo container */}
        <div className="uppercase text-lg tracking-wide font-medium p-2 lg:p-4">
          <Link title="Click to go home" href={"/"}>
            Clothing Shop
          </Link>
        </div>
        {/* Links */}
        <ul
          className={`fixed md:static top-0 right-0 z-40 md:z-auto h-screen w-2/4 md:h-auto md:w-auto flex flex-col md:flex-row justify-center items-center bg-neutral-200 dark:bg-slate-700 md:bg-inherit md:dark:bg-inherit shadow-2xl md:shadow-none translate-x-full md:translate-x-0 transition-transform md:transition-none ease-in-out duration-500 ${
            openModal ? "translate-x-0" : ""
          }`}
        >
          {navLinks.links.map((link, index) => (
            <li key={index} className={navLinks.liClasses}>
              <Link
                onClick={closeModal}
                href={link.to}
                className={`${navLinks.linkClasses}${
                  router.asPath === link.to
                    ? "border-b-slate-900 dark:border-b-white"
                    : ""
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
        {/* Icons Search Wishlist Cart Profile */}
        <div className="flex">
          <Link
            title="Click to open search"
            className={navLinks.iconClasses}
            href={"/search"}
          >
            <FaSearch />
          </Link>
          <button
            type="button"
            title={
              !user?.isLoggedIn
                ? "See your sign in options"
                : "See user options"
            }
            className={`${navLinks.iconClasses} relative group`}
          >
            <FaUser />
            {/* Triangle */}
            <div className="invisible absolute top-10 w-4 h-4 bg-neutral-50 dark:bg-slate-800 border dark:border-slate-600 border-r-transparent dark:border-r-transparent border-b-transparent dark:border-b-transparent rotate-45 z-30 group-focus-within:visible group-active:visible" />
            {/* Content */}
            <div className="invisible absolute top-12 flex flex-col bg-neutral-50 dark:bg-slate-800 shadow-md rounded-lg border dark:border-slate-600 px-4 pt-3 pb-4 z-20 group-focus-within:visible group-active:visible">
              {!user?.isLoggedIn ? (
                <>
                  <Link
                    className={navLinks.userClasses}
                    href={"/auth/signin"}
                  >
                    Login
                  </Link>
                  <Link
                    className={navLinks.userClasses}
                    href={"/auth/signup"}
                  >
                    Register
                  </Link>
                </>
              ) : (
                <Link
                  className={navLinks.userClasses}
                  href="/api/auth/logout"
                  passHref
                >
                  Logout
                </Link>
              )}
            </div>
          </button>
          <Link
            title="Click to open your shopping cart"
            className={navLinks.iconClasses}
            href={"/cart"}
          >
            <FaShoppingCart />
            <span className="text-xs pl-2">
              {cart?.count}
            </span>
          </Link>
        </div>
      </nav>

      <div className="h-[2px]">
        <div
          onTransitionEnd={handleTransitionEnd}
          className="h-full w-0 bg-blue-400 transition-all"
          style={{
            width: `${loaderWidth}%`,
            transitionDuration: `${duration}ms`,
          }}
        />
      </div>
    </header>
  );
};

export default Navbar;
