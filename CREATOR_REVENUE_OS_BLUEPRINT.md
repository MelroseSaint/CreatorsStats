# Creator Revenue OS — Frontend-Only SaaS Blueprint

## 1) Core Product Overview

**Creator Revenue OS** is a client-side operating dashboard for independent musicians and YouTube creators to plan, price, and forecast monetization decisions without spreadsheets.

It provides five decision tools:
1. Sponsorship pricing
2. Revenue projection
3. Growth tracking
4. Release planning
5. Goal/milestone forecasting

Creators pay monthly because it replaces recurring operational planning work:
- Weekly sponsor pricing updates
- Monthly income forecasting across ad/sponsor/music/affiliate streams
- Ongoing milestone and release decision-making
- Progress tracking against revenue and audience goals

Commercial value is **faster pricing decisions**, **better negotiation anchors**, and **clearer monthly planning**.

---

## 2) Feature Set (Frontend Only)

All computations run in-browser (React + plain JavaScript math). Data persists in `localStorage` (or IndexedDB if volume grows).

### A. Sponsorship Rate Calculator

#### Required Inputs
- Platform (`youtube` | `instagram` | `tiktok` | `newsletter`)
- Followers/subscribers (`audienceSize`)
- Avg views per post/video (`avgViews`)
- Avg engagement rate % (`engagementRate`)
- Niche multiplier (`nicheMult`) e.g. finance 1.35, gaming 1.1, music 1.0
- Content format (`integrationType`) e.g. mention, mid-roll, dedicated
- Deliverables count (`deliverables`)
- Usage rights months (`usageMonths`)
- Whitelisting/ad usage (`whitelisting`: boolean)
- Seasonality multiplier (`seasonMult`) e.g. Q4 = 1.2

#### Formulas
1. `baseCPM` by platform:
   - YouTube: 22
   - Instagram: 18
   - TikTok: 16
   - Newsletter: 28

2. Engagement factor:
   - `engagementFactor = clamp(0.75, 1.35, 1 + ((engagementRate - benchmarkER) / benchmarkER) * 0.5)`
   - Benchmarks: YouTube 4%, Instagram 3%, TikTok 5%, Newsletter 6%

3. Integration multiplier:
   - mention 0.7, mid-roll 1.0, dedicated 1.4

4. Core rate:
   - `coreRate = (avgViews / 1000) * baseCPM * nicheMult * engagementFactor * integrationMult`

5. Deliverable adjustment:
   - `deliverableFactor = 1 + (deliverables - 1) * 0.85`

6. Rights and whitelisting:
   - `rightsFee = coreRate * 0.15 * usageMonths`
   - `whitelistingFee = whitelisting ? coreRate * 0.3 : 0`

7. Final quote:
   - `finalRate = (coreRate * deliverableFactor + rightsFee + whitelistingFee) * seasonMult`

#### Outputs
- Recommended quote (single campaign)
- Low / target / high range:
  - `low = finalRate * 0.85`
  - `target = finalRate`
  - `high = finalRate * 1.2`
- Effective CPM implied by quote

#### Recurring Usage Driver
Sponsor pricing must be refreshed per campaign, season, and audience performance changes.

---

### B. Revenue Projection Calculator

#### Required Inputs
- Current monthly views (`monthlyViews`)
- Ad RPM (`adRPM`)
- Uploads per month (`uploadsPerMonth`)
- Sponsor deals per month (`sponsorDeals`)
- Avg sponsor fee (`avgSponsorFee`)
- Affiliate conversion rate (`affiliateCVR`)
- Affiliate clicks per month (`affiliateClicks`)
- Avg affiliate payout (`affiliatePayout`)
- Music streams per month (`streams`)
- Streaming payout per stream (`streamPayout` default 0.0035)
- Membership revenue per month (`membershipRevenue`)
- Growth assumption per month % (`growthPct`)
- Projection horizon months (`months`)

#### Formulas
For month `m` (starting at 0):
- `growthFactor_m = (1 + growthPct/100) ^ m`
- `views_m = monthlyViews * growthFactor_m`
- `adRevenue_m = (views_m / 1000) * adRPM`
- `sponsorRevenue_m = sponsorDeals * avgSponsorFee * growthFactor_m * 0.6 + sponsorDeals * avgSponsorFee * 0.4`
- `affiliateRevenue_m = affiliateClicks * growthFactor_m * affiliateCVR * affiliatePayout`
- `musicRevenue_m = streams * growthFactor_m * streamPayout`
- `total_m = adRevenue_m + sponsorRevenue_m + affiliateRevenue_m + musicRevenue_m + membershipRevenue`

Aggregate:
- `projectedTotal = Σ total_m`
- `avgMonthlyRevenue = projectedTotal / months`

#### Outputs
- Month-by-month revenue table
- Revenue breakdown by stream
- Cumulative projection curve

