import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const WelcomeAnimation: React.FC = () => {
  const { currentUser } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (currentUser && !hasAnimated) {
      setHasAnimated(true);
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [currentUser, hasAnimated]);

  if (!isVisible || !currentUser) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <div className="relative w-full h-full">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-0 overflow-hidden">
            <div
              className="w-1/2 h-screen bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-end pr-12
                          transform transition-all duration-1000 ease-in-out"
              style={{
                transform: isVisible ? 'translateX(0)' : 'translateX(-100%)',
              }}
            >
              <div className="text-right">
                <h2 className="text-white text-4xl font-bold mb-2">Hello</h2>
                <p className="text-blue-100 text-2xl font-light">{currentUser.name}</p>
              </div>
            </div>

            <div
              className="w-1/2 h-screen bg-gradient-to-l from-purple-600 to-purple-800 flex items-center justify-start pl-12
                          transform transition-all duration-1000 ease-in-out"
              style={{
                transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
              }}
            >
              <div className="text-left">
                <p className="text-purple-100 text-2xl font-light mb-2">Welcome Back</p>
                <div className="w-32 h-32 bg-gradient-to-br from-purple-300 to-blue-300 rounded-full flex items-center justify-center text-purple-900 text-6xl font-bold shadow-2xl">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeAnimation;
