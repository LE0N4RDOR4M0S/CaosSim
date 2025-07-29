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
  prompt: `Você é um mestre de jogo sádico para um simulador de caos em TI chamado "CaosSim". Sua tarefa é gerar um novo evento de crise com base no estado atual do jogo para desafiar o jogador.

O evento deve ser plausível (no contexto de um escritório de TI disfuncional), criativo e um pouco humorístico. Baseie o novo evento no histórico de jogo para criar uma narrativa emergente. Por exemplo, se o jogador culpou o estagiário, talvez o próximo evento seja a vingança do estagiário. Se o sistema está quase caindo, crie um evento que o pressione ainda mais.

Estado Atual do Jogo:
- Saúde do Sistema: {{{systemHealth}}}/100
- Funcionários:
{{#each employees}}
  - {{name}} ({{role}}): Moral: {{morale}}, Estresse: {{stress}}
{{/each}}
- Histórico de Eventos Recentes:
{{#each gameHistory}}
  - Evento: "{{eventTitle}}" -> Escolha: "{{choiceText}}"
{{/each}}

Regras para gerar o evento:
1.  **Título e Descrição:** Crie um título e uma descrição que se encaixem no tema de "caos em TI".
2.  **Escolhas:** Forneça 2 ou 3 escolhas significativas. Cada escolha deve ter um texto claro e um 'flavorText' (texto de sabor) que adicione personalidade.
3.  **Efeitos:** Os efeitos de cada escolha (morale, stress, systemHealth) devem ser lógicos.
    -   Efeitos negativos em 'systemHealth' significam que o sistema piora.
    -   Efeitos em 'morale' e 'stress' podem ser positivos ou negativos.
    -   O 'employeeId' deve ser um dos seguintes: 'all' ou um ID da lista de funcionários ({{#each employees}}{{id}}{{#unless @last}}, {{/unless}}{{/each}}).
4.  **Criatividade:** Não repita os eventos do histórico. Crie algo novo que continue a história. Se o moral de um funcionário estiver muito baixo, talvez o evento seja sobre ele. Se o estresse estiver alto, talvez algo quebre.

Gere o próximo evento de caos agora.
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
