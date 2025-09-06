import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const { socket, isUserOnline } = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('newMessage', (data) => {
        setChats(prevChats => 
          prevChats.map(chat => 
            chat._id === data.chatId
              ? {
                  ...chat,
                  lastMessage: {
                    content: data.message.content,
                    timestamp: data.message.timestamp,
                    sender: data.message.sender
                  },
                  updatedAt: data.message.timestamp
                }
              : chat
          ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        );
      });

      return () => {
        socket.off('newMessage');
      };
    }
  }, [socket]);

  const fetchChats = async () => {
    try {
      const response = await api.get('/chat/my-chats');
      setChats(response.data.chats);
    } catch (error) {
      toast.error('Failed to fetch chats');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getOtherParticipant = (participants) => {
    return participants.find(p => p._id !== user._id);
  };

  if (loading) {
    return (
      <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">Loading chats...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-text mb-8">Messages</h1>
        
        {chats.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-caveat font-semibold text-text mb-4">No conversations yet</h3>
            <p className="text-text-muted font-inter mb-6">Start browsing products and message sellers</p>
            <Link to="/" className="btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="space-y-2">
            {chats.map((chat) => {
              const otherUser = getOtherParticipant(chat.participants);
              const isOnline = isUserOnline(otherUser._id);
              
              return (
                <Link
                  key={chat._id}
                  to={`/chat/${chat._id}`}
                  className="block card p-4 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-xl font-semibold text-primary">
                          {otherUser.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      {isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-text truncate">
                          {otherUser.name}
                        </h3>
                        <span className="text-xs text-text-muted">
                          {chat.lastMessage && formatTime(chat.lastMessage.timestamp)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-1">
                        <img
                          src={chat.product.imageUrl || '/placeholder-image.jpg'}
                          alt={chat.product.title}
                          className="w-8 h-8 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-text-muted truncate">
                            {chat.product.title} • ₹{chat.product.price}
                          </p>
                          {chat.lastMessage && (
                            <p className="text-sm text-text-muted truncate">
                              {chat.lastMessage.sender._id === user._id ? 'You: ' : ''}
                              {chat.lastMessage.content}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-accent">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
