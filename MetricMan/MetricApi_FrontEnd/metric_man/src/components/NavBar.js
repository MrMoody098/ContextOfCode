import React, { useEffect, useState } from 'react';
import '../App.css';

const NavBar = () => {
  const [show, setShow] = useState(true);
  let lastScrollY = window.pageYOffset;

  const handleScroll = () => {
    const currentScrollY = window.pageYOffset;

    if (lastScrollY > currentScrollY) {
      setShow(true); // Scrolling up
    } else {
      setShow(false); // Scrolling down
    }
    lastScrollY = currentScrollY;
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`navbar ${show ? 'visible' : 'hidden'}`}>
      <div className="navbar-content">
        <div className="logo">MetricMan</div>
        <input type="text" className="search-bar" placeholder="Search..." />
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
