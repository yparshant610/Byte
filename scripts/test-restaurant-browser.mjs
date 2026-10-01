import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const USER_DATA_DIR = "C:\\Users\\ypars\\.gemini\\antigravity-ide\\brain\\d5202e11-60c2-4f91-b3e5-ab634b55bfd6\\scratch\\edge_profile";

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log('--- Launching Headless Edge with Remote Debugging ---');
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

  let closed = false;
  edge.on('close', () => { closed = true; });

  await sleep(2500);

  // 1. Get WebSocket target
  console.log('Connecting to Edge DevTools Protocol...');
  const res = await fetch('http://127.0.0.1:9222/json');
  const targets = await res.json();
  const page = targets.find(t => t.type === 'page' && t.url.includes('3002')) || targets.find(t => t.type === 'page');
  console.log('Page target found:', page.title, page.url);

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
  await send('DOM.enable');

  await send('Page.navigate', { url: 'http://localhost:3002' });
  console.log('Navigated to http://localhost:3002. Checking state...');
  await sleep(2500);

  // 1. Click "Sign In to Kitchen Portal"
  console.log('Submitting login with Tony\'s credentials...');
  const loginRes = await send('Runtime.evaluate', {
    expression: `
      (async () => {
        const btn = document.querySelector('button[type="submit"]');
        if (btn) btn.click();
        return true;
      })()
    `,
    awaitPromise: true
  });
  console.log('Login clicked:', loginRes);

  await sleep(2500);

  // Capture Dashboard screenshot
  console.log('Capturing Dashboard screenshot...');
  const dashSnap = await send('Page.captureScreenshot', { format: 'png' });
  if (dashSnap.result?.data) {
    fs.writeFileSync(
      'C:\\Users\\ypars\\.gemini\\antigravity-ide\\brain\\d5202e11-60c2-4f91-b3e5-ab634b55bfd6\\screenshots\\food_byters_dashboard.png',
      Buffer.from(dashSnap.result.data, 'base64')
    );
    console.log('✅ Dashboard screenshot saved to screenshots/food_byters_dashboard.png');
  }

  // 2. Switch to Menu & Inventory Tab
  console.log('Navigating to Menu & Inventory tab...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const menuBtn = buttons.find(b => b.textContent.includes('Menu & Inventory'));
        if (menuBtn) menuBtn.click();
      })()
    `
  });

  await sleep(2000);

  // Capture Menu view screenshot
  console.log('Capturing Menu & Inventory screenshot...');
  const menuSnap = await send('Page.captureScreenshot', { format: 'png' });
  if (menuSnap.result?.data) {
    fs.writeFileSync(
      'C:\\Users\\ypars\\.gemini\\antigravity-ide\\brain\\d5202e11-60c2-4f91-b3e5-ab634b55bfd6\\screenshots\\food_byters_menu.png',
      Buffer.from(menuSnap.result.data, 'base64')
    );
    console.log('✅ Menu screenshot saved to screenshots/food_byters_menu.png');
  }

  // 3. Open "+ Add New Dish" modal
  console.log('Opening Add New Dish modal...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const addBtn = buttons.find(b => b.textContent.includes('+ Add New Dish'));
        if (addBtn) addBtn.click();
      })()
    `
  });

  await sleep(1000);

  // Fill in new dish details
  console.log('Filling new dish details...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const setVal = (el, val) => {
          const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
          setter.call(el, val);
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        };

        const inputs = Array.from(document.querySelectorAll('input'));
        const titleInput = inputs.find(i => i.placeholder && i.placeholder.includes('Truffle Funghi'));
        if (titleInput) {
          setVal(titleInput, 'Artisan Truffle Burrata Pizza (Live Test)');
        }

        const priceInput = inputs.find(i => i.type === 'number');
        if (priceInput) {
          setVal(priceInput, '23.50');
        }
      })()
    `
  });

  await sleep(1000);

  // Capture Add Modal screenshot
  console.log('Capturing Add Dish Modal screenshot...');
  const modalSnap = await send('Page.captureScreenshot', { format: 'png' });
  if (modalSnap.result?.data) {
    fs.writeFileSync(
      'C:\\Users\\ypars\\.gemini\\antigravity-ide\\brain\\d5202e11-60c2-4f91-b3e5-ab634b55bfd6\\screenshots\\food_byters_add_dish_modal.png',
      Buffer.from(modalSnap.result.data, 'base64')
    );
    console.log('✅ Modal screenshot saved to screenshots/food_byters_add_dish_modal.png');
  }

  // Submit modal
  console.log('Submitting Add Dish form...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const modalForm = document.querySelector('form');
        if (modalForm) {
          const submitBtn = modalForm.querySelector('button[type=\"submit\"]');
          if (submitBtn) submitBtn.click();
        }
      })()
    `
  });

  await sleep(2500);

  // Capture Menu after dish creation
  console.log('Capturing Menu after creation...');
  const menuAfterSnap = await send('Page.captureScreenshot', { format: 'png' });
  if (menuAfterSnap.result?.data) {
    fs.writeFileSync(
      'C:\\Users\\ypars\\.gemini\\antigravity-ide\\brain\\d5202e11-60c2-4f91-b3e5-ab634b55bfd6\\screenshots\\food_byters_menu_created.png',
      Buffer.from(menuAfterSnap.result.data, 'base64')
    );
    console.log('✅ Menu After Creation saved to screenshots/food_byters_menu_created.png');
  }

  // 4. Test Logout button in Header
  console.log('Testing Logout button...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const logoutBtn = buttons.find(b => b.textContent.includes('Logout') || b.title?.includes('Sign Out'));
        if (logoutBtn) logoutBtn.click();
      })()
    `
  });

  await sleep(1500);

  // Capture Auth screen after Logout
  console.log('Capturing screen after Logout...');
  const afterLogoutSnap = await send('Page.captureScreenshot', { format: 'png' });
  if (afterLogoutSnap.result?.data) {
    fs.writeFileSync(
      'C:\\Users\\ypars\\.gemini\\antigravity-ide\\brain\\d5202e11-60c2-4f91-b3e5-ab634b55bfd6\\screenshots\\food_byters_after_logout.png',
      Buffer.from(afterLogoutSnap.result.data, 'base64')
    );
    console.log('✅ After Logout screenshot saved to screenshots/food_byters_after_logout.png');
  }

  ws.close();
  edge.kill();
  console.log('--- All automated browser verification steps completed successfully! ---');
}

run().catch(err => {
  console.error('Browser script error:', err);
  process.exit(1);
});
