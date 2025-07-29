'use server';

/**
 * @fileOverview An AI agent that suggests the best upgrade to mitigate the current chaos situation.
 *
 * - suggestUpgrade - A function that suggests the best upgrade.
 * - SuggestUpgradeInput - The input type for the suggestUpgrade function.
 * - SuggestUpgradeOutput - The return type for the suggestUpgrade function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestUpgradeInputSchema = z.object({
  chaosDescription: z
    .string()
    .describe('A description of the current chaos situation in the IT environment.'),
  employeeMorale: z.number().describe('The average morale level of the employees (0-100).'),
  employeeStress: z.number().describe('The average stress level of the employees (0-100).'),
  availableUpgrades: z
    .array(z.string())
    .describe('A list of available upgrades that can be purchased.'),
});
export type SuggestUpgradeInput = z.infer<typeof SuggestUpgradeInputSchema>;

const SuggestUpgradeOutputSchema = z.object({
  suggestedUpgrade: z
    .string()
    .describe('The name of the upgrade that the AI suggests to purchase.'),
  reasoning: z.string().describe('The AI’s reasoning for suggesting this upgrade.'),
});
export type SuggestUpgradeOutput = z.infer<typeof SuggestUpgradeOutputSchema>;

export async function suggestUpgrade(input: SuggestUpgradeInput): Promise<SuggestUpgradeOutput> {
  return suggestUpgradeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestUpgradePrompt',
  input: {schema: SuggestUpgradeInputSchema},
  output: {schema: SuggestUpgradeOutputSchema},
  prompt: `You are an expert IT consultant specializing in mitigating chaos in IT environments. Given the current chaos situation, employee morale, employee stress, and available upgrades, you will suggest the best upgrade to purchase to improve the situation.

Chaos Description: {{{chaosDescription}}}
Employee Morale: {{{employeeMorale}}}
Employee Stress: {{{employeeStress}}}
Available Upgrades: {{#each availableUpgrades}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Consider the following when making your suggestion:
- The upgrade should directly address the root cause of the chaos.
- The upgrade should improve employee morale and reduce stress.
- The upgrade should be cost-effective.

Return the suggested upgrade and your reasoning for suggesting it.
`,
});

const suggestUpgradeFlow = ai.defineFlow(
  {
    name: 'suggestUpgradeFlow',
    inputSchema: SuggestUpgradeInputSchema,
    outputSchema: SuggestUpgradeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
