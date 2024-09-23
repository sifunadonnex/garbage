import { ArrowRight, Droplets, Recycle, Users, Coins, MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function AnimatedGlobe() {
  return (
    <div className="relative w-32 h-32 mx-auto m-8">
      <div className="absolute rounded-full inset-0 bg-green-500 opacity-20 animate-pulse"></div>
      <div className="absolute rounded-full inset-2 bg-green-400 opacity-40 animate-ping"></div>
      <div className="absolute rounded-full inset-4 bg-green-300 opacity-60 animate-spin"></div>
      <div className="absolute rounded-full inset-6 bg-green-200 opacity-80 animate-bounce"></div>
      <Droplets className="absolute inset-0 m-auto h-16 w-16 text-green-600 animate-pulse" />
    </div>
  );
}

export default function Home() {
  return (
    <div className="container m-auto px-4 py-16">
      <section className="text-center mb-20">
        <AnimatedGlobe />
        <h1 className="text-6xl font-bold mb-6 text-slate-800 tracking-tight">
          EcoChain <span className="text-green-800 px-2 py-1 rounded-md">Waste Management</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
          EcoChain is a platform that connects waste collectors with recycling facilities and
          provides rewards for waste collection.
        </p>
        <Button className="bg-green-600 hover:bg-green-700 text-lg text-white px-10 py-6 rounded-full">Report Waste</Button>
      </section>
      <section className="grid md:grid-cols-3 gap-10 mb-2">
        <FeatureCard title="Report Waste" description="Report waste to the recycling facility" icon={Recycle} />
        <FeatureCard title="Get Rewards" description="Get rewards for recycling waste" icon={Coins} />
        <FeatureCard title="Connect with Recyclers" description="Connect with recyclers in your area" icon={Users} />
      </section>
    </div>
  );
}

function FeatureCard({ title, description, icon:Icon }: { title: string, description: string, icon: React.ElementType }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out flex flex-col items-center text-center">
      <div className="text-green-100 p-4 rounded-full mb-6">
        <Icon className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="text-xl font-semi-bold mb-4 text-slate-800">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}