import {parseCents, totals, toCsv} from './core.mjs';
const records = [];
const money = cents => (cents / 100).toFixed(2);
const message = document.querySelector('#message');
function render() {
  const list = document.querySelector('#list'); list.replaceChildren();
  records.forEach((record, index) => {
    const row = document.createElement('li');
    const text = document.createElement('span'); text.textContent = `${record.category}　${money(record.cents)}`;
    const button = document.createElement('button'); button.textContent = '刪除'; button.className = 'secondary';
    button.addEventListener('click', () => { records.splice(index, 1); render(); });
    row.append(text, button); list.append(row);
  });
  const summary = document.querySelector('#summary'); summary.replaceChildren();
  for (const [category, cents] of totals(records)) {
    const row = document.createElement('li'); row.textContent = `${category}　${money(cents)}`; summary.append(row);
  }
  document.querySelector('#total').textContent = money(records.reduce((sum, r) => sum + r.cents, 0));
  document.querySelector('#export').disabled = records.length === 0;
}
document.querySelector('#form').addEventListener('submit', event => {
  event.preventDefault();
  try {
    const category = document.querySelector('#category').value.trim();
    if (!category) throw new Error('請填寫分類。');
    if (records.length >= 500) throw new Error('最多保留 500 筆，請先匯出。');
    const cents = parseCents(document.querySelector('#amount').value.trim());
    records.push({category, cents}); message.textContent = ''; render();
    document.querySelector('#amount').value = ''; document.querySelector('#amount').focus();
  } catch (error) { message.textContent = error.message; }
});
document.querySelector('#export').addEventListener('click', () => {
  const url = URL.createObjectURL(new Blob(['\ufeff' + toCsv(records)], {type:'text/csv;charset=utf-8'}));
  const link = document.createElement('a'); link.href = url; link.download = 'expenses.csv'; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
render();
