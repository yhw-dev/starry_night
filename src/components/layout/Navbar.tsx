"use client";

import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import NavLinks from './NavLinks';
import AuthButtons from './AuthButtons';
import { cn } from '../../utils/cn';

// Sample nav links - replace with your actual links
const navLinks = [
  { label: 'Home', href: '#', active: true },
  { label: 'About', href: '#' },
];

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  
  // Sample auth state - replace with your actual auth
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Sample auth functions - replace with your actual auth logic
  const handleLogin = () => {
    // Placeholder: Replace with actual login logic
    setIsLoggedIn(true);
  };

  const handleSignup = () => {
    // Placeholder: Replace with actual signup logic
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // Placeholder: Replace with actual logout logic
    setIsLoggedIn(false);
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-20 w-full transition-all duration-300',
        scrolled 
          ? 'bg-white shadow-md py-3' 
          : 'bg-white/80 backdrop-blur-md py-4'
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Logo />
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <NavLinks links={navLinks} />
        </nav>
        
        {/* Desktop Auth */}
        <div className="hidden md:block">
          <AuthButtons
            isLoggedIn={isLoggedIn}
            userName="Jane Doe"
            onLogin={handleLogin}
            onSignup={handleSignup}
            onLogout={handleLogout}
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;