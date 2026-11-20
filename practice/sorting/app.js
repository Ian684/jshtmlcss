import {parseNumbers, insertionSteps} from './core.mjs';
let steps = [], position = 0;
function render() {
  const step = steps[position]; const bars = document.querySelector('#bars'); bars.replaceChildren();
  const scale = Math.max(1, ...step.values.map(Math.abs));
  step.values.forEach((value, i) => {
    const bar = document.createElement('div'); bar.className = `bar${value < 0 ? ' negative' : ''}${i === step.active ? ' active' : ''}`;
    bar.style.height = `${Math.max(12, Math.abs(value) / scale * 150)}px`;
    const label = document.createElement('span'); label.textContent = String(value); bar.append(label); bars.append(bar);
  });
  document.querySelector('#values').textContent = step.values.join(', ');
  document.querySelector('#note').textContent = step.note;
  document.querySelector('#progress').textContent = `${position + 1} / ${steps.length}`;
  document.querySelector('#previous').disabled = position === 0;
  document.querySelector('#next').disabled = position === steps.length - 1;
}
function reset() {
  try { steps = insertionSteps(parseNumbers(document.querySelector('#numbers').value)); position = 0; document.querySelector('#error').textContent = ''; render(); }
  catch(error) { document.querySelector('#error').textContent = error.message; }
}
document.querySelector('#form').addEventListener('submit', event => { event.preventDefault(); reset(); });
document.querySelector('#next').addEventListener('click', () => { if (position < steps.length - 1) { position++; render(); } });
document.querySelector('#previous').addEventListener('click', () => { if (position > 0) { position--; render(); } });
reset();
