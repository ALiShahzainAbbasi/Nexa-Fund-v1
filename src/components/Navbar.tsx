
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
            <h1 className="text-2xl font-bold gradient-text">CrowdFund</h1>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="/" className="text-base font-medium text-gray-700 hover:text-purple-600">
            Explore
          </a>
          <a href="/" className="text-base font-medium text-gray-700 hover:text-purple-600">
            How It Works
          </a>
          <a href="/" className="text-base font-medium text-gray-700 hover:text-purple-600">
            About Us
          </a>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Button variant="outline" className="text-base font-medium">
            Log In
          </Button>
          <Button className="text-base font-medium">
            Start a Campaign
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
            <a href="/" className="text-base font-medium text-gray-700 hover:text-purple-600">
              Explore
            </a>
            <a href="/" className="text-base font-medium text-gray-700 hover:text-purple-600">
              How It Works
            </a>
            <a href="/" className="text-base font-medium text-gray-700 hover:text-purple-600">
              About Us
            </a>
            <div className="flex flex-col space-y-2 pt-2">
              <Button variant="outline" className="text-base font-medium justify-center w-full">
                Log In
              </Button>
              <Button className="text-base font-medium justify-center w-full">
                Start a Campaign
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
