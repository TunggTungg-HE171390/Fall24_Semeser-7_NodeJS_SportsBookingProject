const FieldController = require("./field.controller");
const PostController = require("./post.controller");
const UserController = require("./user.controller");
const AuthenticationController = require("./authentication.controller");
const MailServiceController = require("./mailService.controller");
const FieldOrderController = require("./field-order.controller");
const FeedbackController = require("./feedback.controller");

module.exports = {
  AuthenticationController,
  MailServiceController,
  FieldController,
  PostController,
  UserController,
  FieldOrderController,
  FeedbackController,
};
