// Brown Peri-procedural Stroke Ri-proceduralsk Assessment Tool
// Evidence-based calculator implementing validated logistic regression model

// 1. Model coefficients (β̂) from Stata
// 1. Updated β̂ from Stata (n = 255,850; ref for PatientClass = Ambulatory Surgery; ref for proc_group = General Surgery)
// 1. Updated β̂ from Stata (n = 255,850; ref for PatientClass = Ambulatory Surgery; ref for proc_group = General Surgery)
const coefs = {
  intercept:          -8.259739,
  ProcAge:             0.0186698,
  t2_diabetes:         0.2100635,
  hypertension:        0.3956097,
  history_stroke:      1.5102930,
  carotid_stenosis:    0.7540256,
  intracranial_athero: 1.0761450,
  afib:                0.2658257,
  // Procedure Setting dummies:
  pc1:                 1.4812410,   // Emergency/Inpatient Surgery
  pc2:                -0.4176664,   // Outpatient Clinic
  // Surgical group dummies (ref = General Surgery):
  pg2:                 0.3003160,   // Transplant Surgery
  pg3:                -0.0007442,   // Orthopedic & Plastic Surgery
  pg4:                 1.3471680,   // Neurosurgery
  pg5:                 1.1698530,   // Cardiovascular Surgery
  pg6:                 0.1905141,   // Thoracic Surgery
  pg7:                 0.0231247,   // Head & Neck Surgery
  pg8:                 0.0810486,   // OB-GYN Surgery
  pg9:                 0.5287325,   // Urologic Surgery
  pg10:                0.4406307    // Non-cardiac Medical Subspecialty Procedures
};

// 2. Updated SEs from Stata (for delta-method CI; diagonal only)
const ses = {
  intercept:           0.1657569,
  ProcAge:             0.0022242,
  t2_diabetes:         0.0617267,
  hypertension:        0.0833122,
  history_stroke:      0.0826593,
  carotid_stenosis:    0.0877367,
  intracranial_athero: 0.2174252,
  afib:                0.0688924,
  pc1:                 0.0660203,
  pc2:                 0.1999194,
  pg2:                 0.5917312,
  pg3:                 0.1321125,
  pg4:                 0.1227410,
  pg5:                 0.1222628,
  pg6:                 0.3505790,
  pg7:                 0.1927555,
  pg8:                 0.3513246,
  pg9:                 0.2082893,
  pg10:                0.1154209
};

// 3. Clinical guidance recommendations
const clinicalGuidance = {
  low: {
    title: "Low Risk (< 1%)",
    recommendations: [
      "Standard peri-procedural monitoring is appropriate",
      "Routine pre-procedural evaluation sufficient",
      "No additional stroke-specific precautions required",
      "Consider standard ASA monitoring guidelines"
    ]
  },
  moderate: {
    title: "Moderate Risk (1-5%)",
    recommendations: [
      "Enhanced peri-procedural monitoring recommended",
      "Consider pre-procedural neurology consultation",
      "Implement stroke-specific monitoring protocols",
      "Monitor blood pressure closely during procedure",
      "Consider extended post-procedural observation"
    ]
  },
  high: {
    title: "High Risk (≥ 5%)",
    recommendations: [
      "Intensive peri-procedural monitoring required",
      "Pre-procedural neurology consultation strongly recommended",
      "Consider postponing elective procedures if possible",
      "Implement comprehensive stroke prevention protocols",
      "Extended post-procedural monitoring in ICU setting",
      "Multidisciplinary team consultation recommended"
    ]
  }
};

// 4. DOM elements
const form = document.getElementById('riskForm');
const probSpan = document.getElementById('predprob');
const resultBox = document.getElementById('result');
const confidenceInterval = document.getElementById('confidence-interval');
const ciValue = document.getElementById('ci-value');
const clinicalGuidanceBox = document.getElementById('clinical-guidance');
const guidanceContent = document.getElementById('guidance-content');

// 5. Main calculation function
function calculateRisk() {
  // Input validation and collection
  const inputs = collectAndValidateInputs();
  if (!inputs.valid) {
    displayError(inputs.message);
    return;
  }

  // Calculate risk
  const riskResult = calculateRiskProbability(inputs);
  
  // Update UI
  updateResults(riskResult);
  updateClinicalGuidance(riskResult.probability);
}

// 6. Input collection and validation
function collectAndValidateInputs() {
  const age = parseFloat(document.getElementById('procAge').value) || 0;
  
  // Validate age
  if (!age || age < 18 || age > 120) {
    return {
      valid: false,
      message: age < 18 ? 'Age must be 18 or older' : 'Please enter a valid age (18-120 years)'
    };
  }

  return {
    valid: true,
    age: age,
    t2_diabetes: document.getElementById('t2_diabetes').checked,
    hypertension: document.getElementById('hypertension').checked,
    history_stroke: document.getElementById('history_stroke').checked,
    carotid_stenosis: document.getElementById('carotid_stenosis').checked,
    intracranial_athero: document.getElementById('intracranial_athero').checked,
    afib: document.getElementById('afib').checked,
    patientClass: document.getElementById('patientClass').value,
    procGroup: document.getElementById('procGroup').value
  };
}

