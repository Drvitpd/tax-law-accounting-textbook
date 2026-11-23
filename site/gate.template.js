/* หน้ากั้นรหัสเข้าแอป (ระดับ 1: รหัสเดียวทั้งเล่ม) กันการเข้าโดยบังเอิญ ไม่ใช่ระบบความปลอดภัย */
(function () {
  var HASH = "__GATE_HASH__";
  var KEY = "atx-gate-ok";
  var BOOK = "__BOOK__";
  function stored() {
    try { if (localStorage.getItem(KEY) === HASH) return true; } catch (e) {}
    try { if (sessionStorage.getItem(KEY) === HASH) return true; } catch (e) {}
    return false;
  }
  if (stored()) return;
  var root = document.documentElement;
  root.classList.add("atx-locked");
  var css = document.createElement("style");
  css.textContent =
    "html.atx-locked body>*:not(#atx-lock){display:none!important}" +
    "#atx-lock{position:fixed;inset:0;display:grid;place-items:center;padding:16px;background:#f3f5f7;z-index:9999;font-family:'Noto Sans Thai',system-ui,sans-serif;color:#15233a}" +
    "#atx-lock .box{background:#fff;border:1px solid #d5dbe3;border-radius:12px;padding:24px;max-width:420px;width:100%}" +
    "#atx-lock .brandbar{text-align:center;margin:0 0 16px}" +
    "#atx-lock .brandbar img{width:220px;max-width:70%;height:auto}" +
    "#atx-lock h1,#atx-lock p{text-align:center}" +
    "#atx-lock h1{font-family:'Noto Serif Thai',Georgia,serif;font-size:1.3rem;margin:0 0 6px}" +
    "#atx-lock p{margin:0 0 14px;color:#5a6678;font-size:.95rem}" +
    "#atx-lock .row{display:flex;gap:8px}" +
    "#atx-lock input[type=password],#atx-lock input[type=text]{flex:1;font:inherit;padding:8px 10px;border:1px solid #d5dbe3;border-radius:8px;min-width:0}" +
    "#atx-lock button{font:inherit;font-weight:700;padding:8px 14px;border-radius:8px;border:1px solid #0d6466;cursor:pointer}" +
    "#atx-lock .show{background:#fff;color:#0d6466}" +
    "#atx-lock .go{background:#0d6466;color:#fff;width:100%;margin-top:12px}" +
    "#atx-lock label{display:flex;gap:8px;align-items:center;margin-top:10px;font-size:.92rem}" +
    "#atx-lock .err{color:#b3261e;font-size:.9rem;margin-top:8px;min-height:1.2em}";
  document.head.appendChild(css);

  function norm(s) { return s.toUpperCase().replace(/[\s\-]/g, ""); }
  function sha(s) {
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)).then(function (b) {
      return Array.from(new Uint8Array(b)).map(function (x) { return x.toString(16).padStart(2, "0"); }).join("");
    });
  }
  function build() {
    var d = document.createElement("div");
    d.id = "atx-lock";
    d.innerHTML =
      '<form class="box" autocomplete="off">' +
      '<div class="brandbar"><img src="__GATE_LOGO__" alt="__ALT__"></div>' +
      "<h1>แอปประจำเล่ม " + BOOK + "</h1>" +
      "<p>สำหรับผู้ซื้อตำรา ใส่รหัสเข้าแอปที่พิมพ์ไว้ในตำรา</p>" +
      '<div class="row"><input id="atx-code" type="password" aria-label="รหัสเข้าแอป" placeholder="รหัสเข้าแอป">' +
      '<button type="button" class="show">แสดง</button></div>' +
      '<label><input id="atx-remember" type="checkbox" checked> จำรหัสในเครื่องนี้</label>' +
      '<button type="submit" class="go">เปิดแอป</button>' +
      '<div class="err" role="alert"></div></form>';
    document.body.appendChild(d);
    var inp = d.querySelector("#atx-code"), err = d.querySelector(".err");
    d.querySelector(".show").onclick = function () {
      var t = inp.type === "password"; inp.type = t ? "text" : "password"; this.textContent = t ? "ซ่อน" : "แสดง";
    };
    d.querySelector("form").onsubmit = function (ev) {
      ev.preventDefault();
      sha(norm(inp.value)).then(function (h) {
        if (h !== HASH) { err.textContent = "รหัสไม่ถูกต้อง โปรดดูรหัสที่พิมพ์ไว้ในตำรา"; return; }
        var store = d.querySelector("#atx-remember").checked ? "localStorage" : "sessionStorage";
        try { window[store].setItem(KEY, HASH); } catch (e) {}
        d.remove(); root.classList.remove("atx-locked");
      });
    };
    inp.focus();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
})();
