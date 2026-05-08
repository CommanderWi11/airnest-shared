(async function () {
  var HASH = "21e30c36a1e3abe706578583595d23fda6063f36f6652c375b9b7cbac33c09f1";
  var KEY  = "airnest-shared.unlocked";

  if (sessionStorage.getItem(KEY) === HASH) return;

  document.documentElement.style.visibility = "hidden";

  function build() {
    var overlay = document.createElement("div");
    overlay.innerHTML =
      '<style>' +
      '@import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500&family=JetBrains+Mono:wght@400&display=swap");' +
      '*{box-sizing:border-box;margin:0;padding:0}' +
      '.gate{position:fixed;inset:0;background:#080f18;display:flex;align-items:center;justify-content:center;font-family:"DM Sans",system-ui,sans-serif;color:#edf5fc;z-index:999999;visibility:visible!important;padding:20px;}' +
      '.gate-card{background:#0d1927;border:1px solid #172335;border-radius:16px;padding:40px 36px 32px;width:100%;max-width:340px;text-align:center;}' +
      '.gate-logo{width:44px;height:44px;background:#0077BB;border-radius:10px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-family:"DM Serif Display",serif;font-size:22px;color:#fff;font-weight:400;}' +
      '.gate-title{font-family:"DM Serif Display",serif;font-size:22px;color:#edf5fc;margin-bottom:4px;}' +
      '.gate-sub{font-size:13px;color:#3a5572;margin-bottom:28px;}' +
      '.gate input{width:100%;padding:12px 14px;background:#080f18;border:1px solid #172335;border-radius:8px;color:#edf5fc;font-family:"DM Sans",sans-serif;font-size:14px;outline:none;transition:border-color .2s;letter-spacing:.05em;}' +
      '.gate input:focus{border-color:#0077BB;}' +
      '.gate-err{color:#ff6b5b;font-size:12px;margin-top:10px;min-height:18px;text-align:left;}' +
      '.gate-btn{width:100%;margin-top:14px;padding:13px;background:#0077BB;color:#fff;border:none;border-radius:8px;font-family:"DM Sans",sans-serif;font-weight:500;font-size:14px;cursor:pointer;transition:background .2s,opacity .2s;letter-spacing:.02em;}' +
      '.gate-btn:hover{background:#0069a8;}' +
      '.gate-btn:active{background:#005488;}' +
      '.gate-btn:disabled{opacity:.5;cursor:not-allowed;}' +
      '.gate-footer{margin-top:20px;font-family:"JetBrains Mono",monospace;font-size:9px;letter-spacing:.12em;color:#172335;text-transform:uppercase;}' +
      '</style>' +
      '<div class="gate"><div class="gate-card">' +
      '<div class="gate-logo">A</div>' +
      '<div class="gate-title">Airnest</div>' +
      '<div class="gate-sub">Shared documents — restricted access</div>' +
      '<form id="gate-form">' +
      '<input type="password" id="gate-pw" placeholder="Enter password" autofocus autocomplete="current-password"/>' +
      '<div class="gate-err" id="gate-err"></div>' +
      '<button type="submit" class="gate-btn" id="gate-submit">Unlock</button>' +
      '</form>' +
      '<div class="gate-footer">Airnest Homes SL · Internal only</div>' +
      '</div></div>';
    document.body.appendChild(overlay);

    document.getElementById("gate-form").addEventListener("submit", async function (e) {
      e.preventDefault();
      var btn = document.getElementById("gate-submit");
      var err = document.getElementById("gate-err");
      var v   = document.getElementById("gate-pw").value;
      if (!v) return;

      btn.disabled    = true;
      btn.textContent = "Verifying…";
      err.textContent = "";

      var buf     = new TextEncoder().encode(v);
      var hashBuf = await crypto.subtle.digest("SHA-256", buf);
      var hex     = Array.from(new Uint8Array(hashBuf))
                      .map(function (b) { return b.toString(16).padStart(2, "0"); }).join("");

      if (hex === HASH) {
        btn.textContent = "✓ Unlocked";
        sessionStorage.setItem(KEY, HASH);
        setTimeout(function () {
          overlay.remove();
          document.documentElement.style.visibility = "";
        }, 300);
      } else {
        err.textContent             = "Incorrect password — try again.";
        btn.disabled                = false;
        btn.textContent             = "Unlock";
        document.getElementById("gate-pw").value = "";
        document.getElementById("gate-pw").focus();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