// 7. Risk calculation with confidence intervals
function calculateRiskProbability(inputs) {
  // Build covariate vector
  const x = {
    intercept: 1,
    ProcAge: inputs.age,
    t2_diabetes: inputs.t2_diabetes ? 1 : 0,
    hypertension: inputs.hypertension ? 1 : 0,
    history_stroke: inputs.history_stroke ? 1 : 0,
    carotid_stenosis: inputs.carotid_stenosis ? 1 : 0,
    intracranial_athero: inputs.intracranial_athero ? 1 : 0,
    afib: inputs.afib ? 1 : 0,
    pc1: inputs.patientClass === '1' ? 1 : 0,
    pc2: inputs.patientClass === '3' ? 1 : 0,
    pg2: inputs.procGroup === '2' ? 1 : 0,
    pg3: inputs.procGroup === '3' ? 1 : 0,
    pg4: inputs.procGroup === '4' ? 1 : 0,
    pg5: inputs.procGroup === '5' ? 1 : 0,
    pg6: inputs.procGroup === '6' ? 1 : 0,
    pg7: inputs.procGroup === '7' ? 1 : 0,
    pg8: inputs.procGroup === '8' ? 1 : 0,
    pg9: inputs.procGroup === '9' ? 1 : 0,
    pg10: inputs.procGroup === '10' ? 1 : 0
  };

  // Calculate linear predictor
  let xb = 0;
  for (const key in coefs) {
    xb += coefs[key] * x[key];
  }

  // Calculate confidence interval
  let var_xb = 0;
  for (const key in ses) {
    var_xb += (ses[key] ** 2) * (x[key] ** 2);
  }
  const se_xb = Math.sqrt(var_xb);

  // 95% confidence interval
  const z = 1.96;
  const xb_lo = xb - z * se_xb;
  const xb_hi = xb + z * se_xb;

  // Transform to probabilities
  const probability = 1 / (1 + Math.exp(-xb));
  const prob_lo = 1 / (1 + Math.exp(-xb_lo));
  const prob_hi = 1 / (1 + Math.exp(-xb_hi));

  return {
    probability: probability,
    confidenceInterval: {
      lower: prob_lo,
      upper: prob_hi
    },
    linearPredictor: xb
  };
}

// 8. Update results display
function updateResults(riskResult) {
  const pct = riskResult.probability * 100;
  
  // Update main result
  probSpan.textContent = `${pct.toFixed(1)}%`;
  
  // Update confidence interval
  const ci_lower = (riskResult.confidenceInterval.lower * 100).toFixed(1);
  const ci_upper = (riskResult.confidenceInterval.upper * 100).toFixed(1);
  ciValue.textContent = `${ci_lower}% - ${ci_upper}%`;
  confidenceInterval.style.display = 'block';
  
  // Update color coding
  updateColorCoding(pct);
}

// 9. Update color coding based on risk level
function updateColorCoding(riskPercentage) {
  if (riskPercentage < 1) {
    resultBox.className = 'results success';
  } else if (riskPercentage >= 1 && riskPercentage < 5) {
    resultBox.className = 'results warning';
  } else {
    resultBox.className = 'results error';
  }
}

// 10. Update clinical guidance
function updateClinicalGuidance(probability) {
  const pct = probability * 100;
  let guidance;
  
  if (pct < 1) {
    guidance = clinicalGuidance.low;
  } else if (pct < 5) {
    guidance = clinicalGuidance.moderate;
  } else {
    guidance = clinicalGuidance.high;
  }
  
  guidanceContent.innerHTML = `
    <h4>${guidance.title}</h4>
    <ul>
      ${guidance.recommendations.map(rec => `<li>${rec}</li>`).join('')}
    </ul>
  `;
  
  clinicalGuidanceBox.style.display = 'block';
}

// 11. Display error state
function displayError(message) {
  probSpan.textContent = message;
  confidenceInterval.style.display = 'none';
  clinicalGuidanceBox.style.display = 'none';
  resultBox.className = 'results';
}

// 12. Event listeners and initialization
document.addEventListener('DOMContentLoaded', function() {
  // Form event listeners
  form.addEventListener('input', calculateRisk);
  
  // Initial calculation
  calculateRisk();
  
  // Add keyboard navigation
  addKeyboardNavigation();
  
  // Add form validation
  addFormValidation();
});

// 13. Keyboard navigation support
function addKeyboardNavigation() {
  const inputs = form.querySelectorAll('input, select');
  inputs.forEach((input, index) => {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && index < inputs.length - 1) {
        e.preventDefault();
        inputs[index + 1].focus();
      }
    });
  });
}

// 14. Form validation feedback
function addFormValidation() {
  const ageInput = document.getElementById('procAge');
  
  ageInput.addEventListener('blur', function() {
    const age = parseFloat(this.value);
    if (age && (age < 18 || age > 120)) {
      this.setCustomValidity('Age must be between 18 and 120 years');
    } else {
      this.setCustomValidity('');
    }
  });
}

// 15. Export function for external use
window.BrownStrokeRiskCalculator = {
  calculate: calculateRisk,
  getModelInfo: () => ({
    coefficients: coefs,
    standardErrors: ses,
    version: '1.0.0',
    lastUpdated: '2024'
  })
};
