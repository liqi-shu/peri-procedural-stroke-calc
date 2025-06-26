const points = {
  age62: 1,
  strokeTIA: 1,
  // …other risk factors…
  bmiProtect: -1
};

function calculateScore() {
  let score = 0;
  const form = document.getElementById('riskForm');

  if (form.elements.age62.checked)     score += points.age62;
  if (form.elements.strokeTIA.checked) score += points.strokeTIA;
  const bmi = parseFloat(document.getElementById('bmi').value) || 0;
  if (bmi >= 35 && bmi <= 40)          score += points.bmiProtect;

  const category =
    score <= 2 ? 'Low risk' :
    score <= 4 ? 'Medium risk' :
    'High risk';

  document.getElementById('result').textContent =
    `Score: ${score} (${category})`;
}

document.getElementById('riskForm')
  .addEventListener('input', calculateScore);

// initial render
calculateScore();
