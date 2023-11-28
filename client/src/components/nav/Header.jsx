import { NavLink, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Button, Form, Image, InputGroup, Fade } from "react-bootstrap";
import SidebarMobile from "./SidebarMobile";
import { useStateContext } from "../../config";
import PageLayout from "../PageLayout";
import { useState } from "react";

const Header = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { loggedInUser } = useStateContext();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery) {
      navigate(`search/?query=${searchQuery}`);
    }
  };
  return (
    <PageLayout extra="position-fixed top-0 bg-white" style={{ zIndex: 4 }}>
      <div className="p-3 d-flex justify-content-between align-items-center">
        <SidebarMobile />
        <NavLink
          to="/"
          className="fs-4 fw-bold mx-4 mx-xl-0"
          title="Pinshot"
          style={{ color: "var(--dark100)" }}
        >
          PINTUBE
        </NavLink>

        <Form className="w-100" onSubmit={handleSubmit}>
          <InputGroup
            className="d-none d-md-flex mx-auto w-50 rounded-pill border"
            onSubmit={handleSubmit}
          >
            <Form.Control
              placeholder="Search"
              aria-label="Search bar for pins"
              className="rounded-start-pill"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="none" type="submit">
              {" "}
              <Icon
                icon="ic:round-search"
                className="fs-2 text-secondary activeIcon"
              />
            </Button>
          </InputGroup>
        </Form>

        <div className="d-flex align-items-center gap-3">
          <Icon
            icon="fluent:camera-add-24-filled"
            className="fs-2 text-secondary activeIcon"
          />
          <Image
            src={loggedInUser.profilePhoto}
            roundedCircle
            className="d-none d-md-block"
            style={{ width: "40px", height: "40px" }}
            title={loggedInUser.userName}
          />
          <Icon
            icon="ic:round-search"
            className="fs-2 d-md-none text-secondary activeIcon"
            onClick={() => setShowSearch(!showSearch)}
          />
        </div>
      </div>

      {showSearch && (
        <Form
          className="d-md-none d-flex align-items-center w-100 py-2 px-3 position-fixed top-0 bg-white"
          style={{ zIndex: 4, transition: "0.3s all" }}
          onSubmit={handleSubmit}
        >
          <Fade in={open}>
            <InputGroup
              className="mx-auto w-100 rounded-pill border"
              onSubmit={handleSubmit}
            >
              <Form.Control
                placeholder="Search"
                aria-label="Search bar for pins"
                className="rounded-start-pill"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="none" type="submit">
                {" "}
                <Icon
                  icon="ic:round-search"
                  className="fs-2 text-secondary activeIcon"
                />
              </Button>
            </InputGroup>
          </Fade>
          <Icon
            icon="material-symbols:close-small"
            className="cursor fs-2 text-secondary activeIcon"
            onClick={() => setShowSearch(!showSearch)}
          />
        </Form>
      )}
    </PageLayout>
  );
};

export default Header;
