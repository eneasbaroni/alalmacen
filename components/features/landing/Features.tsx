import { FeatureCard } from "./FeatureCard";
import { FEATURES } from "@/lib/constants/landing";

export function Features() {
  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              shapeVariant={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