#### Recurring Usage Driver
Creators reforecast monthly after analytics updates, pricing changes, and seasonality shifts.

---

### C. Growth Tracker

#### Required Inputs
- Time series entries by date:
  - Subscribers/followers
  - Monthly views
  - Watch hours (optional)
  - Email list size (optional)
  - Revenue

#### Formulas
For metric `x` between current period `t` and prior `t-1`:
- `absChange = x_t - x_(t-1)`
- `pctChange = x_(t-1) > 0 ? ((x_t - x_(t-1))/x_(t-1))*100 : 0`

Compound monthly growth rate (CMGR) across `n` months:
- `cmgr = ((x_end / x_start) ^ (1/n) - 1) * 100`

3-period moving average:
- `ma3_t = (x_t + x_(t-1) + x_(t-2)) / 3`

#### Outputs
- KPI cards: current, MoM %, CMGR
- Trend sparkline per metric
- Momentum labels: accelerating / flat / declining based on MA slope

#### Recurring Usage Driver
Weekly/monthly check-ins for performance management and sponsor deck updates.

---

### D. Release Planner

#### Required Inputs
- Release type (single/video/EP/course)
- Planned release date
- Production lead time days
- Promo runway days
- Number of assets required (teasers, shorts, emails, posts)
- Capacity per week (assets creator can produce)

#### Formulas
- `totalAssets = teaserCount + shortsCount + emailCount + postCount`
- `requiredWeeks = ceil(totalAssets / capacityPerWeek)`
- `requiredDays = requiredWeeks * 7`
- `latestStartDate = releaseDate - max(productionLeadTimeDays + promoRunwayDays, requiredDays)`

Risk flag:
- `scheduleRisk = daysUntilRelease < max(productionLeadTimeDays + promoRunwayDays, requiredDays)`

#### Outputs
- Backward timeline milestones
- Feasibility indicator (on track / at risk)
- Weekly production targets

#### Recurring Usage Driver
Each new release cycle needs revised timeline planning and capacity balancing.

---

### E. Goal & Milestone Forecasting

#### Required Inputs
- Current value (`currentMetric`) e.g. subscribers, monthly revenue
- Goal value (`goalMetric`)
- Baseline monthly growth % (`baseGrowthPct`)
- Planned uplift actions count (`actionsCount`)
- Uplift per action % (`upliftPerActionPct`)
- Confidence factor (`confidence`: 0.7–1.2)

#### Formulas
- `effectiveGrowthPct = (baseGrowthPct + actionsCount * upliftPerActionPct) * confidence`
- `effectiveGrowth = effectiveGrowthPct / 100`

Months to goal (if growth > 0):
- `monthsToGoal = ceil( ln(goalMetric/currentMetric) / ln(1 + effectiveGrowth) )`

Projected date:
- `goalDate = addMonths(today, monthsToGoal)`

#### Outputs
- Forecasted months to target
- Goal hit date
- Scenario comparison (conservative/base/aggressive)

#### Recurring Usage Driver
Creators revisit targets monthly and evaluate whether planned actions are sufficient.

---

## 3) Mathematical Models (Implementation Notes)

Use deterministic formulas only, no external APIs.

- `clamp(min, max, v) = Math.max(min, Math.min(max, v))`
- Power and logs via `Math.pow`, `Math.log`
- Currency rounding:
  - `round2 = (n) => Math.round(n * 100) / 100`
- Defensive guards:
  - divide-by-zero checks
  - null/empty input defaults

All models are lightweight and stable for plain JavaScript execution.

---

## 4) Data Persistence Design

### Storage Approach
- Use `localStorage` for MVP simplicity.
- Optional switch to IndexedDB for heavy time-series history.

### Object Structure

```json
{
  "version": "1.0.0",
  "user": {
    "plan": "free",
    "email": null,
    "createdAt": "ISO_DATE"
  },
  "inputs": {
    "sponsorship": {},
    "projection": {},
    "releasePlanner": {},
    "goals": {}
  },
  "history": {
    "growthSnapshots": []
  },
  "ui": {
    "theme": "dark",
    "lastVisitedModule": "dashboard"
  },
  "license": {
    "unlock": false,
    "unlockSource": null,
    "updatedAt": null
  }
}
```

Keys:
- `cro_state_v1` main state
- `cro_backup_meta` last export/import metadata

### Export / Import
- Export button:
  - `JSON.stringify(state)`
  - download as `creator-revenue-os-backup-YYYY-MM-DD.json`
- Import button:
  - read JSON file
  - schema validate required top-level keys
  - run migration function before replacing state

### Safe Version Updates
- `state.version` checked on app load
- If older version:
  1. run `migrateState(oldState)`
  2. preserve unknown keys
  3. write migrated state atomically
- Keep a pre-migration backup key `cro_state_v1_backup_TIMESTAMP`

---

## 5) Subscription Gating Model (No Backend Verification)

