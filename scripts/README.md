# Scripts Layout

`scripts/` contains executable project helpers.

## Conventions

- `maintenance/`: restructuring, bulk fixes, and repo housekeeping
- `ops/`: operational helpers such as backend startup and deployment support
- `experiments/`: temporary or exploratory scripts kept for reference

Domain-specific ingestion, seeding, and audit scripts remain in the `scripts/` root for now because they are already part of the active workflow. New generic helper scripts should be placed in one of the subfolders above.
