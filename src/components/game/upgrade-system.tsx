"use client";

import type { Upgrade } from '@/types';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle } from 'lucide-react';

interface UpgradeSystemProps {
  upgrades: Upgrade[];
  purchased: string[];
  onPurchase: (upgrade: Upgrade) => void;
}

export default function UpgradeSystem({ upgrades, purchased, onPurchase }: UpgradeSystemProps) {
  return (
    <TooltipProvider>
      <div className="space-y-2">
        <h3 className="font-semibold text-lg text-primary">Comprar Upgrades</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {upgrades.map(upgrade => (
            <Tooltip key={upgrade.id} delayDuration={100}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  disabled={purchased.includes(upgrade.id)}
                  onClick={() => onPurchase(upgrade)}
                  className="w-full justify-between"
                >
                  <span>{upgrade.name}</span>
                  {purchased.includes(upgrade.id) && <CheckCircle className="w-4 h-4 text-green-500" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{upgrade.description}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
