import { NavLink } from "react-router-dom";
import { Nav } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { links } from "@utils";
import { userService } from "@services";
import { useAuthContext } from "@config";

const Sidebar = () => {
  const { loggedInUser } = useAuthContext();

  return (
    <div
      className="d-none d-xl-block desktop-width position-fixed top-0"
      style={{ zIndex: 5 }}
    >
      <div className="d-flex justify-content-between flex-column align-items-center py-3 px-3 min-vh-100">
        <div className="text-center">
          <Icon icon="iconoir:media-image" className="logo mt-1 mb-4 fs-1" />
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
              <p style={{ fontSize: "14px" }}>{link.label}</p>
            </NavLink>
          ))}
          <NavLink
            to={`/profile/${loggedInUser?.userName}`}
            className={({ isActive }) =>
              isActive ? "activeIcon" : "no-activeIcon"
            }
          >
            <Icon icon="iconamoon:profile-light" className="fs-3" />
            <p style={{ fontSize: "14px" }}>Profile</p>
          </NavLink>
          <Nav.Link
            href="https://github.com/ceenobi/Pinshot"
            target="_blank"
            rel="noreferrer"
            className="my-4"
          >
            <Icon icon="ri:github-fill" className="fs-3 mb-0" />
            <p style={{ fontSize: "14px" }}>Github</p>
          </Nav.Link>
        </div>
        <div title="logout" type="button">
          <Icon
            icon="ic:outline-power-settings-new"
            className="fs-2 logout"
            onClick={() => userService.logout()}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
