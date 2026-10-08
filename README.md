# JustEcosystem

A development hub for the Just family of creative-tool experiments. This repository brings together project plans, API contracts, a React starter, a VS Code theme, and task/documentation-management scaffolding.

## Repository map

| Area | Source | What it contains |
| --- | --- | --- |
| JustCreate starter | [JustCreate/](JustCreate/) | React/TypeScript application source and Vite/Electron script declarations |
| Editor theme | [justcreate-vscode-theme/](justcreate-vscode-theme/) | A VS Code theme package |
| Management template | [template/](template/) | Task/documentation scaffolding and a shared-command source tree |
| API designs | [api-contracts/](api-contracts/), [.docs/api/](.docs/api/) | Contract and integration documentation |
| Plans and checklists | [master_docs/](master_docs/) | Task boards, onboarding notes, and QA templates |

Sibling project names such as JustWorks, JustStuff, JustCreate, JustDraft, and JustEnglish appear in the planning documents. Those references describe the broader intended ecosystem; not every component or integration is implemented in this checkout, and some sibling repositories are private.

## Explore a component

There is no root application or shared root install/build command. Start with the manifest and README inside the component you want to inspect:

- [JustCreate package](JustCreate/package.json) declares `dev`, `build`, `preview`, and `desktop` scripts. Its setup/entry points need validation before presenting it as a ready-to-run app.
- [VS Code theme package](justcreate-vscode-theme/package.json) records the extension's theme metadata.
- [Management template package](template/package.json) declares task/documentation commands, but some declared JavaScript entry points are absent while TypeScript source is present. Review that source/build mismatch before running the template as a tool.

The [API contracts](api-contracts/README.md) and [management notes](master_docs/README.md) are useful starting points for understanding the proposed architecture.

## Project status

This is a collection of early implementations and design material rather than a deployed, integrated platform. Existing task boards and process documents record plans; they are not evidence that a team, endpoint, notification system, or cross-repository integration is currently operating. Live API examples and sibling-project availability have not been verified during this documentation review.

## License

No root license file is included. Check individual component manifests and upstream material before reuse; component or third-party permissions are not automatically established for the entire ecosystem.
