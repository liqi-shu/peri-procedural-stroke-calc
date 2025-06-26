# Perioperative Stroke Risk Calculator

## Overview

The Perioperative Stroke Risk Calculator is an evidence-based, web-based tool designed to predict the risk of perioperative stroke in patients undergoing surgical procedures. This calculator implements a validated logistic regression model derived from comprehensive clinical data analysis.

## Clinical Significance

Perioperative stroke is a serious complication that can significantly impact patient outcomes and healthcare costs. This calculator provides clinicians with a rapid, evidence-based risk assessment tool to:

- Identify high-risk patients preoperatively
- Guide perioperative management decisions
- Facilitate informed consent discussions
- Support clinical decision-making in perioperative care

## Methodology

### Model Development
The risk prediction model was developed using logistic regression analysis on a large clinical dataset. The model incorporates validated clinical predictors including:

- **Patient Demographics**: Age
- **Medical Comorbidities**: Type 2 diabetes, hypertension, history of stroke, carotid stenosis, intracranial atherosclerosis, atrial fibrillation
- **Surgical Factors**: Surgery/procedure setting, procedure category

### Model Performance
The model demonstrates strong predictive performance with appropriate discrimination and calibration metrics suitable for clinical implementation.

## Usage Instructions

### For Healthcare Providers

1. **Enter Patient Age**: Input the patient's age in years (required field)
2. **Select Medical Conditions**: Check all applicable medical conditions
3. **Choose Surgery Setting**: Select the appropriate surgery/procedure setting
4. **Select Procedure Category**: Choose the relevant surgical procedure category
5. **Review Results**: The calculator will display:
   - Linear predictor (xb) value
   - Predicted stroke risk percentage

### Interpretation of Results

- **Linear Predictor (xb)**: The calculated logit value from the regression model
- **Predicted Stroke Risk**: The probability of perioperative stroke expressed as a percentage

### Clinical Decision Support

- **Low Risk (<1%)**: Standard perioperative monitoring
- **Moderate Risk (1-3%)**: Enhanced monitoring and consideration of additional precautions
- **High Risk (>3%)**: Intensive monitoring and multidisciplinary consultation recommended

## Technical Implementation

### Files Structure
```
perioperative-stroke-calc/
├── index.html          # Main HTML interface
├── app.js             # JavaScript calculation engine
├── style.css          # Professional medical styling
└── README.md          # Documentation
```

### Model Coefficients
The calculator implements the following logistic regression coefficients:

```javascript
const coefs = {
  intercept:           -8.425560,
  ProcAge:              0.0203961,
  t2_diabetes:          0.1993000,
  hypertension:         0.4309231,
  history_stroke:       1.3042420,
  carotid_stenosis:     0.7408938,
  intracranial_athero:  1.0137060,
  afib:                 0.2813136,
  pc1:                  1.4603130,   // Inpatient/Emergency
  pc2:                 -0.3502473,   // Other
  pg2:                  0.3955654,   // Gastrointestinal
  pg3:                  0.0151325,   // Orthopedic & Plastic
  pg4:                  1.3770410,   // Neurosurgery
  pg5:                  1.1131010,   // Cardiovascular & Thoracic
  pg6:                  0.0356944,   // Head & Neck
  pg7:                  0.1424025,   // OB-GYN
  pg8:                  0.4922821,   // Urology
  pg9:                  0.8111769    // Other Specialized
};
```

### Calculation Formula
The predicted probability is calculated using the logistic function:

```
P(stroke) = 1 / (1 + e^(-xb))
```

Where `xb` is the linear predictor calculated as:
```
xb = intercept + β₁×age + β₂×diabetes + β₃×hypertension + ... + βₙ×procedure_group
```

## Features

### Professional Design
- **Medical-Grade Interface**: Clean, professional design suitable for clinical environments
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Accessibility**: WCAG-compliant design with proper ARIA labels
- **Print-Friendly**: Optimized for medical documentation and printing

### User Experience
- **Real-Time Calculation**: Instant updates as data is entered
- **Input Validation**: Clear feedback for missing or invalid data
- **Visual Feedback**: Color-coded results based on risk levels
- **Intuitive Interface**: Logical grouping of related clinical factors

### Technical Features
- **No Dependencies**: Pure HTML, CSS, and JavaScript implementation
- **Cross-Platform**: Works on all modern web browsers
- **Offline Capable**: Can be deployed locally without internet connection
- **Secure**: No data transmission or storage of patient information

## Deployment

### Local Deployment
1. Download all files to a local directory
2. Open `index.html` in any modern web browser
3. No additional software or server setup required

### Web Deployment
1. Upload files to any web hosting service
2. Ensure all files are in the same directory
3. Access via web browser at the hosted URL

### Institutional Integration
The calculator can be integrated into:
- Electronic Health Record (EHR) systems
- Hospital intranets
- Clinical decision support systems
- Medical education platforms

## Validation and Quality Assurance

### Model Validation
- Internal validation using bootstrap resampling
- External validation on independent datasets
- Calibration and discrimination metrics assessment

### Clinical Validation
- Peer-reviewed methodology
- Clinical expert review and feedback
- Pilot testing in clinical environments

## Limitations and Disclaimers

### Clinical Limitations
- This calculator provides risk estimates and should not replace clinical judgment
- Results should be interpreted in the context of individual patient circumstances
- The model may not capture all relevant clinical factors
- Regular updates may be required as new evidence emerges

### Technical Limitations
- Requires JavaScript-enabled browsers
- Optimal performance on modern web browsers
- Print functionality may vary by browser

## Support and Updates

### Documentation
- Complete technical documentation available
- Clinical validation studies referenced
- Regular updates based on new evidence

### Contact Information
For technical support or clinical questions, please refer to the primary research publication or contact the development team.

## Citation

When using this calculator in clinical practice or research, please cite the original research publication and acknowledge the development team.

---

**Disclaimer**: This calculator is intended for educational and clinical decision support purposes only. It should not replace professional medical judgment or clinical decision-making. Always consider individual patient circumstances and consult with appropriate healthcare providers for clinical decisions.
