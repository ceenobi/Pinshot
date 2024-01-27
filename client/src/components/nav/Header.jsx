import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Button, Form, Image, InputGroup, Fade } from "react-bootstrap";
import { useAuthContext } from "@config";
import { ColorSchemeToggle } from "@utils";
import { PageLayout } from "@layouts";
import SidebarMobile from "./SidebarMobile";
import SearchResult from "./SearchResult";
import SearchTags from "./SearchTags";

const Header = () => {
  const { loggedInUser, isDark } = useAuthContext();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [resultBox, setResultBox] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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

  const handleSubmitMobile = (e) => {
    e.preventDefault();
    if (searchQuery.length > 0) {
      navigate(`/search?query=${searchQuery}`);
    }
  };

  return (
    <PageLayout
      extra="position-fixed top-0 p-3"
      style={{
        zIndex: 5,
        backgroundColor: isDark ? "var(--color-Dark)" : "#ffffff",
      }}
    >
      {!showSearch ? (
        <>
          <div className="position-relative d-flex justify-content-between align-items-center mb-3">
            <SidebarMobile />
            <NavLink to="/">
              <Image
                src={
                  "https://res.cloudinary.com/ceenobi/image/upload/v1706179614/pintube/Frame_16_ecr4pq.svg"
                }
                style={{ width: "100px" }}
                className="d-lg-none"
              />
            </NavLink>
            <Form className="w-100" onSubmit={handleSubmit}>
              <InputGroup className="d-none d-md-flex mx-auto w-75 rounded-pill border-0 bg-secondary-subtle">
                <Form.Control
                  placeholder="Search"
                  aria-label="Search bar for pins"
                  className="rounded-start-pill border-0 bg-secondary-subtle"
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
                      className="fs-4 text-secondary activeIcon"
                    />
                  </Button>
                ) : (
                  <Button variant="none" type="submit">
                    <Icon
                      icon="iconoir:search"
                      className="fs-4 text-secondary activeIcon"
                    />
                  </Button>
                )}
              </InputGroup>
            </Form>
            <div className="d-flex align-items-center gap-3 gap-lg-4">
              <ColorSchemeToggle />
              <NavLink
                to="/create"
                className={({ isActive }) =>
                  isActive
                    ? "activeIcon d-none d-md-block"
                    : "no-activeIcon d-none d-md-block"
                }
                title="Create pin"
              >
                <Icon icon="solar:camera-linear" className="fs-4" />
              </NavLink>
              <Icon
                icon="iconoir:search"
                className="fs-2 d-md-none cursor"
                onClick={() => setShowSearch(!showSearch)}
              />
              <NavLink to={`/profile/${loggedInUser?.userName}`}>
                <Image
                  src={loggedInUser?.profilePhoto}
                  roundedCircle
                  className="object-fit-cover"
                  style={{ width: "30px", height: "30px" }}
                  title={loggedInUser?.userName}
                />
              </NavLink>
            </div>
            {resultBox && (
              <SearchResult
                searchQuery={searchQuery}
                setResultBox={setResultBox}
              />
            )}
          </div>
        </>
      ) : (
        <>
          <Form
            className="d-md-none d-flex align-items-center justify-content-center w-100 py-2 px-3"
            style={{
              zIndex: 4,
              transition: "0.3s all",
              backgroundColor: isDark ? "var(--color-backgroundDark)" : "white",
            }}
            onSubmit={handleSubmitMobile}
          >
            <Fade in={open}>
              <InputGroup className="mx-auto w-100 rounded-pill border-0 bg-secondary-subtle">
                <Form.Control
                  placeholder="Search"
                  aria-label="Search bar for pins"
                  className="rounded-start-pill border-0 bg-secondary-subtle"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="none">
                  <Icon
                    icon="material-symbols:close-small"
                    className="cursor fs-4 activeIcon"
                    onClick={() => {
                      setShowSearch(!showSearch);
                      setResultBox(false);
                    }}
                  />
                </Button>
              </InputGroup>
            </Fade>
          </Form>
          {resultBox && (
            <SearchResult
              searchQuery={searchQuery}
              setResultBox={setResultBox}
            />
          )}
        </>
      )}
      {matchPaths.includes(location.pathname) && <SearchTags />}
    </PageLayout>
  );
};

export default Header;
