import {
  exercises
} from './labs.mjs';
const response = await fetch('./catalog.json');
if (!response.ok) throw Error('Cannot load exercise catalog');
const catalog = await response.json();
const select = document.querySelector('#exercise');
for (const item of catalog) {
  const option = document.createElement('option');
  option.value = item.slug;
  option.textContent = String(item.id).padStart(2, '0') + ' ' + item.title;
  select.append(option);
}
let cleanup;

function mount() {
  cleanup?.();
  const item = catalog.find(item => item.slug === select.value) || catalog[0];
  document.querySelector('#title').textContent = item.id + '. ' + item.title;
  document.querySelector('#goal').textContent = item.goal;
  cleanup = exercises[item.slug](document.querySelector('#lab'));
  document.querySelector('#navigation').textContent = '本頁共有 ' + catalog.length + ' 個單元；題號 1–3 在原練習目錄。';
}
select.onchange = () => {
  history.replaceState(null, '', '#' + select.value);
  mount();
};
window.addEventListener('hashchange', () => {
  const slug = location.hash.slice(1);
  if (catalog.some(item => item.slug === slug)) {
    select.value = slug;
    mount();
  }
});
if (catalog.some(item => item.slug === location.hash.slice(1))) select.value = location.hash.slice(1);
mount();
