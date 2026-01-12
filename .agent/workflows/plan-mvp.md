---
description: How to plan and scope a new MVP project with structured output
---

# /plan-mvp - Structured MVP Planning Workflow

Use this workflow when user requests a new project, clone, or complex feature.

## Prerequisites
- User has described what they want to build
- Read `.agent/protocols/mvp-planning-protocol.md` for response structure

## Workflow Steps

### Step 1: Show Clarification Form
// turbo
Display the clarification form to gather requirements:
- Target platforms (Web/iOS/Android)
- Core features scope
- AI/Tech stack preference
- Languages and UI
- Monetization model
- Privacy/compliance level
- Timeline urgency

Wait for user to confirm or modify parameters.

### Step 2: Execute Parallel Research
// turbo
Run multiple search queries simultaneously:
```
search_web("[Product] features overview")
search_web("[Product] pricing model")
search_web("[Product] privacy policy")
search_web("[Product] competitors")
fetch_url("[Official URLs if known]")
```

### Step 3: Define MVP Scope
Based on research and user parameters, create structured output:
1. **Target Platforms** - Tech stack decisions
2. **AI Stack** - Cloud/on-device choices
3. **Core Features** - Prioritized list
4. **Monetization** - Tier breakdown

### Step 4: Write Acceptance Criteria
// turbo
For EACH feature, define:
- Measurable metrics (latency, accuracy, coverage)
- Target values (< 600ms, ≥ 92%, etc.)
- Test methods

### Step 5: Create Phased Timeline
Break into 2-week sprints:
- Phase 1: Foundation (Weeks 1-2)
- Phase 2: Core Features (Weeks 3-4)
- Phase 3: Enhancement (Weeks 5-6)
- Phase 4: Polish & Release (Weeks 7-8)

### Step 6: Cite References
// turbo
List all sources used with URLs.

### Step 7: Present Next Steps
Offer actionable options:
1. System Architecture Design
2. Stakeholder Presentation
3. Project Structure Setup
4. Start Implementation

---

## Example Trigger
User says: "Create a clone of [App Name]"

Agent responds with clarification form → waits → researches → outputs structured MVP doc.

## Related Protocols
- `.agent/protocols/mvp-planning-protocol.md` - Full response structure guide
