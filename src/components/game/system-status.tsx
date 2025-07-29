"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface SystemStatusProps {
  health: number;
}

export default function SystemStatus({ health }: SystemStatusProps) {
  const getHealthColor = () => {
    if (health > 66) return "[&>div]:bg-green-500";
    if (health > 33) return "[&>div]:bg-yellow-500";
    return "[&>div]:bg-red-500";
  };
  
  const getTextColor = () => {
    if (health > 66) return "text-green-400";
    if (health > 33) return "text-yellow-400";
    return "text-red-400";
  }

  return (
    <div className="w-full sm:w-64 space-y-2">
        <div className="flex justify-between items-baseline">
            <span className="text-sm font-semibold text-muted-foreground">Estabilidade do Sistema</span>
            <span className={cn("text-xl font-bold font-code", getTextColor())}>{health}%</span>
        </div>
      <Progress value={health} className={cn("h-3", getHealthColor())} />
    </div>
  );
}
