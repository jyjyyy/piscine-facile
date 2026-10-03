import { Battery, Cloud, Droplet, Eye, Gauge, Layers, Leaf, Power, Sparkles, Wrench, Zap, type LucideIcon } from "lucide-react";

const icons: Record<string, LucideIcon> = {
  leaf: Leaf,
  cloud: Cloud,
  sparkles: Sparkles,
  layers: Layers,
  eye: Eye,
  power: Power,
  zap: Zap,
  droplet: Droplet,
  gauge: Gauge,
  battery: Battery,
};

/** Icône associée à un problème (champ "icon" du JSON) */
export function ProblemIcon({ name, className = "h-6 w-6" }: { name: string; className?: string }) {
  const Icon = icons[name] ?? Wrench;
  return <Icon className={className} aria-hidden="true" />;
}
