
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="gradient-text">Fund</span> the Future<br />
              <span className="gradient-text">Dreams</span> Today
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-lg">
              Join our community of dreamers and backers. Together, we can make extraordinary ideas come to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-base md:text-lg font-medium">
                Start a Campaign
              </Button>
              <Button size="lg" variant="outline" className="text-base md:text-lg font-medium">
                Explore Projects
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-8 pt-4">
              <div className="flex flex-col">
                <span className="text-3xl font-bold gradient-text">$2.5M+</span>
                <span className="text-gray-500">Funds Raised</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold gradient-text">350+</span>
                <span className="text-gray-500">Campaigns Funded</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold gradient-text">15k+</span>
                <span className="text-gray-500">Happy Backers</span>
              </div>
            </div>
          </div>
          <div className="relative rounded-lg overflow-hidden shadow-xl animate-fade-in">
            <img 
              src="https://images.unsplash.com/photo-1521898284481-a5ec348cb555?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" 
              alt="People collaborating on a project" 
              className="w-full h-full object-cover aspect-video"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <p className="text-sm font-medium bg-green-600 inline-block px-3 py-1 rounded-full mb-2">Success Story</p>
              <h3 className="text-xl font-bold mb-1">EcoTech Innovations</h3>
              <p className="text-sm">Raised $120,000 to develop sustainable energy solutions</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
