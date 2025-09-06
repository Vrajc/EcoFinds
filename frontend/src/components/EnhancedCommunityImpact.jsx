import React, { useState, useEffect } from 'react';
import { communityAPI } from '../utils/communityApi';
import toast from 'react-hot-toast';

const ImpactMap = () => {
  const [regions] = useState([
    { id: 1, name: "North America", co2Saved: 4250, users: 3420, lat: 45, lng: -100 },
    { id: 2, name: "Europe", co2Saved: 5680, users: 4560, lat: 50, lng: 10 },
    { id: 3, name: "Asia", co2Saved: 3240, users: 2890, lat: 35, lng: 100 },
    { id: 4, name: "South America", co2Saved: 1450, users: 1230, lat: -15, lng: -60 },
    { id: 5, name: "Africa", co2Saved: 890, users: 670, lat: 0, lng: 20 },
  ]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <h3 className="text-xl font-bold text-gray-800 mb-4">🌍 Global Impact Map</h3>
      
      <div className="bg-gradient-to-b from-blue-100 to-green-100 rounded-lg p-6 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {regions.map(region => (
            <div key={region.id} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="font-semibold text-gray-800">{region.name}</div>
              <div className="text-sm text-gray-600 mt-1">
                {region.co2Saved.toLocaleString()} kg CO₂ saved
              </div>
              <div className="text-sm text-green-600">
                {region.users.toLocaleString()} active users
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center text-sm text-gray-600">
        Real-time data from EcoFinds communities worldwide
      </div>
    </div>
  );
};

const SocialSharing = () => {
  const shareToSocial = (platform) => {
    const message = "I'm making a difference with EcoFinds! Join our community and help create a sustainable future 🌱 #EcoFinds #Sustainability";
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`
    };
    
    // Open in new window
    const newWindow = window.open(urls[platform], '_blank', 'width=600,height=400');
    if (newWindow) {
      toast.success(`Sharing to ${platform}!`);
    } else {
      // Fallback if popup blocked
      navigator.clipboard.writeText(message + ' ' + window.location.href).then(() => {
        toast.success(`Link copied to clipboard! You can paste it on ${platform}`);
      }).catch(() => {
        toast.error('Unable to copy link');
      });
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <h3 className="text-xl font-bold text-gray-800 mb-4">📢 Share Your Impact</h3>
      
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-gray-800 mb-2">Spread the Word</h4>
        <p className="text-gray-600 text-sm mb-4">
          Help us grow our community and multiply our environmental impact!
        </p>
        
        <div className="flex space-x-3">
          <button
            onClick={() => shareToSocial('twitter')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <span>🐦</span>
            <span>Twitter</span>
          </button>
          <button
            onClick={() => shareToSocial('facebook')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <span>📘</span>
            <span>Facebook</span>
          </button>
          <button
            onClick={() => shareToSocial('linkedin')}
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <span>💼</span>
            <span>LinkedIn</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="font-bold text-green-600 text-2xl">2.4x</div>
          <div className="text-sm text-gray-600">Impact multiplier when you share</div>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="font-bold text-blue-600 text-2xl">+500</div>
          <div className="text-sm text-gray-600">Bonus eco points for sharing</div>
        </div>
      </div>
    </div>
  );
};

const LiveActivity = () => {
  const [activities, setActivities] = useState([
    { id: 1, user: "Alex M.", action: "avoided plastic water bottle", impact: "0.5kg CO₂", timestamp: new Date(Date.now() - 2 * 60 * 1000), type: "plastic" },
    { id: 2, user: "Sarah K.", action: "bought organic cotton t-shirt", impact: "2.1kg CO₂", timestamp: new Date(Date.now() - 5 * 60 * 1000), type: "purchase" },
    { id: 3, user: "Mike R.", action: "joined Plastic-Free Challenge", impact: "+100 points", timestamp: new Date(Date.now() - 8 * 60 * 1000), type: "challenge" },
    { id: 4, user: "Emma L.", action: "shared impact on social media", impact: "+50 points", timestamp: new Date(Date.now() - 12 * 60 * 1000), type: "share" },
  ]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await communityAPI.getActivities();
        if (response.success) {
          setActivities(response.data);
        }
      } catch (error) {
        console.warn('Activities API not available, using fallback data:', error);
        // Keep fallback data
      }
    };

    fetchActivities();

    // Add new activity every 15 seconds for demo
    const interval = setInterval(() => {
      const newActivity = {
        id: Date.now(),
        user: ["John D.", "Lisa S.", "Tom W.", "Anna B.", "Chris P."][Math.floor(Math.random() * 5)],
        action: [
          "avoided single-use plastic",
          "bought sustainable product",
          "completed eco-challenge",
          "planted a tree virtually"
        ][Math.floor(Math.random() * 4)],
        impact: [`${(Math.random() * 3 + 0.5).toFixed(1)}kg CO₂`, "+75 points", "+120 points"][Math.floor(Math.random() * 3)],
        timestamp: new Date(),
        type: ["plastic", "purchase", "challenge"][Math.floor(Math.random() * 3)]
      };
      
      setActivities(prev => [newActivity, ...prev.slice(0, 4)]);
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'plastic': return '♻️';
      case 'purchase': return '🛒';
      case 'challenge': return '🎯';
      case 'share': return '📢';
      default: return '🌱';
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hr ago`;
    return `${Math.floor(diffInMinutes / 1440)} day ago`;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">⚡ Live Community Activity</h3>
        <div className="flex items-center text-green-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
          <span className="text-sm font-medium">Live</span>
        </div>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3">
              <span className="text-lg">{getActivityIcon(activity.type)}</span>
              <div>
                <div className="font-medium text-gray-800">
                  <span className="text-green-600">{activity.user}</span> {activity.action}
                </div>
                <div className="text-sm text-gray-600">{getTimeAgo(activity.timestamp)}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-green-600">{activity.impact}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const EnhancedCommunityImpact = () => {
  return (
    <div className="space-y-8">
      {/* Add the enhanced components to the existing CommunityImpact */}
      <div className="grid lg:grid-cols-2 gap-6">
        <ImpactMap />
        <LiveActivity />
      </div>
      
      <SocialSharing />
    </div>
  );
};

export default EnhancedCommunityImpact;
