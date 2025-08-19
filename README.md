# Brown Peri‑procedural Stroke Risk Assessment Tool

> **Version:** 1.1.0
> **Last Updated:** 2025‑08‑18

An evidence‑based web calculator for estimating **30‑day peri‑procedural ischemic stroke risk** using a multivariable logistic regression model derived from a large multicenter cohort (n=255,850).

---

## Quick Start

1. Open `index.html` in any modern browser.
2. Enter patient age (18–120 years).
3. Check applicable comorbidities.
4. Choose the procedure **Setting** and **Category**.
5. Read the **predicted risk (%)** and **95% CI**.

> **Intended Use**: Clinical decision support for licensed clinicians; not a substitute for clinical judgment.

---

## Features (current)

* Real‑time risk calculation with **95% confidence intervals (delta‑method; diagonal SEs)**.
* Clean, responsive UI (desktop, tablet, mobile) with **color‑coded risk tiers**.
* Pure **HTML/CSS/JavaScript**; no external dependencies.

> **Removed (until implemented):** "Offline capable" and automatic "clinical recommendations" text output. See **Roadmap**.

---

## Model

* **Type:** Multivariable logistic regression
* **Reference Groups:** Ambulatory Surgery (setting), General Surgery (procedure category)
* **Predictors:**

  * Age (continuous)
  * Comorbidities: Type 2 diabetes, hypertension, prior stroke, carotid stenosis, intracranial atherosclerosis, atrial fibrillation
  * Settings (dummy‑coded vs reference): Emergency/Inpatient, Outpatient Clinic
  * Procedure categories (dummy‑coded vs reference): Orthopedic & Plastic, Neurosurgery, Cardiovascular, Thoracic, Head & Neck, OB‑GYN, Urologic, Non‑cardiac medical subspecialties

### Encoding

* **Setting (****`patientClass`****)**: `0` = Ambulatory (ref), `1` = Emergency/Inpatient → `pc1=1`, `3` = Outpatient Clinic → `pc2=1`.
* **Procedure (****`procGroup`****)**: `1` = General (ref), `3–10` = specialty dummies as listed above.

### Formula

* Linear predictor: $\eta = \beta_0 + \sum_k \beta_k x_k$.
* Probability: $p = 1/(1+e^{-\eta})$.
* 95% CI via delta‑method on $\eta$ using **diagonal** variance approximation, then transformed back to probability.

> The coefficients and standard errors are embedded in `app.js` and can be version‑controlled alongside this README.

---

## Risk Tiers (UI)

* **Low**: < **1%** (green)
* **Moderate**: **1–5%** (amber)
* **High**: ≥ **5%** (red)

These tiers drive the result panel's color only; they **do not** auto‑generate prescriptive recommendations.

---

## Repository Structure

* `index.html` – Web UI scaffolding and accessibility hooks
* `app.js` – Calculation engine (coefficients, SEs, CI logic)
* `style.css` – Layout, theming, and responsive styles
* `README.md` – This document

---

## Validation & Limitations

* Developed and internally validated within a single health system; calibration may vary at external sites.
* CI uses a **diagonal‑only** variance approximation (no covariance terms)—a conservative simplification.
* Not intended for pediatrics, pregnancy, emergency decision‑making, or procedures outside the listed categories.
* Input range currently limited to ages 18–120.

---

## Versioning

* **1.1.0 (2025‑08‑18)**

  * Clarified **what's implemented now** vs **roadmap** (removed "offline" and auto‑recommendations claims until shipped)
  * Documented CI method and predictor encodings
  * Added Known Limitations and Versioning/Changelog
* **1.0.0 (2025‑08‑07)**

  * Initial public README with coefficients and basic usage

---

## Roadmap / TODO

* **Clinical guidance block**: render tier‑specific guidance (the CSS hooks exist) driven by a clearly documented ruleset.
* **Offline support**: add Web App Manifest + Service Worker with an explicit cache strategy; re‑add the "offline capable" claim once shipped.
* **Consistency**: surface `version` and `lastUpdated` in the UI footer; centralize metadata in one source of truth.
* **Unit tests**: add coefficient smoke tests and CI bounds tests.
* **Accessibility**: shortcut links, high‑contrast audit, and keyboard trap checks for details/summary.

---

## Deployment

* **Local**: open `index.html` in a modern browser
* **Institutional**: host on an intranet or embed within an EHR wrapper (ensure content security policy permits inline resources)
* **Public web**: static hosting (e.g., GitHub Pages or any static CDN)

---

## Citation (placeholder)

Shu L, *et al.* Development and validation of an EHR‑derived model for 30‑day peri‑procedural ischemic stroke. **\[Journal / Year TBD]**. PMID: **TBD**. 