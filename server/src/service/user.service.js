import bcrypt from "bcrypt";
//add a user to db
const addUser =
  (User) =>
  async ({ userName, email, password }) => {
    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(password, salt);
    return await User.create({ userName, email, password: passwordHashed });
  };

//verify password to login user
const verifyPassword = () => async (password, userPassword) => {
  return await bcrypt.compare(password, userPassword);
};

//get all users
const getUsers = (User) => async () => {
  return await User.find({});
};

// authenticate user
const getAuthUser = (User) => async (id) => {
  return await User.findById(id);
};

//find user by username
const getUserByUsername =
  (User) =>
  async ({ userName }) => {
    return await User.findOne({ userName: userName }).select("+password");
  };

//get user profile
const getUserProfile =
  (User) =>
  async ({ userName }) => {
    return await User.findOne({ userName: userName });
  };

const getUserByEmail =
  (User) =>
  async ({ email }) => {
    return await User.findOne({ email: email });
  };

//find user by id
const getUserById =
  (User) =>
  async ({ id }) => {
    return await User.findOne({ _id: id });
  };

//update user profile detail
const updateUser =
  (User) =>
  async (id, { userName, email, password, profilePhoto, bio }) => {
    const user = await User.findById(id);
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const passwordHashed = await bcrypt.hash(password, salt);
      user.password = passwordHashed;
    }
    Object.assign(user, {
      userName: userName || user.userName,
      email: email || user.email,
      profilePhoto: profilePhoto || user.profilePhoto,
      bio: bio || user.bio,
    });
    return await user.save();
  };

//reset user password
const passwordReset =
  (User) =>
  async (id, { password }) => {
    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(password, salt);
    return await User.updateOne({ _id: id }, { password: passwordHashed });
  };

//create token to verify user for password reset or email verification
const createVerifyToken =
  (Token) =>
  async ({ userId, token }) => {
    const createToken = new Token({
      userId,
      token,
    });
    return createToken.save();
  };

//verify the token
const verifyToken =
  (Token) =>
  async ({ userId, token }) => {
    return await Token.findOne({
      userId: userId,
      token: token,
    });
  };

//update user verification status to true
const updateVerifyUserStatus = (User) => async (id) => {
  return await User.findByIdAndUpdate(id, { isVerified: true }, { new: true });
};

//subscribe a user
const subscribeUser = (User) => async (userId, subId) => {
  await User.findByIdAndUpdate(userId, {
    $push: { subscribedUsers: subId },
  });
  await User.findByIdAndUpdate(subId, {
    $push: { subscribers: userId },
  });
  return;
};

const unSubscribeUser = (User) => async (userId, subId) => {
  await User.findByIdAndUpdate(userId, {
    $pull: { subscribedUsers: subId },
  });
  await User.findByIdAndUpdate(subId, {
    $pull: { subscribers: userId },
  });
  return;
};

const getSubbedUsers = (User) => async (userId) => {
  const findUser = await User.findById(userId);
  const getSubbedIds = findUser.subscribedUsers.map((user) => user);
  return await User.find({ _id: getSubbedIds });
};

const getSubcribers = (User) => async (userId) => {
  const findUser = await User.findById(userId);
  const getSubbedIds = findUser.subscribers.map((user) => user);
  return await User.find({ _id: getSubbedIds });
};

export default (User, Token) => {
  return {
    addUser: addUser(User),
    verifyPassword: verifyPassword(),
    getUsers: getUsers(User),
    getUserByUsername: getUserByUsername(User),
    getUserProfile: getUserProfile(User),
    getUserByEmail: getUserByEmail(User),
    getUserById: getUserById(User),
    getAuthUser: getAuthUser(User),
    updateUser: updateUser(User),
    createVerifyToken: createVerifyToken(Token),
    verifyToken: verifyToken(User, Token),
    updateVerifyUserStatus: updateVerifyUserStatus(User),
    passwordReset: passwordReset(User),
    subscribeUser: subscribeUser(User),
    unSubscribeUser: unSubscribeUser(User),
    getSubbedUsers: getSubbedUsers(User),
    getSubcribers: getSubcribers(User),
  };
};
