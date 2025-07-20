// app.js

// 1. Model coefficients (β̂) from Stata
const coefs = {
  intercept:           -8.425560,
  ProcAge:              0.0203961,
  t2_diabetes:          0.1993000,
  hypertension:         0.4309231,
  history_stroke:       1.3042420,
  carotid_stenosis:     0.7408938,
  intracranial_athero:  1.0137060,
  afib:                 0.2813136,
  // PatientClassGroup dummy coefficients
  pc1:                  1.4603130,   // Inpatient/Emergency
  pc2:                 -0.3502473,   // Other
  // Procedure‐group dummy coefficients (ref = group "1")
  pg2:                  0.3955654,
  pg3:                  0.0151325,
  pg4:                  1.3770410,
  pg5:                  1.1131010,
  pg6:                  0.0356944,
  pg7:                  0.1424025,
  pg8:                  0.4922821,
  pg9:                  0.8111769
};

// 2. Standard errors from Stata (for approximate 95% CI; diagonal only)
const ses = {
  intercept:           0.1500193,
  ProcAge:             0.0020215,
  t2_diabetes:         0.0617271,
  hypertension:        0.0833548,
  history_stroke:      0.0764592,
  carotid_stenosis:    0.0875954,
  intracranial_athero: 0.2182400,
  afib:                0.0684455,
  pc1:                 0.0658814,
  pc2:                 0.1962092,
  pg2:                 0.1146251,
  pg3:                 0.1306683,
  pg4:                 0.1206353,
  pg5:                 0.1190543,
  pg6:                 0.1881062,
  pg7:                 0.3506027,
  pg8:                 0.2067492,
  pg9:                 0.4241228
};

// 3. Grab form + output elements
const form        = document.getElementById('riskForm');
const probSpan    = document.getElementById('predprob');
const resultBox   = document.getElementById('result');

// 4. Main calculation / render function
function calculateRisk() {
  // — Read & validate inputs —
  const age = parseFloat(document.getElementById('procAge').value) || 0;
  if (age <= 0) {
    // Age is required; clear any previous result
    probSpan.textContent = 'Age is required';
    resultBox.className = 'results';
    return;
  }
  const t2_diabetes        = document.getElementById('t2_diabetes').checked;
  const hypertension       = document.getElementById('hypertension').checked;
  const history_stroke     = document.getElementById('history_stroke').checked;
  const carotid_stenosis   = document.getElementById('carotid_stenosis').checked;
  const intracranial_athero= document.getElementById('intracranial_athero').checked;
  const afib               = document.getElementById('afib').checked;
  const patientClass       = document.getElementById('patientClass').value; // "0","1","3"
  const procGroup          = document.getElementById('procGroup').value;    // "1"–"9"

  // — Build covariate vector x in same key‐order as coefs/ses —
  const x = {
    intercept:            1,
    ProcAge:              age,
    t2_diabetes:          t2_diabetes   ? 1 : 0,
    hypertension:         hypertension  ? 1 : 0,
    history_stroke:       history_stroke? 1 : 0,
    carotid_stenosis:     carotid_stenosis? 1 : 0,
    intracranial_athero:  intracranial_athero?1:0,
    afib:                 afib          ? 1 : 0,
    pc1:                  patientClass === '1' ? 1 : 0,
    pc2:                  patientClass === '3' ? 1 : 0,
    pg2:                  procGroup === '2' ? 1 : 0,
    pg3:                  procGroup === '3' ? 1 : 0,
    pg4:                  procGroup === '4' ? 1 : 0,
    pg5:                  procGroup === '5' ? 1 : 0,
    pg6:                  procGroup === '6' ? 1 : 0,
    pg7:                  procGroup === '7' ? 1 : 0,
    pg8:                  procGroup === '8' ? 1 : 0,
    pg9:                  procGroup === '9' ? 1 : 0
  };

  // — Compute linear predictor xb = Σ β_i * x_i —
  let xb = 0;
  for (const key in coefs) {
    xb += coefs[key] * x[key];
  }

  // — Approximate variance of xb (diagonal‐only) & its SE —
  let var_xb = 0;
  for (const key in ses) {
    var_xb += (ses[key] ** 2) * (x[key] ** 2);
  }
  const se_xb = Math.sqrt(var_xb);

  // — Delta‐method 95% CI on the logit scale —
  const z      = 1.96;
  const xb_lo  = xb - z * se_xb;
  const xb_hi  = xb + z * se_xb;

  // — Back‐transform to probabilities —
  const p      = 1 / (1 + Math.exp(-xb));
  const p_lo   = 1 / (1 + Math.exp(-xb_lo));
  const p_hi   = 1 / (1 + Math.exp(-xb_hi));

  // — Update UI: show point estimate + 95% CI —
  probSpan.textContent = 
    `${(p*100).toFixed(1)}% (95% CI ${(p_lo*100).toFixed(1)}–${(p_hi*100).toFixed(1)}%)`;

  // — Color‐code risk level —
  const pct = p * 100;
  if (pct < 1) {
    resultBox.className = 'results success';  // green
  } else if (pct < 5) {
    resultBox.className = 'results warning';  // orange
  } else {
    resultBox.className = 'results error';    // red
  }
}

// 5. Wire up event listener & initial run
form.addEventListener('input', calculateRisk);
calculateRisk();
