"use client";

import type { Employee } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Code2,
  Coffee,
  Server,
  Briefcase,
  HeartHandshake,
  User,
  Smile,
  Frown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmployeeCardProps {
  employee: Employee;
}

const roleIcons: Record<Employee['role'], React.ElementType> = {
  'Dev Júnior': Code2,
  'Dev Sênior': Code2,
  'Estagiário': Coffee,
  'Infra': Server,
  'Gerente': Briefcase,
  'RH': HeartHandshake,
};

export default function EmployeeCard({ employee }: EmployeeCardProps) {
  const Icon = roleIcons[employee.role] || User;

  return (
    <Card className="bg-background/50 hover:bg-background/80 transition-colors">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-4">
        <Avatar>
          <AvatarFallback className="bg-secondary">
            <Icon className="h-6 w-6 text-primary" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-lg font-semibold">{employee.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{employee.role}</p>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-2">
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Smile className="w-3 h-3 text-green-400"/> Moral</span>
            <span>{employee.morale}/100</span>
          </div>
          <Progress value={employee.morale} className="h-2 [&>div]:bg-green-500" />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Frown className="w-3 h-3 text-red-400"/> Estresse</span>
            <span>{employee.stress}/100</span>
          </div>
          <Progress value={employee.stress} className="h-2 [&>div]:bg-red-500" />
        </div>
      </CardContent>
    </Card>
  );
}
