import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  FaUser,
  FaHeart,
  FaSearch,
  FaShoppingCart,
} from "react-icons/fa";

import "./navbar.styles.css";

const Navbar = () => {
  const [openModal, setOpenModal] = useState(false);

  const location = useLocation();

  const toggleModal = () => {
    setOpenModal((prev) => !prev);
  };

  const pathMatchRoute = (route: string) => {
    if (route === location.pathname) {
      return true;
    }
    return false;
  };

  return (
    <>
      <div className="navbar">
        {openModal && (
          <div
            className="navigation-overlay"
            onClick={toggleModal}
          />
        )}
        <div
          onClick={toggleModal}
          className={`${
            openModal ? "burger-close " : ""
          }burger`}
        >
          <div id="burger-top"></div>
          <div id="burger-middle"></div>
          <div id="burger-bottom"></div>
        </div>
        <nav className="navbar-nav">
          <div className="navbar-logo-container">
            <Link to={"/"}>Clothing Shop</Link>
          </div>
          <ul
            className={`${
              openModal ? "active-links-container " : ""
            }navbar-links-container`}
          >
            <li>
              <Link
                to={"/"}
                className={`${
                  pathMatchRoute("/") ? "active-link " : ""
                }navbar-link`}
              >
                Home
              </Link>
            </li>
            <li>
              {" "}
              <Link
                className={`${
                  pathMatchRoute("/categories/men")
                    ? "active-link "
                    : ""
                }navbar-link`}
                to={"/categories/men"}
              >
                Men
              </Link>
            </li>
            <li>
              {" "}
              <Link
                className={`${
                  pathMatchRoute("/categories/women")
                    ? "active-link "
                    : ""
                }navbar-link`}
                to={"/categories/women"}
              >
                Women
              </Link>
            </li>
            <li>
              {" "}
              <Link
                className={`${
                  pathMatchRoute("/categories")
                    ? "active-link "
                    : ""
                }navbar-link`}
                to={"/categories"}
              >
                Categories
              </Link>
            </li>
            <li>
              <Link
                className={`${
                  pathMatchRoute("/offers")
                    ? "active-link "
                    : ""
                }navbar-link`}
                to={"/offers"}
              >
                Special Offers
              </Link>
            </li>
            <li>
              <Link
                className={`${
                  pathMatchRoute("/contact-us")
                    ? "active-link "
                    : ""
                }navbar-link`}
                to={"/contact-us"}
              >
                Contact Us
              </Link>
            </li>
          </ul>
          <div className="navbar-icon-links-container">
            <Link to={"/search"} className="icon-link">
              <FaSearch title="Search" />
            </Link>
            <Link
              to={"/profile/wishlist"}
              className="icon-link"
            >
              <FaHeart title="Wishlist" />
            </Link>
            <Link to={"/cart"} className="icon-link">
              <FaShoppingCart title="Cart" />
            </Link>
            <Link to={"/profile"} className="icon-link">
              <FaUser title="Profile" />
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
