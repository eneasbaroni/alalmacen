import { StepCard } from "./StepCard";
import { HOW_IT_WORKS_STEPS } from "@/lib/constants/landing";

export function HowItWorks() {
  return (
    <section className=" px-4 ">
      <div className="py-16  mx-auto bg-white rounded-t-4xl">
        <div className="text-center mb-12 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Cómo Funciona
          </h2>
          <p className="text-l font-light text-gray-600">
            Tres simples pasos para comenzar a acumular puntos y disfrutar de
            beneficios
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <StepCard
              key={index}
              number={step.number}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
