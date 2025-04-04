import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js"; 

export const test = (req, res) => {
  res.status(200).json({ message: "Welcome to Hasnain Iftikhar Estate API" });
};

// Update user information

export const updateUser = async (req, res, next) => {

  if (req.user.userId !== req.params.id) {
    return next(errorHandler(401, "Unauthorized to update this user"));
  }
  

  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedUser) {
      return next(errorHandler(404, "User not found"));
    }

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json({
      message: "User updated successfully",
      user: rest,
    });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

// Delete user

export const deleteUser = async (req, res, next) => {
  if (req.user.userId!== req.params.id) {
    return next(errorHandler(401, "Unauthorized to delete this user"));
  }

  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return next(errorHandler(404, "User not found"));
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};
