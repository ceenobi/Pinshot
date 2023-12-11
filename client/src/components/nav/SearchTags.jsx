import { useState } from "react";
import { Button } from "react-bootstrap";
import { useFetch } from "../../hooks";
import { searchService } from "../../services";
import { useNavigate } from "react-router-dom";

const SearchTags = () => {
  const [tagQuery, setTagQuery] = useState("");
  const { data: tags } = useFetch(searchService.getAllTags);
  const navigate = useNavigate();

  const shuffleTags = () => {
    const shuffled = [...tags].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 40);
  };
  const getRandomTags = shuffleTags();

  return (
    <div className="d-flex gap-3 overflow-x-scroll overflow-y-hidden scrollbody p-3">
      {getRandomTags?.map((tag, i) => (
        <Button
          key={i}
          variant="none"
          style={{
            backgroundColor: tag === tagQuery ? "var(--blue100)" : "#000",
            color: tag === tagQuery ? "var(--cream200)" : "#fff",
          }}
          className={
            tag === tagQuery
              ? "rounded-4 px-3 py-1 fw-bold text-capitalize"
              : "rounded-4 px-3 py-1 activeIcon text-capitalize"
          }
          onClick={() => {
            setTagQuery(tag);
            navigate(`search/?query=${tag}`);
          }}
        >
          {tag}
        </Button>
      ))}
    </div>
  );
};

export default SearchTags;
