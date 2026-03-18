import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import TrackingPlanGenerator from "./components/trackingPlanGenerator";

const page = () => {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col bg-[#fafafa]">
        <Header title="Tracking Plan → GTM" />
        <main className="flex flex-1 flex-col gap-4 px-4 lg:gap-6 lg:px-10 pb-8">
          <div className="w-full mx-auto">
            <TrackingPlanGenerator />
          </div>
        </main>
      </div>
    </div>
  );
};

export default page;
