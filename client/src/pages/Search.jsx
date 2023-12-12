import { useEffect, useState } from "react";
import { Col, Image, Row } from "react-bootstrap";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { searchService } from "../services";
import { MasonryLayout, PageLayout, PinCard } from "../components";
import { Loading } from "../utils";
import { useTitle } from "../hooks";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const [result, setResult] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useTitle(`Search result for "${query}"`);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) {
      params.append("query", query);
    } else {
      params.delete("query");
    }
    navigate({ search: params.toString() });
  }, [query, navigate]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const searchRequest = async () => {
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
  const filterPins = result.filter((data) => data?.title);

  return (
    <PageLayout extra="px-3" style={{ paddingTop: "8rem" }}>
      {error ? (
        <p className="mt-5">{error?.response?.data?.error}</p>
      ) : (
        <>
          {loading ? (
            <Loading text="Searching..." />
          ) : (
            <div>
              {result && result?.length > 0 ? (
                <>
                  <MasonryLayout>
                    {filterPins.map((pin) => (
                      <PinCard key={pin._id} {...pin} />
                    ))}
                  </MasonryLayout>
                  {filterProfile?.length > 0 && (
                    <>
                      <hr />
                      <Row className="my-3">
                        <Col xs={4} md={2}>
                          <div className="d-flex gap-4">
                            {filterProfile.map((user) => (
                              <div
                                style={{ width: "50px", height: "50px" }}
                                key={user._id}
                              >
                                <Link to={`/profile/${user.userName}`}>
                                  <Image
                                    src={user.profilePhoto}
                                    className="rounded-4 object-fit-cover w-100 h-100"
                                    roundedCircle
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
                            ))}
                          </div>
                        </Col>
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
