import React from 'react';
import { Link } from 'react-router';
import { Button } from './ui/button';

const Navigation: React.FC = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost">Home</Button>
            </Link>
            <Link to="/chat">
              <Button variant="ghost">Chat</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 