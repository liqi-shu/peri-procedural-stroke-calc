// 1. Store your coefficients exactly as in Stata:
const coefs = {
  intercept: -8.425560,
  ProcAge:      0.0203961,
  t2_diabetes:  0.1993000,
  hypertension: 0.4309231,
  history_stroke:    1.3042420,
  carotid_stenosis:  0.7408938,
  intracranial_athero:1.0137060,
  afib:              0.2813136,
  // patient class dummies:
  pc1: 1.4603130,
  pc2: -0.3502473,
  // proc_group dummies:
  pg2: 0.3955654,
  pg3: 0.0151325,
  pg4: 1.3770410,
  pg5: 1.1131010,
  pg6: 0.0356944,
  pg7: 0.1424025,
  pg8: 0.4922821,
  pg9: 0.8111769,
  // …and any remaining meds or flags…
};

// 2. Grab the form and result spans:
const form = document.getElementById('riskForm');
const xbSpan = document.getElementById('xb');
const probSpan = document.getElementById('predprob');

// 3. The core function:
function calculateLogistic() {
  let xb = coefs.intercept;

  // continuous:
  xb += coefs.ProcAge * parseFloat(form.procAge.value || 0);

  // binaries:
  xb += coefs.t2_diabetes * (form.t2_diabetes.checked ? 1 : 0);
  xb += coefs.hypertension * (form.hypertension.checked ? 1 : 0);
  xb += coefs.history_stroke * (form.history_stroke.checked ? 1 : 0);
  // …repeat for carotid_stenosis, intracranial_athero, afib…

  // patient class:
  const pc = form.patientClass.value;
  if (pc === '1') xb += coefs.pc1;
  else if (pc === '2') xb += coefs.pc2;
  // (Group 3 has no term in this version)

  // proc group:
  const pg = form.procGroup.value;
  if (pg !== '1') xb += coefs['pg' + pg];

  // any other meds/flags…
  // xb += coefs.had_ras_inhibitor * (form.had_ras_inhibitor.checked ? 1:0);
  // …

  // logistic transform:
  const predprob = 1 / (1 + Math.exp(-xb));

  // display:
  xbSpan.textContent = xb.toFixed(4);
  probSpan.textContent = (predprob * 100).toFixed(1) + '%';
}

// 4. Wire it up:
form.addEventListener('input', calculateLogistic);

// 5. Initial call
calculateLogistic();
