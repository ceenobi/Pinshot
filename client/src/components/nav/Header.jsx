import { NavLink } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Button, Form, Image, InputGroup } from "react-bootstrap";
import SidebarMobile from "./SidebarMobile";
import { useStateContext } from "../../config";
import PageLayout from "../PageLayout";

const Header = () => {
  const { loggedInUser } = useStateContext();
  return (
    <PageLayout
      extra="position-fixed top-0 bg-white"
      style={{ zIndex: 3 }}
    >
      <div className="p-3 d-flex justify-content-between align-items-center">
        <SidebarMobile />
        <NavLink
          to="/"
          className="fs-4 fw-bold"
          title="Pinshot"
          style={{ color: "var(--dark100)" }}
        >
          PINSHOT<sup className="fw-light">TM</sup>
        </NavLink>
        <InputGroup className="d-none d-xl-flex w-50 rounded-pill border">
          <Form.Control
            placeholder="Search"
            aria-label="Search bar for pins"
            className="rounded-start-pill"
          />
          <Button variant="none" type="submit">
            {" "}
            <Icon
              icon="ic:round-search"
              className="fs-2 text-secondary activeIcon"
            />
          </Button>
        </InputGroup>

        <div className="d-flex align-items-center gap-3 gap-md-5">
          <Image
            src={loggedInUser.profilePhoto}
            roundedCircle
            className="d-none d-xl-block"
            style={{ width: "40px", height: "40px" }}
            title={loggedInUser.userName}
          />
          <Icon
            icon="fluent:camera-add-24-filled"
            className="fs-2 text-secondary activeIcon"
          />
          <Icon
            icon="ic:round-search"
            className="fs-2 d-xl-none text-secondary activeIcon"
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default Header;
