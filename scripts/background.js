chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason !== "install" && details.reason !== "update") return;

  chrome.contextMenus.create({
    id: "sampleContextMenu",
    title: 'Selected "%s"',
    contexts: ["selection"],
  });
  let isLogin = false;
  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    console.log(info.selectionText);
    // await chrome.storage.local.remove("authToken");

    const authTokenStorage = await chrome.storage.local.get("authToken");
    // if (Object.keys(authTokenStorage).length > 0) {
    //   console.log("authTokenStorage", authTokenStorage);
    //   // createPage(authTokenStorage.authToken, info.selectionText);
    // } else {
    //   startAuthenticationFlow();
    // }

    (async function getCurrentTab() {
      let queryOptions = { active: true, lastFocusedWindow: true };
      let [tab] = await chrome.tabs.query(queryOptions);
      await chrome.scripting.insertCSS({
        files: ["styles.css"],
        target: { tabId: tab.id },
      });
      await chrome.tabs.sendMessage(tab.id, {
        type: "openModal",
        message: {
          text: info.selectionText,
          login: isLogin ? true : false,
        },
      });
    })();
  });
});

// Función para manejar la respuesta de la autenticación
async function handleAuthenticationResponse(redirectUri) {
  const urlParams = new URL(redirectUri);
  const authCode = urlParams.searchParams.get("code");
  const response = await fetch("http://localhost:5400/v1/auth/login", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code: authCode,
    }),
  });
  const result = await response.json();
  console.log(result);
  await chrome.storage.local.set({ authToken: result?.data?.access_token });
}

async function createPage(token, text) {
  const postPage = await fetch(
    "https://api.notion.com/v1/blocks/e049fa81a9214667b2dd35937f6b65df/children",
    {
      method: "PATCH",
      headers: {
        accept: "application/json",
        "Notion-Version": "2022-06-28",
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        children: [
          {
            heading_2: {
              rich_text: [
                {
                  text: {
                    content: `${text}`,
                  },
                },
              ],
              children: [
                {
                  paragraph: {
                    rich_text: [
                      {
                        text: {
                          content: "Paragraph",
                        },
                      },
                    ],
                  },
                },
              ],
              is_toggleable: true,
            },
          },
        ],
      }),
    }
  );

  const resultPostPage = await postPage.json();
  console.log(resultPostPage);
}

// Función para iniciar el flujo de autenticación
function startAuthenticationFlow() {
  // URI de redirección registrado en tu integración de Notion
  const redirectUri =
    "https://fpljefipnkiphonnhgpakgnapobpljhc.chromiumapp.org/";

  // URI de autorización proporcionado por Notion
  const authorizationUrl =
    "https://api.notion.com/v1/oauth/authorize?client_id=6fe491a5-3b72-49a2-b321-66db7eb26c21&response_type=code";

  // Parámetros necesarios para la solicitud de autorización
  const clientId = "6fe491a5-3b72-49a2-b321-66db7eb26c21";
  const state = "estado-aleatorio-generado-por-tu-extension"; // Estado opcional para protección CSRF

  // Construir la URL de autorización con los parámetros necesarios
  const authUrl = `https://api.notion.com/v1/oauth/authorize?client_id=6fe491a5-3b72-49a2-b321-66db7eb26c21&response_type=code`;

  // Lanzar la ventana emergente de autenticación usando launchWebAuthFlow
  chrome.identity.launchWebAuthFlow(
    { url: authUrl, interactive: true },
    function (redirectUrl) {
      // console.log(redirectUrl);
      // La ventana emergente de autenticación se cerrará y se llamará a esta función de devolución de llamada
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
      }

      // Manejar la respuesta de autenticación
      handleAuthenticationResponse(redirectUrl);
    }
  );
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (!request.isLogged) {
    console.log(request);
    startAuthenticationFlow();
  }
});
