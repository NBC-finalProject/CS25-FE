import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className = '' }) => {
  return (
    <div className={`max-w-4xl mx-auto px-5 ${className}`}>
      {children}
    </div>
  );
};

export default Container;