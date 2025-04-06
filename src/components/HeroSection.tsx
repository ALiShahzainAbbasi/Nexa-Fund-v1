
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="py-12 md:py-20">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Next Gen<br />
              Crowdfunding<br />
              <span className="text-green-500">Platform</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-lg">
              Where to grow your business from zero investment
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-base md:text-lg font-medium bg-green-500 hover:bg-green-600 w-40">
                Register
              </Button>
            </div>
            <div className="flex space-x-1 pt-4">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="w-2 h-2 rounded-full bg-gray-300"></span>
              <span className="w-2 h-2 rounded-full bg-gray-300"></span>
            </div>
          </div>
          <div className="relative rounded-lg overflow-hidden animate-fade-in">
            <img 
              src="/lovable-uploads/74654fa6-014a-49ef-8b28-da9d857ac6fb.png" 
              alt="Crowdfunding Platform" 
              className="w-full h-full object-contain aspect-square"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
