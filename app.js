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
  let xb = coefs.intercept;

  // Continuous predictor: age
  const age = parseFloat(document.getElementById('procAge').value) || 0;
  xb += coefs.ProcAge * age;

  // Binary predictors (checkboxes)
  xb += coefs.t2_diabetes        * (document.getElementById('t2_diabetes').checked ? 1 : 0);
  xb += coefs.hypertension       * (document.getElementById('hypertension').checked  ? 1 : 0);
  xb += coefs.history_stroke     * (document.getElementById('history_stroke').checked? 1 : 0);
  xb += coefs.carotid_stenosis   * (document.getElementById('carotid_stenosis').checked?1 : 0);
  xb += coefs.intracranial_athero* (document.getElementById('intracranial_athero').checked?1 : 0);
  xb += coefs.afib               * (document.getElementById('afib').checked          ? 1 : 0);

  // Patient class grouping
  const pc = document.getElementById('patientClass').value;
  if (pc === '1') xb += coefs.pc1;
  else if (pc === '2') xb += coefs.pc2;
  // (Group 0 or 3 have no added coefficient)

  // Procedure group
  const pg = document.getElementById('procGroup').value;
  if (pg !== '1') {
    xb += coefs['pg' + pg];
  }

  // 4. Transform to probability via logistic function
  const predprob = 1 / (1 + Math.exp(-xb));

  // 5. Update the UI
  xbSpan.textContent   = xb.toFixed(4);
  probSpan.textContent = (predprob * 100).toFixed(1) + '%';
}

// 6. Wire up and initialize
form.addEventListener('input', calculateRisk);
calculateRisk();
