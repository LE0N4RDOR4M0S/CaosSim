"use client";

import type { GameEvent, Choice } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface EventDisplayProps {
  event: GameEvent;
  onSelectChoice: (choice: Choice) => void;
}

export default function EventDisplay({ event, onSelectChoice }: EventDisplayProps) {
  return (
    <Card className="flex flex-col animate-in fade-in duration-500">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-destructive neon-red" />
          <CardTitle className="text-2xl font-headline text-destructive neon-red">{event.title}</CardTitle>
        </div>
        <CardDescription className="text-muted-foreground text-md pt-2">{event.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {event.choices.map((choice, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto whitespace-normal text-left justify-start p-4 hover:bg-primary/10 hover:border-primary"
              onClick={() => onSelectChoice(choice)}
            >
              {choice.text}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
