# Documentation Map

`docs/` is now the main home for project documentation.

## Sections

- `architecture/`: core system architecture, AI stack, bot architecture, pipelines
- `governance/`: ethical, policy, and decision framing documents
- `integrations/`: external ecosystem and institutional integration strategies
- `iqra/`: Iqra learning specs, flows, pronunciation, and content rules
- `notes/`: short-form notes, scratch knowledge, and internal references worth keeping
- `operations/`: VPS, deployment, automation, and operational runbooks
- `product/`: product positioning, master specs, ecosystem thinking, and module plans
- `prompts/`: reusable Codex, AI, and workflow prompt files
- `references/`: supporting binary references such as PDFs
- `research/`: exploratory research, project improvement studies, and chat-export analysis
- `status/`: project state, sync snapshots, and temporary operating status docs
- `vault/`: archived deep documentation retained for historical and strategic context

## Featured Research

- `research/PROJECT_IMPROVEMENT_RESEARCH.md`: prioritized engineering and product improvement roadmap for the current repo state

## Root-Level Convention

The repository root should stay limited to:

- runtime apps and source folders
- build and package configuration
- agent entry files such as `AGENTS.md`, `CLAUDE.md`, and `GEMINI.md`
- top-level project files such as `README.md` and `CHANGELOG.md`

If a new Markdown file is not required by tooling at the root, place it in the appropriate `docs/` section instead.

