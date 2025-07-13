import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white text-center p-4 mt-auto">
      &copy; {new Date().getFullYear()} PDF Tools. All rights reserved.
    </footer>
  );
};

export default Footer;
