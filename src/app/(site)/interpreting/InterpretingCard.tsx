import { ReactNode } from "react";

export interface InterpretingCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  features?: string[];
  accentColor?: string;  // Tailwind text-* sınıfı, örn: "text-red-600"
  iconBg?: string;       // Tailwind bg-* sınıfı, örn: "bg-red-50"
}

export default function InterpretingCard({
  icon,
  title,
  description,
  features = [],
  accentColor = "text-red-600",
  iconBg = "bg-red-50",
}: InterpretingCardProps) {
    
  const accentBg = accentColor.replace("text-", "bg-");

  return (
    <div className="group flex flex-col items-center text-center bg-white border border-gray-100 rounded-2xl px-8 py-10 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 h-full">
      {/* Icon */}
      <div
        className={`flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${iconBg} group-hover:scale-110 transition-transform duration-300`}
      >
        <span className={`text-3xl ${accentColor}`}>{icon}</span>
      </div>

      {/* Title */}
      <h3 className="text-xl font-black text-gray-900 mb-4 tracking-tight">
        {title}
      </h3>

      {/* Accent divider */}
      <div className={`w-10 h-1 rounded-full mb-5 ${accentBg}`} />

      {/* Description */}
      <p className="text-sm text-gray-500 leading-relaxed mb-6">
        {description}
      </p>

      {/* Features */}
      
        <ul className="w-full flex flex-col gap-2 mt-auto text-left">
          {features.map((feat, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${accentBg}`} />
              {feat}
            </li>
          ))}
        </ul>
    </div>
  );
}