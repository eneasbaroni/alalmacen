import { Hero, Features, HowItWorks } from "@/components/features/landing";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-aam-gray-200 ">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />

      {/* How It Works Section */}
      <HowItWorks />
    </main>
  );
}
