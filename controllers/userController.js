import User from "../models/User.js";

export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else res.status(404).json({ message: "User not found" });
};

export const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) user.password = req.body.password;
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else res.status(404).json({ message: "User not found" });
};
export const getUsers = async (req, res) => {
  const users = await User.find({});
  res.json(users);
};

export const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.isAdmin) {
      return res.status(400).json({ message: "Cannot delete admin user" });
    }
    await User.deleteOne({ _id: req.params.id });
    res.json({ message: "User deleted" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};