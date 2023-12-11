import { useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import { format } from "timeago.js";
import {
  EditProfileModal,
  PageLayout,
  SubscribedUsers,
  UserLikedPins,
  UserPins,
} from "../components";
import { useFetch, useTitle } from "../hooks";
import { userService } from "../services";
import { Loading } from "../utils";
import { Button, Image, Tab, Tabs } from "react-bootstrap";
import { tryCatch, useStateContext } from "../config";

const Profile = () => {
  const { userName } = useParams();
  const { loggedInUser, setLoggedInUser } = useStateContext() || {};
  const {
    data: user,
    error,
    loading,
    setData,
  } = useFetch(userService.getUserProfile, userName);
  useTitle(`${user?.userName} profile`);

  const follow = tryCatch(async (userId) => {
    const res = await userService.followUser(userId, loggedInUser._id);
    toast.success(res.data);
    const { data } = await userService.authUser();
    setLoggedInUser(data);
    const userinfo = await userService.getUserProfile(userName);
    setData(userinfo.data);
  });

  const unfollow = tryCatch(async (userId) => {
    const res = await userService.unFollowUser(userId, loggedInUser._id);
    toast.success(res.data);
    const { data } = await userService.authUser();
    setLoggedInUser(data);
    const userinfo = await userService.getUserProfile(userName);
    setData(userinfo.data);
  });

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
              <div className="d-md-flex gap-3 align-items-center text-center text-md-start">
                <div>
                  <Image
                    src={user?.profilePhoto}
                    style={{ width: "120px", height: "120px" }}
                    roundedCircle
                    className="mb-2 object-fit-cover"
                  />
                  <EditProfileModal user={user} setData={setData} />
                </div>
                <div>
                  <div className="mb-0 d-flex flex-wrap align-items-center justify-content-center justify-content-md-start gap-2">
                    <span className="fs-4 fw-bold">{user?.userName}</span>
                    <div className="d-flex flex-wrap align-items-center gap-2">
                      <span className="text-secondary">
                        {" "}
                        * {user?.subscribedUsers?.length} followers
                      </span>
                      <span className="text-secondary">
                        {" "}
                        * {user?.subscribers} following
                      </span>
                    </div>
                  </div>
                  <p>{user?.email}</p>
                  <p className="mb-0">
                    <b>bio:</b> {user?.bio}
                  </p>
                  <p>
                    <b>member since:</b> {format(user?.createdAt)}
                  </p>
                  {loggedInUser._id !== user?._id && (
                    <Button
                      variant="none"
                      style={{
                        width: "130px",
                        backgroundColor: "var(--blue100)",
                      }}
                      className="border-0 fw-bold rounded-3 p-2 btn-style"
                      onClick={
                        loggedInUser.subscribedUsers?.includes(user?._id)
                          ? () => unfollow(user?._id)
                          : () => follow(user?._id)
                      }
                    >
                      <Icon icon="mdi:bell" className="me-1" />
                      {loggedInUser.subscribedUsers?.includes(user?._id)
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
                <Tab eventKey="user" title="Your pins">
                  <UserPins user={user} />
                </Tab>
                <Tab eventKey="likedpins" title="Your liked pins">
                  <UserLikedPins />
                </Tab>
                <Tab eventKey="Subscribedusers" title="Followers">
                  <SubscribedUsers user={user} />
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
