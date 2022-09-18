import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  FaUser,
  FaHeart,
  FaSearch,
  FaShoppingCart,
} from "react-icons/fa";

import Hamburger from "../hamburger/hamburger.component";
import Overlay from "../overlay/overlay.component";

import useUser from "../../hooks/useUser";
import fetcher from "../../utils/fetcher";

const navLinks = {
  liClasses:
    "h-1/12 w-full md:h-auto my-1 md:my-0 md:mx-2 lg:mx-4 2xl:mx-8 flex justify-center items-center",
  linkClasses:
    "block text-lg py-1 w-10/12 md:w-full md:min-w-max text-center border-b border-transparent hover:border-b-slate-900 dark:hover:border-b-white ",
  links: [
    { name: "Home", to: "/" },
    {
      name: "Men",
      to: "/categories/men",
    },
    {
      name: "Women",
      to: "/categories/women",
    },
    {
      name: "Categories",
      to: "/categories",
    },
    {
      name: "Special Offers",
      to: "/offers",
    },
    {
      name: "Contact Us",
      to: "/contact-us",
    },
  ],
};

const Navbar = () => {
  const [openModal, setOpenModal] = useState(false);
  const { user, mutateUser } = useUser();

  const router = useRouter();

  const toggleModal = () => {
    setOpenModal((prev) => !prev);
  };

  return (
    <>
      <header className="flex justify-items-center items-center h-20 py-1">
        {openModal && <Overlay handleClick={toggleModal} />}
        <Hamburger
          openModal={openModal}
          handleClick={toggleModal}
        />
        <nav className="w-full h-full flex justify-between items-center">
          {/* Navbar logo container */}
          <div className="uppercase text-lg tracking-wide font-medium p-2 lg:p-4">
            <Link href={"/"}>Clothing Shop</Link>
          </div>
          {/* Links */}
          <ul
            className={`fixed md:static top-0 right-0 z-20 md:z-auto h-screen w-2/4 md:h-auto md:w-auto flex flex-col md:flex-row justify-center items-center bg-neutral-200 dark:bg-slate-700 md:bg-inherit shadow-2xl md:shadow-none translate-x-full md:translate-x-0 transition-transform md:transition-none ease-in-out duration-500 ${
              openModal ? "translate-x-0" : ""
            }`}
          >
            {navLinks.links.map((link, index) => (
              <li
                key={index}
                className={navLinks.liClasses}
              >
                <Link href={link.to}>
                  <a
                    className={`${navLinks.linkClasses}${
                      link.to === router.pathname
                        ? "border-b-slate-900 dark:border-b-white"
                        : ""
                    }`}
                  >
                    {link.name}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
          {/* Icons Search Wishlist Cart Profile */}
          <div className="flex">
            <Link href={"/search"}>
              <a className="flex justify-center items-center cursor-pointer p-2 lg:p-4 text-lg">
                <FaSearch title="Search" />
              </a>
            </Link>
            <Link href={"/wishlist"}>
              <a className="flex justify-center items-center cursor-pointer p-2 lg:p-4 text-lg">
                <FaHeart title="Wishlist" />
              </a>
            </Link>
            <Link href={"/cart"}>
              <a className="flex justify-center items-center cursor-pointer p-2 lg:p-4 text-lg">
                <FaShoppingCart title="Cart" />
              </a>
            </Link>
            {/* TODO - Compelete this */}
            <Link
              href={
                user?.isLoggedIn
                  ? "/profile"
                  : "/auth/signin"
              }
            >
              <a className="flex justify-center items-center cursor-pointer p-2 lg:p-4 text-lg">
                <FaUser title="User" />
              </a>
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
