# 🤖 Agent Response Protocol - Structured MVP Planning

> **Purpose**: Guide AI agents to respond with professional, structured outputs for complex project planning tasks.

---

## 📋 PHASE 1: CLARIFICATION (Required Before Execution)

When user requests a complex feature/project, **ALWAYS** start with a clarification form:

```markdown
## 🎯 Clarify Scope & Requirements

Before I proceed, please confirm these parameters:

| Parameter | Options | Default |
|-----------|---------|---------|
| **Target Platforms** | Web / iOS / Android / All | MVP speed best practice |
| **Core Features** | [List specific features] | Industry standard |
| **AI/Tech Stack** | Cloud / On-device / Hybrid | Balance quality & cost |
| **Languages** | Primary + UI languages | Core + English UI |
| **Monetization** | Free / Freemium / Subscription | Common SaaS model |
| **Privacy Level** | Strict / Balanced / Minimal | Balanced opt-in |
| **Timeline** | Urgent / Standard / Flexible | Realistic MVP pace |

Please check/modify these, then I'll proceed with research and planning.
```

---

## 🔍 PHASE 2: RESEARCH (Parallel Tool Calls)

After clarification, execute **parallel research**:

```
Executing research phase...

├── search_web("[Product] features overview")
├── search_web("[Product] pricing model")
├── search_web("[Product] privacy policy")
├── search_web("[Product] competitors comparison")
├── search_web("[Product] user reviews")
└── fetch_url("[Official documentation URLs]")
```

**Key Pattern**: Use `multi_tool_use.parallel` for efficiency.

---

## 📝 PHASE 3: MVP SCOPE DEFINITION

Structure output with clear sections:

### 3.1 Target Platforms
```markdown
## Target Platforms

- **Primary**: [Platform 1] + [Platform 2]
- **Approach**: [Tech stack decision]
- **Shared Logic**: [Code reuse strategy]
```

### 3.2 Tech/AI Stack
```markdown
## AI Stack (Hybrid Approach)

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Cloud STT | OpenAI Whisper | High accuracy |
| On-device | [Fallback] | Low latency |
| Backend | [Choice] | Scalability |
| Database | [Choice] | Real-time sync |
```

### 3.3 Core Features List
```markdown
## Core MVP Features

1. **Feature Name** - Brief description
2. **Feature Name** - Brief description
3. **Feature Name** - Brief description
...
```

### 3.4 Monetization Model
```markdown
## Monetization

| Tier | Features | Price |
|------|----------|-------|
| Free | Basic features | $0 |
| Pro | Advanced + Offline | $X/month |
| Family | Multi-user + All | $Y/month |
```

---

## ✅ PHASE 4: ACCEPTANCE CRITERIA (Measurable!)

**CRITICAL**: Every feature MUST have measurable metrics:

```markdown
## Acceptance Criteria

### Feature: [Name]
| Metric | Target | Test Method |
|--------|--------|-------------|
| Latency | < 600ms | Performance test |
| Accuracy | ≥ 92% | Test dataset |
| Error Rate | ≤ 8% | False positive analysis |
| Coverage | ≥ 90% | Feature audit |

### Feature: [Name]
| Metric | Target | Test Method |
|--------|--------|-------------|
| ... | ... | ... |
```

---

## 📅 PHASE 5: PHASED TIMELINE

Always break into 2-week sprints:

```markdown
## Development Timeline (X Weeks)

### Phase 1: Foundation (Weeks 1-2)
- [ ] Architecture design
- [ ] UI scaffolding
- [ ] Core integration setup

### Phase 2: Core Features (Weeks 3-4)
- [ ] Feature A implementation
- [ ] Feature B implementation
- [ ] Backend integration

### Phase 3: Enhancement (Weeks 5-6)
- [ ] Advanced features
- [ ] Calibration & tuning
- [ ] Offline support

### Phase 4: Polish & Release (Weeks 7-8)
- [ ] QA testing
- [ ] Store submissions
- [ ] Beta rollout
- [ ] Privacy/compliance checks
```

---

## 📚 PHASE 6: REFERENCES

Always cite sources:

```markdown
## References

1. [Source Name] - https://url.com/path
2. [Documentation] - https://docs.example.com
3. [Pricing Page] - https://product.com/pricing
4. [App Store] - https://apps.apple.com/...
5. [Play Store] - https://play.google.com/...
```

---

## 🎯 NEXT STEPS PROMPT

Always end with actionable next steps:

```markdown
---

**If you approve this MVP + criteria, I'll proceed to:**

1. 🏗️ **System Architecture Design** - Technical diagrams
2. 📊 **Stakeholder Presentation** - Slide deck
3. 📁 **Project Structure** - File/folder setup
4. 🚀 **Implementation** - Start coding Phase 1

Which should I start with?
```

---

## 💡 RESPONSE QUALITY CHECKLIST

Before submitting response, verify:

- [ ] Clarification form shown (if new project)
- [ ] Research sources cited
- [ ] Features have measurable acceptance criteria
- [ ] Timeline is phased with realistic estimates
- [ ] Tech stack decisions are justified
- [ ] Next steps are clear and actionable
- [ ] Tables used for comparison data
- [ ] Emoji headers for visual scanning
- [ ] Code blocks for technical details

---

## 🔧 TOOL CALLING PATTERNS

### Parallel Research
```javascript
// Execute multiple searches simultaneously
await Promise.all([
  search_web("query 1"),
  search_web("query 2"),
  search_web("query 3"),
  fetch_url("https://specific-url.com")
]);
```

### Sequential with Dependencies
```javascript
// When output of one affects the next
const research = await search_web("initial query");
const details = await fetch_url(research.top_result_url);
const analysis = await analyze(details);
```

### Task Boundary Updates
```javascript
// Update task status at each phase
task_boundary({
  mode: "PLANNING",
  taskName: "Create MVP Specification",
  taskStatus: "Researching competitor features",
  taskSummary: "Completed clarification. Now gathering data."
});
```

---

## 📋 EXAMPLE RESPONSE STRUCTURE

```
┌─────────────────────────────────────────────────────────┐
│  1. CLARIFICATION                                       │
│     └── Form with parameters                            │
├─────────────────────────────────────────────────────────┤
│  2. RESEARCH SUMMARY                                    │
│     └── Key findings from searches                      │
├─────────────────────────────────────────────────────────┤
│  3. MVP SCOPE                                           │
│     ├── Target Platforms                                │
│     ├── Tech Stack                                      │
│     ├── Core Features                                   │
│     └── Monetization                                    │
├─────────────────────────────────────────────────────────┤
│  4. ACCEPTANCE CRITERIA                                 │
│     └── Measurable metrics per feature                  │
├─────────────────────────────────────────────────────────┤
│  5. TIMELINE                                            │
│     └── Phased 2-week sprints                           │
├─────────────────────────────────────────────────────────┤
│  6. REFERENCES                                          │
│     └── Cited sources with URLs                         │
├─────────────────────────────────────────────────────────┤
│  7. NEXT STEPS                                          │
│     └── Actionable options for user                     │
└─────────────────────────────────────────────────────────┘
```

---

**Last Updated**: 2026-01-12
**Version**: 1.0.0
