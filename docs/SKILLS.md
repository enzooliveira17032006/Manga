# Skills do Projeto (Manga Reader)

## android-cli
* **Função:** Fornece instruções para interagir com o emulador Android, compilação via CLI, e inspeção visual da UI, fundamental para testar o App Mobile do leitor de mangá.
* **Local de instalação:** `.agents/skills/android-cli/SKILL.md`
* **Dependências:** CLI Oficial do Android (Android SDK).
* **Configuração realizada:** Cópia para workspace e escopo restrito a este projeto.
* **Status:** INSTALADA. Configuração OK.
* **Como o agente deve utilizá-la:** Sempre que for demandado criar builds ou rodar comandos na versão mobile Android do leitor, lendo este arquivo e executando os passos descritos.

## securecoder (Pack)
* **Função:** Planejamento e modelagem de ameaças para o Backend (API, Authentication, Autorização). Aborda OWASP e mitigação de riscos.
* **Local de instalação:** `.agents/skills/` (diversas pastas, ex: `create_security_implementation_plan/SKILL.md`, `run_security_scanner/SKILL.md`).
* **Dependências:** Nenhuma dependência externa imediata, foca em fluxos analíticos e ferramentas base.
* **Configuração realizada:** Importação das skills de segurança para o escopo local.
* **Status:** INSTALADA. Configuração OK.
* **Como o agente deve utilizá-la:** Quando for criar a camada de API e Autenticação (Backend do Manga Reader), o agente deve acionar os fluxos contidos nestes SKILLs para garantir o máximo de segurança.

## Skills Ausentes (Conforme validação do ambiente base)
* React, Vite, Next.js, Tailwind, PWA, Offline-first, IndexedDB, etc.
* **Motivo:** O ambiente global não contém plugins ou skills declarados com essas tecnologias. Como não podemos inventar skills não-oficiais (regra rigorosa), dependemos apenas do conhecimento nativo do LLM para estas stacks na etapa de desenvolvimento de software.

## Skills do GitHub (agentic-awesome-skills)
* Foram instaladas 19 novas skills de Front-end, Back-end, DevOps, Testes e Arquitetura. (Veja GITHUB-SKILLS.md para a lista detalhada).
