// =========================
// Configuración personalizada del widget
// =========================

// Generar y guardar un ID único persistente
let clientId = localStorage.getItem('client-id');
if (!clientId) {
  clientId = crypto.randomUUID();
  localStorage.setItem('client-id', clientId);
}

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

// =========================
// Parche para inyectar clientId en cada mensaje
// =========================
const waitForSubmitPatch = setInterval(() => {
  if (typeof submitMessage === 'function') {
    clearInterval(waitForSubmitPatch);

    const originalSubmitMessage = submitMessage;
    const clientId = localStorage.getItem('client-id');

    submitMessage = function(messageText) {
      const originalFetch = window.fetch;
      window.fetch = function(url, options) {
        try {
          const body = JSON.parse(options.body);
          body.sessionId = clientId;
          body.metadata = {
            ...body.metadata,
            clientId: clientId
          };
          options.body = JSON.stringify(body);
        } catch (e) {
          console.error('Error injecting clientId/sessionId:', e);
        }
        window.fetch = originalFetch;
        return originalFetch(url, options);
      };
      return originalSubmitMessage(messageText);
    };
  }
}, 300);

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
  script.src = 'https://cdn.jsdelivr.net/gh/Joragca/Web-Agent@v1.0.4/chat-widget.js';
  script.defer = true;
  document.head.appendChild(script);
})();
