import { spawn } from 'child_process';
import fs from 'fs';

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const USER_DATA_DIR = "C:\\Users\\ypars\\.gemini\\antigravity-ide\\brain\\d5202e11-60c2-4f91-b3e5-ab634b55bfd6\\scratch\\edge_profile";

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  const edge = spawn(EDGE_PATH, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-sync',
    '--remote-debugging-port=9222',
    `--user-data-dir=${USER_DATA_DIR}`,
    '--window-size=1440,900',
    'http://localhost:3002'
  ]);

  await sleep(2500);
  const res = await fetch('http://127.0.0.1:9222/json');
  const targets = await res.json();
  const page = targets.find(t => t.type === 'page' && t.url.includes('3002')) || targets.find(t => t.type === 'page');

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let msgId = 1;
  const pending = new Map();

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      pending.get(data.id)(data);
      pending.delete(data.id);
    }
  };

  await new Promise(resolve => ws.onopen = resolve);

  function send(method, params = {}) {
    const id = msgId++;
    return new Promise((resolve) => {
      pending.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Page.navigate', { url: 'http://localhost:3002' });
  await sleep(2000);

  // Click login
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = document.querySelector('button[type=\"submit\"]');
        if (btn) btn.click();
      })()
    `
  });
  await sleep(2000);

  // Click Payouts & Financials
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const payoutBtn = buttons.find(b => b.textContent.includes('Payouts & Financials'));
        if (payoutBtn) payoutBtn.click();
      })()
    `
  });
  await sleep(2000);

  const snap = await send('Page.captureScreenshot', { format: 'png' });
  if (snap.result?.data) {
    fs.writeFileSync(
      'C:\\Users\\ypars\\.gemini\\antigravity-ide\\brain\\d5202e11-60c2-4f91-b3e5-ab634b55bfd6\\screenshots\\food_byters_payouts.png',
      Buffer.from(snap.result.data, 'base64')
    );
    console.log('✅ Payouts screenshot saved.');
  }

  ws.close();
  edge.kill();
}

run().catch(console.error);
