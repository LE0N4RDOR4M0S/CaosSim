'use server';

/**
 * @fileOverview Um agente de IA que gera eventos de jogo dinâmicos com base no estado atual do jogo.
 *
 * - generateEvent - Uma função que gera um novo evento de jogo.
 * - GenerateEventInput - O tipo de entrada para a função generateEvent.
 * - GenerateEventOutput - O tipo de retorno para a função generateEvent (que é um GameEvent).
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { GameEvent, Employee, Choice } from '@/types';

// Definindo esquemas Zod para os tipos do jogo para que a IA os entenda.
const EmployeeSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.enum(['Dev Júnior', 'Dev Sênior', 'Estagiário', 'Infra', 'Gerente', 'RH']),
  morale: z.number(),
  stress: z.number(),
});

const EffectSchema = z.object({
  employeeId: z.string().optional(),
  morale: z.number().optional(),
  stress: z.number().optional(),
  systemHealth: z.number().optional(),
});

const ChoiceSchema = z.object({
  text: z.string(),
  effects: z.array(EffectSchema),
  flavorText: z.string(),
});

const HistoryItemSchema = z.object({
  eventTitle: z.string(),
  choiceText: z.string(),
});

const GenerateEventInputSchema = z.object({
  employees: z.array(EmployeeSchema).describe('O estado atual dos funcionários.'),
  systemHealth: z.number().describe('A saúde atual do sistema (0-100).'),
  gameHistory: z.array(HistoryItemSchema).describe('O histórico de eventos e escolhas feitas pelo jogador.'),
});
export type GenerateEventInput = z.infer<typeof GenerateEventInputSchema>;

const GenerateEventOutputSchema = z.object({
  id: z.string(),
  title: z.string().describe('O título do novo evento de caos. Deve ser criativo e relacionado a TI.'),
  description: z.string().describe('Uma breve descrição do que está acontecendo.'),
  choices: z.array(ChoiceSchema).describe('Uma lista de 2 a 3 escolhas que o jogador pode fazer em resposta ao evento. As escolhas devem ter consequências claras e interessantes.'),
});
export type GenerateEventOutput = z.infer<typeof GenerateEventOutputSchema>;


export async function generateEvent(input: GenerateEventInput): Promise<GameEvent> {
  const event = await generateEventFlow(input);
  // A IA pode alucinar um employeeId inválido, então vamos garantir que apenas 'all' ou IDs válidos sejam usados.
  const validEmployeeIds = ['all', ...input.employees.map(e => e.id)];
  event.choices.forEach(choice => {
    choice.effects.forEach(effect => {
      if (effect.employeeId && !validEmployeeIds.includes(effect.employeeId)) {
        // Se o ID for inválido, podemos removê-lo ou atribuí-lo a um funcionário aleatório.
        // Por simplicidade, vamos remover o efeito do employeeId.
        delete effect.employeeId;
      }
    });
  });
  return event;
}

const prompt = ai.definePrompt({
  name: 'generateEventPrompt',
  input: { schema: GenerateEventInputSchema },
  output: { schema: GenerateEventOutputSchema },
  prompt: `Você é um mestre de jogo sádico em um simulador chamado "CaosSim", que retrata o caos em um setor de TI disfuncional.

Crie um novo evento de crise com base no estado atual do jogo:

Saúde do sistema: {{{systemHealth}}}/100

Funcionários:
{{#each employees}}– {{name}} ({{role}}): Moral: {{morale}}, Estresse: {{stress}}{{/each}}

Eventos anteriores:
{{#each gameHistory}}– "{{eventTitle}}", escolha: "{{choiceText}}"{{/each}}

Requisitos do evento:
1. Título e descrição caóticos e plausíveis.
2. 3 ou 4 escolhas com humor, texto principal + flavorText.
3. Efeitos lógicos (morale, stress, systemHealth) por escolha.
4. Use "all" ou IDs de funcionários como employeeId.
5. Não repita eventos. Use o histórico para criar narrativa.
6. Dê atenção a moral baixa ou estresse alto dos funcionários.
7. Pode inventar nomes e situações criativas dentro do tema.
8. Sempre tenha uma solução viável (mesmo absurda).

Gere o próximo evento agora.
`,
});

const generateEventFlow = ai.defineFlow(
  {
    name: 'generateEventFlow',
    inputSchema: GenerateEventInputSchema,
    outputSchema: GenerateEventOutputSchema,
  },
  async (input) => {
    // Garante que o histórico não seja muito longo para o prompt
    const recentHistory = input.gameHistory.slice(-5);

    const { output } = await prompt({ ...input, gameHistory: recentHistory });
    return output!;
  }
);
