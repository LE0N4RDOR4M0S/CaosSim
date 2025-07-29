import type { Employee, GameEvent, Upgrade } from '@/types';

export const INITIAL_EMPLOYEES: Employee[] = [
  { id: 'dev-jr', name: 'Dev Júnior', role: 'Dev Júnior', morale: 70, stress: 50 },
  { id: 'dev-sr', name: 'Dev Sênior', role: 'Dev Sênior', morale: 60, stress: 70 },
  { id: 'intern', name: 'O Estagiário', role: 'Estagiário', morale: 90, stress: 20 },
  { id: 'infra', name: 'Cara da Infra', role: 'Infra', morale: 50, stress: 80 },
  { id: 'manager', name: 'Gerente', role: 'Gerente', morale: 80, stress: 60 },
  { id: 'hr', name: 'Pessoa do RH', role: 'RH', morale: 75, stress: 40 },
];

// Não usamos mais eventos estáticos, mas manteremos a estrutura caso precisemos dela para outra coisa.
export const EVENTS: GameEvent[] = [];

export const UPGRADES: Upgrade[] = [
  {
    id: 'upgrade-1',
    name: 'Comprar uma máquina de café melhor',
    description: 'Aumente o moral com o néctar dos deuses.',
    effects: [{ employeeId: 'all', morale: 10, stress: -5 }],
  },
  {
    id: 'upgrade-2',
    name: 'Contratar um terapeuta no local',
    description: 'Forneça ajuda profissional para os colapsos mentais iminentes.',
    effects: [{ employeeId: 'all', stress: -25, morale: 5 }],
  },
  {
    id: 'upgrade-3',
    name: 'Instalar um novo sistema de ar condicionado',
    description: 'Porque a sala do servidor não deveria parecer um vulcão.',
    effects: [{ employeeId: 'infra', stress: -20, morale: 10 }, { systemHealth: 10 }],
  },
  {
    id: 'upgrade-4',
    name: 'Mudar para política de trabalho remoto',
    description: 'Deixe as pessoas lidarem com o caos do conforto de suas casas.',
    effects: [{ employeeId: 'all', stress: -15, morale: 15 }],
  },
];
