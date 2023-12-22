import User from "../models/user.model.js";
import Token from "../models/token.model.js";
import Pin from "../models/pin.model.js";
import Comment from "../models/comment.model.js";
import UserService from "./user.service.js";
import PinService from "./pin.service.js";
import CommentService from "./comment.service.js";
import SearchService from "./search.service.js";

const myUserService = UserService(User, Token);
const myPinService = PinService(Pin, Comment);
const myCommentService = CommentService(Comment);
const mySearchService = SearchService(User, Pin);

export { myUserService, myPinService, myCommentService, mySearchService };
