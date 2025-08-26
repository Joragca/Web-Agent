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

// ===== Overrides de estilo para volver al look anterior =====
(function addWidgetStyleOverrides() {
  const css = `
  /* Contenedor de los botones persistentes */
  .chat-assist-widget .persistent-suggested-questions {
    display:flex !important;
    flex-wrap:wrap !important;
    gap:8px !important;
    padding:8px 12px !important;
    justify-content:flex-start !important;
    background:transparent !important;
    border-top:none !important;
  }

  /* Botones sugeridos tipo "pill" transparentes */
  .chat-assist-widget .suggested-question-btn.always-visible {
    display:inline-flex !important;
    align-items:center !important;
    justify-content:center !important;
    padding:4px 12px !important;
    font-size:12px !important;
    border-radius:20px !important;
    border:1px solid var(--chat-widget-primary, #7BA8FF) !important;
    background-color:transparent !important;
    color:var(--chat-widget-primary, #7BA8FF) !important;
    cursor:pointer !important;
    transition:background-color .2s !important;
    white-space:nowrap !important;
    flex-shrink:0 !important;
    margin:4px 4px 0 0 !important;
    width:auto !important;
    max-width:100% !important;
  }

  .chat-assist-widget .suggested-question-btn.always-visible:hover {
    background-color:rgba(123,168,255,.1) !important;
    border-color:var(--chat-widget-primary, #7BA8FF) !important;
  }

  /* Textarea más compacta */
  .chat-assist-widget .chat-textarea {
    min-height:28px !important;
    height:auto !important;
    padding:4px 10px !important;
    font-size:13px !important;
    line-height:1.2 !important;
    resize:none !important;
  }

  /* Pie del widget (gris y pequeño, sin heredar estilos globales) */
  .chat-assist-widget .chat-footer-link {
    font-size:10px !important;
    color:#9ca3af !important;
    text-align:center !important;
    display:block !important;
    text-decoration:none !important;
  }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
})();



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
// 🚀 Cargar automáticamente el widget real
// =========================
(function loadChatWidget() {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/gh/Joragca/Web-Agent@main/chat-widget.js?v=' + Date.now();
  script.defer = true;
  document.head.appendChild(script);
})();




