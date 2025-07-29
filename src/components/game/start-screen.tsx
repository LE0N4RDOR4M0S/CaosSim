"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500 border-primary/50 shadow-lg shadow-primary/20">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2">
            <Sparkles className="w-10 h-10 neon-cyan" />
            <CardTitle className="text-4xl font-headline neon-cyan">
              CaosSim
            </CardTitle>
          </div>
          <CardDescription className="font-code text-lg neon-green">
            Sobrevivência em TI
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p className="text-center text-muted-foreground">
            Seu emprego está em jogo. Os servidores estão instáveis. Os funcionários estão no limite. Você consegue sobreviver ao caos?
          </p>
          <Button
            size="lg"
            className="w-full font-bold text-lg"
            onClick={onStart}
            variant="default"
          >
            <span>Começar o Caos</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
