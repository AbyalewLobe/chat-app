import User from '../models/user.model.js';
import Message from '../models/message.model.js';
import cloudinary from '../lib/clodinary.js';
import { getReceiverSocketId, io } from '../lib/socket.js';

// Get all users except the logged-in user
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select('-password');
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error('Error fetching users for sidebar', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get messages between logged-in user and a specific user
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    if (!myId || !userToChatId) {
      return res.status(400).json({ message: 'Invalid user or chat id' });
    }

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 }); // sort by oldest first

    res.status(200).json({ messages });
  } catch (error) {
    console.error('Error in getMessages controller:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Send a new message (text or image)
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { id: receiverId } = req.params;
    const { text } = req.body;

    // Validate input: must have text or image
    if (!text && !req.file && !req.body.image) {
      return res
        .status(400)
        .json({ message: 'Message text or image required' });
    }

    let imageUrl;
    // Handle image upload
    if (req.file) {
      // If using multer for file uploads
      const uploadResponse = await cloudinary.uploader.upload(req.file.path);
      imageUrl = uploadResponse.secure_url;
    } else if (req.body.image) {
      // If frontend sends base64 or URL string
      const uploadResponse = await cloudinary.uploader.upload(req.body.image);
      imageUrl = uploadResponse.secure_url;
    }

    // Create and save message
    const newMessage = new Message({
      senderId,
      receiverId, // ✅ corrected spelling
      text: text || '',
      image: imageUrl || '',
    });

    await newMessage.save();

    // Emit socket event to receiver if connected
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error in sendMessage controller:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
