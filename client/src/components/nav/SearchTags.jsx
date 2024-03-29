import { useEffect, useState, useMemo } from "react";
import { Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useFetch, useScroll } from "@hooks";
import { searchService } from "@services";

const SearchTags = () => {
  const [tagQuery, setTagQuery] = useState("");
  // const { data: tags } = useFetch(searchService.getAllTags);
  const { scroll, scrollRef } = useScroll();
  const navigate = useNavigate();
  const location = useLocation();

  const useCustomFetch = () => {
    return useFetch(searchService.getAllTags);
  };

  const tags = useCustomFetch();
  const memoizedTags = useMemo(() => {
    return tags;
  }, [tags]);

  const { data: memoizedData } = memoizedTags;

  const shuffleTags = () => {
    const shuffled = [...memoizedData].sort(() => 0.5 - Math.random());
    const selectedTagIndex = shuffled.findIndex((tag) => tag === tagQuery);
    if (selectedTagIndex !== -1) {
      const selectedTag = shuffled.splice(selectedTagIndex, 1)[0];
      shuffled.unshift(selectedTag);
    }
    return shuffled.slice(0, 40);
  };
  const getRandomTags = shuffleTags();

  const handleTagClick = (tag) => {
    setTagQuery(tag);
    navigate(`search/?query=${tag}`);
  };

  useEffect(() => {
    if (location.pathname != "/search/") {
      setTagQuery("");
    }
  }, [location.pathname]);

  return (
    <div className="position-relative">
      <div
        className="overflow-x-auto overflow-y-hidden scrollbody px-lg-3"
        style={{ minWidth: "100%" }}
        ref={scrollRef}
      >
        <div className="d-flex align-items-center gap-2 vw-100">
          {getRandomTags?.map((tag, i) => (
            <Button
              key={i}
              variant="solid"
              style={{
                backgroundColor:
                  tag === tagQuery ? "var(--dark100)" : "lightGrey",
                color: tag === tagQuery ? "var(--cream200)" : "var(--dark100)",
                minWidth: "fit-content",
              }}
              size="sm"
              className={`rounded-3 fw-medium item ${
                tag === tagQuery && "activeIcon bg-dark"
              } text-capitalize fs-6 fw-bold`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>
      {getRandomTags?.length > 0 && (
        <>
          <Icon
            icon="mdi:arrow-left-bold-circle-outline"
            className="d-none d-lg-block cursor fs-4 position-absolute top-50 start-0 text-secondary activeIcon translate-middle z-2 focus-arrowBox"
            onClick={() => scroll(-400)}
            style={{
              transition: "all 0.5s ease",
            }}
          />

          <Icon
            icon="mdi:arrow-right-bold-circle-outline"
            className="d-none d-lg-block cursor fs-4 position-absolute top-50 start-100 text-secondary activeIcon translate-middle z-2 focus-arrowBox"
            onClick={() => scroll(400)}
            style={{ transition: "all 0.5s ease" }}
          />
        </>
      )}
    </div>
  );
};

export default SearchTags;
