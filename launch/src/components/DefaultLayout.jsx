import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { Link, NavLink, Outlet } from "react-router-dom";
import "./../styles/Style.css";
import { Nav } from "react-bootstrap";

export default function DefaultLayout() {
  const logout = (event) => {
    event.preventDefault();
    console.log("uitgelogd");
  };

  return (
    <>
      <Navbar>
        <Container>
          <Navbar.Brand as={Link} to={"/"}>
            Code d'Or
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            {/* <Navbar.Text>
              Signed in as: <a href="#login">Mark Otto</a>
            </Navbar.Text> */}

            <NavLink
              to="/"
              className={({ isActive }) =>
                "nav-links" + (isActive ? " activated" : "")
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/projecten"
              className={({ isActive }) =>
                "nav-links" + (isActive ? " activated" : "")
              }
            >
              Projecten
            </NavLink>

            <NavLink
              to="#"
              className={"nav-links"}
              onClick={(event) => logout(event)}
            >
              Uitloggen
            </NavLink>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Outlet></Outlet>
    </>
  );
}
