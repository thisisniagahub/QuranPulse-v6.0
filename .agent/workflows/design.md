---
description: Design-first workflow — generate UI mockups, pick components, build React. Use when creating new UI features or pages.
---

# /design — Design Pipeline 🎨

// turbo-all

Prompt → Mockup → Component Selection → React Implementation.

## Prerequisites
- User has described the UI they want
- Read `ui-ux-promax` and `magic-ui` skills for design patterns

## Workflow Steps

### Step 1: Capture Design Intent
Extract from user request:
- **Layout**: Dashboard? Landing? Form? Gallery?
- **Vibe**: Minimal? Glassmorphism? Neon? Corporate?
- **Platform**: Desktop? Mobile? Responsive?
- **Reference**: Any examples or inspiration?

### Step 2: Generate Mockup
Choose the best design tool:

**Option A: Stitch (AI-generated screens)**
```
mcp_stitch_create_project → title: "<project name>"
mcp_stitch_generate_screen_from_text → prompt: "<detailed UI description>"
```
Wait for generation. Review `output_components` for suggestions.

**Option B: Image Generation**
```
generate_image → Prompt: "Modern web UI design for <description>, 
dark mode, glassmorphism, minimal, professional"
```

**Option C: Shadcn Components (skip mockup)**
```
mcp_shadcn-ui_list-components    → Browse available
mcp_shadcn-ui_get-component-docs → Read API/usage
```

### Step 3: Component Selection
Map design to Shadcn components:
```
Headers       → NavigationMenu, Sheet
Cards         → Card, HoverCard
Forms         → Input, Select, Checkbox, RadioGroup
Tables        → Table, DataTable
Modals        → Dialog, AlertDialog, Drawer
Charts        → Chart (Recharts wrapper)
Navigation    → Tabs, Breadcrumb, Sidebar
Feedback      → Toast, Alert, Skeleton
```

Install selected components:
```
mcp_shadcn-ui_install-component → component: "card"
mcp_shadcn-ui_install-component → component: "dialog"
```

### Step 4: Implement Components
Build in this order:
1. **Layout shell** — Page container, grid/flex structure
2. **Static content** — Text, headings, badges
3. **Interactive elements** — Buttons, inputs, modals
4. **Data display** — Tables, charts, cards
5. **Animations** — Framer Motion (read `framer-animations` skill)

### Step 5: Visual Verification
Screenshot the result:
```
browser_subagent → navigate to localhost → screenshot
```

Compare with original design intent.
If gaps found → iterate.

### Step 6: Present to User
Show:
- 📸 Screenshot of implemented design
- 🧩 Components used
- 🎨 Color palette / theme applied

## Shadcn Block Shortcuts
For full-page layouts:
```
mcp_shadcn-ui_list-blocks       → Browse page templates
mcp_shadcn-ui_get-block-docs    → Get block details
mcp_shadcn-ui_install-blocks    → Install full page template
```

## Example Trigger
```
User: "design dashboard untuk analytics"
Agent: [Stitch mockup] → [pick Card, Chart, Table] → [implement] → [screenshot ✅]
```
