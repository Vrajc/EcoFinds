import express from 'express';
const router = express.Router();

// Mock data for community impact
const communityStats = {
  totalCO2Saved: 15420,
  plasticsAvoided: 89340,
  treesPlanted: 2847,
  activeUsers: 12543,
  totalProducts: 45230,
  wasteReduced: 234.5,
  energySaved: 12845,
  lastUpdated: new Date()
};

const currentChallenge = {
  id: 1,
  title: "Plastic-Free September",
  description: "Join our community in avoiding single-use plastics",
  goal: 100000,
  current: 67543,
  reward: "Plant 1000 trees globally",
  timeLeft: "12 days",
  participants: 8932,
  startDate: "2025-09-01",
  endDate: "2025-09-30"
};

const leaderboard = [
  { id: 1, name: "Green Warriors", impact: 2847, members: 156, avatar: null },
  { id: 2, name: "Eco Champions", impact: 2134, members: 203, avatar: null },
  { id: 3, name: "Planet Savers", impact: 1987, members: 89, avatar: null },
  { id: 4, name: "Zero Waste Heroes", impact: 1765, members: 134, avatar: null },
  { id: 5, name: "Sustainable Living", impact: 1543, members: 167, avatar: null }
];

const milestones = [
  {
    id: 1,
    title: "1 Million Plastic Items Avoided! 🎉",
    description: "Our community just prevented 1 million single-use plastic items!",
    achievedAt: "2025-09-01",
    impact: "Equivalent to cleaning 50 beaches",
    category: "plastic"
  },
  {
    id: 2,
    title: "10,000 Trees Planted 🌳",
    description: "Community CO₂ savings funded tree planting in Amazon rainforest!",
    achievedAt: "2025-08-15",
    impact: "Will absorb 250 tons of CO₂ over 20 years",
    category: "trees"
  }
];

const recentActivities = [
  { id: 1, user: "Alex M.", action: "avoided plastic water bottle", impact: "0.5kg CO₂", timestamp: new Date(), type: "plastic" },
  { id: 2, user: "Sarah K.", action: "bought organic cotton t-shirt", impact: "2.1kg CO₂", timestamp: new Date(), type: "purchase" },
  { id: 3, user: "Mike R.", action: "joined Plastic-Free Challenge", impact: "+100 points", timestamp: new Date(), type: "challenge" },
  { id: 4, user: "Emma L.", action: "shared impact on social media", impact: "+50 points", timestamp: new Date(), type: "share" }
];

// Get community statistics
router.get('/stats', (req, res) => {
  try {
    // Simulate real-time updates by slightly modifying stats
    const updatedStats = {
      ...communityStats,
      totalCO2Saved: communityStats.totalCO2Saved + Math.floor(Math.random() * 10),
      plasticsAvoided: communityStats.plasticsAvoided + Math.floor(Math.random() * 50),
      activeUsers: communityStats.activeUsers + Math.floor(Math.random() * 5),
      lastUpdated: new Date()
    };
    
    res.json({
      success: true,
      data: updatedStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching community stats',
      error: error.message
    });
  }
});

// Get current challenge
router.get('/challenge', (req, res) => {
  try {
    // Update challenge progress
    const updatedChallenge = {
      ...currentChallenge,
      current: Math.min(currentChallenge.current + Math.floor(Math.random() * 100), currentChallenge.goal),
      participants: currentChallenge.participants + Math.floor(Math.random() * 10)
    };
    
    res.json({
      success: true,
      data: updatedChallenge
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching current challenge',
      error: error.message
    });
  }
});

// Get leaderboard
router.get('/leaderboard', (req, res) => {
  try {
    // Simulate some changes in leaderboard
    const updatedLeaderboard = leaderboard.map(team => ({
      ...team,
      impact: team.impact + Math.floor(Math.random() * 10)
    })).sort((a, b) => b.impact - a.impact);
    
    res.json({
      success: true,
      data: updatedLeaderboard
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching leaderboard',
      error: error.message
    });
  }
});

// Get milestones
router.get('/milestones', (req, res) => {
  try {
    res.json({
      success: true,
      data: milestones
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching milestones',
      error: error.message
    });
  }
});

// Get recent activities
router.get('/activities', (req, res) => {
  try {
    // Add some new random activities
    const newActivities = [
      {
        id: Date.now(),
        user: ["John D.", "Lisa S.", "Tom W.", "Anna B.", "Chris P."][Math.floor(Math.random() * 5)],
        action: [
          "avoided single-use plastic",
          "bought sustainable product", 
          "completed eco-challenge",
          "planted a tree virtually"
        ][Math.floor(Math.random() * 4)],
        impact: `${(Math.random() * 3 + 0.5).toFixed(1)}kg CO₂`,
        timestamp: new Date(),
        type: ["plastic", "purchase", "challenge"][Math.floor(Math.random() * 3)]
      }
    ];
    
    const allActivities = [...newActivities, ...recentActivities].slice(0, 10);
    
    res.json({
      success: true,
      data: allActivities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching recent activities',
      error: error.message
    });
  }
});

// Get user's personal impact stats (requires authentication)
router.get('/user-impact', (req, res) => {
  try {
    // Mock user impact data
    const userImpact = {
      co2Saved: Math.floor(Math.random() * 500) + 100,
      plasticsAvoided: Math.floor(Math.random() * 100) + 20,
      ecoPoints: Math.floor(Math.random() * 2000) + 500,
      rank: "Top " + (Math.floor(Math.random() * 20) + 5) + "%",
      treesPlanted: Math.floor(Math.random() * 10) + 1,
      badgesEarned: Math.floor(Math.random() * 15) + 3
    };
    
    res.json({
      success: true,
      data: userImpact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user impact',
      error: error.message
    });
  }
});

// Join challenge endpoint
router.post('/challenge/join', (req, res) => {
  try {
    // Simulate joining a challenge
    res.json({
      success: true,
      message: 'Successfully joined the challenge!',
      data: {
        challengeId: currentChallenge.id,
        pointsAwarded: 100,
        newParticipantCount: currentChallenge.participants + 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error joining challenge',
      error: error.message
    });
  }
});

// SSE endpoint for real-time updates
router.get('/live-stats', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  const sendUpdate = () => {
    const stats = {
      totalCO2Saved: communityStats.totalCO2Saved + Math.floor(Math.random() * 20),
      plasticsAvoided: communityStats.plasticsAvoided + Math.floor(Math.random() * 100),
      activeUsers: communityStats.activeUsers + Math.floor(Math.random() * 10),
      timestamp: new Date()
    };
    
    res.write(`data: ${JSON.stringify(stats)}\n\n`);
  };

  // Send initial data
  sendUpdate();
  
  // Send updates every 30 seconds
  const interval = setInterval(sendUpdate, 30000);
  
  req.on('close', () => {
    clearInterval(interval);
  });
});

export default router;
