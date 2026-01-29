landing.md

# Agent Safety Check

## The PR check that stops unsafe agent changes before they ship.

**Agent configs are production code.**  
When an agent gains a new tool, loses a guardrail, or can suddenly send data externally — that’s a security incident waiting to happen.

**Agent Safety Check** runs on every pull request and answers one question:

> “Is this agent change safe to merge?”

**✅ GitHub Check + risk grade + policy diff + test report.**  
**🚫 Block merges on critical issues (optional).**

---

## Why this exists

Enterprises aren’t rejecting agents because models are bad.  
They’re rejecting agents because **they can’t control them**.

Common failure modes:

- A PR adds a **high-risk tool** (refund, delete, approve) with no approval gate
- Policies accidentally allow **external domains** (exfil risk)
- Budget caps removed → agent loops → **runaway cost**
- Hidden instructions / prompt injection patterns slip into agent inputs

Teams need guardrails that are:

- **deterministic** (not “LLM decides if it’s safe”)
- **auditable**
- **CI-native** (show up in PRs like any other check)

---

## What Agent Safety Check does (MVP)

### 1) Detects risky changes in agent manifests

We scan agent config files (YAML/JSON), for example:

- `agents/**.yaml`
- `agents/**.json`

We compute a **permission diff**:

- tools added/removed
- risk levels changed
- gating policies removed
- budgets increased
- egress rules relaxed

### 2) Runs an Agent Safety Test Suite

A small, fast suite that checks:

- **prompt injection attempts**
- **data exfil attempts**
- **high-risk tool abuse attempts**
- **runaway loop/cost guardrails**
- **policy bypass attempts**

### 3) Posts results directly on the PR

- ✅/❌ GitHub Check status
- Risk grade (A–F)
- Top findings + how to fix
- Link to a shareable report

---

## The “viral” demo (60 seconds)

1. Open a PR that relaxes a policy or adds a risky tool
2. Agent Safety Check posts:

- “High-risk tool added without approval gate”
- “External domains now allowed”
- “Budget caps increased 5×”
- “Injection test fails: agent would execute unsafe action”

3. Fix the manifest → check turns green.

**It’s instantly understandable to devs, security, and leadership.**

---

## Example output (what you’ll see on a PR)

### ✅ Agent Safety Check — Grade: B

**Findings**

- ⚠️ Added tool: `jira.createTicket` (low risk)
- ⚠️ Increased `maxToolCalls` from 6 → 10 (watch cost)

**Tests**

- ✅ Injection: pass
- ✅ Exfil: pass
- ✅ Tool abuse: pass
- ✅ Runaway: pass

---

### ❌ Agent Safety Check — Grade: F

**Critical Findings**

- 🚨 Added tool: `payments.refund` (high risk) without approval gate
- 🚨 `denyExternalDomains` removed (exfil risk)

**Failed Tests**

- ❌ Exfil attempt not blocked
- ❌ Tool abuse attempt not gated

---

## How it works

**Install GitHub App → choose repos → done.**

On PR open/update:

1. We fetch the changed files list
2. Parse agent manifests (base vs head)
3. Run static rules + test suite
4. Post GitHub Check + PR comment
5. Generate a report (HTML/JSON)

No repo indexing. No “read your entire codebase.”
Just agent configs + deterministic checks.

---

## What we scan (Agent Manifest)

Minimal supported manifest fields:

- model info (optional)
- tool list + risk level
- policies
- budgets

Example:

```yaml
name: support-agent
tools:
  - id: jira.createTicket
    risk: low
  - id: zendesk.refund
    risk: high
policies:
  allowTools: ["jira.createTicket","zendesk.refund"]
  gateRiskLevels: ["high"]
  denyExternalDomains: ["*"]
  maxToolCalls: 8
  maxTokens: 8000

Security & privacy

We do not need your full codebase.
We only store:

the agent manifest(s) under scan

findings + test outcomes

report artifacts (optional retention)

Reports can be:

private (default)

public share links (demo org only)

Pricing (simple)
Free

1 repo

baseline rules + baseline suite

PR check + summary

Pro

unlimited repos (per org pricing)

custom rules (your policies)

report retention + badge

Slack notifications (optional)

Enterprise

SSO / SCIM

org-wide policies

longer retention

dedicated support

Want early access pricing? Install and ping us.

Quick start

Install the GitHub App

Add agents/*.yaml (or point us to your folder)

Open a PR that changes a tool/policy

Watch the check run

FAQ
Is this a code review tool?

No. We don’t review your application code.
We scan agent configs for security + governance risks.

Do you call an LLM to judge safety?

MVP: No. Checks are deterministic rules + deterministic tests.
(Optionally later: “dynamic evaluation mode” for deeper analysis.)

Will this block merges?

Optional. You can run in:

Monitor mode (reports only)

Enforce mode (fail check on critical issues)

Can it work with any agent framework?

Yes. If you can represent your agent’s tools/policies in a manifest, we can scan it.

CTA
Install Agent Safety Check

Get a safety grade on your agents in the next PR.

[Install the GitHub App]
[View Demo Repo]
[See Sample Report]


If you want, I can also write:
- a **GitHub Marketplace listing description** (short + compliant)
- the **demo repo structure** (3 vulnerable manifests + expected outputs)
- 2 viral scripts for 45-second demo videos (screen-record ready)
```
