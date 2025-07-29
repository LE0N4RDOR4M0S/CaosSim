"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ServerCrash } from 'lucide-react';

interface GameOverScreenProps {
  reason: string;
  onRestart: () => void;
}

export default function GameOverScreen({ reason, onRestart }: GameOverScreenProps) {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500 border-destructive/50 shadow-lg shadow-destructive/20">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2">
            <ServerCrash className="w-10 h-10 neon-red" />
            <CardTitle className="text-4xl font-headline neon-red">
              Fim de Jogo
            </CardTitle>
          </div>
          <CardDescription className="font-code text-lg text-destructive">
            Você falhou.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground text-lg">{reason}</p>
        </CardContent>
        <CardFooter>
          <Button
            size="lg"
            className="w-full font-bold text-lg"
            onClick={onRestart}
            variant="destructive"
          >
            Jogar Novamente?
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