### Flow
1. User clicks Upgrade.
2. Frontend opens Stripe Checkout Payment Link.
3. On success, Stripe redirects to `/app?checkout=success&plan=pro`.
4. Client shows unlock screen and requests email + transaction reference input.
5. App stores `license.unlock = true` in localStorage and unlocks Pro modules.

### Pro Feature Gating (Client-Side)
- Route guards check `state.license.unlock`.
- Free users:
  - limited scenarios
  - limited saved history
  - no export/import or advanced forecast scenarios

### Risk Tradeoffs
- No backend verification means unlock can be spoofed by technical users.
- Suitable for early MVP where speed > strict enforcement.

### Abuse Reduction Without Backend
- Obfuscate unlock flags (not secure, just friction).
- Tie unlock to hashed email + install fingerprint in localStorage.
- Soft checks: periodic reminder modal if no purchase reference stored.
- Feature throttles still preserve value for honest buyers.

### Upgrade Path to Proper Validation
Later add serverless verification:
- Stripe webhook -> store active subscription
- JWT/session-based entitlement check
- Replace local unlock with signed token verification

---

## 6) UI/UX Structure

### Visual System (Provided Palette)
- Background: `#0D0F14`
- Surface: `#161A22`
- Primary accent: `#18C29C`
- Secondary accent: `#F5B841`
- Text primary: `#F2F4F8`
- Text muted: `#8A94A6`

### Layout
- Left sidebar nav + top command bar
- Main dashboard grid (12-column responsive)
- Sticky KPI strip at top

### Navigation Flow
- `/` Landing + pricing + CTA
- `/checkout` redirect handler explanation
- `/app` Dashboard home
- `/app/sponsorship`
- `/app/projection`
- `/app/growth`
- `/app/release`
- `/app/goals`
- `/app/settings` (backup/import/theme/subscription)

### Dashboard Sections
1. Revenue snapshot
2. Growth momentum
3. Active milestones
4. Upcoming release timeline
5. Quick actions (new forecast, update metrics)

### Component Breakdown
- `AppShell`
- `SidebarNav`
- `KpiCard`
- `LineChart` (Recharts)
- `InputPanel`
- `ScenarioTabs`
- `ProjectionTable`
- `MilestoneTimeline`
- `PlanGate`

### Premium Experience Principles
- Dense but readable data hierarchy
- Default dark mode with high contrast accents
- Consistent spacing scale and card rhythm
- Minimize modal count; use slide-over panels

---

## 7) Monetization Plan

### Free Tier
- 1 saved scenario per module
- 3-month projection horizon
- Basic sponsorship quote only
- No export/import

### Starter Tier — **$12/month**
- Up to 10 saved scenarios/module
- 12-month projection
- Growth tracker history (12 months)
- Export JSON enabled

### Pro Tier — **$29/month**
- Unlimited scenarios
- 24-month projection + multi-scenario compare
- Advanced sponsorship adjustments (rights/whitelisting/seasonality)
- Goal forecasting scenarios (conservative/base/aggressive)
- Priority templates for release plans

### Why Pricing Works
- Comparable to one small spreadsheet automation subscription
- Value linked directly to pricing decisions and income planning
- Low enough for solo creators, high enough for viable MRR growth

---

## 8) 14-Day MVP Build Plan (React + Vercel + Stripe, No Backend)

### Day 1
- Product spec freeze, IA, wireframes, data schema.

### Day 2
- React app setup (Vite/Next static), routing, theme tokens, shell layout.

### Day 3
- State layer + localStorage persistence + migration utility.

### Day 4
- Sponsorship calculator UI + formulas + validation.

### Day 5
- Revenue projection module + chart/table outputs.

### Day 6
- Growth tracker module + CMGR/momentum logic.

### Day 7
- Release planner module + backward scheduling timeline.

### Day 8
- Goals forecasting module + scenario presets.

### Day 9
- Dashboard aggregation page + shared KPI components.

### Day 10
- Stripe Checkout integration (payment links) + redirect handling.

### Day 11
- Plan gating and locked-state UX + pricing page polish.

### Day 12
- Export/import JSON backup, settings page, version migration tests.

### Day 13
- QA pass: edge cases, mobile responsiveness, performance cleanup.

### Day 14
- Vercel deploy, analytics events, launch checklist.

---

## 9) Future Upgrade Path

### Phase 2: Authentication
- Add Auth (Clerk/Auth.js/Firebase Auth) for user identity.

### Phase 3: Cloud Sync
- Sync local state to managed DB (Postgres/Firestore) per user.

### Phase 4: Backend Validation
- Stripe webhooks + entitlement API
- Server-issued signed feature tokens

### Phase 5: Team Accounts
- Workspace model
- Shared dashboards/scenarios
- Role-based permissions

This preserves the MVP’s frontend velocity while enabling migration to durable SaaS infrastructure.
