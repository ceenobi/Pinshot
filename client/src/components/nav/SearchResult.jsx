import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { Image } from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import { searchService } from "@services";

const SearchResult = ({ searchQuery, setResultBox }) => {
  const [result, setResult] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const searchRequest = async () => {
        document.title = `Search result for "${searchQuery}"`;
        try {
          setLoading(true);
          const { data } = await searchService.searchUserOrPins(searchQuery);
          setResult(data);
        } catch (error) {
          setError(error);
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      searchRequest();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const filterProfile = result.filter((data) => data.userName);
  const filterPins = result.filter((data) => data.title);
  const searchResult = [...filterPins, ...filterProfile];

  return (
    <div className="mt-5 py-4 px-4 bg-white shadow rounded-3 searchbox scrollbody">
      <div className="position-relative py-4">
        {error ? (
          <p className="mt-5">{error?.response?.data?.error}</p>
        ) : (
          <>
            {loading ? (
              <div className="w-100 mx-auto text-center">
                <ClipLoader color="#96b6c5" />
              </div>
            ) : (
              <div>
                {result?.length > 0 ? (
                  <>
                    <div className="mb-2">
                      <h1 className="fs-6 text-black">
                        We found {result?.length} results
                      </h1>
                      {searchResult.slice(0, 10).map((pin) => (
                        <div
                          key={pin._id}
                          className="d-flex align-items-center gap-2 mb-2 p-2 hovershade"
                          onClick={() => setResultBox(false)}
                        >
                          <Link
                            to={
                              pin.title
                                ? `/pin/${pin._id}`
                                : `/profile/${pin.userName}`
                            }
                          >
                            <Image
                              className="rounded-4 object-fit-cover"
                              src={pin.title ? pin.image[0] : pin.profilePhoto}
                              alt={pin.title ? pin.title : pin.userName}
                              loading="lazy"
                              style={{
                                width: "50px",
                                height: "50px",
                                borderRadius: pin.userName && "50%",
                              }}
                            />
                          </Link>
                          <Link
                            to={
                              pin.title
                                ? `/pin/${pin._id}`
                                : `/profile/${pin.userName}`
                            }
                            className="fw-bold text-black"
                          >
                            {pin.title ? pin.title : pin.userName}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="fs-6 mt-5 text-center text-black">
                    Sorry we could not find any available result for{" "}
                    <span className="fw-bold">
                      &quot;{searchQuery}
                      &quot;
                    </span>
                  </p>
                )}
              </div>
            )}
          </>
        )}
        {result?.length > 10 && (
          <p
            className="position-absolute top-100 start-50 translate-middle cursor text-black"
            onClick={() => {
              navigate(`search/?query=${searchQuery}`);
              setResultBox(false);
            }}
          >
            View all results
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchResult;

SearchResult.propTypes = {
  searchQuery: PropTypes.string,
  setResultBox: PropTypes.any,
};
