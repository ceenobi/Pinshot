import { useState } from "react";
import { Icon } from "@iconify/react";
import { Image, Offcanvas, Stack, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { links } from "../../utils";
import { useAuthContext } from "../../config";
import { userService } from "../../services";

const SidebarMobile = () => {
  const [show, setShow] = useState(false);
  const { loggedInUser, isDark } = useAuthContext();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      <Icon
        icon="ant-design:menu-outlined"
        className="display-3 d-xl-none cursor"
        onClick={handleShow}
      />
      <Offcanvas
        show={show}
        onHide={handleClose}
        style={{
          backgroundColor: isDark ? "var(--color-backgroundDark)" : "white",
          color: isDark ? "var(--color-backgroundLight)" : "black",
        }}
      >
        <Offcanvas.Header>
          <Offcanvas.Title className="text-capitalize">
            <Stack direction="horizontal" className="align-items-center">
              <Image
                src={loggedInUser?.profilePhoto}
                roundedCircle
                className="me-2 object-fit-cover"
                style={{ width: "40px", height: "40px" }}
                alt={loggedInUser?.userName}
              />
              <span>Hi, {loggedInUser?.userName}</span>
            </Stack>
          </Offcanvas.Title>
          <Icon
            icon="line-md:menu-to-close-alt-transition"
            className="display-6 cursor"
            onClick={handleClose}
          />
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="text-center">
            {links.map((link, i) => (
              <NavLink
                to={`/${link.path}`}
                key={i}
                className={({ isActive }) =>
                  isActive ? "activeIcon" : "no-activeIcon"
                }
                title={link.label}
                onClick={handleClose}
              >
                <div className="display-3 mb-0">{link.icon}</div>
                <p style={{ fontSize: "14px" }}>{link.label}</p>
              </NavLink>
            ))}
            <NavLink
              to={`/profile/${loggedInUser?.userName}`}
              className={({ isActive }) =>
                isActive ? "activeIcon mt-4" : "no-activeIcon mt-4"
              }
              onClick={handleClose}
            >
              <Icon icon="iconamoon:profile-light" className="display-1" />
              <p style={{ fontSize: "14px" }}>Profile</p>
            </NavLink>
            <Nav.Link
              href="https://github.com/ceenobi/Pinshot"
              target="_blank"
              rel="noreferrer"
              className="mt-4"
            >
              <Icon icon="ri:github-fill" className="display-3 mb-0" />
              <p style={{ fontSize: "14px" }}>Github</p>
            </Nav.Link>
            <Icon
              icon="ic:outline-power-settings-new"
              className="display-3 mt-4 logout"
              title="logout"
              onClick={() => userService.logout()}
            />
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default SidebarMobile;
