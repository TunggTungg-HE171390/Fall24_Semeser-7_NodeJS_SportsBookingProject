const FieldRouter = require("./field.route");
const PostRouter = require("./post.route");
const UserRouter = require("./user.route");
const AuthenticationRouter = require("./authen.route");
const FeedbackRouter = require("./feedback.route");
const Field_OrderRouter = require("./field_order.route");

module.exports = {
  AuthenticationRouter,
  FieldRouter,
  PostRouter,
  UserRouter,
  FeedbackRouter,
  Field_OrderRouter
};
