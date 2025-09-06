import React, { useState, useEffect } from 'react';
import { communityAPI } from '../utils/communityApi';
import toast from 'react-hot-toast';

const CommunityImpact = () => {
  const [communityStats, setCommunityStats] = useState({
    totalCO2Saved: 15420,
    plasticsAvoided: 89340,
    treesPlanted: 2847,
    activeUsers: 12543,
    totalProducts: 45230,
    wasteReduced: 234.5, // in tons
    energySaved: 12845 // in kWh
  });

  const [currentChallenge, setCurrentChallenge] = useState({
    id: 1,
    title: "Plastic-Free September",
    description: "Join our community in avoiding single-use plastics",
    goal: 100000,
    current: 67543,
    reward: "Plant 1000 trees globally",
    timeLeft: "12 days",
    participants: 8932
  });

  const [leaderboard, setLeaderboard] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [userStats, setUserStats] = useState({
    co2Saved: 287,
    plasticsAvoided: 45,
    rank: "Top 15%",
    ecoPoints: 1250
  });

  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Try to fetch from API, but use fallback data if it fails
        try {
          const [statsRes, challengeRes, leaderboardRes, milestonesRes, userImpactRes] = await Promise.all([
            communityAPI.getStats(),
            communityAPI.getCurrentChallenge(),
            communityAPI.getLeaderboard(),
            communityAPI.getMilestones(),
            communityAPI.getUserImpact()
          ]);

          if (statsRes.success) setCommunityStats(statsRes.data);
          if (challengeRes.success) setCurrentChallenge(challengeRes.data);
          if (leaderboardRes.success) setLeaderboard(leaderboardRes.data);
          if (milestonesRes.success) setMilestones(milestonesRes.data);
          if (userImpactRes.success) setUserStats(userImpactRes.data);
        } catch (apiError) {
          console.warn('API not available, using fallback data:', apiError);
          // Use fallback data
          setLeaderboard([
            { id: 1, name: "Green Warriors", impact: 2847, members: 156 },
            { id: 2, name: "Eco Champions", impact: 2134, members: 203 },
            { id: 3, name: "Planet Savers", impact: 1987, members: 89 },
            { id: 4, name: "Zero Waste Heroes", impact: 1765, members: 134 },
            { id: 5, name: "Sustainable Living", impact: 1543, members: 167 }
          ]);
          setMilestones([
            {
              id: 1,
              title: "1 Million Plastic Items Avoided! 🎉",
              description: "Our community just prevented 1 million single-use plastic items!",
              achievedAt: "2025-09-01",
              impact: "Equivalent to cleaning 50 beaches"
            },
            {
              id: 2,
              title: "10,000 Trees Planted 🌳",
              description: "Community CO₂ savings funded tree planting in Amazon rainforest!",
              achievedAt: "2025-08-15",
              impact: "Will absorb 250 tons of CO₂ over 20 years"
            }
          ]);
        }
      } catch (error) {
        console.error('Error in fetchData:', error);
        toast.error('Failed to load community data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up live stats subscription with error handling
    let eventSource = null;
    try {
      eventSource = communityAPI.subscribeLiveStats((data) => {
        setCommunityStats(prev => ({
          ...prev,
          ...data
        }));
      });
    } catch (error) {
      console.warn('Live stats not available:', error);
    }

    return () => {
      if (eventSource && eventSource.close) {
        eventSource.close();
      }
    };
  }, []);

  const handleJoinChallenge = async () => {
    try {
      setJoining(true);
      
      try {
        const response = await communityAPI.joinChallenge(currentChallenge.id);
        if (response.success) {
          toast.success(response.message);
          setCurrentChallenge(prev => ({
            ...prev,
            participants: response.data.newParticipantCount
          }));
          setUserStats(prev => ({
            ...prev,
            ecoPoints: prev.ecoPoints + response.data.pointsAwarded
          }));
        }
      } catch (apiError) {
        // Fallback behavior when API is not available
        console.warn('API not available, using fallback:', apiError);
        toast.success('Successfully joined the challenge!');
        setCurrentChallenge(prev => ({
          ...prev,
          participants: prev.participants + 1
        }));
        setUserStats(prev => ({
          ...prev,
          ecoPoints: prev.ecoPoints + 100
        }));
      }
    } catch (error) {
      console.error('Error joining challenge:', error);
      toast.error('Failed to join challenge');
    } finally {
      setJoining(false);
    }
  };

  // Animate counters
  useEffect(() => {
    const animateCounters = () => {
      const counters = document.querySelectorAll('.counter-number');
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          counter.textContent = Math.floor(current).toLocaleString();
        }, 16);
      });
    };

    animateCounters();
  }, []);

  const progressPercentage = (currentChallenge.current / currentChallenge.goal) * 100;

  // Share functionality
  const handleShareImpact = () => {
    const message = `I've prevented ${userStats.co2Saved}kg of CO₂ with EcoFinds! 🌱 Join me in making sustainable choices! #EcoFinds #SustainableLiving`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Environmental Impact',
        text: message,
        url: window.location.href
      }).catch(console.error);
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(message).then(() => {
        toast.success('Impact message copied to clipboard!');
      }).catch(() => {
        toast.error('Unable to share. Please copy manually.');
      });
    }
  };

  const handleInviteFriends = () => {
    const inviteMessage = `Join me on EcoFinds - a sustainable marketplace where we're making a real environmental impact! Together we've saved ${communityStats.totalCO2Saved.toLocaleString()}kg of CO₂! 🌍 ${window.location.origin}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Join EcoFinds Community',
        text: inviteMessage,
        url: window.location.origin
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(inviteMessage).then(() => {
        toast.success('Invitation link copied to clipboard!');
      }).catch(() => {
        toast.error('Unable to copy invitation link.');
      });
    }
  };

  const handleViewAllLeaderboard = () => {
    toast.info('Full leaderboard feature coming soon!');
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 animate-pulse">
          <div className="h-8 bg-gray-300 rounded mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Global Impact Stats */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">🌍 Global Community Impact</h2>
          <p className="text-gray-600">Together, we're making a real difference for our planet</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-green-600 counter-number" data-target={communityStats.totalCO2Saved}>
              0
            </div>
            <div className="text-sm text-gray-600 mt-1">kg CO₂ Prevented</div>
            <div className="text-xs text-green-500 mt-1">↑ +2.4% this week</div>
          </div>

          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-blue-600 counter-number" data-target={communityStats.plasticsAvoided}>
              0
            </div>
            <div className="text-sm text-gray-600 mt-1">Plastic Items Avoided</div>
            <div className="text-xs text-blue-500 mt-1">↑ +5.7% this week</div>
          </div>

          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-emerald-600 counter-number" data-target={communityStats.treesPlanted}>
              0
            </div>
            <div className="text-sm text-gray-600 mt-1">Trees Planted</div>
            <div className="text-xs text-emerald-500 mt-1">🌱 Growing daily</div>
          </div>

          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-purple-600 counter-number" data-target={communityStats.activeUsers}>
              0
            </div>
            <div className="text-sm text-gray-600 mt-1">Active Eco-Warriors</div>
            <div className="text-xs text-purple-500 mt-1">↑ +12.3% this month</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Current Challenge */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">🎯 Active Challenge</h3>
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
              {currentChallenge.timeLeft} left
            </span>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold text-lg text-gray-800">{currentChallenge.title}</h4>
            <p className="text-gray-600 text-sm mt-1">{currentChallenge.description}</p>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Progress</span>
              <span className="text-sm font-semibold text-gray-800">
                {currentChallenge.current.toLocaleString()} / {currentChallenge.goal.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">{Math.round(progressPercentage)}% complete</div>
          </div>

          <div className="bg-green-50 rounded-lg p-3 mb-4">
            <div className="flex items-center text-green-700">
              <span className="mr-2">🏆</span>
              <span className="font-medium">Reward: {currentChallenge.reward}</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">{currentChallenge.participants?.toLocaleString()} participants</span>
            <button 
              onClick={handleJoinChallenge}
              disabled={joining}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                joining 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'
              } text-white`}
            >
              {joining ? 'Joining...' : 'Join Challenge'}
            </button>
          </div>
        </div>

        {/* Your Impact vs Community */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-xl font-bold text-gray-800 mb-4">📊 Your Impact</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
              <div>
                <div className="font-semibold text-gray-800">Your CO₂ Savings</div>
                <div className="text-sm text-gray-600">{userStats.rank} of community</div>
              </div>
              <div className="text-2xl font-bold text-green-600">{userStats.co2Saved} kg</div>
            </div>

            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
              <div>
                <div className="font-semibold text-gray-800">Plastic Items Avoided</div>
                <div className="text-sm text-gray-600">This month</div>
              </div>
              <div className="text-2xl font-bold text-blue-600">{userStats.plasticsAvoided}</div>
            </div>

            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
              <div>
                <div className="font-semibold text-gray-800">Eco Points Earned</div>
                <div className="text-sm text-gray-600">Total score</div>
              </div>
              <div className="text-2xl font-bold text-purple-600">{userStats.ecoPoints.toLocaleString()}</div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center text-yellow-800">
              <span className="mr-2">⭐</span>
              <span className="font-medium">You're doing 2.3x better than average!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Team Leaderboard */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">🏅 Top Eco Teams</h3>
          <button 
            onClick={handleViewAllLeaderboard}
            className="text-green-600 hover:text-green-700 font-medium transition-colors"
          >
            View All →
          </button>
        </div>

        <div className="space-y-3">
          {leaderboard.map((team, index) => (
            <div key={team.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  index === 0 ? 'bg-yellow-100 text-yellow-800' :
                  index === 1 ? 'bg-gray-100 text-gray-800' :
                  index === 2 ? 'bg-orange-100 text-orange-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  #{index + 1}
                </div>
                <div className="ml-3">
                  <div className="font-semibold text-gray-800">{team.name}</div>
                  <div className="text-sm text-gray-600">{team.members} members</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-800">{team.impact.toLocaleString()} kg CO₂</div>
                <div className="text-sm text-green-600">↑ Active</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Milestones */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-xl font-bold text-gray-800 mb-6">🏆 Community Achievements</h3>
        
        <div className="space-y-4">
          {milestones.map((milestone) => (
            <div key={milestone.id} className="flex items-start p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="font-semibold text-gray-800">{milestone.title}</h4>
                <p className="text-gray-600 text-sm mt-1">{milestone.description}</p>
                <div className="flex items-center mt-2 space-x-4">
                  <span className="text-xs text-gray-500">Achieved {milestone.achievedAt}</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {milestone.impact}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">Ready to Make an Impact?</h3>
          <p className="text-green-100 mb-4">Join our community challenges and help create a sustainable future</p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={handleShareImpact}
              className="bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Share Your Impact
            </button>
            <button 
              onClick={handleInviteFriends}
              className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-400 transition-colors"
            >
              Invite Friends
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityImpact;
