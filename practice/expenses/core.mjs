export function parseCents(text) {
  if (!/^(0|[1-9]\d{0,8})(\.\d{1,2})?$/.test(text)) throw new Error('請輸入最多兩位小數的非負金額。');
  const [whole, fraction = ''] = text.split('.');
  return Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
}

export function totals(records) {
  const categories = new Map();
  for (const record of records) {
    if (!Number.isSafeInteger(record.cents) || record.cents < 0) throw new Error('金額格式錯誤。');
    const sum = (categories.get(record.category) || 0) + record.cents;
    if (!Number.isSafeInteger(sum)) throw new Error('金額超過安全範圍。');
    categories.set(record.category, sum);
  }
  return categories;
}

export function toCsv(records) {
  // Prefix spreadsheet formulas in user-provided cells before CSV quoting.
  const cell = value => `"${String(value).replace(/^[=+@\-\t\r]/, "'$&").replaceAll('"', '""')}"`;
  return ['category,amount', ...records.map(r => `${cell(r.category)},${(r.cents / 100).toFixed(2)}`)].join('\r\n');
}
