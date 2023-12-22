import { useState } from "react";
import { Icon } from "@iconify/react";
import { Image, Offcanvas, Stack } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { links } from "../../utils";
import { useAuthContext } from "../../config";
import { userService } from "../../services";

const SidebarMobile = () => {
  const [show, setShow] = useState(false);
  const { loggedInUser } = useAuthContext() || {};

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      <Icon
        icon="ant-design:menu-outlined"
        className="display-3 d-xl-none text-secondary cursor"
        onClick={handleShow}
      />
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
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
                <div className="fs-2 mb-0">{link.icon}</div>
                <p style={{ fontSize: "18px" }}>{link.label}</p>
              </NavLink>
            ))}
            <NavLink
              to={`/profile/${loggedInUser?.userName}`}
              className={({ isActive }) =>
                isActive ? "activeIcon mt-4" : "no-activeIcon mt-4"
              }
              onClick={handleClose}
            >
              <Icon icon="ic:round-person-2" className="fs-1" />
              <p style={{ fontSize: "18px" }}>Profile</p>
            </NavLink>
            <Icon
              icon="ic:outline-power-settings-new"
              className="fs-1 mt-4 logout"
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
