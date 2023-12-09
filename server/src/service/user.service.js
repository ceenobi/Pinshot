import bcrypt from "bcrypt";
//add a user to db
const addUser =
  (User) =>
  async ({ userName, email, password }) => {
    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(password, salt);
    return await User.create({ userName, email, password: passwordHashed });
  };
// const addUser =
//   (User) =>
//   async ({ userName, email, password }) => {
//     const salt = await bcrypt.genSalt(10);
//     const passwordHashed = await bcrypt.hash(password, salt);
//     const user = new User({
//       userName,
//       email,
//       password: passwordHashed,
//     });
//     return user.save();
//   };

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

const getUserByUsername =
  (User) =>
  async ({ userName }) => {
    return await User.findOne({ userName: userName }).select("+password");
  };

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
    Object.assign(user, { userName, email, profilePhoto, bio });
    return await user.save();
  };
// const updateUser =
//   (User) =>
//   async (id, { userName, email, password, profilePhoto, bio }) => {
//     const user = await User.findById(id);
//     if (password) {
//       const salt = await bcrypt.genSalt(10);
//       const passwordHashed = await bcrypt.hash(password, salt);
//       user.password = passwordHashed || user.password;
//     }
//     user.userName = userName || user.userName;
//     user.email = email || user.email;
//     user.profilePhoto = profilePhoto || user.profilePhoto;
//     user.bio = bio || user.bio;
//     return await user.save();
//   };

//reset user password
const passwordReset =
  (User) =>
  async ({ userName, password }) => {
    const passwordHashed = await bcrypt.hash(password, 10);
    return await User.updateOne({ userName }, { password: passwordHashed });
  };

//create token to verify user registration
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
//delete token after verification
const removeTokenAfterVerified = (Token) => async (id) => {
  return await Token.findByIdAndDelete(id);
};

//subscribe a user
const subscribeUser = (User) => async (userId, sub) => {
  await User.findByIdAndUpdate(userId, {
    $push: { subscribedUsers: sub },
  });
  await User.findByIdAndUpdate(sub, {
    $inc: { subscribers: 1 },
  });
  return;
};
const unSubscribeUser = (User) => async (userId, sub) => {
  await User.findByIdAndUpdate(userId, {
    $pull: { subscribedUsers: sub },
  });
  await User.findByIdAndUpdate(sub, {
    $inc: { subscribers: -1 },
  });
  return;
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
    removeTokenAfterVerified: removeTokenAfterVerified(Token),
    passwordReset: passwordReset(User),
    subscribeUser: subscribeUser(User),
    unSubscribeUser: unSubscribeUser(User),
  };
};
