/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");

// Test the real submit handler with simulated responses. No network access.
async function contactCase(response, expected, message = "") {
  const state = [];
  let cursor = 0;
  let payload;
  const context = {
    Error,
    exports: {},
    require: name => {
      if (name === "react") return { useState: initial => {
        const index = cursor++;
        if (!(index in state)) state[index] = initial;
        return [state[index], value => { state[index] = value; }];
      }};
      if (name === "react/jsx-runtime") return { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) };
      throw new Error("Unexpected import: " + name);
    },
    FormData: class { constructor(form) { this.form = form; } get(key) { return this.form[key] ?? ""; } },
    fetch: async (url, options) => {
      assert.equal(url, "/api/contact");
      assert.equal(options.method, "POST");
      payload = JSON.parse(options.body);
      if (response instanceof Error) throw response;
      return { ok: response.httpOk, json: async () => response.body };
    },
  };
  const js = ts.transpileModule(fs.readFileSync("src/components/contact-form.tsx", "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  vm.runInNewContext(js, context);
  const element = context.exports.ContactForm();
  await element.props.onSubmit({ preventDefault() {}, currentTarget: {
    name: "Test", email: "test@example.invalid", company: "Testbetrieb",
    message: "Simulierter Formulartest", website: "",
  }});
  assert.equal(state[0], expected);
  assert.deepEqual(Object.keys(payload), ["name", "email", "company", "message", "website"]);
  if (message) assert.equal(state[1], message);
  cursor = 0;
  const rendered = context.exports.ContactForm();
  if (expected === "ok") assert.equal(rendered.props.role, "status");
}

function motionCase(reduce) {
  let nextId = 0;
  const timers = new Map(), intervals = new Map();
  const label = {}, number = {};
  const fade = { style: {}, querySelector: selector => selector === ".stat-lbl" ? label : number };
  const document = {
    querySelector: () => null, querySelectorAll: () => [],
    getElementById: id => id === "statFade" ? fade : null,
    documentElement: { scrollHeight: 900, clientHeight: 900 },
  };
  const window = {
    matchMedia: () => ({ matches: reduce }), scrollY: 0,
    setTimeout: fn => { const id = ++nextId; timers.set(id, () => { timers.delete(id); fn(); }); return id; },
    setInterval: fn => { const id = ++nextId; intervals.set(id, fn); return id; },
    clearTimeout: id => timers.delete(id), clearInterval: id => intervals.delete(id),
    requestAnimationFrame: () => ++nextId, cancelAnimationFrame() {},
    addEventListener() {}, removeEventListener() {},
  };
  vm.runInNewContext(fs.readFileSync("public/blau-motion.js", "utf8"), { window, document });
  const dispose = window.initSynotixMotion();
  assert.match(number.innerHTML, /01.*Analyse/);
  assert.equal(intervals.size, reduce ? 0 : 1);
  if (!reduce) {
    const rotate = [...intervals.values()][0];
    for (const expected of ["Umsetzung", "Begleitung", "Analyse"]) {
      rotate();
      [...timers.values()].at(-1)();
      assert.ok(number.innerHTML.includes(expected));
      assert.doesNotMatch(label.textContent, /84|100|DSGVO|schnellere/);
    }
  }
  dispose();
  assert.equal(timers.size, 0);
  assert.equal(intervals.size, 0);
}

(async () => {
  await contactCase({ httpOk: true, body: { ok: true } }, "ok");
  await contactCase({ httpOk: false, body: { error: "Simulierter Serverfehler" } }, "error", "Simulierter Serverfehler");
  await contactCase(new Error("Simulierter Netzfehler"), "error", "Simulierter Netzfehler");
  motionCase(true);
  motionCase(false);
  console.log("PASS: 3 simulated form response cases; motion rotation, reduced motion and disposal. No messages sent.");
})().catch(error => { console.error(error); process.exitCode = 1; });
