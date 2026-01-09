import React, { useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import { GiShoppingBag } from "react-icons/gi";
import { AuthContext } from "../../support/auth/AuthProvider";

const Header = () => {
  const { keycloak } = useContext(AuthContext);

  const handleLogout = () => {
    keycloak.logout({
      redirectUri: window.location.origin+ "/login",
    });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand d-flex align-items-center gap-1">
          <GiShoppingBag size={24} />
          <span>Ecommerce App</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">

            {!keycloak?.authenticated ? (
              <li className="nav-item">
                <NavLink to="/login" className="nav-link">
                  Login
                </NavLink>
              </li>
            ) : (
              <li className="nav-item">
                <button
                  onClick={handleLogout}
                  className="btn btn-link nav-link"
                >
                  Logout
                </button>
              </li>
            )}

            <li className="nav-item">
              <NavLink to="/cart" className="nav-link">
                Cart 
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
