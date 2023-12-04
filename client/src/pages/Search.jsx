import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { searchService } from "../services";
import { MasonryLayout, PageLayout, PinCard } from "../components";
import { Loading } from "../utils";
import { Button, Col, Image, Row } from "react-bootstrap";
import { useFetch } from "../hooks";
import toast from "react-hot-toast";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const [result, setResult] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tag, setTag] = useState(query);
  const { data: tags } = useFetch(searchService.getAllTags);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams();
    if (tag) {
      params.append("query", tag);
    } else {
      params.delete("query");
    }
    navigate({ search: params.toString() });
  }, [tag, navigate]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const searchRequest = async () => {
        document.title = `Search result for "${query}"`;
        try {
          setLoading(true);
          const { data } = await searchService.searchUserOrPins(query);
          setResult(data);
        } catch (error) {
          setError(error);
          console.error(error);
          toast.error(error?.response?.data?.error);
        } finally {
          setLoading(false);
        }
      };
      searchRequest();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const filterProfile = result.filter((data) => data?.email);
  const filterPins = result.filter((data) => data?.owner);

  const shuffleTags = () => {
    const shuffled = [...tags].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 30);
  };
  const getRandomTags = shuffleTags();

  console.log(result);

  return (
    <PageLayout extra="py-5 px-3 mt-5">
      {error ? (
        <p className="mt-5">{error?.response?.data?.error}</p>
      ) : (
        <>
          {loading ? (
            <Loading text="Searching..." />
          ) : (
            <div>
              <div className="d-flex gap-3 overflow-x-scroll scrollbody mb-4">
                {getRandomTags?.map((tag, i) => (
                  <Button
                    key={i}
                    variant="none"
                    style={{
                      backgroundColor: query === tag ? "var(--blue200)" : "",
                      color:
                        query === tag ? "var(--cream200)" : "var(--dark100)",
                    }}
                    className={
                      query === tag
                        ? "rounded-4 px-3 py-1 fw-bold"
                        : "rounded-4 bg-secondary-subtle px-3 py-1 activeIcon"
                    }
                    onClick={() => setTag(tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
              {result?.length > 0 ? (
                <>
                  <MasonryLayout>
                    {filterPins.map((pin) => (
                      <PinCard key={pin._id} {...pin} />
                    ))}
                  </MasonryLayout>
                  {filterProfile.length > 0 && (
                    <>
                      <hr />
                      <Row className="my-3">
                        {filterProfile.map((user) => (
                          <Col key={user._id} xs={4} md={2}>
                            <div>
                              <Link to={`/profile/${user.userName}`}>
                                <Image
                                  src={user.profilePhoto}
                                  style={{ width: "100%", height: "150px" }}
                                  className="rounded-4"
                                />
                              </Link>
                              <div className="text-center">
                                <Link
                                  to={`/profile/${user.userName}`}
                                  className="text-black"
                                >
                                  {user.userName}
                                </Link>
                              </div>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </>
                  )}
                </>
              ) : (
                <p className="fs-6 mt-5">
                  Sorry we could not find any available result for{" "}
                  <span className="fw-bold">
                    &quot;{query}
                    &quot;
                  </span>
                </p>
              )}
            </div>
          )}
        </>
      )}
    </PageLayout>
  );
};

export default Search;
