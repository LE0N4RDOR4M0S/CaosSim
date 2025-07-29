export type Employee = {
  id: string;
  name: string;
  role: 'Dev Júnior' | 'Dev Sênior' | 'Estagiário' | 'Infra' | 'Gerente' | 'RH';
  morale: number; // 0-100
  stress: number; // 0-100
};

export type Effect = {
  employeeId?: 'all' | string;
  morale?: number;
  stress?: number;
  systemHealth?: number;
};

export type Choice = {
  text: string;
  effects: Effect[];
  flavorText: string;
};

export type GameEvent = {
  id: string;
  title: string;
  description: string;
  choices: Choice[];
};

export type Upgrade = {
  id: string;
  name: string;
  description: string;
  effects: Effect[];
};

export type GameHistoryItem = {
  event: GameEvent;
  choice: Choice;
};
