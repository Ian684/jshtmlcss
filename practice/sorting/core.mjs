export function parseNumbers(text) {
  const fields = text.trim().split(/[\s,]+/);
  if (!text.trim() || fields.length > 30 || fields.some(x => !/^-?\d+$/.test(x) || Math.abs(Number(x)) > 100)) throw new Error('請輸入 1–30 個整數，範圍為 -100 到 100。');
  return fields.map(Number);
}

export function insertionSteps(input) {
  const values = [...input];
  const steps = [{values:[...values], active:-1, note:'起始陣列；左側每輪會多一個已排序元素。'}];
  for (let i = 1; i < values.length; i++) {
    const key = values[i]; let j = i - 1;
    while (j >= 0 && values[j] > key) {
      values[j + 1] = values[j];
      steps.push({values:[...values], active:j + 1, note:`把 ${values[j]} 往右移，替 ${key} 騰出空間。`});
      j--;
    }
    values[j + 1] = key;
    steps.push({values:[...values], active:j + 1, note:`把 ${key} 放在位置 ${j + 1}。`});
  }
  steps.push({values:[...values], active:-1, note:'排序完成。相同值不互換，這是穩定排序。'});
  return steps;
}
