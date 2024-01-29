import { NavLink } from "react-router-dom";
import { Image, Nav } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { links } from "@utils";
import { userService } from "@services";
import { tryCatch } from "@config";
import { useAuthContext} from "@hooks";

const Sidebar = () => {
  const { loggedInUser, setLoggedInUser } = useAuthContext();

  const sideBarLinks = [
    ...links,
    {
      icon: <Icon icon="mdi:person-outline" />,
      path: `profile/${loggedInUser?.userName}`,
      label: "Profile",
    },
  ];

  const logoutUser = tryCatch(async () => {
    await userService.logout();
    setLoggedInUser("");
  });

  return (
    <div
      className="d-none d-xl-block sidebar-width position-fixed top-0"
      style={{ zIndex: 5 }}
    >
      <div className="d-flex justify-content-between flex-column align-items-center py-3 min-vh-100">
        <div className="text-center">
          <NavLink to="/">
            <Image
              src={
                "https://res.cloudinary.com/ceenobi/image/upload/v1706179614/pintube/Frame_16_ecr4pq.svg"
              }
              style={{ width: "95px" }}
              className="mb-4"
            />
          </NavLink>
          {sideBarLinks.map((link, i) => (
            <NavLink
              to={`/${link.path}`}
              key={i}
              className={({ isActive }) =>
                isActive ? "activeIcon" : "no-activeIcon"
              }
              title={link.label}
            >
              <div className="fs-4 mb-0">{link.icon}</div>
              <p className="small">{link.label}</p>
            </NavLink>
          ))}
          <Nav.Link
            href="https://github.com/ceenobi/Pinshot"
            target="_blank"
            rel="noreferrer"
            className="my-4"
            title="View code base"
          >
            <Icon icon="ri:github-fill" className="fs-4 mb-0" />
            <p className="small">Github</p>
          </Nav.Link>
        </div>
        <div title="logout" type="button">
          <Icon
            icon="mdi:power-standby"
            className="fs-4 logout"
            onClick={logoutUser}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
