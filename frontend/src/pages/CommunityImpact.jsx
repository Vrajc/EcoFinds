import React from 'react';
import CommunityImpact from '../components/CommunityImpact';
import EnhancedCommunityImpact from '../components/EnhancedCommunityImpact';

const CommunityImpactPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="section-container">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">Community Impact</h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600">
              See how our community is making a positive environmental impact together
            </p>
          </div>
          
          <CommunityImpact />
          
          <div className="mt-6 sm:mt-8">
            <EnhancedCommunityImpact />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityImpactPage;
