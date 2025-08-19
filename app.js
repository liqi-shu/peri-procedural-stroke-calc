// Brown Peri-procedural Stroke Ri-proceduralsk Assessment Tool
// Evidence-based calculator implementing validated logistic regression model

// 1. Model coefficients (β̂) from Stata
// Updated β̂ from Stata (n = 255,850; ref for PatientClass = Ambulatory Surgery; ref for proc_group = General Surgery)
const coefs = {
  intercept:          -8.251679,
  ProcAge:             0.0186463,
  t2_diabetes:         0.210143,
  hypertension:        0.3965528,
  history_stroke:      1.510622,
  carotid_stenosis:    0.7539576,
  intracranial_athero: 1.076393,
  afib:                0.265985,
  // Procedure Setting dummies:
  pc1:                 1.481849,    // Emergency/Inpatient Surgery
  pc2:                -0.4181883,   // Outpatient Clinic
  // Surgical group dummies (ref = General Surgery):
  pg3:                -0.0084477,   // Orthopedic & Plastic Surgery
  pg4:                 1.339401,    // Neurosurgery
  pg5:                 1.162026,    // Cardiovascular Surgery
  pg6:                 0.1828371,   // Thoracic Surgery
  pg7:                 0.0156524,   // Head & Neck Surgery
  pg8:                 0.0736675,   // OB-GYN Surgery
  pg9:                 0.5209588,   // Urologic Surgery
  pg10:                0.4328439    // Non-cardiac Medical Subspecialty Procedures
};

// 2. Updated SEs from Stata (for delta-method CI; diagonal only)
const ses = {
  intercept:           0.1647509,
  ProcAge:             0.0022234,
  t2_diabetes:         0.0617267,
  hypertension:        0.0832952,
  history_stroke:      0.082658,
  carotid_stenosis:    0.0877354,
  intracranial_athero: 0.2174465,
  afib:                0.0688937,
  pc1:                 0.0660051,
  pc2:                 0.1999125,
  pg3:                 0.1309491,
  pg4:                 0.1214727,
  pg5:                 0.1209741,
  pg6:                 0.3501457,
  pg7:                 0.1919943,
  pg8:                 0.3509153,
  pg9:                 0.2075443,
  pg10:                0.1140659
};



// 4. DOM elements
const form = document.getElementById('riskForm');
const probSpan = document.getElementById('predprob');
const resultBox = document.getElementById('result');
const confidenceInterval = document.getElementById('confidence-interval');
const ciValue = document.getElementById('ci-value');


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



// 11. Display error state
function displayError(message) {
  probSpan.textContent = message;
  confidenceInterval.style.display = 'none';

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
