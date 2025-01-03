const Cart = require("../models/Cart");
const Order = require("../models/Order");
const OrderDetail = require("../models/OrderDetail");
const Product = require("../models/Product");
const LineItem = require("../models/LineItem");
const User = require("../models/User");
const Member = require("../models/Member");

class OrderController {
  // [GET] /order/:id

  async getById(req, res) {
    try {
      // Tìm đơn hàng theo ID và populate cả chi tiết đơn hàng và thông tin sản phẩm
      let order = await Order.findOne({ _id: req.params.id }).populate({
        path: "details",
        model: "OrderDetail",
        populate: {
          path: "productId", // Tham chiếu đến bảng Product
          model: "Product",
        },
      });

      if (!order) {
        return res
          .status(404)
          .json({ success: false, message: "Order not found" });
      }

      // Xử lý các chi tiết đơn hàng để thêm trường imageUrl
      const response = order.details.map((detail) => {
        const product = detail.productId; // Thông tin sản phẩm đã được populate
        const imageUrl = product?.image
          ? product.image.startsWith("http")
            ? product.image
            : `${req.protocol}://${req.get("host")}/public/images/products/${
                product.image
              }`
          : `${req.protocol}://${req.get(
              "host"
            )}/public/images/products/defaultImage.jpg`;

        return {
          ...detail.toObject(),
          product: {
            ...product.toObject(), // Thêm thông tin sản phẩm
            imageUrl, // Thêm trường imageUrl
          },
        };
      });

      // Trả về chi tiết đơn hàng với sản phẩm
      res.status(200).json({ success: true, orderDetails: response });
    } catch (error) {
      // Xử lý lỗi và trả về phản hồi lỗi
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // [GET] /order/getByUser
  async getAllsByUser(req, res) {
    try {
      const { _id } = req.user; // Lấy user ID từ access token (phải có middleware xác thực trước đó)

      // Tìm các đơn hàng của người dùng
      const orders = await Order.find({ user: _id })
        .populate({
          path: "details",
          model: "OrderDetail",
        }) // Populate các OrderDetail nếu cần
        .sort({ date: -1 }); // Sắp xếp theo ngày (mới nhất trước)

      if (!orders || orders.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No orders found for this user",
        });
      }

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // [GET] /order/getOrderByUser
  async getOrdersByUser(req, res) {
    try {
      const { _id } = req.user; // Extract user ID from the access token (ensure authentication middleware is used)

      const queries = { ...req.query };
      const excludeFields = ["limit", "sort", "page", "fields"];
      excludeFields.forEach((el) => delete queries[el]);

      // Format query operators for Mongoose syntax
      let queryString = JSON.stringify(queries);
      queryString = queryString.replace(
        /\b(gte|gt|lt|lte)\b/g,
        (matchedEl) => `$${matchedEl}`
      );
      const formattedQueries = JSON.parse(queryString);

      // Filtering by status with case-insensitive regex
      if (queries?.status) {
        formattedQueries.status = { $regex: queries.status, $options: "i" };
      }

      // Add filter for user ID
      formattedQueries.user = _id;

      let queryCommand = Order.find(formattedQueries).populate({
        path: "details",
        model: "OrderDetail",
        select: "productId productName productImage productPrice quantity",
      });

      // Sorting
      if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        queryCommand = queryCommand.sort(sortBy);
      }

      // Field Limiting
      if (req.query.fields) {
        const fields = req.query.fields.split(",").join(" ");
        queryCommand = queryCommand.select(fields);
      }

      // Pagination
      const page = +req.query.page || 1;
      const limit = +req.query.limit || 10;
      const skip = (page - 1) * limit;
      queryCommand = queryCommand.skip(skip).limit(limit);

      // Execute query
      const orders = await queryCommand.exec();

      // Count total orders for pagination
      const counts = await Order.find(formattedQueries).countDocuments();

      // Map through each order to add imageUrl to each order detail
      const formattedOrders = orders.map((order) => {
        const formattedDetails = order.details.map((detail) => {
          const imageUrl = detail.productImage
            ? detail.productImage.startsWith("http")
              ? detail.productImage
              : `${req.protocol}://${req.get("host")}/public/images/products/${
                  detail.productImage
                }`
            : `${req.protocol}://${req.get(
                "host"
              )}/public/images/products/defaultImage.jpg`;
          return {
            ...detail.toObject(),
            imageUrl,
          };
        });
        return {
          ...order.toObject(),
          details: formattedDetails,
        };
      });

      res.status(200).json({
        success: true,
        counts,
        orders:
          formattedOrders.length > 0 ? formattedOrders : "No orders found",
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // [GET] /order/
  async getOrders(req, res) {
    try {
      const queries = { ...req.query };
      const excludeFields = ["limit", "sort", "page", "fields"];
      excludeFields.forEach((el) => delete queries[el]);

      // Format query operators for Mongoose syntax
      let queryString = JSON.stringify(queries);
      queryString = queryString.replace(
        /\b(gte|gt|lt|lte)\b/g,
        (matchedEl) => `$${matchedEl}`
      );
      const formattedQueries = JSON.parse(queryString);

      // Filtering by status with case-insensitive regex
      if (queries?.status) {
        formattedQueries.status = { $regex: queries.status, $options: "i" };
      }

      let queryCommand = Order.find(formattedQueries).populate({
        path: "details",
        model: "OrderDetail",
        select: "productId productName productImage productPrice quantity",
      });

      // Sorting
      if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        queryCommand = queryCommand.sort(sortBy);
      }

      // Field Limiting
      if (req.query.fields) {
        const fields = req.query.fields.split(",").join(" ");
        queryCommand = queryCommand.select(fields);
      }

      // Pagination
      const page = +req.query.page || 1;
      const limit = +req.query.limit || 10;
      const skip = (page - 1) * limit;
      queryCommand = queryCommand.skip(skip).limit(limit);

      // Execute query
      const orders = await queryCommand.exec();

      // Count total orders for pagination
      const counts = await Order.find(formattedQueries).countDocuments();

      // Map through each order to add imageUrl to each order detail
      const formattedOrders = orders.map((order) => {
        const formattedDetails = order.details.map((detail) => {
          const imageUrl = detail.productImage
            ? detail.productImage.startsWith("http")
              ? detail.productImage
              : `${req.protocol}://${req.get("host")}/public/images/products/${
                  detail.productImage
                }`
            : `${req.protocol}://${req.get(
                "host"
              )}/public/images/products/defaultImage.jpg`;
          return {
            ...detail.toObject(),
            imageUrl,
          };
        });
        return {
          ...order.toObject(),
          details: formattedDetails,
        };
      });

      res.status(200).json({
        success: true,
        counts,
        orders:
          formattedOrders.length > 0 ? formattedOrders : "No orders found",
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  //[GET] /order/getAll
  async getAllByAdmin(req, res) {
    try {
      const queries = { ...req.query };

      // Tách các trường đặc biệt ra khỏi query
      const excludeFields = ["limit", "sort", "page", "fields"];
      excludeFields.forEach((el) => delete queries[el]);

      // Format lại các operators cho đúng cú pháp mongoose
      let queryString = JSON.stringify(queries);
      queryString = queryString.replace(
        /\b(gte|gt|lt|lte)\b/g,
        (matchedEl) => `$${matchedEl}`
      );
      const formatedQueries = JSON.parse(queryString);

      // Filtering
      if (queries?.status) {
        formatedQueries.status = { $regex: queries.status, $options: "i" }; // Tìm kiếm đơn hàng theo trạng thái (status)
      }

      // Execute query
      let queryCommand = Order.find(formatedQueries).populate({
        path: "details",
        model: "OrderDetail",
      });

      if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        queryCommand = queryCommand.sort(sortBy);
      }

      // Field limiting
      if (req.query.fields) {
        const fields = req.query.fields.split(",").join(" ");
        queryCommand = queryCommand.select(fields);
      }

      // Pagination
      const page = +req.query.page || 1;
      const limit = +req.query.limit || process.env.LIMIT_ORDERS || 10; // Giới hạn số lượng đơn hàng trên mỗi trang
      const skip = (page - 1) * limit;
      queryCommand.skip(skip).limit(limit);

      // Lấy danh sách đơn hàng
      const response = await queryCommand.exec();

      // Lấy số lượng đơn hàng
      const counts = await Order.find(formatedQueries).countDocuments();

      res.status(200).json({
        success: response.length > 0,
        counts,
        orders: response.length > 0 ? response : "Cannot get orders",
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  //[POST] /order/checkout
  async checkout(req, res) {
    try {
      const user = req.user; // Lấy thông tin user từ accessToken
      const payment = req.body.payment;
      if (!payment) {
        return res
          .status(400)
          .json({ success: false, message: "Payment method not provided" });
      }

      let cart = await Cart.findOne({ user: user._id }).populate({
        path: "items",
        select: "selectedForCheckout quantity",
        populate: {
          path: "product",
          model: "Product",
          populate: { path: "categories" },
        },
      });

      if (!cart) {
        return res
          .status(400)
          .json({ success: false, message: "Cart not found" });
      }

      const selectedItems = cart.items.filter(
        (item) => item.selectedForCheckout && !item.deleted
      );

      if (selectedItems.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "No items selected for checkout" });
      }

      // Mảng lưu trữ các _id của OrderDetail đã lưu
      const orderDetailsIds = [];

      // Vòng lặp for để tạo OrderDetail cho mỗi item
      for (const item of selectedItems) {
        // Tạo OrderDetail
        const orderDetail = new OrderDetail({
          productId: item.product._id,
          productName: item.product.name,
          productImage: item.product.image,
          productPrice: item.product.price,
          quantity: item.quantity,
        });

        // Lưu OrderDetail vào cơ sở dữ liệu
        const savedOrderDetail = await orderDetail.save();
        orderDetailsIds.push(savedOrderDetail._id);

        await Product.findByIdAndUpdate(
          item.product._id,
          { $inc: { soldCount: item.quantity } }, // Cộng thêm số lượng đã bán vào soldCount
          { new: true } // Trả về tài liệu đã được cập nhật
        );
      }

      // Tính tổng giá trị của các sản phẩm đã chọn
      let totalPrice = selectedItems.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
      );
      // Kiểm tra rank của user để áp dụng giảm giá
      const userInfo = await User.findById(user._id);
      const member = await Member.findById(userInfo.member); // Lấy thông tin member của user
      if (member) {
        if (member.rank === "Silver") {
          // totalPrice *= 0.98; // Giảm 2%
        } else if (member.rank === "Gold") {
          totalPrice *= 0.95; // Giảm 5%
        } else if (member.rank === "Diamond") {
          totalPrice *= 0.9; // Giảm 10%
        }
      }

      // Tạo đơn hàng mới
      const newOrder = await Order.create({
        details: orderDetailsIds,
        date: new Date(),
        status: "Pending",
        totalPrice: totalPrice.toFixed(2), // Làm tròn 2 chữ số thập phân
        payment: payment, // Payment information từ client
        user: user._id,
      });

      // Nếu cần, bạn có thể xóa các item đã checkout khỏi giỏ hàng
      const itemsToRemove = cart.items.filter(
        (item) => item.selectedForCheckout
      );
      cart.items = cart.items.filter((item) => !item.selectedForCheckout);
      await cart.save();

      // Xóa các LineItem tương ứng khỏi cơ sở dữ liệu
      for (const item of itemsToRemove) {
        await LineItem.findByIdAndDelete(item._id);
      }

      res.status(200).json({
        success: true,
        message: "Checkout successful",
        order: newOrder,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Checkout failed",
        error: error.message,
      });
    }
  }

  // [PUT] /order/updateStatus/:id
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body; // Lấy trạng thái mới từ request body

      // Kiểm tra trạng thái mới có hợp lệ không
      const validStatuses = ["Pending", "Shipping", "Transported", "Cancelled"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid order status",
        });
      }

      // Tìm đơn hàng theo ID
      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      // Cập nhật trạng thái đơn hàng
      order.status = status;
      if (status === "Transported") {
        // Tìm tất cả các orderDetails liên quan đến order này
        const orderDetails = await OrderDetail.find({
          _id: { $in: order.details },
        });

        // Tính tổng số lượng sản phẩm
        const totalQuantity = orderDetails.reduce(
          (acc, detail) => acc + detail.quantity,
          0
        );
        const user = await User.findById(order.user).populate("member");
        if (user && user.member) {
          user.member.score += 2 * totalQuantity; // Cộng thêm 2 điểm
          await user.member.save(); // Lưu thay đổi vào Member
        }
      }
      await order.save();

      res.status(200).json({
        success: true,
        message: "Order status updated successfully",
        order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // [PUT] /order/updateIsDelivered/:id
  async updateIsDelivered(req, res) {
    try {
      const orderId = req.params.id; // Lấy order ID từ params
      const { isDelivered } = req.body; // Trạng thái isDelivered từ body

      // Tìm đơn hàng của user
      const order = await Order.findOne({ _id: orderId });

      if (!order) {
        return res
          .status(404)
          .json({ success: false, message: "Order not found" });
      }

      // Cập nhật thuộc tính isDelivered
      order.isDelivered = isDelivered ? isDelivered : false;

      // Lưu lại thay đổi
      await order.save();

      res.status(200).json({
        success: true,
        message: `Order delivery status updated successfully to ${isDelivered}`,
        order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  }

  //GET /order/byTime?startTime=2023-01-01&endTime=2023-01-31
  async getOrdersByTimes(req, res) {
    try {
      const { _id } = req.user; // Lấy user ID từ access token (phải có middleware xác thực trước đó)

      // Lấy startTime và endTime từ query params
      const { startTime, endTime } = req.query;

      // Kiểm tra nếu startTime hoặc endTime không được cung cấp
      if (!startTime || !endTime) {
        return res.status(400).json({
          success: false,
          message: "Please provide both startTime and endTime.",
        });
      }

      // Chuyển đổi startTime và endTime thành kiểu Date
      const start = new Date(startTime);
      const end = new Date(new Date(endTime).setHours(23, 59, 59, 999)); // Đặt thời gian cuối ngày

      // Lấy các query parameters
      const queries = { ...req.query };
      const excludeFields = [
        "limit",
        "sort",
        "page",
        "fields",
        "startTime",
        "endTime",
      ];
      excludeFields.forEach((el) => delete queries[el]);

      // Format lại các operators cho đúng cú pháp mongoose
      let queryString = JSON.stringify(queries);
      queryString = queryString.replace(
        /\b(gte|gt|lt|lte)\b/g,
        (matchedEl) => `$${matchedEl}`
      );
      const formatedQueries = JSON.parse(queryString);

      // Thêm điều kiện thời gian và trạng thái Successed vào formatedQueries
      formatedQueries.date = { $gte: start, $lte: end };
      formatedQueries.status = "Successed";

      // Tìm các đơn hàng trong khoảng thời gian đã chỉ định và thuộc về người dùng
      let queryCommand = Order.find({ ...formatedQueries }).populate({
        path: "details",
        model: "OrderDetail",
      });

      // Sắp xếp nếu có tham số sort
      if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        queryCommand = queryCommand.sort(sortBy);
      }

      // Lọc các trường cần thiết nếu có tham số fields
      if (req.query.fields) {
        const fields = req.query.fields.split(",").join(" ");
        queryCommand = queryCommand.select(fields);
      }

      // Phân trang
      const page = +req.query.page || 1;
      const limit = +req.query.limit || process.env.LIMIT_ORDERS || 10; // Giới hạn số lượng đơn hàng trên mỗi trang
      const skip = (page - 1) * limit;
      queryCommand.skip(skip).limit(limit);

      // Thực thi query
      const response = await queryCommand.exec();

      // Tính tổng tiền của các đơn hàng tìm được
      const totalAmount = response.reduce(
        (sum, order) => sum + order.totalPrice,
        0
      );

      // Lấy số lượng đơn hàng
      const counts = await Order.find({
        ...formatedQueries,
      }).countDocuments();

      res.status(200).json({
        success: response.length > 0,
        counts,
        totalAmount,
        orders:
          response.length > 0
            ? response
            : "No successful orders found in the specified time range",
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // [PUT] /order/:id
  async deleteByUser(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id; // Lấy user ID từ access token

      // Tìm đơn hàng theo ID và kiểm tra xem nó có thuộc về người dùng không và có trạng thái là "Pending" không
      const order = await Order.findOne({
        _id: id,
        user: userId,
        status: "Pending",
      });
      console.log(order);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found or cannot be deleted",
        });
      }

      order.status = "Cancelled";
      await order.save();

      res.status(200).json({
        success: true,
        message: "Order deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

// Function để tính giảm giá dựa trên rank của thành viên
async function applyDiscountByRank(userId, totalPrice) {
  try {
    // Lấy thông tin user và member
    const user = await User.findById(userId);
    const member = await Member.findById(user.member);

    if (member) {
      switch (member.rank) {
        case "Silver":
          return totalPrice * 0.98; // Giảm 2%
        case "Gold":
          return totalPrice * 0.95; // Giảm 5%
        case "Diamond":
          return totalPrice * 0.9; // Giảm 10%
        default:
          return totalPrice; // Không giảm giá nếu không có rank
      }
    }

    return totalPrice; // Trả về tổng giá trị gốc nếu không có thông tin member
  } catch (error) {
    console.error("Error applying discount:", error.message);
    return totalPrice; // Trả về tổng giá trị gốc nếu xảy ra lỗi
  }
}

module.exports = new OrderController();
