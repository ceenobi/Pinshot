import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { userService } from "@services";
import { useFetch } from "@hooks";
import { PageLayout } from "@components";
import { Loading } from "@utils";
import { useAuthContext } from "@config";

const AccVerification = () => {
  const { userId } = useParams();
  const { token } = useParams();
  const navigate = useNavigate();
  const { error, loading } = useFetch(
    userService.verifyUserAccount,
    userId,
    token
  );
  const { loggedInUser } = useAuthContext();

  useEffect(() => {
    if (loggedInUser.isVerified) {
      toast.success("You are verified already");
      navigate("/");
    }
  }, [loggedInUser.isVerified, navigate]);

  return (
    <PageLayout extra="py-5 px-3 mt-5">
      {error ? (
        <p className="mt-5">{error}</p>
      ) : (
        <>
          {loading ? (
            <Loading text="Verifying..." />
          ) : (
            <>
              <h1 className="fs-4">Account verified successfully</h1>
            </>
          )}
        </>
      )}
    </PageLayout>
  );
};

export default AccVerification;
