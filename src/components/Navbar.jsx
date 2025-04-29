import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav
      style={{ padding: "10px", backgroundColor: "#522258", color: "white" }}
    >
      <Link to="/" style={{ margin: "0 10px", color: "white" }}>
        Dashboard
      </Link>
      <Link to="/login" style={{ margin: "0 10px", color: "white" }}>
        Login
      </Link>
      <Link to="/signup" style={{ margin: "0 10px", color: "white" }}>
        Signup
      </Link>
    </nav>
  );
};

export default Navbar;
