
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import WalletConnect from './WalletConnect';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="py-4 border-b">
      <div className="container flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-green-600">Nexa Fund</h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-base font-medium text-gray-700 hover:text-green-600">
            Home
          </Link>
          <Link to="/features" className="text-base font-medium text-gray-700 hover:text-green-600">
            Features
          </Link>
          <Link to="/browse" className="text-base font-medium text-gray-700 hover:text-green-600">
            Browse
          </Link>
          <Link to="/blog" className="text-base font-medium text-gray-700 hover:text-green-600">
            Blog
          </Link>
          <Link to="/pricing" className="text-base font-medium text-gray-700 hover:text-green-600">
            Pricing
          </Link>
          <Link to="/about" className="text-base font-medium text-gray-700 hover:text-green-600">
            About
          </Link>
          <Link to="/contact" className="text-base font-medium text-gray-700 hover:text-green-600">
            Contact
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <WalletConnect />
          <Link to="/start-campaign">
            <Button className="text-base font-medium bg-green-500 hover:bg-green-600">
              Start Campaign
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={toggleMenu} className="md:hidden">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden py-4 px-4 bg-white absolute top-16 left-0 right-0 z-50 border-b animate-fade-in">
          <nav className="flex flex-col space-y-4">
            <Link to="/" className="text-base font-medium text-gray-700 hover:text-green-600">
              Home
            </Link>
            <Link to="/features" className="text-base font-medium text-gray-700 hover:text-green-600">
              Features
            </Link>
            <Link to="/browse" className="text-base font-medium text-gray-700 hover:text-green-600">
              Browse
            </Link>
            <Link to="/blog" className="text-base font-medium text-gray-700 hover:text-green-600">
              Blog
            </Link>
            <Link to="/pricing" className="text-base font-medium text-gray-700 hover:text-green-600">
              Pricing
            </Link>
            <Link to="/about" className="text-base font-medium text-gray-700 hover:text-green-600">
              About
            </Link>
            <Link to="/contact" className="text-base font-medium text-gray-700 hover:text-green-600">
              Contact
            </Link>
            <div className="flex flex-col space-y-2 pt-2">
              <WalletConnect />
              <Link to="/start-campaign" className="w-full">
                <Button className="text-base font-medium justify-center w-full bg-green-500 hover:bg-green-600">
                  Start Campaign
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
