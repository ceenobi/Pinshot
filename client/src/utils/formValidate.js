const registerOptions = {
  email: {
    required: "Email is required",
    validate: {
      maxLength: (v) =>
        v.length <= 50 || "The email should have at most 30 characters",
      matchPattern: (v) =>
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
        "Invalid email address",
    },
  },
  password: {
    required: "Password is required!",
    validate: {
      minLength: (v) =>
        v.length >= 6 || "Password should not be less than 6 characters",
    },
  },
  userName: {
    required: "Username is required",
    validate: {
      minLength: (v) =>
        v.length >= 5 || "Username should have at least 5 characters",
      matchPattern: (v) =>
        /^[a-zA-Z0-9_]+$/.test(v) ||
        "Username must contain only letters, numbers and _",
    },
  },
  comment: {
    required: "Cannot send empty comment",
  },
};

export default registerOptions;
