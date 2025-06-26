// app.js

// 1. Model coefficients from your Stata output
const coefs = {
  intercept:           -8.425560,
  ProcAge:              0.0203961,
  t2_diabetes:          0.1993000,
  hypertension:         0.4309231,
  history_stroke:       1.3042420,
  carotid_stenosis:     0.7408938,
  intracranial_athero:  1.0137060,
  afib:                 0.2813136,
  // PatientClassGroup dummies
  pc1:                  1.4603130,   // PatientClassGroup == 1
  pc2:                 -0.3502473,   // PatientClassGroup == 2
  // proc_group dummies (reference is group 1)
  pg2:                  0.3955654,
  pg3:                  0.0151325,
  pg4:                  1.3770410,
  pg5:                  1.1131010,
  pg6:                  0.0356944,
  pg7:                  0.1424025,
  pg8:                  0.4922821,
  pg9:                  0.8111769
};

// 2. Grab the form and output spans
const form     = document.getElementById('riskForm');
const xbSpan   = document.getElementById('xb');
const probSpan = document.getElementById('predprob');

// 3. Calculation function
function calculateRisk() {
  // Check if all required fields are filled
  const age = parseFloat(document.getElementById('procAge').value) || 0;
  const t2_diabetes = document.getElementById('t2_diabetes').checked;
  const hypertension = document.getElementById('hypertension').checked;
  const history_stroke = document.getElementById('history_stroke').checked;
  const carotid_stenosis = document.getElementById('carotid_stenosis').checked;
  const intracranial_athero = document.getElementById('intracranial_athero').checked;
  const afib = document.getElementById('afib').checked;
  const patientClass = document.getElementById('patientClass').value;
  const procGroup = document.getElementById('procGroup').value;

  // Get the results container for styling
  const resultContainer = document.getElementById('result');

  // Check if age is provided (required field)
  if (!age || age <= 0) {
    xbSpan.textContent = 'Please enter age';
    probSpan.textContent = 'Age is required';
    resultContainer.className = 'results'; // Black (default state)
    return;
  }

  // All fields are available, proceed with calculation
  let xb = coefs.intercept;

  // Continuous predictor: age
  xb += coefs.ProcAge * age;

  // Binary predictors (checkboxes)
  xb += coefs.t2_diabetes        * (t2_diabetes ? 1 : 0);
  xb += coefs.hypertension       * (hypertension ? 1 : 0);
  xb += coefs.history_stroke     * (history_stroke ? 1 : 0);
  xb += coefs.carotid_stenosis   * (carotid_stenosis ? 1 : 0);
  xb += coefs.intracranial_athero* (intracranial_athero ? 1 : 0);
  xb += coefs.afib               * (afib ? 1 : 0);

  // Patient class grouping
  // Based on Stata output: 0=Outpatient/Elective Surgery (baseline), 1=Inpatient/Emergency, 3=Other
  if (patientClass === '1') xb += coefs.pc1;  // Inpatient/Emergency
  else if (patientClass === '3') xb += coefs.pc2;  // Other
  // PatientClassGroup == 0 (Outpatient/Elective Surgery) is baseline - no coefficient added

  // Procedure group
  if (procGroup !== '1') {
    xb += coefs['pg' + procGroup];
  }

  // 4. Transform to probability via logistic function
  const predprob = 1 / (1 + Math.exp(-xb));

  // 5. Update the UI
  xbSpan.textContent   = xb.toFixed(4);
  probSpan.textContent = (predprob * 100).toFixed(1) + '%';
  
  // Update styling based on risk level
  const riskPercentage = predprob * 100;
  if (riskPercentage < 1) {
    resultContainer.className = 'results success'; // Green for low risk
  } else if (riskPercentage >= 1 && riskPercentage < 5) {
    resultContainer.className = 'results warning'; // Orange for moderate risk
  } else {
    resultContainer.className = 'results error'; // Red for high risk
  }
}

// 6. Wire up and initialize
form.addEventListener('input', calculateRisk);
calculateRisk(); // Show initial message when page loads
