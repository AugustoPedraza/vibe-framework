# Research Command

> `/vibe research [type]` - Market, domain, or technical research using BMAD workflows

## Purpose

Invoke BMAD's research workflows for:
- Market analysis (competitors, trends)
- Domain exploration (new problem spaces)
- Technical spikes (technology evaluation)

**Output:** Research document in `docs/planning/` or `_bmad-output/`

---

## Research Types

| Type | Purpose | When to Use |
|------|---------|-------------|
| `market` | Competitive analysis, industry trends | New product features, positioning |
| `domain` | Problem space exploration | Unfamiliar business domains |
| `technical` | Technology evaluation, spikes | Architecture decisions, new tools |

---

## Usage

```bash
# Market research
/vibe research market "real-time collaboration tools"

# Domain research
/vibe research domain "home service industry workflows"

# Technical research
/vibe research technical "Phoenix PubSub vs external message queue"
```

---

## Workflow

```
Define Scope -> Execute Research -> Synthesize -> Document -> Recommend
```

---

## Phase 1: Define Scope

```
+======================================================================+
|  RES DEFINING RESEARCH SCOPE                                          |
|  Type: [market | domain | technical]                                  |
+======================================================================+
```

### Market Research Scope

```
+---------------------------------------------------------------------+
|  MARKET RESEARCH SCOPE                                               |
|                                                                      |
|  Topic: {query}                                                      |
|                                                                      |
|  Research Questions:                                                 |
|    1. Who are the main competitors?                                  |
|    2. What features differentiate them?                              |
|    3. What are users saying (reviews, forums)?                       |
|    4. What trends are emerging?                                      |
|    5. Where are the gaps/opportunities?                              |
|                                                                      |
|  Refine questions or add more? [Enter to continue]                   |
+---------------------------------------------------------------------+
```

### Domain Research Scope

```
+---------------------------------------------------------------------+
|  DOMAIN RESEARCH SCOPE                                               |
|                                                                      |
|  Topic: {query}                                                      |
|                                                                      |
|  Research Questions:                                                 |
|    1. Who are the key stakeholders?                                  |
|    2. What are the core workflows?                                   |
|    3. What pain points exist?                                        |
|    4. What terminology is used?                                      |
|    5. What regulations/constraints apply?                            |
|                                                                      |
|  Refine questions or add more? [Enter to continue]                   |
+---------------------------------------------------------------------+
```

### Technical Research Scope

```
+---------------------------------------------------------------------+
|  TECHNICAL RESEARCH SCOPE                                            |
|                                                                      |
|  Topic: {query}                                                      |
|                                                                      |
|  Research Questions:                                                 |
|    1. What are the options/alternatives?                             |
|    2. What are the trade-offs?                                       |
|    3. What are performance characteristics?                          |
|    4. What's the learning curve/complexity?                          |
|    5. What does the community/support look like?                     |
|    6. How does it integrate with our stack?                          |
|                                                                      |
|  Refine questions or add more? [Enter to continue]                   |
+---------------------------------------------------------------------+
```

---

## Phase 2: Execute Research

```
+======================================================================+
|  RES EXECUTING RESEARCH                                               |
|  Gathering information...                                             |
+======================================================================+
```

### Research Methods

**Web Search:**
- Current articles, blog posts
- Documentation, official sources
- Community discussions (Reddit, HN, Discord)

**Competitive Analysis (market):**
- Feature comparison tables
- Pricing analysis
- User reviews and ratings

**Domain Analysis:**
- Industry reports
- Stakeholder interviews (simulated)
- Regulatory landscape

**Technical Evaluation:**
- Official documentation
- Benchmarks and comparisons
- GitHub activity, issue patterns

### Progress Display

```
+---------------------------------------------------------------------+
|  RESEARCH IN PROGRESS                                                |
|                                                                      |
|  [x] Searching web for relevant sources                              |
|  [x] Analyzing competitor products                                   |
|  [ ] Synthesizing findings                                           |
|  [ ] Generating recommendations                                      |
|                                                                      |
|  Sources found: 12                                                   |
|  Key insights: 5                                                     |
+---------------------------------------------------------------------+
```

