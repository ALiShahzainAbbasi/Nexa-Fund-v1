
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="py-4 border-b">
      <div className="container flex items-center justify-between">
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-green-600">CrowdFund</h1>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="/" className="text-base font-medium text-gray-700 hover:text-green-600">
            Home
          </a>
          <a href="/" className="text-base font-medium text-gray-700 hover:text-green-600">
            Features
          </a>
          <a href="/" className="text-base font-medium text-gray-700 hover:text-green-600">
            Community
          </a>
          <a href="/" className="text-base font-medium text-gray-700 hover:text-green-600">
            Blog
          </a>
          <a href="/" className="text-base font-medium text-gray-700 hover:text-green-600">
            Pricing
          </a>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Button className="text-base font-medium bg-green-500 hover:bg-green-600">
            Register Now
          </Button>
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
            <a href="/" className="text-base font-medium text-gray-700 hover:text-green-600">
              Home
            </a>
            <a href="/" className="text-base font-medium text-gray-700 hover:text-green-600">
              Features
            </a>
            <a href="/" className="text-base font-medium text-gray-700 hover:text-green-600">
              Community
            </a>
            <a href="/" className="text-base font-medium text-gray-700 hover:text-green-600">
              Blog
            </a>
            <a href="/" className="text-base font-medium text-gray-700 hover:text-green-600">
              Pricing
            </a>
            <div className="flex flex-col space-y-2 pt-2">
              <Button className="text-base font-medium justify-center w-full bg-green-500 hover:bg-green-600">
                Register Now
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
