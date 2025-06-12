import React from 'react';
import Container from './Container';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white text-center py-10 font-pretendard">
      <Container>
        <p>&copy; 2025 CS25. All rights reserved.</p>
      </Container>
    </footer>
  );
};

export default Footer;