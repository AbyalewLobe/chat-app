import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

import { generateToken } from '../lib/utils.js';
import cloudinary from '../lib/clodinary.js';
export const signup = async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters long' });
    }

    if (!userName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      //generate jwt token
      generateToken(newUser._id, res);
      await newUser.save();
      return res.status(201).json({
        message: 'User created successfully',
        user: {
          _id: newUser._id,
          userName: newUser.userName,
          email: newUser.email,
          profilePic: newUser.profilePic,
        },
      });
    } else {
      return res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Error in signup controller:', error.message);
    return res.status(500).json({ message: 'Internal Server error' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credential' });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid Credential' });
    }
    generateToken(user._id, res);
    return res.status(200).json({
      message: 'Login successful',
      user: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.log('Error in login controller:', error.message);
    return res.status(500).json({ message: 'Internal Server error' });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie('jwt', '', { maxAge: 0 });
    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error in logout controller:', error.message);
    return res.status(500).json({ message: 'Internal Server error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: 'Profile picture is required' });
    }

    // Upload image to Cloudinary
    const uploadResource = await cloudinary.uploader.upload(profilePic);

    // Update user profilePic in DB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResource.secure_url },
      { new: true }
    );

    return res.status(200).json({
      _id: updatedUser._id,
      userName: updatedUser.userName,
      email: updatedUser.email,
      profilePic: updatedUser.profilePic,
    });
  } catch (error) {
    console.error('Error in updateProfile controller:', error.message);
    return res.status(500).json({ message: 'Internal Server error' });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error('Error in checkAuth controller:', error.message);
    return res.status(500).json({ message: 'Internal Server error' });
  }
};
