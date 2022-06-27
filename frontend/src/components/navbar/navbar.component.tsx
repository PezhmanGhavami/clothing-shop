import { useLocation, Link } from "react-router-dom";

import {
  FaUser,
  FaHeart,
  FaSearch,
  FaShoppingCart,
} from "react-icons/fa";

import "./navbar.styles.css";

const Navbar = () => {
  const location = useLocation();

  const pathMatchRoute = (route: string) => {
    if (route === location.pathname) {
      return true;
    }
    return false;
  };

  return (
    <div className="navbar">
      <nav className="navbar-nav">
        <div className="navbar-logo-container">
          <Link to={"/"}>Mosaic Clothing</Link>
        </div>
        <div className="navbar-links-container">
          <Link
            to={"/"}
            className={`${
              pathMatchRoute("/") ? "active " : ""
            }navbar-link`}
          >
            Home
          </Link>
          <Link
            className={`${
              pathMatchRoute("/categories/men")
                ? "active "
                : ""
            }navbar-link`}
            to={"/categories/men"}
          >
            Men
          </Link>
          <Link
            className={`${
              pathMatchRoute("/categories/women")
                ? "active "
                : ""
            }navbar-link`}
            to={"/categories/women"}
          >
            Women
          </Link>
          <Link
            className={`${
              pathMatchRoute("/categories") ? "active " : ""
            }navbar-link`}
            to={"/categories"}
          >
            Categories
          </Link>
          <Link
            className={`${
              pathMatchRoute("/offers") ? "active " : ""
            }navbar-link`}
            to={"/offers"}
          >
            Special Offers
          </Link>
          <Link
            className={`${
              pathMatchRoute("/contact-us") ? "active " : ""
            }navbar-link`}
            to={"/contact-us"}
          >
            Contact Us
          </Link>
        </div>
        <div className="navbar-others-container">
          <div>
            <FaSearch title="Search" />
          </div>
          <div>
            <FaHeart title="Wishlist" />
          </div>
          <div>
            <FaShoppingCart title="Cart" />
          </div>
          <div>
            <FaUser title="Profile" />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
