import { Link, NavLink, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { Button, Form, Image, InputGroup, Fade } from "react-bootstrap";
import SidebarMobile from "./SidebarMobile";
import { useAuthContext } from "../../config";
import PageLayout from "../PageLayout";
import SearchResult from "./SearchResult";
import SearchTags from "./SearchTags";

const Header = () => {
  const { loggedInUser } = useAuthContext();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [resultBox, setResultBox] = useState(false);
  const location = useLocation();

  const paths = ["/", "/trending", "/search/", "/explore"];
  const matchPaths = paths.map((path) => path);

  useEffect(() => {
    if (searchQuery.length > 0) {
      setResultBox(true);
    } else {
      setResultBox(false);
    }
  }, [searchQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.length > 0) {
      setResultBox(true);
    }
  };

  return (
    <PageLayout
      extra="position-fixed top-0 bg-white py-2 px-3"
      style={{ zIndex: 5 }}
    >
      <>
        <div className="position-relative d-flex justify-content-between align-items-center mb-3 mt-1">
          <SidebarMobile />
          <NavLink
            to="/"
            className="fs-4 fw-bold mx-4 mx-xl-0"
            title="Pinshot"
            style={{ color: "var(--dark100)" }}
          >
            PINSHOT
          </NavLink>

          <Form className="w-100" onSubmit={handleSubmit}>
            <InputGroup className="d-none d-md-flex mx-auto w-50 rounded-pill border">
              <Form.Control
                placeholder="Search"
                aria-label="Search bar for pins"
                className="rounded-start-pill"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {resultBox ? (
                <Button
                  variant="none"
                  type="submit"
                  onClick={() => {
                    setResultBox(false);
                    setSearchQuery("");
                  }}
                >
                  <Icon
                    icon="material-symbols:close-small"
                    className="fs-2 text-secondary activeIcon"
                  />
                </Button>
              ) : (
                <Button variant="none" type="submit">
                  <Icon
                    icon="ic:round-search"
                    className="fs-2 text-secondary activeIcon"
                  />
                </Button>
              )}
            </InputGroup>
          </Form>
          <div className="d-flex align-items-center gap-3">
            <NavLink
              className={({ isActive }) =>
                isActive ? "activeIcon" : "no-activeIcon"
              }
              to="/create"
            >
              <Icon icon="fluent:camera-add-24-filled" className="fs-2" />
            </NavLink>

            <Link to={`/profile/${loggedInUser?.userName}`}>
              <Image
                src={loggedInUser?.profilePhoto}
                roundedCircle
                className="d-none d-md-block object-fit-cover"
                style={{ width: "40px", height: "40px" }}
                title={loggedInUser?.userName}
              />
            </Link>
            <Icon
              icon="ic:round-search"
              className="fs-2 d-md-none text-secondary activeIcon"
              onClick={() => setShowSearch(!showSearch)}
            />
          </div>
          {resultBox && (
            <SearchResult
              searchQuery={searchQuery}
              setResultBox={setResultBox}
            />
          )}
        </div>
        {matchPaths.includes(location.pathname) && <SearchTags />}
      </>
      {showSearch && (
        <>
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
              onClick={() => {
                setShowSearch(!showSearch);
                setResultBox(false);
              }}
            />
          </Form>
        </>
      )}
    </PageLayout>
  );
};

export default Header;
