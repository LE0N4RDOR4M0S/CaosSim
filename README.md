# 🎮 ChaosSim: IT Survival

**ChaosSim: IT Survival** é um simulador cômico e estratégico onde você tenta manter uma equipe de TI funcional em meio ao caos cotidiano. Entre bugs, deploys malditos e decisões moralmente questionáveis, o jogo mistura humor ácido e gestão realista para entregar uma experiência envolvente (ou traumática).

---

## 🚀 Visão Geral

Este projeto explora conceitos modernos de desenvolvimento web, simulação e integração com inteligência artificial. A proposta vai além do entretenimento, servindo também como vitrine de boas práticas em arquitetura front-end e uso de IA em experiências interativas.

---

## 🧱 Arquitetura & Tecnologias

O jogo é construído com uma stack moderna e modular, pensada para performance e escalabilidade:

- **Next.js:** SSR e otimizações nativas para performance e SEO.
- **TypeScript:** Tipagem estática para código robusto e manutenção tranquila.
- **Tailwind CSS:** Estilização rápida, responsiva e altamente customizável.
- **GenKit (AI):** Orquestra fluxos de IA para geração procedural de eventos e upgrades inteligentes (`src/ai/`).
- **Componentes Reutilizáveis:** Interface baseada em Atomic Design (`src/components/`).
- **Hooks Personalizados:** Controle de estado com lógica isolada e reativa (`src/hooks/`).
- **Engine de Jogo:** Regras desacopladas da UI, organizadas em módulos (`src/lib/`).

---

## 🧩 Funcionalidades Técnicas

- **IA no Controle do Caos:** Modelos de linguagem sugerem ações e criam eventos dinâmicos conforme o nível de estresse do time.
- **Gestão de Moral e Estresse:** Cada funcionário tem status individuais que reagem às suas (más) decisões.
- **Sistema de Upgrades:** Melhore o ambiente com café, psicólogos ou trabalho remoto – ou não.
- **UI Responsiva e Temática:** Interface em Dark Mode com estética "hacker-pixelada".
- **Textos Sarcásticos:** Porque toda crise merece uma frase de efeito.

---

## 🛠️ Como Rodar Localmente

```bash
# 1. Clone o repositório
git clone [URL do Repositório]

# 2. Instale as dependências
npm install

# 3. (Opcional) Configure variáveis de ambiente para recursos com IA

# 4. Inicie o servidor de desenvolvimento
npm run dev

```
## Licença

Este projeto está licenciado sob a Licença Apache 2.0 - veja o arquivo [LICENSE](./LICENSE) para detalhes.

