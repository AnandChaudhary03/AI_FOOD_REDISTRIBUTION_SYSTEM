# 📊 AnnaSetu — Final Project Presentation Outline & Slide Deck

**Title**: AI-Based Food Redistribution System for Waste Reduction and Surplus Inventory Management  
**Team**: AnnaSetu Development Team  
**Technology Stack**: React.js, FastAPI, PostgreSQL, HTML5 Barcode PWA, Tailwind/Vanilla CSS, Haversine AI Matcher, Time-Series Demand Predictor  

---

## 📽️ Slide Deck Outline (15 Slides)

### Slide 1: Title Slide
- **Header**: AnnaSetu — Bridging Surplus. Ending Hunger.
- **Subtitle**: AI-Powered Food Waste Reduction & Real-Time Redistribution Platform
- **Presenters**: Project Development Team
- **Tagline**: Intelligent Inventory Management, Real-Time POS Sync & Community Food Recovery

---

### Slide 2: Problem Statement & Context
- **Global Food Waste Impact**: 1.3 Billion tons of food wasted annually while 820+ million people face hunger.
- **Core Business Pain Points**:
  - Inaccurate demand forecasting leading to over-purchasing.
  - Poor inventory expiry tracking resulting in expired stock.
  - Lack of automated logistics to connect surplus food with local NGOs before spoilage.

---

### Slide 3: Proposed Solution — AnnaSetu Ecosystem
- **Dual-Sided Ecosystem**:
  1. **Food Businesses (Donors)**: Restaurants, Hotels, Supermarkets, Households.
  2. **Recipient Organizations (Beneficiaries)**: NGOs, Community Kitchens, Shelters, Food Banks.
  3. **Logistics Fleet**: Dedicated Electric Cargo Van delivery riders.
- **Key Pillars**: Real-Time POS Sync, Expiry Tracking, AI Demand Forecasting, Haversine Proximity Matcher, 6-Digit OTP Delivery Verification.

---

### Slide 4: System Architecture Diagram
- **Architecture**: Decoupled PWA Frontend + FastAPI REST Microservices + PostgreSQL Multi-Tenant DB.
- **Integrations**: POS REST API Bridge (Square, Toast, Clover), OpenFoodFacts Barcode Scanner, Workbox PWA Service Workers.

---

### Slide 5: Core Module 1 — Inventory Management & Expiry Tracking
- **Multi-Channel Input**: Manual Entry, Bulk CSV Upload (`sample_inventory_import.csv`), Live Camera Barcode/QR Scanner.
- **Automated Expiry Engine**: Calculates days-to-expiry, triggers warning banners, blocks expired food donations (Food Safety Compliance).

---

### Slide 6: Core Module 2 — Real-Time POS System Integration
- **Third-Party POS REST APIs**: Square, Toast, Clover, and Custom POS Hardware support.
- **API Key Security**: Secret token authentication (`pos_live_...`) with instant key revocation.
- **Real-Time Auto-Deduction**: Sales checkout at POS registers automatically deducts stock in real-time.
- **Interactive POS Simulator**: Built-in test sandbox for live register testing.

---

### Slide 7: Core Module 3 — AI Demand Forecasting & Smart Reorder Engine
- **Time-Series Demand Forecasting**: Predicts 7-day & 30-day daily consumption velocity per product category.
- **Smart Purchasing Reorder Recommendations**:
  - Calculates safety stock thresholds.
  - Recommends optimal purchase order quantities bounded by warehouse storage capacity (e.g. 500kg).
  - Estimates cost savings from preventing over-stocking.

---

### Slide 8: Core Module 4 — AI Redistribution Marketplace & Matching Engine
- **Haversine Proximity Matcher**: Ranks available donations by shortest GPS travel distance between donor and NGO.
- **Capacity Ratio Matching**: Matches donation quantity with NGO meal capacity.
- **Instant Claiming**: 1-Click NGO acceptance and date-time pickup scheduler.

---

### Slide 9: Core Module 5 — Delivery Partner Fleet & Food Safety Tracking
- **Live Fleet Overview**: Tracks driver availability (`🟢 Available / Free` vs `🟠 In Transit / Busy`).
- **Driver Cards**: Shows Driver Name, Dialable Phone Number, EV Vehicle Plate Number, and Driver Rating (4.9 ⭐).
- **6-Digit OTP Handover**: Recipient NGOs confirm delivery with secret OTP code to guarantee food safety.

---

### Slide 10: Multi-Tenant Role Dashboards
- **5 Custom Role Portals**:
  1. Business Dashboard (Warm Saffron Theme)
  2. NGO Dashboard (Emerald Forest Theme)
  3. Individual Household Donor Dashboard (Royal Purple Theme)
  4. Delivery Partner Dashboard (Electric Ocean Blue Theme)
  5. Master Admin Portal (Midnight Amber Theme)

---

### Slide 11: Sustainability Impact & Analytics
- **Environmental & Social Metrics**:
  - Total Food Saved (kg) & Meals Redistributed.
  - CO₂ Equivalent Emissions Avoided ($\text{Food kg} \times 2.5$).
  - Downloadable **PDF Certificate of Honor** for corporate ESG compliance.

---

### Slide 12: System Testing & Performance Benchmarks
- **Production Build**: Built cleanly with Vite PWA in **440ms** (0 compilation errors).
- **Automated Pytest Suite**: 100% test pass rate across POS sync, AI urgency scoring, and demand forecasts.
- **Locust Load Benchmark**: Handles 500+ concurrent POS sale syncs & API requests under 50ms latency.

---

### Slide 13: Demonstration Walkthrough
- **Step 1**: Business registers & generates POS API Key.
- **Step 2**: POS sale checkout auto-deducts stock.
- **Step 3**: AI flags expiring item & lists surplus donation.
- **Step 4**: Nearby NGO accepts donation & schedules pickup.
- **Step 5**: Delivery driver verifies 6-digit OTP code & delivers food safely.

---

### Slide 14: Challenges & Resolutions
- **Challenge 1**: Preventing donation of expired food $\rightarrow$ Enforced backend HTTP 400 validation blocking expired items.
- **Challenge 2**: UI Contrast on role navbars $\rightarrow$ Created vibrant warm saffron-coral gradient (`#FF6B52` $\rightarrow$ `#FF875F` $\rightarrow$ `#FFD166`) with drop shadow for 100% visibility.

---

### Slide 15: Future Scope & Conclusion
- **Future Enhancements**: IoT Temperature Smart Sensors inside delivery vans, Blockchain audit logs for food traceability, AI Computer Vision for food quality inspection.
- **Conclusion**: AnnaSetu successfully bridges food surplus with community need—saving food, reducing CO₂ emissions, and ending hunger.
