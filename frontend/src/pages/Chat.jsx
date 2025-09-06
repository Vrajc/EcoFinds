import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Chat = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { socket, isUserOnline } = useSocket();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);

  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    fetchChat();
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (socket && chat) {
      socket.emit('joinChat', chatId);

      socket.on('newMessage', (data) => {
        if (data.chatId === chatId) {
          setMessages(prev => [...prev, data.message]);
          // Mark as seen immediately
          socket.emit('markAsSeen', { chatId, userId: user._id });
        }
      });

      socket.on('userTyping', (data) => {
        if (data.userId !== user._id) {
          setTyping(data.isTyping ? getOtherParticipant()?.name : '');
        }
      });

      socket.on('messagesSeen', (data) => {
        if (data.chatId === chatId) {
          setMessages(prev => 
            prev.map(msg => 
              msg.sender._id === user._id 
                ? { ...msg, status: 'seen' }
                : msg
            )
          );
        }
      });

      return () => {
        socket.off('newMessage');
        socket.off('userTyping');
        socket.off('messagesSeen');
      };
    }
  }, [socket, chat, chatId, user]);

  const fetchChat = async () => {
    try {
      const response = await api.get(`/chat/${chatId}`);
      setChat(response.data.chat);
      setMessages(response.data.chat.messages);
    } catch (error) {
      toast.error('Failed to load chat');
      navigate('/chats');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    const messageContent = newMessage.trim();
    setNewMessage('');

    // Stop typing indicator
    if (isTyping) {
      setIsTyping(false);
      socket.emit('typing', { chatId, userId: user._id, isTyping: false });
    }

    try {
      const response = await api.post('/chat/message', {
        chatId,
        content: messageContent
      });

      const sentMessage = response.data.message;
      setMessages(prev => [...prev, sentMessage]);

      // Emit via socket for real-time update
      socket.emit('sendMessage', {
        chatId,
        content: messageContent,
        senderId: user._id
      });
    } catch (error) {
      toast.error('Failed to send message');
      setNewMessage(messageContent); // Restore message if failed
    } finally {
      setSending(false);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!isTyping && socket) {
      setIsTyping(true);
      socket.emit('typing', { chatId, userId: user._id, isTyping: true });
    }

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit('typing', { chatId, userId: user._id, isTyping: false });
    }, 1000);
  };

  const getOtherParticipant = () => {
    return chat?.participants.find(p => p._id !== user._id);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">Loading chat...</div>
        </div>
      </div>
    );
  }

  const otherUser = getOtherParticipant();
  const isOnline = isUserOnline(otherUser?._id);

  return (
    <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-4">
      <div className="max-w-4xl mx-auto h-[calc(100vh-200px)] flex flex-col">
        {/* Chat Header */}
        <div className="card p-4 mb-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/chats" className="btn-secondary px-3 py-2">
                ← Back
              </Link>
              <div className="relative">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="font-semibold text-primary">
                    {otherUser?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                {isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div>
                <h2 className="font-semibold text-text">{otherUser?.name}</h2>
                <p className="text-sm text-text-muted">
                  {isOnline ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
            <Link to={`/products/${chat.product._id}`} className="btn-secondary text-sm">
              View Product
            </Link>
          </div>
          
          {/* Product Info */}
          <div className="mt-4 p-3 bg-background rounded-lg flex items-center space-x-3">
            <img
              src={chat.product.imageUrl || '/placeholder-image.jpg'}
              alt={chat.product.title}
              className="w-12 h-12 rounded object-cover"
            />
            <div>
              <h3 className="font-medium text-text">{chat.product.title}</h3>
              <p className="text-lg font-bold text-primary">₹{chat.product.price}</p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="card flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => {
              const isOwn = message.sender._id === user._id;
              const showTime = index === 0 || 
                new Date(message.timestamp) - new Date(messages[index - 1].timestamp) > 5 * 60 * 1000;
              
              return (
                <div key={index}>
                  {showTime && (
                    <div className="text-center text-xs text-text-muted mb-2">
                      {formatTime(message.timestamp)}
                    </div>
                  )}
                  <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      isOwn 
                        ? 'bg-primary text-white rounded-br-md' 
                        : 'bg-gray-100 text-text rounded-bl-md'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      {isOwn && (
                        <div className="flex items-center justify-end mt-1 space-x-1">
                          <span className="text-xs opacity-75">
                            {formatTime(message.timestamp)}
                          </span>
                          <span className="text-xs">
                            {message.status === 'seen' ? '✓✓' : 
                             message.status === 'delivered' ? '✓✓' : '✓'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {typing && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-2 rounded-2xl rounded-bl-md">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={sendMessage} className="flex space-x-3">
              <input
                ref={messageInputRef}
                type="text"
                value={newMessage}
                onChange={handleTyping}
                placeholder="Type a message..."
                className="flex-1 input-field rounded-full py-3"
                disabled={sending}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || sending}
                className="btn-primary px-6 py-3 rounded-full disabled:opacity-50"
              >
                {sending ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
