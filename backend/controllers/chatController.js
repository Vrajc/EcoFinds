import Chat from '../models/Chat.js';
import Product from '../models/Product.js';

export const startChat = async (req, res) => {
  try {
    const { productId } = req.body;
    const buyerId = req.user._id;

    // Find the product and seller
    const product = await Product.findById(productId).populate('owner');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const sellerId = product.owner._id;
    
    // Check if buyer is trying to chat with themselves
    if (buyerId.toString() === sellerId.toString()) {
      return res.status(400).json({ message: 'You cannot chat with yourself' });
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      product: productId,
      participants: { $all: [buyerId, sellerId] }
    }).populate('participants', 'name email')
      .populate('product', 'title imageUrl price');

    if (!chat) {
      // Create new chat
      chat = await Chat.create({
        participants: [buyerId, sellerId],
        product: productId,
        messages: []
      });
      
      chat = await Chat.findById(chat._id)
        .populate('participants', 'name email')
        .populate('product', 'title imageUrl price');
    }

    res.status(200).json({ success: true, chat });
  } catch (error) {
    console.error('Start chat error:', error);
    res.status(500).json({ message: 'Server error while starting chat' });
  }
};

export const getUserChats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const chats = await Chat.find({
      participants: userId
    })
    .populate('participants', 'name email')
    .populate('product', 'title imageUrl price')
    .populate('lastMessage.sender', 'name')
    .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, chats });
  } catch (error) {
    console.error('Get user chats error:', error);
    res.status(500).json({ message: 'Server error while fetching chats' });
  }
};

export const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    const chat = await Chat.findById(chatId)
      .populate('participants', 'name email')
      .populate('product', 'title imageUrl price')
      .populate('messages.sender', 'name email');

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is participant
    if (!chat.participants.some(p => p._id.toString() === userId.toString())) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Mark messages as seen
    const unreadMessages = chat.messages.filter(msg => 
      msg.sender._id.toString() !== userId.toString() && 
      msg.status !== 'seen'
    );

    if (unreadMessages.length > 0) {
      unreadMessages.forEach(msg => msg.status = 'seen');
      await chat.save();
    }

    res.status(200).json({ success: true, chat });
  } catch (error) {
    console.error('Get chat messages error:', error);
    res.status(500).json({ message: 'Server error while fetching messages' });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { chatId, content } = req.body;
    const senderId = req.user._id;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is participant
    if (!chat.participants.includes(senderId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const newMessage = {
      sender: senderId,
      content: content.trim(),
      timestamp: new Date(),
      status: 'sent'
    };

    chat.messages.push(newMessage);
    await chat.save();

    // Populate the new message
    await chat.populate('messages.sender', 'name email');
    const savedMessage = chat.messages[chat.messages.length - 1];

    res.status(200).json({ success: true, message: savedMessage });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error while sending message' });
  }
};
