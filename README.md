# Perioperative Stroke Risk Calculator

A static, accessible web tool to estimate perioperative ischemic stroke risk using a validated logistic regression model.

## Features

- **Evidence-Based**: Developed from multicenter data (2016–2024) with external validation 
- **Instant Results**: Live calculation of logit (xb) and stroke probability
- **Accessible**: WCAG-compliant, mobile-responsive, and offline-capable
- **Zero Dependencies**: Pure HTML/CSS/JS, no backend

## Usage

1. **Clone the repo**
   ```bash
   git clone https://github.com/<username>/perioperative-stroke-calc.git
   cd perioperative-stroke-calc
   ```
2. **Open locally**
   ```bash
   open index.html
   ```
3. **Deploy with GitHub Pages**
   - Push to `main`
   - Enable Pages under **Settings → Pages**

## Inputs

- **Age**, in years
- **Comorbidities**: Type 2 diabetes, hypertension, prior stroke, carotid/intracranial atherosclerosis, atrial fibrillation
- **Surgical Factors**: Procedure setting (inpatient/emergency), procedure category

## Calculation

- **Linear predictor**: `xb = intercept + Σ(coef × input)`
- **Probability**: `P = 1 / (1 + e^(−xb))`

## License

MIT License

## Citation

Shu L, et al. A Multicenter Perioperative Stroke Risk Model. 