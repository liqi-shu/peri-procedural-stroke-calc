# Brown Peri-procedural Stroke Risk Assessment Tool

## Overview

An evidence-based web calculator for predicting peri-procedural stroke risk in surgical patients. Implements a validated logistic regression model derived from multicenter clinical data (n=255,850).

## Features

- **Real-time risk calculation** with 95% confidence intervals
- **Evidence-based clinical recommendations** based on risk stratification
- **Responsive design** for desktop, tablet, and mobile use
- **No dependencies** - pure HTML/CSS/JavaScript
- **Offline capable** after initial load

## Usage

1. Enter patient age (18-120 years)
2. Select applicable medical conditions
3. Choose surgery setting and procedure category
4. Review calculated risk and clinical recommendations

## Risk Categories

- **Low Risk (< 1%)**: Standard monitoring appropriate
- **Moderate Risk (1-5%)**: Enhanced monitoring recommended  
- **High Risk (≥ 5%)**: Intensive monitoring required

## Model Details

**Sample Size**: 255,850 patients  
**Model Type**: Multivariable logistic regression  
**Reference Groups**: Ambulatory Surgery, General Surgery  

### Key Predictors
- Age (continuous)
- Medical conditions: diabetes, hypertension, stroke history, carotid stenosis, intracranial atherosclerosis, atrial fibrillation
- Surgery setting: ambulatory, emergency/inpatient, outpatient clinic
- Procedure category: 9 specialty groups (transplant surgery removed)

## Technical Implementation

### Files
- `index.html` - Main interface
- `app.js` - Calculation engine with updated coefficients
- `style.css` - Styling
- `README.md` - Documentation

### Current Model Coefficients
```javascript
const coefs = {
  intercept:          -8.251679,
  ProcAge:             0.0186463,
  t2_diabetes:         0.210143,
  hypertension:        0.3965528,
  history_stroke:      1.510622,
  carotid_stenosis:    0.7539576,
  intracranial_athero: 1.076393,
  afib:                0.265985,
  pc1:                 1.481849,    // Emergency/Inpatient Surgery
  pc2:                -0.4181883,   // Outpatient Clinic
  pg3:                -0.0084477,   // Orthopedic & Plastic Surgery
  pg4:                 1.339401,    // Neurosurgery
  pg5:                 1.162026,    // Cardiovascular Surgery
  pg6:                 0.1828371,   // Thoracic Surgery
  pg7:                 0.0156524,   // Head & Neck Surgery
  pg8:                 0.0736675,   // OB-GYN Surgery
  pg9:                 0.5209588,   // Urologic Surgery
  pg10:                0.4328439    // Non-cardiac Medical Subspecialties
};
```

## Deployment

**Local**: Open `index.html` in any modern browser  
**Institutional**: Deploy on hospital intranet or integrate with EHR systems  
**Web**: Host on GitHub Pages, cloud platforms, or medical education sites

## Limitations

- Clinical judgment should not be replaced by calculator results
- Results should be interpreted in context of individual patient circumstances
- Model may not capture all relevant clinical factors
- Requires JavaScript-enabled browser

## Citation

**Primary Research**: Shu L, et al. A Multicenter Peri-procedural Stroke Risk Model. [Journal Name]. [Year].

---

**Disclaimer**: This calculator is for educational and clinical decision support only. It should not replace professional medical judgment. Always consider individual patient circumstances and consult appropriate healthcare providers.

**Version**: 1.0.0  
**Last Updated**: 08/07/2025  
**Institution**: Brown University Medical School 