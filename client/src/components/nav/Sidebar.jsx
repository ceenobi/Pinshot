import { NavLink } from "react-router-dom";
import { Icon } from "@iconify/react";
import { links } from "../../utils";
import { userService } from "../../services";

const Sidebar = () => {
  return (
    <div
      className="d-none d-xl-block desktop-width position-fixed top-0 bg-white"
      style={{ zIndex: 5 }}
    >
      <div className="d-flex justify-content-between flex-column align-items-center py-3 px-3 min-vh-100">
        <div className="text-center">
          <NavLink to="/">
            <h1 className="logo fs-5 mb-4" title="Pinshot">
              P
            </h1>
          </NavLink>
          {links.map((link, i) => (
            <NavLink
              to={`/${link.path}`}
              key={i}
              className={({ isActive }) =>
                isActive ? "activeIcon" : "no-activeIcon"
              }
              title={link.label}
            >
              <div className="fs-3 mb-0">{link.icon}</div>
              <p style={{ fontSize: "12px" }}>{link.label}</p>
            </NavLink>
          ))}
        </div>
        <Icon
          icon="ic:outline-power-settings-new"
          className="fs-2 text-secondary logout"
          title="logout"
          onClick={() => userService.logout()}
        />
      </div>
    </div>
  );
};

export default Sidebar;
