import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

export const getAdminSummary = async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalUsers = await User.countDocuments();
  const orders = await Order.find({});

  const totalEarnings = orders.reduce((acc, item) => acc + item.totalPrice, 0);

  const monthlySales = await Order.aggregate([
    {
      $group: {
        _id: { $substr: ["$createdAt", 0, 7] },
        total: { $sum: "$totalPrice" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json({
    totalOrders,
    totalProducts,
    totalUsers,
    totalEarnings,
    monthlySales: monthlySales.map((m) => ({
      month: m._id,
      total: m.total,
      orders: m.orders,
    })),
  });
};


export const getDashboardStats = async (req, res) => {
  const users = await User.countDocuments();
  const products = await Product.countDocuments();
  const orders = await Order.find();
  const totalEarnings = orders.reduce(
    (sum, order) => sum + order.totalPrice,
    0
  );

  res.json({
    users,
    products,
    orders: orders.length,
    totalEarnings,
  });
};

export const getAllOrders = async (req, res) => {
  const orders = await Order.find({}).populate("user", "id name");
  res.json(orders);
};

export const getAllUsers = async (req, res) => {
  const users = await User.find({});
  res.json(users);
};

export const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  res.json(products);
};
