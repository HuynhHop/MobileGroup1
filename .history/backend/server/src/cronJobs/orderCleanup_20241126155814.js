const cron = require("node-cron");
const { Payment } = require("../app/models/Payment");
const Order = require("../app/models/Order");

// Chạy công việc này mỗi ngày (tùy chỉnh thời gian chạy theo yêu cầu)
cron.schedule("0 0 * * *", async () => {
  // Chạy vào 12:00 AM mỗi ngày
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000); // Thời gian 3 ngày trước

  try {
    // Tìm các đơn hàng cần hủy
    const ordersToCancel = await Order.find({
      status: "Pending",
      createdAt: { $lt: threeDaysAgo }, // Đơn hàng được tạo hơn 3 ngày trước
    });

    // Cập nhật trạng thái của từng đơn hàng tìm thấy
    for (const order of ordersToCancel) {
      order.status = "Cancelled";
      await order.save();
    }

    if (ordersToCancel.length > 0) {
      console.log(`Cancelled ${ordersToCancel.length} orders due to timeout.`);
    }
  } catch (error) {
    console.error("Failed to update order statuses:", error.message);
  }
});
