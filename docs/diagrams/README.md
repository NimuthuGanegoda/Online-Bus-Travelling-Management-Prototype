# Prototype Diagram Assets

This folder contains release-ready diagram exports for the Online Bus Travelling Management Prototype.

Generated files:
- `prototype-system-architecture-diagram.png`
- `prototype-system-architecture-diagram.jpg`
- `prototype-system-architecture-diagram.pdf`
- `prototype-use-case-diagram.png`
- `prototype-use-case-diagram.jpg`
- `prototype-use-case-diagram.pdf`

To regenerate the assets locally:

```bash
python3 docs/diagrams/generate_prototype_diagrams.py
```

Requirements:
- `graphviz` with the `dot` command available on `PATH`
- Python `Pillow`

The diagrams are derived from the current prototype layout under:
- `prototypes/Integration`
- `prototypes/Amiliya`
- `prototypes/Sarasi`
- `prototypes/Neo`

Source analysis covers:
- Passenger, driver, and admin prototype clients
- Express backends and their route/controller boundaries
- Supabase-backed operational data flows
- Neo analytics services for ETA, driver rating, and emergency triage
