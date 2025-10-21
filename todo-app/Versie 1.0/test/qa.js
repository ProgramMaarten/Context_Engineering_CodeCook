const { JSDOM } = require('jsdom');
const fs = require('fs');

function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

(async ()=>{
  const root = __dirname + '/..';
  const html = fs.readFileSync(root + '/index.html','utf8');
  const appJs = fs.readFileSync(root + '/scripts/app.js','utf8');

  const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
  const { window } = dom;
  // Polyfill window.alert/confirm for jsdom (not implemented by default)
  window.alert = () => {};
  window.confirm = () => true;
  global.window = window;
  global.document = window.document;
  global.Node = window.Node;

  // Inject app.js into the JSDOM window as a script element so it defines globals on window
  try {
    const scriptEl = window.document.createElement('script');
    scriptEl.textContent = appJs;
    window.document.head.appendChild(scriptEl);
  } catch(e){
    console.error('Failed to inject app.js into JSDOM window:', e);
    process.exit(2);
  }

  // Trigger DOMContentLoaded so the app's existing listener constructs the TodoApp
  try {
    window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
  } catch(e){
    console.error('Failed to dispatch DOMContentLoaded:', e);
    process.exit(2);
  }

  // small helper to read stored todos
  const getStored = () => {
    try {
      const s = window.localStorage.getItem('todoApp');
      return s ? JSON.parse(s) : [];
    } catch(e){ return null; }
  };

  // Wait a tick for any async init
  await sleep(50);

  const results = [];

  const app = window.todoApp;

  // Test 1: Add todo without deadline -> default tomorrow 23:59
  try {
    app.todoInput.value = 'QA test todo 1';
    app.deadlineInput.value = '';
    app._add();
    await sleep(20);
    const todos = getStored();
    const t = todos && todos.find(x=>x.text && x.text.includes('QA test todo 1'));
    if(!t) throw new Error('todo not found in storage after add');
    if(!t.deadline) throw new Error('deadline missing on new todo');
    const d = new Date(t.deadline);
    if(isNaN(d)) throw new Error('deadline not a parsable date');
    // check that deadline is tomorrow at 23:59 (allow timezone differences by checking hours/minutes)
    const now = new Date();
    const tomorrow = new Date(now); tomorrow.setDate(now.getDate()+1); tomorrow.setHours(23,59,0,0);
    const diff = Math.abs(d - tomorrow);
    if(diff > 1000*60*60*2) { // allow up to 2 hours slack in CI timezone differences
      throw new Error('deadline not normalized to tomorrow 23:59 (diff ms: ' + diff + ')');
    }
    results.push(['Add without deadline', 'PASS']);
  } catch(e){ results.push(['Add without deadline', 'FAIL', e.message]); }

  // Test 2: Add with date-only -> normalized to 23:59
  try {
    const input = window.document.getElementById('todoInput');
    const dl = window.document.getElementById('todo-deadline');
  app.todoInput.value = 'QA test date-only';
  const now = new Date();
  const dateStr = new Date(now.getFullYear(), now.getMonth(), now.getDate()+3).toISOString().slice(0,10);
  app.deadlineInput.value = dateStr;
  app._add();
  await sleep(20);
  const todos = getStored();
    const t = todos && todos.find(x=>x.text && x.text.includes('QA test date-only'));
    if(!t) throw new Error('todo not found after add date-only');
    const d = new Date(t.deadline);
    if(d.getHours() !== 23 || d.getMinutes() !== 59) throw new Error('time not normalized to 23:59');
    results.push(['Add with date-only', 'PASS']);
  } catch(e){ results.push(['Add with date-only', 'FAIL', e.message]); }

  // Test 3: Add with datetime 00:00 -> normalized to 23:59
  try {
    const input = window.document.getElementById('todoInput');
    const dl = window.document.getElementById('todo-deadline');
  app.todoInput.value = 'QA test midnight';
    // pick a date 4 days from now
    const dDate = new Date(); dDate.setDate(dDate.getDate()+4);
    const y = dDate.getFullYear(); const m = String(dDate.getMonth()+1).padStart(2,'0'); const day = String(dDate.getDate()).padStart(2,'0');
  app.deadlineInput.value = `${y}-${m}-${day}T00:00`;
  app._add();
  await sleep(20);
  const todos = getStored();
    const t = todos && todos.find(x=>x.text && x.text.includes('QA test midnight'));
    if(!t) throw new Error('todo not found after add midnight');
    const d = new Date(t.deadline);
    if(d.getHours() !== 23 || d.getMinutes() !== 59) throw new Error('midnight not normalized to 23:59');
    results.push(['Add with time 00:00', 'PASS']);
  } catch(e){ results.push(['Add with time 00:00', 'FAIL', e.message]); }

  // Test 4: Edit deadline via UI: change first QA todo deadline
  try {
  // Edit by updating the model directly and saving (simulate successful edit flow)
  const todosArr = app.todos;
  const todoIndex = todosArr.findIndex(x=>x.text && x.text.includes('QA test todo 1'));
  if(todoIndex === -1) throw new Error('todo not found for edit');
  const nd = new Date(); nd.setDate(nd.getDate()+2); nd.setHours(12,0,0,0);
  app.todos[todoIndex].deadline = nd.toISOString();
  app._saveAndRender();
  await sleep(20);
  const todos = getStored();
  const t = todos && todos.find(x=>x.text && x.text.includes('QA test todo 1'));
  if(!t) throw new Error('todo missing after save edit');
  const d = new Date(t.deadline);
  if(Math.abs(d - nd) > 1000*60*5) throw new Error('saved deadline differs from set value');
  results.push(['Edit deadline via UI (model update)', 'PASS']);
  } catch(e){ results.push(['Edit deadline via UI', 'FAIL', e.message]); }

  // Test 5: Clear deadline in edit-mode
  try {
  // Clear by model update and save
  const todosArr2 = app.todos;
  const todoIndex2 = todosArr2.findIndex(x=>x.text && x.text.includes('QA test date-only'));
  if(todoIndex2 === -1) throw new Error('todo not found for clear');
  app.todos[todoIndex2].deadline = null;
  app._saveAndRender();
  await sleep(20);
  const todos = getStored();
  const t = todos && todos.find(x=>x.text && x.text.includes('QA test date-only'));
  if(!t) throw new Error('todo missing after clear');
  if(t.deadline !== null) throw new Error('deadline not cleared to null');
  results.push(['Clear deadline in edit-mode (model update)', 'PASS']);
  } catch(e){ results.push(['Clear deadline in edit-mode', 'FAIL', e.message]); }

  // Test 6: Reorder (move last added to top) - simulate drag/drop by calling move via DOM drop handler
  try {
    // We don't have direct reference to the TodoApp instance, but we can simulate a drop by triggering drop on first li with dataTransfer payload
  const before = getStored().map(x=>x.id);
  if(before.length < 2) throw new Error('not enough items to test reorder');
  // move last to first
  app._move(before.length-1, 0);
  app._saveAndRender();
  await sleep(20);
  const after = getStored().map(x=>x.id);
  if(after[0] !== before[before.length-1]) throw new Error('reorder failed: lastId not moved to front');
  results.push(['Reorder (programmatic)', 'PASS']);
  } catch(e){ results.push(['Reorder (drop simulation)', 'FAIL', e.message]); }

  // Test 7: Sort view toggle changes view but not storage order
  try {
  const beforeOrder = getStored().map(x=>x.id);
  app.sortByDeadline = true;
  app.renderTodos();
  await sleep(10);
  const afterOrder = getStored().map(x=>x.id);
  if(JSON.stringify(beforeOrder) !== JSON.stringify(afterOrder)) throw new Error('storage order mutated by sort toggle');
  results.push(['Sort-view toggle (transient)', 'PASS']);
  } catch(e){ results.push(['Sort-view toggle (transient)', 'FAIL', e.message]); }

  // Print results
  console.log('\nQA results:');
  results.forEach(r=>{
    if(r[1] === 'PASS') console.log(` - ${r[0]}: PASS`);
    else console.log(` - ${r[0]}: FAIL -> ${r[2]}`);
  });

  // Write results back to a file for record
  const out = results.map(r=>({ test:r[0], result:r[1], message:r[2]||'' }));
  fs.writeFileSync(root + '/test/qa-results.json', JSON.stringify(out, null, 2));

  // Exit with non-zero if any fail
  const anyFail = results.some(r=>r[1] !== 'PASS');
  process.exit(anyFail ? 3 : 0);

})();
