import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import { format } from "timeago.js";
import {
  EditProfileModal,
  MyButton,
  PageLayout,
  SubscribedUsers,
  UserLikedPins,
  UserPins,
} from "../components";
import { useFetch, useTitle } from "../hooks";
import { userService } from "../services";
import { Loading } from "../utils";
import { Button, Image, Tab, Tabs } from "react-bootstrap";
import { tryCatch, useAuthContext } from "../config";

const Profile = () => {
  const { userName } = useParams();
  const memoizedUserName = useMemo(() => userName, [userName]);
  const { loggedInUser, setLoggedInUser } = useAuthContext();
  const {
    data: user,
    error,
    loading,
    setData,
  } = useFetch(userService.getUserProfile, memoizedUserName);
  const [isloading, setIsLoading] = useState(false);
  const memoizedUser = useMemo(() => user, [user]);
  useTitle(`${memoizedUser?.userName} profile`);

  const follow = tryCatch(async (userId) => {
    const res = await userService.followUser(userId, loggedInUser._id);
    toast.success(res.data);
    const { data } = await userService.authUser();
    setLoggedInUser(data);
    const userinfo = await userService.getUserProfile(memoizedUserName);
    setData(userinfo.data);
  });

  const unfollow = tryCatch(async (userId) => {
    const res = await userService.unFollowUser(userId, loggedInUser._id);
    toast.success(res.data);
    const { data } = await userService.authUser();
    setLoggedInUser(data);
    const userinfo = await userService.getUserProfile(memoizedUserName);
    setData(userinfo.data);
  });

  const resendTokenLink = async () => {
    setIsLoading(true);
    try {
      const { status, data } = await userService.resendVerificationLink(
        loggedInUser._id
      );
      if (status === 200) {
        toast.success(data.msg);
      }
    } catch (error) {
      toast.error(error.response.data.error);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout extra="py-5 px-3 mt-5">
      {error ? (
        <p className="mt-5">{error}</p>
      ) : (
        <>
          {loading ? (
            <Loading text="Fetching user..." />
          ) : (
            <div>
              <div className="d-md-flex justify-content-center gap-3  text-center text-md-start">
                <div>
                  <Image
                    src={user?.profilePhoto}
                    style={{ width: "120px", height: "120px" }}
                    roundedCircle
                    className="mb-2 object-fit-cover"
                  />
                  <EditProfileModal user={memoizedUser} setData={setData} />
                </div>
                <div>
                  <div className="mb-0 d-flex flex-wrap align-items-center justify-content-center justify-content-md-start gap-2">
                    <span className="fs-4 fw-bold">
                      @{memoizedUser?.userName}
                    </span>
                    <div className="d-flex flex-wrap align-items-center gap-2">
                      <span className="text-secondary">
                        {" "}
                        * {memoizedUser?.subscribedUsers?.length} followers
                      </span>
                      <span className="text-secondary">
                        {" "}
                        * {memoizedUser?.subscribers} following
                      </span>
                    </div>
                  </div>
                  <p className="mb-1">{memoizedUser?.email}</p>
                  <div className="mb-2 d-md-flex gap-2">
                    {loggedInUser._id === memoizedUser?._id && (
                      <>
                        <p className="fw-bold mb-0">Account verification:</p>
                        <span>
                          {memoizedUser?.isVerified === true
                            ? "Verified"
                            : "Not verified"}
                        </span>
                        {!memoizedUser?.isVerified && (
                          <MyButton
                            text={isloading ? "Sending..." : "Resend link"}
                            className="mx-2 rounded-4"
                            onClick={resendTokenLink}
                          />
                        )}
                      </>
                    )}
                  </div>
                  <p className="mb-0">
                    <b>Bio:</b> {memoizedUser?.bio}
                  </p>
                  <p>
                    <b>Member since:</b> {format(memoizedUser?.createdAt)}
                  </p>
                  {loggedInUser._id !== memoizedUser?._id && (
                    <Button
                      variant="none"
                      style={{
                        width: "130px",
                        backgroundColor: "var(--blue200)",
                      }}
                      className="border-0 fw-bold rounded-4 p-2 btn-style"
                      onClick={
                        loggedInUser.subscribedUsers?.includes(
                          memoizedUser?._id
                        )
                          ? () => unfollow(user?._id)
                          : () => follow(user?._id)
                      }
                    >
                      <Icon icon="mdi:bell" className="me-1" />
                      {loggedInUser.subscribedUsers?.includes(memoizedUser?._id)
                        ? "Unfollow"
                        : "Follow"}
                    </Button>
                  )}
                </div>
              </div>
              <Tabs
                defaultActiveKey="user"
                id="user-profile-tab"
                className="mt-5"
                justify
              >
                <Tab eventKey="user" title="Pins">
                  <UserPins user={memoizedUser?._id} />
                </Tab>
                <Tab eventKey="likedpins" title="Liked pins">
                  <UserLikedPins user={memoizedUser?._id} />
                </Tab>
                <Tab eventKey="Subscribedusers" title="Followers">
                  <SubscribedUsers user={memoizedUser?._id} />
                </Tab>
              </Tabs>
            </div>
          )}
        </>
      )}
    </PageLayout>
  );
};

export default Profile;
