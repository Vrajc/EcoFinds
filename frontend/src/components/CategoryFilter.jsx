import { useEffect } from 'react';

const categories = [
  'All',
  'electronics',
  'clothing',
  'home',
  'books',
  'sports',
  'toys',
  'furniture',
  'other'
];

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  return (
    <div className="card-elevated p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12">
      <div className="text-center mb-6 sm:mb-8">
        <h3 className="font-caveat font-semibold text-2xl sm:text-3xl mb-2">Browse Categories</h3>
        <p className="text-text-muted font-inter text-sm sm:text-base">Find exactly what you're looking for</p>
      </div>
      
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category === 'All' ? '' : category)}
            className={`px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6 lg:py-3 rounded-full font-medium capitalize transition-all transform hover:scale-105 flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm lg:text-base ${
              (selectedCategory === '' && category === 'All') ||
              selectedCategory === category
                ? 'bg-primary text-white shadow-lg'
                : 'bg-gray-100 text-text hover:bg-gray-200 hover:shadow-md'
            }`}
          >
            <span className="hidden xs:block">
              {getCategoryIcon(category, (selectedCategory === '' && category === 'All') || selectedCategory === category)}
            </span>
            <span>{category === 'All' ? 'All Items' : category}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Helper function for category icons
const getCategoryIcon = (category, isSelected) => {
  const iconColor = isSelected ? 'currentColor' : '#6B7280';
  
  const icons = {
    'All': (
      <svg className="w-5 h-5" fill="none" stroke={iconColor} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    electronics: (
      <svg className="w-5 h-5" fill="none" stroke={iconColor} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    clothing: (
      <svg className="w-5 h-5" fill="none" stroke={iconColor} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    home: (
      <svg className="w-5 h-5" fill="none" stroke={iconColor} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    books: (
      <svg className="w-5 h-5" fill="none" stroke={iconColor} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    sports: (
      <svg className="w-5 h-5" fill="none" stroke={iconColor} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    toys: (
      <svg className="w-5 h-5" fill="none" stroke={iconColor} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    furniture: (
      <svg className="w-5 h-5" fill="none" stroke={iconColor} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4l-2 14h14l-2-14M11 9h2" />
      </svg>
    ),
    other: (
      <svg className="w-5 h-5" fill="none" stroke={iconColor} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    )
  };
  
  return icons[category] || icons.other;
};

export default CategoryFilter;
