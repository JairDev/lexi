let textInfo = "";
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason !== "install" && details.reason !== "update") return;

  chrome.contextMenus.create({
    id: "sampleContextMenu",
    title: 'Selected "%s"',
    contexts: ["selection"],
  });
  let isLogin = false;
  chrome.contextMenus.onClicked.addListener(async (info) => {
    console.log(info.selectionText);
    textInfo = info.selectionText;
    console.log(isLogin);
    const { authToken } = await chrome.storage.local.get("authToken");
    if (authToken) {
      isLogin = true;
      console.log("authTokenStorage", authToken);
    }
    (async function getCurrentTab() {
      let queryOptions = { active: true, lastFocusedWindow: true };
      let [tab] = await chrome.tabs.query(queryOptions);
      console.log(tab);
      // const translatedText = await getTranslated(textInfo);
      // console.log(translatedText);
      // await chrome.scripting.insertCSS({
      //   files: ["styles.css"],
      //   target: { tabId: tab.id },
      // });
      await chrome.tabs.sendMessage(tab.id, {
        type: "openModal",
        message: {
          text: textInfo,
          login: authToken ? true : false,
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
  console.log(response.status);
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  console.log(tab);
  if (response.status !== 400) {
    console.log("is loginnnnnn");
    await chrome.storage.local.set({ authToken: result?.data?.access_token });
    await chrome.tabs.sendMessage(tab.id, {
      type: "login",
      message: {
        text: textInfo,
        login: true,
      },
    });
  }
}

async function getTranslated(text) {
  console.log(text);
  try {
    const response = await fetch("http://localhost:5400/v1/translated", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({ data: text }),
    });
    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
  }
}

async function createPage(token, text, suggestionText) {
  const pageId = await getPage(token);
  console.log(text);
  const postPage = await fetch("http://localhost:5400/v1/post", {
    method: "POST",
    headers: {
      accept: "application/json",
      "Notion-Version": "2022-06-28",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      token: token,
      data: text,
      pageId: pageId.results[0].id,
      suggestionText: suggestionText,
    }),
  });

  const resultPostPage = await postPage.json();
  console.log(resultPostPage);
}

async function getSugestion(text) {
  console.log(text);
  try {
    const response = await fetch("http://localhost:5400/v1/suggestion", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({ data: text }),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
}

async function getPage(token) {
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "Notion-Version": "2022-06-28",
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ page_size: 100 }),
  };
  try {
    const response = await fetch("https://api.notion.com/v1/search", options);
    return response.json();
  } catch (error) {
    console.log(error);
  }
}

// Función para iniciar el flujo de autenticación
function startAuthenticationFlow() {
  const clientId = "6fe491a5-3b72-49a2-b321-66db7eb26c21";
  const authUrl = `https://api.notion.com/v1/oauth/authorize?client_id=${clientId}&response_type=code`;

  // Lanzar la ventana emergente de autenticación usando launchWebAuthFlow
  chrome.identity.launchWebAuthFlow(
    { url: authUrl, interactive: true },
    function (redirectUrl) {
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
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  const authTokenStorage = await chrome.storage.local.get("authToken");
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  // console.log(request);

  if (request.type === "auth") {
    if (!request.login) {
      console.log("login", request);
      startAuthenticationFlow();
    } else {
      const textGeneration = await getSugestion(request.text);
      console.log("isLogged", request, textGeneration);
      createPage(
        authTokenStorage.authToken,
        request.text,
        textGeneration.message
      );
    }
  }

  if (request.type === "logout") {
    console.log("logout", request);
    await chrome.tabs.sendMessage(tab.id, {
      type: "logout",
      message: {
        text: textInfo,
        login: false,
      },
    });
    await chrome.storage.local.remove("authToken");
  }
  if (request.type === "translated") {
    console.log("translated", request);
    const textTranslated = await getTranslated(request.text);
    console.log("translated", textTranslated);
    await chrome.tabs.sendMessage(tab.id, {
      type: "translated",
      message: {
        data: textTranslated.message,
      },
    });
  }
  if (request.type === "suggestion") {
    console.log("suggestion");
    const textGeneration = await getSugestion(request.text);
    console.log("textGeneration", textGeneration);
    console.log("???", request);
    await chrome.tabs.sendMessage(tab.id, {
      type: "suggestion",
      message: {
        data: textGeneration?.message,
      },
    });
  }
});
