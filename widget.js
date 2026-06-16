(function () {
  // ---- Styles ----
  var css = `
  #wa-widget { position: fixed; bottom: 20px; right: 20px; z-index: 9999; font-family: -apple-system, "Segoe UI", Roboto, sans-serif; }
  #wa-launcher { position: relative; width: 60px; height: 60px; border-radius: 50%; background: #25D366; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 16px rgba(37,211,102,.45); transition: transform .2s; }
  #wa-launcher:hover { transform: scale(1.08); }
  #wa-dot { position: absolute; top: 6px; right: 6px; width: 9px; height: 9px; background: #ff3b30; border: 1.5px solid #fff; border-radius: 50%; }
  #wa-chat { position: absolute; bottom: 75px; right: 0; width: 310px; border-radius: 16px; background: #fff; overflow: hidden; box-shadow: 0 8px 28px rgba(0,0,0,.18); display: none; flex-direction: column; border: 1px solid #ece5da; }
  #wa-chat.open { display: flex; animation: waPop .22s ease; }
  @keyframes waPop { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  #wa-header { background: linear-gradient(135deg, #1ebe5b 0%, #128C7E 100%); color: #fff; padding: 13px 14px; display: flex; align-items: center; gap: 10px; }
  #wa-avatar { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; background: #fff; padding: 3px; }
  #wa-name { font-weight: 600; font-size: 15px; }
  #wa-status { font-size: 12px; opacity: .9; display: flex; align-items: center; gap: 5px; }
  .wa-online-dot { width: 7px; height: 7px; background: #a6ff8f; border-radius: 50%; display: inline-block; }
  #wa-close { margin-left: auto; background: none; border: none; color: #fff; font-size: 22px; cursor: pointer; line-height: 1; opacity: .85; }
  #wa-close:hover { opacity: 1; }
  #wa-body { padding: 20px 16px; min-height: 96px; background: #f7f1e6; }
  #wa-bubble { background: #fffdf6; border-radius: 0 10px 10px 10px; padding: 11px 13px; font-size: 14px; color: #3a3a3a; line-height: 1.45; box-shadow: 0 1px 2px rgba(0,0,0,.08); max-width: 88%; position: relative; }
  #wa-bubble::before { content: ""; position: absolute; top: 0; left: -7px; border-width: 0 8px 8px 0; border-style: solid; border-color: transparent #fffdf6 transparent transparent; }
  #wa-time { display: block; font-size: 10px; color: #b0a98f; text-align: right; margin-top: 5px; }
  #wa-footer { padding: 13px; background: #fff; border-top: 1px solid #f0eada; }
  #wa-cta { display: flex; align-items: center; justify-content: center; background: #25D366; color: #fff; text-decoration: none; padding: 12px; border-radius: 26px; font-weight: 600; font-size: 14px; box-shadow: 0 3px 10px rgba(37,211,102,.4); transition: background .2s; }
  #wa-cta:hover { background: #1ebe5b; }
  `;

  // ---- Read config from the script tag (allows per-site customization) ----
  var s = document.currentScript;
  var phone = (s && s.getAttribute('data-phone')) || '9779712039906';
  var name  = (s && s.getAttribute('data-name'))  || 'Chitra Tech';
  var logo  = (s && s.getAttribute('data-logo'))  || 'https://chitratech.com.np/logo-transparent.png';
  var msg   = (s && s.getAttribute('data-message')) || 'Thank you for contacting us. How can we help you today?';

  var waIcon = '<svg viewBox="0 0 32 32" width="32" height="32" fill="#fff"><path d="M16 .5C7.4.5.5 7.4.5 16c0 2.8.7 5.4 2 7.8L.5 31.5l7.9-2c2.3 1.2 4.9 1.9 7.6 1.9 8.6 0 15.5-6.9 15.5-15.5S24.6.5 16 .5zm0 28.3c-2.4 0-4.7-.6-6.7-1.8l-.5-.3-4.7 1.2 1.3-4.6-.3-.5C3.9 20.7 3.3 18.4 3.3 16 3.3 9 9 3.3 16 3.3S28.7 9 28.7 16 23 28.8 16 28.8zm7.1-9.4c-.4-.2-2.3-1.1-2.6-1.3-.4-.1-.6-.2-.9.2-.3.4-1 1.3-1.2 1.5-.2.2-.4.3-.8.1-.4-.2-1.6-.6-3.1-1.9-1.1-1-1.9-2.3-2.1-2.7-.2-.4 0-.6.2-.8.2-.2.4-.4.6-.7.2-.2.3-.4.4-.7.1-.3 0-.5 0-.7-.1-.2-.9-2.1-1.2-2.9-.3-.8-.6-.7-.9-.7h-.7c-.2 0-.6.1-1 .5-.3.4-1.3 1.3-1.3 3.1 0 1.8 1.3 3.6 1.5 3.8.2.2 2.6 4 6.3 5.6.9.4 1.6.6 2.1.8.9.3 1.7.2 2.3.1.7-.1 2.3-.9 2.6-1.8.3-.9.3-1.6.2-1.8-.1-.2-.3-.3-.7-.5z"/></svg>';

  var now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  var html = `
  <button id="wa-launcher" aria-label="Open WhatsApp chat">${waIcon}<span id="wa-dot"></span></button>
  <div id="wa-chat">
    <div id="wa-header">
      <img src="${logo}" alt="${name}" id="wa-avatar">
      <div><div id="wa-name">${name}</div><div id="wa-status"><span class="wa-online-dot"></span> Online</div></div>
      <button id="wa-close" aria-label="Close">&times;</button>
    </div>
    <div id="wa-body">
      <div id="wa-bubble">
        <p style="margin:0 0 6px; font-weight:600;">👋 Welcome to ${name}!</p>
        <p style="margin:0;">${msg}</p>
        <span id="wa-time">${now}</span>
      </div>
    </div>
    <div id="wa-footer">
      <a id="wa-cta" href="https://wa.me/${phone}" target="_blank" rel="noopener">Chat on WhatsApp</a>
    </div>
  </div>`;

  // ---- Inject ----
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var wrap = document.createElement('div');
  wrap.id = 'wa-widget';
  wrap.innerHTML = html;
  document.body.appendChild(wrap);

  var launcher = wrap.querySelector('#wa-launcher');
  var chat = wrap.querySelector('#wa-chat');
  var close = wrap.querySelector('#wa-close');
  var dot = wrap.querySelector('#wa-dot');

  launcher.addEventListener('click', function () {
    chat.classList.toggle('open');
    if (dot) dot.style.display = 'none';
  });
  close.addEventListener('click', function () {
    chat.classList.remove('open');
  });
})();
