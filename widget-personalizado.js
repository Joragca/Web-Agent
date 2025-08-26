// =========================
// Configuración personalizada del widget
// =========================

// Generar y guardar un ID único persistente (unificado)
(function initClientId() {
  var id = localStorage.getItem('n8n-client-id') || localStorage.getItem('client-id');
  if (!id) {
    id = (window.crypto && window.crypto.randomUUID)
      ? window.crypto.randomUUID()
      : Math.random().toString(36).slice(2, 12);
  }
  localStorage.setItem('n8n-client-id', id);
  localStorage.setItem('client-id', id); // compatibilidad
})();


// Configuración del widget
window.ChatWidgetConfig = {
  webhook: {
    url: 'https://n8n.srv823913.hstgr.cloud/webhook/agente-web-tws',
    route: 'general'
  },
  branding: {
    logo: 'https://media.licdn.com/dms/image/v2/D4E0BAQGgr4bQ8racog/company-logo_200_200/B4EZhRWJTPGoAI-/0/1753711416944/the_wise_seeker_logo?e=1758153600&v=beta&t=DKdZfW9Ejivd0hspuKnYY7jZb4YDxYh3LsfSHnn8NKo',
    name: 'The Wise Skill',
    welcomeText: '¡Hazme una pregunta!',
    responseTimeText: 'Estoy disponible ahora mismo'
  },
  style: {
    primaryColor: '#7BA8FF',
    secondaryColor: '#74E5D3',
    position: 'right',
    backgroundColor: '#ffffff',
    fontColor: '#1f2937'
  },
  suggestedQuestions: ['¿Qué tipo de skills evaluáis?', '¿Qué hacéis exactamente en The Wise Skill?']
};

// Inyectar sessionId/metadata envolviendo fetch (sin depender de submitMessage)
(function patchFetchForSession() {
  var originalFetch = window.fetch;
  window.fetch = function (url, options) {
    try {
      var u = (typeof url === 'string') ? url : (url && url.url);
      var isWebhook = u && u.indexOf(window.ChatWidgetConfig.webhook.url) === 0;
      var method = (options && options.method ? options.method : 'GET').toUpperCase();

      if (isWebhook && method === 'POST' && options) {
        var body = options.body ? JSON.parse(options.body) : null;

        // Si el cuerpo es un array (p.ej. loadPreviousSession), no lo tocamos
        if (Array.isArray(body)) {
          return originalFetch.apply(this, arguments);
        }

        if (body && typeof body === 'object') {
          var id = localStorage.getItem('n8n-client-id');
          body.sessionId = body.sessionId || id;
          body.metadata = Object.assign({}, body.metadata || {}, { clientId: id });
          options.body = JSON.stringify(body);
        }
      }
    } catch (e) {
      console.warn('Fetch patch error:', e);
    }
    return originalFetch.apply(this, arguments);
  };
})();



// =========================
// Forzar bypass en el registro de usuario
// =========================
const overrideForm = setInterval(() => {
  const registrationForm = document.querySelector('.user-registration');
  const welcome = document.querySelector('.chat-welcome');
  const chatBody = document.querySelector('.chat-body');

  if (registrationForm && welcome && chatBody) {
    registrationForm.style.display = 'none';
    welcome.style.display = 'none';
    chatBody.classList.add('active');
    clearInterval(overrideForm);
  }
}, 300);

// =========================
// 🚀 Cargar base + aplicar overrides (con fallback)
// =========================
(function loadChatWidget() {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/gh/Joragca/Web-Agent@main/chat-widget.js?v=' + Date.now();
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);

  function injectCssOverrides() {
    if (document.getElementById('tws-widget-overrides')) return;
    const style = document.createElement('style');
    style.id = 'tws-widget-overrides';
    style.textContent = `
      /* Aísla de CSS global */
      .chat-assist-widget, .chat-assist-widget * { box-sizing: border-box; }

      /* Controles: textarea y botón con la MISMA altura */
      .chat-assist-widget .chat-controls { align-items: center !important; }
      .chat-assist-widget .chat-textarea{
        height:48px !important; min-height:48px !important; max-height:48px !important;
        overflow-y:auto !important; line-height:1.4 !important; padding:12px 14px !important;
      }
      .chat-assist-widget .chat-submit{
        flex:0 0 48px !important; width:48px !important; height:48px !important;
      }

      /* Disclaimer: gris y pequeño (no azul) */
      .chat-assist-widget .chat-footer{ padding:8px 12px !important; }
      .chat-assist-widget .chat-footer-link{
        color: var(--chat-widget-text, #1f2937) !important;
        opacity:.6 !important; font-size:12px !important; text-decoration:none !important;
      }

      /* Chips persistentes */
      .chat-assist-widget .persistent-suggested-questions{
        padding:8px 16px 0 !important; background:var(--chat-color-surface);
        border-top:1px solid var(--chat-color-light); gap:8px !important;
      }
      .chat-assist-widget .suggested-question-btn.always-visible{
        border-radius:9999px !important; padding:8px 14px !important;
      }
    `;
    document.head.appendChild(style);
  }

  function applyDomFixes() {
    // Forzar estilos clave por si algún CSS global/inline gana la cascada
    const link = document.querySelector('.chat-assist-widget .chat-footer-link');
    if (link) {
      link.style.color = '#1f2937';
      link.style.opacity = '0.6';
      link.style.fontSize = '12px';
      link.style.textDecoration = 'none';
    }
    const ta = document.querySelector('.chat-assist-widget .chat-textarea');
    if (ta) {
      // Inline con !important (concatenamos sin borrar otros estilos inline del widget)
      ta.setAttribute('style', (ta.getAttribute('style') || '') +
        ';height:48px !important;min-height:48px !important;max-height:48px !important;overflow-y:auto !important;line-height:1.4 !important;padding:12px 14px !important;');
    }
  }

  // Cuando cargue el base, inyecta CSS y espera a que pinte el DOM del widget
  script.addEventListener('load', () => {
    injectCssOverrides();
    const wait = setInterval(() => {
      if (document.querySelector('.chat-assist-widget')) {
        applyDomFixes();
        clearInterval(wait);
      }
    }, 50);
  });

  // Fallback por si 'load' no dispara o hay caché rara
  setTimeout(() => { injectCssOverrides(); applyDomFixes(); }, 1500);
})();



