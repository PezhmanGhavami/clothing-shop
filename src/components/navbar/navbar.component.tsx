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
  const { user } = useUser();
  const { cart } = useCart();

  const router = useRouter();
  // NOTE - I'm using router.asPath which might not work because it won't be availble unitle router.isReady

  useEffect(() => {
    const handleLoadingError = () => {
      toast.error(
        "Coudln't load the page; Please try again.",
      );
    };

    router.events.on(
      "routeChangeError",
      handleLoadingError,
    );

    return () => {
      router.events.off(
        "routeChangeError",
        handleLoadingError,
      );
    };
  }, [router]);

  const toggleModal = () => {
    setOpenModal((prev) => !prev);
  };
  const closeModal = () => {
    setOpenModal(false);
  };

  return (
    <header className="sticky top-0 z-20 h-20 bg-white pt-1 shadow-md dark:bg-slate-900">
      {openModal && <Overlay handleClick={closeModal} />}
      <Hamburger
        openModal={openModal}
        handleClick={toggleModal}
      />
      <nav className="flex h-full w-full items-center justify-between">
        {/* Navbar logo container */}
        <div className="p-2 text-lg font-medium uppercase tracking-wide lg:p-4">
          <Link title="Click to go home" href={"/"}>
            Clothing Shop
          </Link>
        </div>
        {/* Links */}
        <ul
          className={`fixed right-0 top-0 z-40 flex h-screen w-2/4 flex-col items-center justify-center bg-neutral-200 shadow-2xl transition-transform duration-500 ease-in-out dark:bg-slate-700 md:static md:z-auto md:h-auto md:w-auto md:translate-x-0 md:flex-row md:bg-inherit md:shadow-none md:transition-none md:dark:bg-inherit ${
            openModal ? "translate-x-0" : "translate-x-full"
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
            className={`${navLinks.iconClasses} group relative`}
          >
            <FaUser />
            {/* Triangle */}
            <div className="invisible absolute top-10 z-30 h-4 w-4 rotate-45 border border-b-transparent border-r-transparent bg-neutral-50 group-focus-within:visible group-active:visible dark:border-slate-600 dark:border-b-transparent dark:border-r-transparent dark:bg-slate-800" />
            {/* Content */}
            <div className="invisible absolute top-12 z-20 flex flex-col rounded-lg border bg-neutral-50 px-4 pb-4 pt-3 shadow-md group-focus-within:visible group-active:visible dark:border-slate-600 dark:bg-slate-800">
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
            <span className="pl-2 text-xs">
              {cart?.count}
            </span>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
