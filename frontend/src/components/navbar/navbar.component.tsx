import { Link } from "react-router-dom";

import "./navbar.styles.css";

const Navbar = () => {
  return (
    <div className="navbar">
      <Link className="logo-container" to={"/"}>
        Home
      </Link>
      <div className="nav-links">
        <Link to={"/categories"}>Categories</Link>
      </div>
    </div>
  );
};

export default Navbar;
