import React from "react";
import "./SideNav.css";

const SideNav = ({ activeNavItem, handleNavItemClick }) => {
  return (
    <nav className="sidenav">
      <div className="nav-section">
        <h2
          className={activeNavItem === "home" ? "active" : ""}
          onClick={() => handleNavItemClick("home")}
        >
          Home
        </h2>
      </div>
      <div className="nav-section">
        <h2
          className={activeNavItem === "overview" ? "active" : ""}
          onClick={() => handleNavItemClick("overview")}
        >
          Overview
        </h2>
      </div>
      <div className="nav-section">
        <h2
          className={activeNavItem === "status" ? "active" : ""}
          onClick={() => handleNavItemClick("status")}
        >
          Status
        </h2>
      </div>
    </nav>
  );
};

export default SideNav;
