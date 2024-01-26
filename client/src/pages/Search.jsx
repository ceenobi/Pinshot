import { useEffect, useState } from "react";
import { Image, Tab, Tabs } from "react-bootstrap";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { searchService } from "@services";
import { MasonryLayout, PinCard } from "@components";
import { PageLayout } from "@layouts";
import { Loading } from "@utils";
import { useTitle } from "@hooks";

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
    <PageLayout extra="px-3" style={{ paddingTop: "8.5rem" }}>
      {error ? (
        <p className="mt-5">{error?.response?.data?.error}</p>
      ) : (
        <>
          {loading ? (
            <Loading text="Searching..." />
          ) : (
            <div className="py-2">
              {result && result?.length > 0 ? (
                <>
                  <Tabs
                    defaultActiveKey="Pins"
                    id="pins-search-result"
                    className="mb-3"
                    fill
                  >
                    <Tab eventKey="Pins" title="Pins">
                      <MasonryLayout>
                        {filterPins.map((pin) => (
                          <PinCard key={pin._id} {...pin} />
                        ))}
                      </MasonryLayout>
                    </Tab>
                    <Tab eventKey="Account" title="Account">
                      {filterProfile?.length > 0 ? (
                        <>
                          {filterProfile.map((user) => (
                            <Link
                              to={`/profile/${user.userName}`}
                              key={user._id}
                            >
                              <div className="d-flex align-items-center gap-2 mb-2 p-2 hovershade">
                                <Image
                                  className="rounded-4 object-fit-cover"
                                  src={user.profilePhoto}
                                  alt={user.userName}
                                  loading="lazy"
                                  style={{
                                    width: "45px",
                                    height: "45px",
                                  }}
                                  roundedCircle
                                />
                                <span
                                  to={`/profile/${user.userName}`}
                                  className="fw-bold"
                                >
                                  {user.userName}
                                </span>
                              </div>
                            </Link>
                          ))}
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
                    </Tab>
                  </Tabs>
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
