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

## Citation (placeholder)

Shu L, *et al.* Development and validation of an EHR‑derived model for 30‑day peri‑procedural ischemic stroke. **\[Journal / Year TBD]**. PMID: **TBD**. 