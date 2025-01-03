const roleRouter = require("./role");
const categoryRouter = require("./category");
const authorRouter = require("./author");
const publisherRouter = require("./publisher");
const productRouter = require("./product");
const userRouter = require("./user");
// const feedbackRouter = require("./feedback");
const cartRouter = require("./cart");
const commentRouter = require("./comment");
const orderRouter = require("./order");
const ratingRouter = require("./rating");

const { notFound, errHandler } = require("../app/middlewares/ErrorHandler");

function route(app) {
  app.use("/role", roleRouter);
  app.use("/category", categoryRouter);
  app.use("/author", authorRouter);
  app.use("/publisher", publisherRouter);
  app.use("/product", productRouter);
  app.use("/user", userRouter);
  // app.use("/feedback", feedbackRouter);
  app.use("/cart", cartRouter);
  app.use("/comment", commentRouter);
  app.use("/order", orderRouter);
  app.use("/rating", ratingRouter);

  // Nếu không vào route nào thì là err Not found
  app.use(notFound);
  // Nếu có lỗi  ở bất kỳ route nào thì dưới này hứng nếu trên đó catch next(err)
  app.use(errHandler);
}

module.exports = route;