---

## Phase 3: Synthesize Findings

```
+======================================================================+
|  RES SYNTHESIZING FINDINGS                                            |
|  Organizing research results                                          |
+======================================================================+
```

### Synthesis Output

```
+---------------------------------------------------------------------+
|  RESEARCH SYNTHESIS                                                  |
|                                                                      |
|  Key Findings:                                                       |
|    1. {Major finding 1}                                              |
|    2. {Major finding 2}                                              |
|    3. {Major finding 3}                                              |
|                                                                      |
|  Patterns Observed:                                                  |
|    * {Pattern 1}                                                     |
|    * {Pattern 2}                                                     |
|                                                                      |
|  Gaps/Opportunities:                                                 |
|    * {Gap 1}                                                         |
|    * {Gap 2}                                                         |
|                                                                      |
|  Feedback on synthesis? [Enter to continue]                          |
+---------------------------------------------------------------------+
```

---

## Phase 4: Generate Document

```
+======================================================================+
|  RES GENERATING RESEARCH DOCUMENT                                     |
|  Output: docs/planning/research/{topic}.md                            |
+======================================================================+
```

### Document Template

```markdown
# Research: {Topic}

**Type:** {market | domain | technical}
**Date:** {date}
**Author:** AI-assisted research

## Executive Summary

{2-3 sentence summary of key findings and recommendations}

## Research Questions

1. {Question 1}
2. {Question 2}
...

## Methodology

- Web search for {N} sources
- Analysis of {specific sources}
- Synthesis and pattern recognition

## Findings

### Finding 1: {Title}

{Detailed finding with evidence}

**Sources:** {links}

### Finding 2: {Title}

{Detailed finding with evidence}

**Sources:** {links}

...

## Analysis

### Patterns

{Patterns observed across findings}

### Gaps and Opportunities

{Identified gaps in market/domain/technology}

### Risks

{Potential risks identified}

## Recommendations

1. **{Recommendation 1}**
   - Rationale: {why}
   - Action: {what to do}

2. **{Recommendation 2}**
   - Rationale: {why}
   - Action: {what to do}

## Next Steps

1. {Suggested next step}
2. {Suggested next step}

## Sources

- {Source 1 with link}
- {Source 2 with link}
...
```

---

## Phase 5: Recommendations

```
+======================================================================+
|  RES RESEARCH COMPLETE                                                |
|  Recommendations for next steps                                       |
+======================================================================+
```

```
+---------------------------------------------------------------------+
|  RESEARCH COMPLETE                                                   |
|                                                                      |
|  Document: docs/planning/research/{topic}.md                         |
|                                                                      |
|  Top Recommendations:                                                |
|    1. {Recommendation}                                               |
|    2. {Recommendation}                                               |
|    3. {Recommendation}                                               |
|                                                                      |
|  Suggested Next Steps:                                               |
|    /vibe ux-design {feature} - If designing new feature              |
|    /vibe plan - If ready to plan implementation                      |
|    /vibe party - If need team discussion on findings                 |
|                                                                      |
|  Research document saved and ready for team review.                  |
+---------------------------------------------------------------------+
```

---

## Options

### `--quick`

Faster research with fewer sources:

```bash
/vibe research market "chat apps" --quick
```

### `--depth [shallow|medium|deep]`

Control research depth:

```bash
/vibe research technical "websockets" --depth deep
```

### `--output [path]`

Custom output location:

```bash
/vibe research domain "construction" --output _bmad-output/
```

---

## Integration

Research documents can inform:
- `/vibe ux-design` - UX decisions based on market research
- `/vibe plan` - Sprint planning based on domain understanding
- `/vibe party` - Team discussions about technical options

---

## Anti-Patterns

- Never skip scope definition (ensures focused research)
- Never present findings without sources (verify claims)
- Never make recommendations without evidence
- Never auto-implement based on research alone (requires human decision)
