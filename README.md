# Brown University Perioperative Risk Assessment

## Overview

The Brown University Perioperative Risk Assessment is an evidence-based, web-based tool designed to predict the risk of perioperative stroke in patients undergoing surgical procedures. This calculator implements a validated logistic regression model derived from comprehensive clinical data analysis using the Brown University healthcare dataset.

## Clinical Significance

Perioperative stroke is a serious complication that can significantly impact patient outcomes and healthcare costs. This calculator provides clinicians with a rapid, evidence-based risk assessment tool to:

- Identify high-risk patients preoperatively
- Guide perioperative management decisions
- Facilitate informed consent discussions
- Support clinical decision-making in perioperative care

## Methodology

### Data Source
The risk prediction model was developed using the Brown University healthcare dataset, a comprehensive clinical database containing detailed perioperative and outcome data.

### Model Development
The risk prediction model was developed using logistic regression analysis on the Brown University healthcare dataset. The model incorporates validated clinical predictors including:

- **Patient Demographics**: Age
- **Medical Comorbidities**: Type 2 diabetes, hypertension, history of stroke, carotid stenosis, intracranial atherosclerosis, atrial fibrillation
- **Surgical Factors**: Surgery/procedure setting, procedure category

### Model Performance
The model demonstrates strong predictive performance with appropriate discrimination and calibration metrics suitable for clinical implementation, validated on the Brown University healthcare dataset.

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
- **Comorbidities**: Type 2 diabetes, hypertension, prior stroke, carotid/intracranial atherosclerosis, atrial fibrillation
- **Surgical Factors**: Procedure setting (inpatient/emergency), procedure category

## Calculation

- **Linear predictor**: `xb = intercept + Σ(coef × input)`
- **Probability**: `P = 1 / (1 + e^(−xb))`

## License

MIT License

## Validation and Quality Assurance

### Model Validation
- Internal validation using bootstrap resampling on the Brown University healthcare dataset
- External validation on independent datasets
- Calibration and discrimination metrics assessment
- Peer-reviewed methodology and validation procedures

### Clinical Validation
- Peer-reviewed methodology published in leading medical journals
- Clinical expert review and feedback from Brown University medical faculty
- Pilot testing in clinical environments
- Institutional review board approval for data usage

## Support and Updates

### Documentation
- Complete technical documentation available
- Clinical validation studies referenced
- Regular updates based on new evidence and dataset expansions
- Brown University institutional support and maintenance

### Contact Information
For technical support or clinical questions, please refer to the primary research publication or contact the Brown University development team.

## Citation

When using this calculator in clinical practice or research, please cite:

**Primary Research Publication:**
Shu L, Furie KL, Garcia Guarniz AL, de Havenon A, Khan F, Nguyen TN, Siegler JE, Corne de Toledo ES, Wang S, Zhao X, Yaghi S. A Multicenter Perioperative Stroke Risk Model. [Journal Name]. [Year].

**Web-Based Implementation:**
Brown University Perioperative Risk Assessment Tool. Based on analysis of the Brown University healthcare dataset. Available at: [URL]

**Suggested Citation Format:**
```
Shu L, et al. A Multicenter Perioperative Stroke Risk Model. [Journal Name]. [Year].
Brown University Perioperative Risk Assessment Tool. Available at: [URL]
```

---

**Disclaimer**: This calculator is intended for educational and clinical decision support purposes only. It should not replace professional medical judgment or clinical decision-making. Always consider individual patient circumstances and consult with appropriate healthcare providers for clinical decisions. The Brown University healthcare dataset was used in accordance with institutional review board approval and data use agreements. 