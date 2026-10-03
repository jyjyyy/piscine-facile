import { Calculator, Clock, FlaskConical, Gauge, Repeat, Scale, Thermometer, Waves, Zap, type LucideIcon } from "lucide-react";
import type { CalculatorInfo } from "@/lib/calculators";

const icons: Record<CalculatorInfo["icon"], LucideIcon> = {
  calculator: Calculator,
  clock: Clock,
  gauge: Gauge,
  zap: Zap,
  thermometer: Thermometer,
  waves: Waves,
  flask: FlaskConical,
  repeat: Repeat,
  scale: Scale,
};

export function CalculatorIcon({ name, className = "h-6 w-6" }: { name: CalculatorInfo["icon"]; className?: string }) {
  const Icon = icons[name];
  return <Icon className={className} aria-hidden="true" />;
}
