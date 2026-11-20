const key = 'practice.todo.v1';
const list = document.querySelector('#list');
const message = document.querySelector('#message');
let tasks = [];
try {
  const saved = JSON.parse(localStorage.getItem(key) || '[]');
  if (!Array.isArray(saved) || saved.length > 500 || !saved.every(t => t && typeof t.id === 'string' && typeof t.text === 'string' && t.text.length <= 120 && typeof t.done === 'boolean')) throw new Error('invalid tasks');
  tasks = saved;
} catch { message.textContent = '舊資料無法讀取，可以重新新增事項。'; }

function save() {
  try { localStorage.setItem(key, JSON.stringify(tasks)); }
  catch { message.textContent = '瀏覽器無法儲存，這次新增的資料只會留在本頁。'; }
}

function render() {
  list.replaceChildren();
  const filter = document.querySelector('#filter').value;
  for (const task of tasks.filter(t => filter === 'all' || t.done === (filter === 'done'))) {
    const row = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox'; checkbox.checked = task.done;
    checkbox.setAttribute('aria-label', `完成：${task.text}`);
    checkbox.addEventListener('change', () => { task.done = checkbox.checked; save(); render(); });
    const text = document.createElement('span'); text.textContent = task.text;
    if (task.done) text.className = 'done';
    const remove = document.createElement('button'); remove.textContent = '刪除'; remove.className = 'secondary';
    remove.setAttribute('aria-label', `刪除：${task.text}`);
    remove.addEventListener('click', () => { tasks = tasks.filter(t => t.id !== task.id); save(); render(); });
    row.append(checkbox, text, remove); list.append(row);
  }
  document.querySelector('#count').textContent = `共 ${tasks.length} 項，未完成 ${tasks.filter(t => !t.done).length} 項`;
}

document.querySelector('#form').addEventListener('submit', event => {
  event.preventDefault();
  const input = document.querySelector('#task');
  const text = input.value.trim();
  if (!text) { message.textContent = '請輸入事項。'; return; }
  if (tasks.length >= 500) { message.textContent = '已達 500 項，請先整理清單。'; return; }
  tasks.push({id: crypto.randomUUID(), text, done: false});
  input.value = ''; message.textContent = ''; save(); render(); input.focus();
});
document.querySelector('#filter').addEventListener('change', render);
render();
