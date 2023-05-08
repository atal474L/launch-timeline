import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { Link, NavLink, Navigate, Outlet } from "react-router-dom";
import "./../styles/Style.css";
import { Nav } from "react-bootstrap";
import { userStateContext } from "../contexts/ContextProvider";

export default function DefaultLayout() {
  const { currentUser, userToken } = userStateContext();

  if (!userToken) {
    return <Navigate to={"login"}></Navigate>;
  }

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
              Uitloggen {currentUser.name}
            </NavLink>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Outlet></Outlet>
    </>
  );
}
