import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Find Your Next Real Estate Opportunity
        </h1>
        <p className="text-xl md:text-2xl mb-8">
          Discover expired listings and FSBO properties with AI-powered insights
        </p>
      </div>
    </section>
  );
};

export default Hero;