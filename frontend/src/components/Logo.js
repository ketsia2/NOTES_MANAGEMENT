import React from 'react';

const Logo = ({ className = "h-12 w-12" }) => {
  return (
    <div className={`flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xl rounded-lg ${className}`}>
      NC
    </div>
  );
};

export default Logo;