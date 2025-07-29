"use client";

import type { Employee, GameEvent, Upgrade, Choice } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import EmployeeCard from './employee-card';
import EventDisplay from './event-display';
import UpgradeSystem from './upgrade-system';
import SystemStatus from './system-status';
import { useState } from 'react';

interface GameScreenProps {
  employees: Employee[];
  systemHealth: number;
  currentEvent: GameEvent | null;
  availableUpgrades: Upgrade[];
  purchasedUpgrades: string[];
  onSelectChoice: (choice: Choice) => void;
  onPurchaseUpgrade: (upgrade: Upgrade) => void;
}

export default function GameScreen({
  employees,
  systemHealth,
  currentEvent,
  availableUpgrades,
  purchasedUpgrades,
  onSelectChoice,
  onPurchaseUpgrade,
}: GameScreenProps) {
  const [showExitModal, setShowExitModal] = useState(false);

  const handleExit = () => {
    window.location.href = "/";
  };
  return (
    <div className="min-h-screen flex flex-col p-2 sm:p-4 gap-4">
      <header className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 rounded-lg bg-card/50 border border-border">
        <h1 className="text-2xl sm:text-3xl font-headline neon-cyan">CaosSim: Sobrevivência em TI</h1>
        <div className="flex items-center gap-4">
          <SystemStatus health={systemHealth} />
          <button
            className="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition"
            onClick={() => setShowExitModal(true)}
          >
            Sair
          </button>
        </div>
      </header>

      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-zinc-900 rounded-lg shadow-lg p-6 max-w-sm w-full border border-zinc-800">
        <h2 className="text-lg font-bold mb-4 text-white">Deseja realmente sair?</h2>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded bg-zinc-700 text-white hover:bg-zinc-600"
            onClick={() => setShowExitModal(false)}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 rounded bg-red-700 text-white hover:bg-red-800"
            onClick={handleExit}
          >
            Sair
          </button>
        </div>
          </div>
        </div>
      )}

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
        <Card className="lg:col-span-1 flex flex-col">
          <CardHeader>
            <CardTitle className="neon-green">Status dos Funcionários</CardTitle>
          </CardHeader>
          <ScrollArea className="flex-1">
            <CardContent className="space-y-4">
              {employees.map(emp => (
                <EmployeeCard key={emp.id} employee={emp} />
              ))}
            </CardContent>
          </ScrollArea>
        </Card>

        <div className="lg:col-span-2 flex flex-col gap-4">
          {currentEvent && (
            <EventDisplay event={currentEvent} onSelectChoice={onSelectChoice} />
          )}

          <Card>
            <CardHeader>
              <CardTitle className="neon-green">Upgrades e Suporte</CardTitle>
            </CardHeader>
            <CardContent>
              <UpgradeSystem
                upgrades={availableUpgrades}
                purchased={purchasedUpgrades}
                onPurchase={onPurchaseUpgrade}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );

  
}
