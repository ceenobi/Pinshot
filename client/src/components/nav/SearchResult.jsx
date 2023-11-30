import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { searchService } from "../../services";
import { Image } from "react-bootstrap";
import { ClipLoader } from "react-spinners";

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

  const filterProfile = result.filter((data) => data.email);
  const filterPins = result.filter((data) => data.owner);

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
                      <h1 className="fs-6">
                        We found {result?.length} results
                      </h1>
                      {filterPins.map((pin) => (
                        <div
                          key={pin._id}
                          className="d-flex align-items-center flex-wrap gap-2 mb-2 p-2 hovershade"
                          onClick={() => setResultBox(false)}
                        >
                          <Link to={`/pin/${pin._id}`}>
                            <Image
                              className="rounded-4 object-fit-cover"
                              src={pin.image[0]}
                              alt={pin.title}
                              loading="lazy"
                              style={{ width: "60px", height: "60px" }}
                            />
                          </Link>
                          <Link
                            to={`/pin/${pin._id}`}
                            className="fw-bold text-black"
                          >
                            {pin.title}
                          </Link>
                        </div>
                      ))}
                    </div>
                    <div>
                      {filterProfile.map((user) => (
                        <div
                          key={user._id}
                          className="d-flex gap-2 align-items-center mb-2 p-2 hovershade"
                        >
                          <Link to={`/profile/${user.userName}`}>
                            <Image
                              src={user.profilePhoto}
                              style={{ width: "50px", height: "50px" }}
                              roundedCircle
                            />
                          </Link>
                          <Link
                            to={`/profile/${user.userName}`}
                            className="fw-bold text-black"
                          >
                            {user.userName}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="fs-6 mt-5 text-center">
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
        <p
          className="position-absolute top-100 start-50 translate-middle cursor"
          onClick={() => {
            navigate(`search/?query=${searchQuery}`);
            setResultBox(false);
          }}
        >
          View all results
        </p>
      </div>
    </div>
  );
};

export default SearchResult;

SearchResult.propTypes = {
  searchQuery: PropTypes.string,
  setResultBox: PropTypes.string,
};
