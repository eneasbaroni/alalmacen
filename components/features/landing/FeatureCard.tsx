interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ComponentType;
  shapeVariant?: number;
}

const organicShapes = [
  "38% 62% 48% 52% / 55% 42% 58% 45%", // Forma 1
  "52% 48% 63% 37% / 42% 58% 42% 58%", // Forma 2
  "45% 55% 40% 60% / 60% 48% 52% 40%", // Forma 3
  "60% 40% 55% 45% / 48% 62% 38% 52%", // Forma 4
];

export function FeatureCard({
  title,
  description,
  icon: Icon,
  shapeVariant = 0,
}: FeatureCardProps) {
  return (
    <div
      className="bg-white flex flex-col text-center justify-start items-center p-6 "
      style={{
        borderRadius: organicShapes[shapeVariant % organicShapes.length],
      }}
    >
      {Icon && (
        <div className="text-gray-900 mb-4">
          <Icon />
        </div>
      )}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 font-light leading-5 tablet:p-6">
        {description}
      </p>
    </div>
  );
}
