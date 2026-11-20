function view(root, html) {
  root.innerHTML = html;
  return selector => root.querySelector(selector);
}

export const exercises = {
  "dialog": (root) => {
    const $ = view(root, '<button id="open">開啟對話框</button><dialog><p>可用 Escape 或按鈕關閉</p><button id="close">關閉</button></dialog><output id="result">已關閉</output>');
    $('#open').onclick = () => {
      $('dialog').showModal();
      $('#result').textContent = '已開啟';
    };
    $('#close').onclick = () => {
      $('dialog').close();
      $('#result').textContent = '已關閉';
    };
    $('dialog').onclose = () => {
      $('#result').textContent = '已關閉';
    };
  },
  "details": (root) => {
    const $ = view(root, '<details><summary>展開筆記</summary><p id="note">HTML 本身就提供開關語意。</p></details><output id="result">收合</output>');
    $('details').ontoggle = () => {
      $('#result').textContent = $('details').open ? '展開' : '收合';
    };
  },
  "tabs": (root) => {
    const $ = view(root, '<div role="tablist"><button role="tab" id="tab-a" aria-selected="true" aria-controls="panel-a">HTML</button><button role="tab" id="tab-b" aria-selected="false" aria-controls="panel-b">CSS</button></div><section id="panel-a" role="tabpanel">HTML 結構</section><section id="panel-b" role="tabpanel" hidden>CSS 樣式</section>');
    for (const tab of root.querySelectorAll('[role=tab]')) tab.onclick = () => {
      for (const t of root.querySelectorAll('[role=tab]')) {
        const active = t === tab;
        t.setAttribute('aria-selected', active);
        $('#' + t.getAttribute('aria-controls')).hidden = !active;
      }
    };
  },
  "carousel": (root) => {
    const $ = view(root, '<p id="result"></p><button id="prev">上一張</button><button id="next">下一張</button>');
    const slides = ['山景', '海景', '城市'];
    let index = 0;
    const render = () => {
      $('#result').textContent = slides[index];
    };
    $('#prev').onclick = () => {
      index = (index + slides.length - 1) % slides.length;
      render();
    };
    $('#next').onclick = () => {
      index = (index + 1) % slides.length;
      render();
    };
    render();
  },
  "theme": (root) => {
    const $ = view(root, '<button id="toggle">切換深淺</button><div id="sample" style="padding:24px">主題預覽</div><output id="result"></output>');
    let dark = false;
    const render = () => {
      $('#sample').style.background = dark ? '#172b25' : '#eff6ed';
      $('#sample').style.color = dark ? 'white' : '#173126';
      $('#result').textContent = dark ? '深色' : '淺色';
    };
    $('#toggle').onclick = () => {
      dark = !dark;
      render();
    };
    render();
  },
  "font_scale": (root) => {
    const $ = view(root, '<label>字級<input id="size" type="range" min="12" max="40" value="16"></label><p id="sample">閱讀練習文字</p><output id="result"></output>');
    const render = () => {
      $('#sample').style.fontSize = $('#size').value + 'px';
      $('#result').textContent = $('#size').value + 'px';
    };
    $('#size').oninput = render;
    render();
  },
  "grid": (root) => {
    const $ = view(root, '<label>欄數<input id="columns" type="range" min="1" max="4" value="2"></label><div id="grid" style="display:grid;gap:8px"><span>甲</span><span>乙</span><span>丙</span><span>丁</span></div><output id="result"></output>');
    const render = () => {
      $('#grid').style.gridTemplateColumns = 'repeat(' + $('#columns').value + ',minmax(0,1fr))';
      $('#result').textContent = $('#columns').value + ' 欄';
    };
    $('#columns').oninput = render;
    render();
  },
  "flex": (root) => {
    const $ = view(root, '<label>對齊<select id="align"><option>flex-start</option><option>center</option><option>space-between</option></select></label><div id="flex" style="display:flex;gap:8px;background:#eee"><span>甲</span><span>乙</span><span>丙</span></div><output id="result"></output>');
    $('#align').onchange = () => {
      $('#flex').style.justifyContent = $('#align').value;
      $('#result').textContent = $('#align').value;
    };
  },
  "responsive": (root) => {
    const $ = view(root, '<label>預覽寬度<input id="width" type="range" min="180" max="600" value="300"></label><div id="preview" style="max-width:100%;display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:8px"><span>卡片一</span><span>卡片二</span><span>卡片三</span></div><output id="result"></output>');
    const render = () => {
      $('#preview').style.width = $('#width').value + 'px';
      $('#result').textContent = $('#width').value + 'px';
    };
    $('#width').oninput = render;
    render();
  },
  "sticky": (root) => {
    const $ = view(root, '<div id="scroll" style="height:150px;overflow:auto;border:1px solid"><div id="sticky" style="position:sticky;top:0;background:#fed;padding:8px">固定標題</div><div style="height:500px">內容</div></div><output id="result">0</output>');
    $('#scroll').onscroll = () => {
      $('#result').textContent = String($('#scroll').scrollTop);
    };
  },
  "tooltip": (root) => {
    const $ = view(root, '<button id="help" aria-describedby="tip">聚焦查看提示</button><p role="tooltip" id="tip" hidden>提示不能只依賴滑鼠。</p>');
    const show = () => {
      $('#tip').hidden = false;
    };
    const hide = () => {
      $('#tip').hidden = true;
    };
    $('#help').onfocus = show;
    $('#help').onblur = hide;
    $('#help').onmouseenter = show;
    $('#help').onmouseleave = hide;
  },
  "menu": (root) => {
    const $ = view(root, '<div role="menu"><button role="menuitem" tabindex="0">第一項</button><button role="menuitem" tabindex="-1">第二項</button><button role="menuitem" tabindex="-1">第三項</button></div><output id="result">第一項</output>');
    const items = [...root.querySelectorAll('[role=menuitem]')];
    items.forEach((item, index) => {
      item.onkeydown = e => {
        if (!['ArrowDown', 'ArrowUp'].includes(e.key)) return;
        e.preventDefault();
        const next = (index + (e.key === 'ArrowDown' ? 1 : items.length - 1)) % items.length;
        items.forEach((x, i) => x.tabIndex = i === next ? 0 : -1);
        items[next].focus();
        $('#result').textContent = items[next].textContent;
      };
    });
  },
  "password_visibility": (root) => {
    const $ = view(root, '<label>練習密碼<input id="password" type="password" value="sample-only"></label><button id="toggle" aria-pressed="false">顯示</button><output id="result">隱藏</output>');
    $('#toggle').onclick = () => {
      const show = $('#password').type === 'password';
      $('#password').type = show ? 'text' : 'password';
      $('#toggle').setAttribute('aria-pressed', show);
      $('#result').textContent = show ? '顯示' : '隱藏';
    };
  },
  "password_meter": (root) => {
    const $ = view(root, '<label>測試字串<input id="password" autocomplete="off"></label><meter id="meter" min="0" max="4"></meter><output id="result">0 / 4</output><p>只計算長度、大小寫與數字四個條件，不代表實際密碼安全程度。</p>');
    $('#password').oninput = () => {
      const t = $('#password').value;
      const score = [t.length >= 12, /[a-z]/.test(t), /[A-Z]/.test(t), /[0-9]/.test(t)].filter(Boolean).length;
      $('#meter').value = score;
      $('#result').textContent = score + ' / 4';
    };
  },
  "character_count": (root) => {
    const $ = view(root, '<label>文字<textarea id="text"></textarea></label><output id="result">0 字元</output>');
    $('#text').oninput = () => {
      $('#result').textContent = [...$('#text').value].length + ' 字元';
    };
  },
  "search": (root) => {
    const $ = view(root, '<label>搜尋<input id="query"></label><ul id="list"></ul><output id="result"></output>');
    const names = ['Apple', 'Banana', 'Apricot', 'Cherry'];
    const render = () => {
      const found = names.filter(x => x.toLowerCase().includes($('#query').value.toLowerCase()));
      $('#list').replaceChildren(...found.map(x => {
        const li = document.createElement('li');
        li.textContent = x;
        return li;
      }));
      $('#result').textContent = found.length + ' 筆';
    };
    $('#query').oninput = render;
    render();
  },
  "table_sort": (root) => {
    const $ = view(root, '<table><thead><tr><th>品項</th><th><button id="sort">依數量排序</button></th></tr></thead><tbody></tbody></table><output id="result"></output>');
    let ascending = true;
    const rows = [
      ['Pen', 3],
      ['Book', 1],
      ['Cup', 2]
    ];
    const render = () => {
      $('tbody').replaceChildren(...rows.map(row => {
        const tr = document.createElement('tr');
        for (const cell of row) {
          const td = document.createElement('td');
          td.textContent = cell;
          tr.append(td);
        }
        return tr;
      }));
      $('#result').textContent = rows.map(r => r[0]).join(',');
    };
    $('#sort').onclick = () => {
      rows.sort((a, b) => ascending ? a[1] - b[1] : b[1] - a[1]);
      ascending = !ascending;
      render();
    };
    render();
  },
  "pagination": (root) => {
    const $ = view(root, '<p id="result"></p><button id="previous">上一頁</button><button id="next">下一頁</button>');
    const values = ['A', 'B', 'C', 'D', 'E'];
    let page = 0;
    const render = () => {
      $('#result').textContent = values.slice(page * 2, page * 2 + 2).join(',');
      $('#previous').disabled = page === 0;
      $('#next').disabled = (page + 1) * 2 >= values.length;
    };
    $('#previous').onclick = () => {
      page--;
      render();
    };
    $('#next').onclick = () => {
      page++;
      render();
    };
    render();
  },
  "debounce": (root) => {
    const $ = view(root, '<label>輸入文字<input id="query"></label><output id="result">等待輸入</output>');
    let timer;
    $('#query').oninput = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        $('#result').textContent = $('#query').value;
      }, 150);
    };
    return () => clearTimeout(timer);
  },
  "undo_counter": (root) => {
    const $ = view(root, '<button id="add">加一</button><button id="undo">撤回</button><output id="result">0</output>');
    let value = 0;
    const history = [];
    const render = () => {
      $('#result').textContent = value;
      $('#undo').disabled = !history.length;
    };
    $('#add').onclick = () => {
      history.push(value);
      value++;
      render();
    };
    $('#undo').onclick = () => {
      value = history.pop();
      render();
    };
    render();
  },
  "stopwatch": (root) => {
    const $ = view(root, '<button id="start">開始</button><button id="stop">暫停</button><button id="reset">歸零</button><output id="result">0.0</output>');
    let timer = null,
      start = 0,
      total = 0;
    const draw = () => {
      $('#result').textContent = ((total + (timer !== null ? performance.now() - start : 0)) / 1000).toFixed(1);
    };
    $('#start').onclick = () => {
      if (timer !== null) return;
      start = performance.now();
      timer = setInterval(draw, 50);
    };
    $('#stop').onclick = () => {
      if (timer !== null) {
        total += performance.now() - start;
        clearInterval(timer);
        timer = null;
        draw();
      }
    };
    $('#reset').onclick = () => {
      clearInterval(timer);
      timer = null;
      total = 0;
      draw();
    };
    return () => clearInterval(timer);
  },
  "countdown": (root) => {
    const $ = view(root, '<label>秒數<input id="seconds" type="number" min="0.1" max="60" step="0.1" value="1"></label><button id="start">倒數</button><output id="result">準備</output>');
    let timer;
    $('#start').onclick = () => {
      const seconds = Number($('#seconds').value);
      if (!(seconds > 0 && seconds <= 60)) {
        $('#result').textContent = '請輸入 0–60 秒';
        return;
      }
      clearInterval(timer);
      const end = performance.now() + seconds * 1000;
      timer = setInterval(() => {
        const remaining = Math.max(0, end - performance.now());
        $('#result').textContent = remaining ? (remaining / 1000).toFixed(1) : '完成';
        if (!remaining) clearInterval(timer);
      }, 30);
    };
    return () => clearInterval(timer);
  },
  "stepper": (root) => {
    const $ = view(root, '<progress id="progress" max="3" value="1"></progress><p id="result"></p><button id="next">繼續</button>');
    let step = 1;
    const render = () => {
      $('#result').textContent = '步驟 ' + step + ' / 3';
      $('#progress').value = step;
      $('#next').disabled = step === 3;
    };
    $('#next').onclick = () => {
      step++;
      render();
    };
    render();
  },
  "drag_drop": (root) => {
    const $ = view(root, '<div id="source" draggable="true" style="padding:24px;background:#ded">拖曳卡片</div><div id="target" style="padding:32px;border:2px dashed;margin-top:16px">放到這裡</div><output id="result">未放置</output>');
    $('#source').ondragstart = e => e.dataTransfer.setData('text/plain', 'card-1');
    $('#target').ondragover = e => e.preventDefault();
    $('#target').ondrop = e => {
      e.preventDefault();
      if (e.dataTransfer.getData('text/plain') === 'card-1') {
        $('#target').append($('#source'));
        $('#result').textContent = '已放置';
      }
    };
  },
  "canvas_draw": (root) => {
    const $ = view(root, '<canvas id="canvas" width="300" height="160" style="width:300px;max-width:100%;height:160px;border:1px solid;touch-action:none"></canvas><button id="clear">清除</button><output id="result">0 段</output>');
    const canvas = $('#canvas'),
      context = canvas.getContext('2d');
    let drawing = false,
      segments = 0;
    const point = e => {
      const r = canvas.getBoundingClientRect();
      return [(e.clientX - r.left) * canvas.width / r.width, (e.clientY - r.top) * canvas.height / r.height];
    };
    canvas.onpointerdown = e => {
      drawing = true;
      canvas.setPointerCapture(e.pointerId);
      context.beginPath();
      context.moveTo(...point(e));
    };
    canvas.onpointermove = e => {
      if (!drawing) return;
      context.lineTo(...point(e));
      context.stroke();
      $('#result').textContent = ++segments + ' 段';
    };
    canvas.onpointerup = () => drawing = false;
    $('#clear').onclick = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      segments = 0;
      $('#result').textContent = '0 段';
    };
  },
  "canvas_chart": (root) => {
    const $ = view(root, '<label>非負數值<input id="values" value="2,4,8"></label><button id="draw">繪圖</button><canvas id="chart" width="300" height="160" style="max-width:100%"></canvas><output id="result"></output>');
    $('#draw').onclick = () => {
      const values = $('#values').value.split(',').map(Number);
      if (values.length > 20 || values.some(v => !Number.isFinite(v) || v < 0)) {
        $('#result').textContent = '數值錯誤';
        return;
      }
      const ctx = $('#chart').getContext('2d');
      ctx.clearRect(0, 0, 300, 160);
      ctx.fillStyle = '#286447';
      const max = Math.max(1, ...values);
      values.forEach((v, i) => ctx.fillRect(i * 300 / values.length, 160 - v / max * 150, 300 / values.length - 4, v / max * 150));
      $('#result').textContent = values.join(',');
    };
    $('#draw').click();
  },
  "svg_progress": (root) => {
    const $ = view(root, '<label>進度<input id="percent" type="range" min="0" max="100" value="25"></label><svg width="140" height="140" viewBox="0 0 140 140" aria-hidden="true"><circle cx="70" cy="70" r="50" fill="none" stroke="#ddd" stroke-width="10"/><circle id="ring" cx="70" cy="70" r="50" fill="none" stroke="#286447" stroke-width="10" transform="rotate(-90 70 70)"/></svg><output id="result"></output>');
    const draw = () => {
      const length = 2 * Math.PI * 50;
      $('#ring').style.strokeDasharray = length;
      $('#ring').style.strokeDashoffset = length * (1 - Number($('#percent').value) / 100);
      $('#result').textContent = $('#percent').value + '%';
    };
    $('#percent').oninput = draw;
    draw();
  },
  "file_preview": (root) => {
    const $ = view(root, '<label>選取文字檔<input id="file" type="file" accept=".txt,text/plain"></label><pre id="result">尚未讀取</pre>');
    $('#file').onchange = async () => {
      const file = $('#file').files[0];
      if (!file) return;
      if (file.size > 100000) {
        $('#result').textContent = '檔案過大';
        return;
      }
      $('#result').textContent = await file.text();
    };
  },
  "csv_parser": (root) => {
    const $ = view(root, '<label>CSV 一行<textarea id="csv">a,"b,c"</textarea></label><button id="parse">解析</button><output id="result"></output>');
    $('#parse').onclick = () => {
      const text = $('#csv').value;
      let quote = false,
        value = '',
        fields = [];
      for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (c === '"') {
          if (quote && text[i + 1] === '"') {
            value += '"';
            i++;
          } else quote = !quote;
        } else if (c === ',' && !quote) {
          fields.push(value);
          value = '';
        } else value += c;
      }
      if (quote) {
        $('#result').textContent = '引號未閉合';
        return;
      }
      fields.push(value);
      $('#result').textContent = JSON.stringify(fields);
    };
  },
  "json_viewer": (root) => {
    const $ = view(root, '<label>JSON<textarea id="json">{"x":1}</textarea></label><button id="parse">格式化</button><pre id="result"></pre>');
    $('#parse').onclick = () => {
      try {
        $('#result').textContent = JSON.stringify(JSON.parse($('#json').value), null, 2);
      } catch {
        $('#result').textContent = 'JSON 格式錯誤';
      }
    };
  },
  "json_table": (root) => {
    const $ = view(root, '<label>記錄陣列<textarea id="json">[{"a":1},{"b":2}]</textarea></label><button id="render">建立表格</button><table id="table"></table><output id="result"></output>');
    $('#render').onclick = () => {
      try {
        const rows = JSON.parse($('#json').value);
        if (!Array.isArray(rows) || rows.length > 100 || rows.some(r => !r || typeof r !== 'object' || Array.isArray(r))) throw Error();
        const keys = [...new Set(rows.flatMap(Object.keys))];
        $('#table').replaceChildren();
        for (const values of [keys, ...rows.map(row => keys.map(k => row[k] ?? ''))]) {
          const tr = document.createElement('tr');
          for (const value of values) {
            const td = document.createElement('td');
            td.textContent = String(value);
            tr.append(td);
          }
          $('#table').append(tr);
        }
        $('#result').textContent = rows.length + ' 列 / ' + keys.length + ' 欄';
      } catch {
        $('#result').textContent = '請輸入物件陣列';
      }
    };
  },
  "query_builder": (root) => {
    const $ = view(root, '<label>查詢<input id="query" value="a b"></label><label>頁碼<input id="page" type="number" value="1" min="1"></label><button id="build">建立</button><output id="result"></output>');
    $('#build').onclick = () => {
      const params = new URLSearchParams({
        q: $('#query').value,
        page: $('#page').value
      });
      $('#result').textContent = '?' + params.toString();
    };
  },
  "url_inspector": (root) => {
    const $ = view(root, '<label>HTTP 網址<input id="url" value="https://example.test:8443/a"></label><button id="inspect">解析</button><output id="result"></output>');
    $('#inspect').onclick = () => {
      try {
        const url = new URL($('#url').value);
        if (!['http:', 'https:'].includes(url.protocol)) throw Error();
        $('#result').textContent = url.hostname + ' | ' + (url.port || 'default') + ' | ' + url.pathname;
      } catch {
        $('#result').textContent = '網址格式錯誤';
      }
    };
  },
  "date_difference": (root) => {
    const $ = view(root, '<label>開始<input id="start" type="date" value="2024-02-28"></label><label>結束<input id="end" type="date" value="2024-03-01"></label><button id="calculate">計算</button><output id="result"></output>');
    $('#calculate').onclick = () => {
      const a = Date.parse($('#start').value + 'T00:00:00Z'),
        b = Date.parse($('#end').value + 'T00:00:00Z');
      $('#result').textContent = Number.isFinite(a + b) ? String((b - a) / 86400000) + ' 天' : '日期錯誤';
    };
  },
  "timezone": (root) => {
    const $ = view(root, '<label>UTC 時刻<input id="instant" value="2026-01-01T00:00:00Z"></label><label>時區<select id="zone"><option>Asia/Taipei</option><option>UTC</option><option>America/New_York</option></select></label><button id="format">顯示</button><output id="result"></output>');
    $('#format').onclick = () => {
      const date = new Date($('#instant').value);
      try {
        $('#result').textContent = new Intl.DateTimeFormat('en-GB', {
          timeZone: $('#zone').value,
          hour: '2-digit',
          minute: '2-digit',
          hourCycle: 'h23'
        }).format(date);
      } catch {
        $('#result').textContent = '時間錯誤';
      }
    };
  },
  "unit_converter": (root) => {
    const $ = view(root, '<label>數值<input id="value" type="number" value="2"></label><label>來源<select id="unit"><option value="m">m</option><option value="cm">cm</option><option value="inch">inch</option></select></label><button id="convert">轉成公分</button><output id="result"></output>');
    $('#convert').onclick = () => {
      const units = {
        m: 1,
        cm: .01,
        inch: .0254
      };
      const value = Number($('#value').value);
      $('#result').textContent = Number.isFinite(value) ? String(Number((value * units[$('#unit').value] * 100).toFixed(6))) + ' cm' : '數值錯誤';
    };
  },
  "temperature": (root) => {
    const $ = view(root, '<label>華氏<input id="fahrenheit" type="number" value="32"></label><button id="convert">轉攝氏</button><output id="result"></output>');
    $('#convert').onclick = () => {
      const f = Number($('#fahrenheit').value);
      $('#result').textContent = Number.isFinite(f) && f >= -459.67 ? Number(((f - 32) * 5 / 9).toFixed(3)) + ' °C' : '數值錯誤';
    };
  },
  "rgb": (root) => {
    const $ = view(root, '<label>R<input id="r" type="range" min="0" max="255" value="0"></label><label>G<input id="g" type="range" min="0" max="255" value="0"></label><label>B<input id="b" type="range" min="0" max="255" value="0"></label><div id="swatch" style="height:80px"></div><output id="result"></output>');
    const render = () => {
      const hex = '#' + ['r', 'g', 'b'].map(k => Number($('#' + k).value).toString(16).padStart(2, '0')).join('');
      $('#swatch').style.background = hex;
      $('#result').textContent = hex;
    };
    for (const input of root.querySelectorAll('input')) input.oninput = render;
    render();
  },
  "hex_color": (root) => {
    const $ = view(root, '<label>六碼 Hex<input id="hex" value="#12abff"></label><button id="parse">拆解 RGB</button><output id="result"></output>');
    $('#parse').onclick = () => {
      const match = /^#([0-9a-f]{6})$/i.exec($('#hex').value);
      $('#result').textContent = match ? [0, 2, 4].map(i => parseInt(match[1].slice(i, i + 2), 16)).join(',') : '顏色格式錯誤';
    };
  },
  "gradient": (root) => {
    const $ = view(root, '<label>起色<input id="a" type="color" value="#ff0000"></label><label>末色<input id="b" type="color" value="#0000ff"></label><label>角度<input id="angle" type="range" min="0" max="360" value="90"></label><div id="preview" style="height:100px"></div><output id="result"></output>');
    const render = () => {
      const value = 'linear-gradient(' + $('#angle').value + 'deg, ' + $('#a').value + ', ' + $('#b').value + ')';
      $('#preview').style.background = value;
      $('#result').textContent = value;
    };
    for (const input of root.querySelectorAll('input')) input.oninput = render;
    render();
  },
  "clipboard": (root) => {
    const $ = view(root, '<label>文字<input id="text" value="copy me"></label><button id="copy">複製</button><output id="result"></output>');
    $('#copy').onclick = async () => {
      try {
        await navigator.clipboard.writeText($('#text').value);
        $('#result').textContent = '已複製';
      } catch {
        $('#result').textContent = '瀏覽器未允許複製';
      }
    };
  },
  "keyboard": (root) => {
    const $ = view(root, '<p>按空白鍵計數；輸入框內不攔截。</p><input aria-label="測試輸入"><button id="focus">聚焦後按空白</button><output id="result">0</output>');
    let count = 0;
    const handler = e => {
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        e.preventDefault();
        $('#result').textContent = ++count;
      }
    };
    root.addEventListener('keydown', handler);
    return () => root.removeEventListener('keydown', handler);
  },
  "preferences": (root) => {
    const $ = view(root, '<label>暱稱<input id="name"></label><button id="save">保存</button><output id="result"></output>');
    try {
      const data = JSON.parse(localStorage.getItem('lab.preferences') || '{}');
      if (typeof data.name === 'string') $('#name').value = data.name;
    } catch {}
    $('#save').onclick = () => {
      try {
        localStorage.setItem('lab.preferences', JSON.stringify({
          name: $('#name').value
        }));
        $('#result').textContent = '已保存';
      } catch {
        $('#result').textContent = '無法保存';
      }
    };
  },
  "session": (root) => {
    const $ = view(root, '<button id="visit">記錄一次</button><button id="reset">歸零</button><output id="result"></output>');
    let count = Number(sessionStorage.getItem('lab.visits') || 0);
    if (!Number.isSafeInteger(count) || count < 0) count = 0;
    const render = () => {
      $('#result').textContent = count;
      sessionStorage.setItem('lab.visits', count);
    };
    $('#visit').onclick = () => {
      count++;
      render();
    };
    $('#reset').onclick = () => {
      count = 0;
      render();
    };
    render();
  },
  "worker": (root) => {
    const $ = view(root, '<label>上限<input id="limit" type="number" min="1" max="100000" value="30"></label><button id="run">計算質數數量</button><output id="result"></output>');
    const source = 'onmessage=e=>{let n=e.data,count=0;for(let x=2;x<=n;x++){let prime=true;for(let d=2;d*d<=x;d++)if(x%d===0){prime=false;break;}if(prime)count++;}postMessage(count)}';
    const url = URL.createObjectURL(new Blob([source], {
      type: 'text/javascript'
    }));
    const worker = new Worker(url);
    URL.revokeObjectURL(url);
    worker.onmessage = e => {
      $('#result').textContent = e.data + ' 個';
    };
    worker.onerror = () => {
      $('#result').textContent = 'Worker 執行失敗';
    };
    $('#run').onclick = () => {
      const n = Number($('#limit').value);
      if (!Number.isInteger(n) || n < 1 || n > 100000) {
        $('#result').textContent = '範圍錯誤';
        return;
      }
      worker.postMessage(n);
    };
    return () => worker.terminate();
  },
  "fetch": (root) => {
    const $ = view(root, '<button id="load">讀取資料</button><output id="result">尚未讀取</output>');
    let controller;
    $('#load').onclick = async () => {
      controller?.abort();
      controller = new AbortController();
      try {
        const response = await fetch('./data.json', {
          signal: controller.signal
        });
        if (!response.ok) throw Error('HTTP ' + response.status);
        const data = await response.json();
        $('#result').textContent = data.items.map(x => x.name).join(',');
      } catch (error) {
        if (error.name !== 'AbortError') $('#result').textContent = '讀取失敗';
      }
    };
    return () => controller?.abort();
  },
  "intersection": (root) => {
    const $ = view(root, '<div id="viewport" style="height:140px;overflow:auto;border:1px solid"><div id="first" style="height:130px">第一張</div><div style="height:150px">中間</div><div id="last" style="height:130px">最後一張</div></div><output id="result">尚未觀察</output>');
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries)
        if (entry.isIntersecting) $('#result').textContent = entry.target.id;
    }, {
      root: $('#viewport'),
      threshold: .5
    });
    observer.observe($('#first'));
    observer.observe($('#last'));
    return () => observer.disconnect();
  },
};
