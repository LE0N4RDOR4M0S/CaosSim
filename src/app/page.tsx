"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { Employee, GameEvent, Upgrade, Choice, GameHistoryItem } from '@/types';
import { INITIAL_EMPLOYEES, UPGRADES } from '@/lib/game-data';
import StartScreen from '@/components/game/start-screen';
import GameOverScreen from '@/components/game/game-over-screen';
import GameScreen from '@/components/game/game-screen';
import { useToast } from '@/hooks/use-toast';
import { generateEvent } from '@/ai/flows/generate-event';
import { Loader } from 'lucide-react';

type GameState = 'start' | 'playing' | 'generating' | 'over';

export default function Home() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [systemHealth, setSystemHealth] = useState(100);
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const [gameHistory, setGameHistory] = useState<GameHistoryItem[]>([]);
  const [availableUpgrades, setAvailableUpgrades] = useState<Upgrade[]>(UPGRADES);
  const [purchasedUpgrades, setPurchasedUpgrades] = useState<string[]>([]);
  const [gameOverReason, setGameOverReason] = useState('');
  const { toast } = useToast();

  const getNextEvent = useCallback(async (currentEmployees: Employee[], currentSystemHealth: number, history: GameHistoryItem[]) => {
    setGameState('generating');
    try {
      const historyForAI = history.map(h => ({
        eventTitle: h.event.title,
        choiceText: h.choice.text,
      }));

      const newEvent = await generateEvent({
        employees: currentEmployees,
        systemHealth: currentSystemHealth,
        gameHistory: historyForAI,
      });
      setCurrentEvent(newEvent);
      setGameState('playing');
    } catch (error) {
      console.error("Falha ao gerar evento da IA:", error);
      toast({
        variant: 'destructive',
        title: "Erro de Conexão com a IA",
        description: "Não foi possível gerar o próximo evento. Verifique sua conexão ou a configuração da IA.",
      });
      // Fallback para um evento de erro ou tentar novamente
      setGameState('over');
      setGameOverReason("A IA entrou em colapso e levou o universo do jogo com ela.");
    }
  }, [toast]);


  const startGame = useCallback(() => {
    const initialEmployees = JSON.parse(JSON.stringify(INITIAL_EMPLOYEES));
    const initialHealth = 100;
    const initialHistory: GameHistoryItem[] = [];

    setEmployees(initialEmployees);
    setSystemHealth(initialHealth);
    setAvailableUpgrades(UPGRADES);
    setPurchasedUpgrades([]);
    setGameHistory(initialHistory);
    setGameOverReason('');
    setCurrentEvent(null);
    
    getNextEvent(initialEmployees, initialHealth, initialHistory);
  }, [getNextEvent]);

  const restartGame = () => {
    setGameState('start');
  };

  const handleSelectChoice = useCallback((choice: Choice) => {
    if (!currentEvent) return;
    
    let newSystemHealth = systemHealth;
    const newEmployees = employees.map(emp => {
      const updatedEmp = { ...emp };
      for (const effect of choice.effects) {
        if (effect.employeeId === 'all' || effect.employeeId === emp.id) {
          if (effect.morale) updatedEmp.morale = Math.max(0, Math.min(100, updatedEmp.morale + effect.morale));
          if (effect.stress) updatedEmp.stress = Math.max(0, Math.min(100, updatedEmp.stress + effect.stress));
        }
        if (effect.systemHealth) {
          newSystemHealth = Math.max(0, Math.min(100, newSystemHealth + effect.systemHealth));
        }
      }
      return updatedEmp;
    });

    const newHistory: GameHistoryItem[] = [...gameHistory, { event: currentEvent, choice }];
    setGameHistory(newHistory);
    setEmployees(newEmployees);
    setSystemHealth(newSystemHealth);

    toast({
      title: "Consequência",
      description: <p className="font-code">{choice.flavorText}</p>,
    });
    
    const avgMorale = newEmployees.reduce((acc, emp) => acc + emp.morale, 0) / (newEmployees.length || 1);
    if (newSystemHealth <= 0) {
      setGameState('over');
      setGameOverReason('O sistema caiu. Todos os dados foram perdidos. Assim como seu emprego.');
      return;
    }
    if (avgMorale <= 0) {
        setGameState('over');
        setGameOverReason("Todos se demitiram. Você é o único que restou. Aproveite o silêncio.");
        return;
    }
    
    getNextEvent(newEmployees, newSystemHealth, newHistory);
  }, [employees, systemHealth, currentEvent, gameHistory, getNextEvent, toast]);

  const handlePurchaseUpgrade = useCallback((upgrade: Upgrade) => {
    let newSystemHealth = systemHealth;
    const newEmployees = employees.map(emp => {
      const updatedEmp = { ...emp };
      for (const effect of upgrade.effects) {
        if (effect.employeeId === 'all' || effect.employeeId === emp.id) {
          if (effect.morale) updatedEmp.morale = Math.max(0, Math.min(100, updatedEmp.morale + effect.morale));
          if (effect.stress) updatedEmp.stress = Math.max(0, Math.min(100, updatedEmp.stress + effect.stress));
        }
        if (effect.systemHealth) {
          newSystemHealth = Math.max(0, Math.min(100, newSystemHealth + effect.systemHealth));
        }
      }
      return updatedEmp;
    });

    setEmployees(newEmployees);
    setSystemHealth(newSystemHealth);
    setPurchasedUpgrades(prev => [...prev, upgrade.id]);
    
    toast({
      title: "Upgrade Comprado!",
      description: `Instalado: ${upgrade.name}`,
    });

  }, [employees, systemHealth, toast]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    if (systemHealth <= 0) {
      setGameState('over');
      setGameOverReason('O sistema caiu. Todos os dados foram perdidos. Assim como seu emprego.');
      return;
    }
    
    const avgMorale = employees.reduce((acc, emp) => acc + emp.morale, 0) / (employees.length || 1);
    if (avgMorale <= 0) {
        setGameState('over');
        setGameOverReason("Todos se demitiram. Você é o único que restou. Aproveite o silêncio.");
        return;
    }
  }, [employees, systemHealth, gameState]);

  if (gameState === 'start') {
    return <StartScreen onStart={startGame} />;
  }

  if (gameState === 'over') {
    return <GameOverScreen reason={gameOverReason} onRestart={restartGame} />;
  }
  
  if (gameState === 'generating' || !currentEvent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader className="h-12 w-12 animate-spin text-primary" />
        <p className="text-xl text-muted-foreground font-code">Gerando novo nível de caos...</p>
      </div>
    );
  }
  
  return (
    <GameScreen
      employees={employees}
      systemHealth={systemHealth}
      currentEvent={currentEvent}
      availableUpgrades={availableUpgrades}
      purchasedUpgrades={purchasedUpgrades}
      onSelectChoice={handleSelectChoice}
      onPurchaseUpgrade={handlePurchaseUpgrade}
    />
  );
}
