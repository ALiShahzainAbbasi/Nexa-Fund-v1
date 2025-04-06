
import { Separator } from "@/components/ui/separator";

const ClientsSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Clients</h2>
          <p className="text-gray-600">We have been working with some Fortune 500+ clients</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 items-center justify-items-center">
          {/* Client logos would go here */}
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">Logo</div>
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">Logo</div>
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">Logo</div>
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">Logo</div>
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">Logo</div>
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">Logo</div>
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">Logo</div>
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;
