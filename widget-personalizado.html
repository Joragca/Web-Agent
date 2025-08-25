<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Chat Widget Test</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: sans-serif;
      background-color: #f9f9f9;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    h1 {
      color: #333;
    }
  </style>
</head>

<body>
  <h1>Prueba de Widget de Chat</h1>

<!-- 🔹 Script 1: Configuración inicial y generación de clientId -->
<script>
  // Generar y guardar un ID único persistente
  let clientId = localStorage.getItem('client-id');
  if (!clientId) {
    clientId = crypto.randomUUID();
    localStorage.setItem('client-id', clientId);
  }

  // Configuración del widget
  window.ChatWidgetConfig = {
    webhook: {
      url: 'https://primary-production-6cb6.up.railway.app/webhook/agente-web-tws',
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
</script>

<script src="https://cdn.jsdelivr.net/gh/Joragca/Web-Agent@v1.0.3/chat-widget.js"></script>


<!-- 🔹 Script 2: Cargar el widget y parchear submitMessage -->
<script>


  // 🔥 Parche para inyectar el clientId en cada mensaje
  const waitForSubmitPatch = setInterval(() => {
    if (typeof submitMessage === 'function') {
      clearInterval(waitForSubmitPatch);

      const originalSubmitMessage = submitMessage;
      const clientId = localStorage.getItem('client-id');

      submitMessage = function(messageText) {
        // Parchear window.fetch solo para inyectar metadata/sessionId
        const originalFetch = window.fetch;
        window.fetch = function(url, options) {
          try {
            const body = JSON.parse(options.body);

            // ✅ Inyectamos clientId como sessionId y en metadata
            body.sessionId = clientId;
            body.metadata = {
              ...body.metadata,
              clientId: clientId
            };

            options.body = JSON.stringify(body);
          } catch (e) {
            console.error('Error injecting clientId/sessionId:', e);
          }

          // Restauramos fetch después de una ejecución
          window.fetch = originalFetch;

          return originalFetch(url, options);
        };

        return originalSubmitMessage(messageText);
      };
    }
  }, 300);
</script>


  <!-- 🔹 Autoabrir el chat (sin formulario) -->
  <script>
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
  </script>
</body>



</html>

<style>
/* Contenedor de los botones */
.persistent-suggested-questions {
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 8px !important;
  padding: 8px 12px !important;
  justify-content: flex-start !important;
}

/* Botones sugeridos */
.suggested-question-btn.always-visible {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 4px 12px !important; /* espacio interno (márgenes del contenido) */
  font-size: 12px !important;
  border-radius: 20px !important;
  border: 1px solid var(--chat-widget-primary, #7BA8FF) !important;
  background-color: transparent !important;
  color: var(--chat-widget-primary, #7BA8FF) !important;
  cursor: pointer !important;
  transition: background-color 0.2s !important;
  white-space: nowrap !important;
  flex-shrink: 0 !important;
  margin: 4px 4px 0 0 !important; /* espacio entre botones */
  width: auto !important; /* ❗️Esto es lo que lo hace dinámico */
  max-width: 100% !important;
}

/* Hover */
.suggested-question-btn.always-visible:hover {
  background-color: rgba(123, 168, 255, 0.1) !important;
  border-color: var(--chat-widget-primary, #7BA8FF) !important;
}

/* Estilo input */
.chat-textarea {
  min-height: 28px !important;
  height: auto !important;
  padding: 4px 10px !important;
  font-size: 13px !important;
  line-height: 1.2 !important;
  resize: none !important;
}

/* Footer texto */
.chat-footer-link {
  font-size: 10px !important;
  color: #9ca3af !important;
  text-align: center !important;
  display: block !important;
}
</style>
