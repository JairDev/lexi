chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.type === "openModal") {
    // const translate = getTranslate();
    // // console.log(translate);
    // // console.log(sendResponse);
    // const dataGeneration = await getSugestion(request.message.text);
    const body = document.querySelector("body");
    const root = document.createElement("div");
    root.setAttribute("class", "root");
    const shadow = root.attachShadow({ mode: "open" });
    const modalLayout = document.createElement("div");
    modalLayout.setAttribute("class", "modal-layout");
    const title = createElement("h1", "title", "Send To Notion");
    const wrapperHeader = createWrapper("content-header");
    const wrapperMenu = createWrapper("content-menu");
    const wrapperContentMenu = createWrapper("content-content-menu");
    const wrapperSelectedText = createWrapper();
    const wrapperTranslateText = createWrapper();
    const wrapperSuggestionText = createWrapper("content-suggestion-text");
    const wrapperLoginButton = createWrapper("content-login-button");
    const menu = document.createElement("div");
    menu.textContent = "Menu";
    const titleSelectedText = createElement(
      "div",
      "content-title",
      "Selected text"
    );
    const titleTranslatedText = createElement(
      "div",
      "content-title",
      "Translated Text"
    );
    const titleSuggestionText = createElement(
      "div",
      "content-title",
      `Example sentence with the word: ${request.message?.text}`
    );
    console.log(request.message?.text);
    const contentSelectedText = createElement(
      "p",
      "content-selected-text",
      request.message.text
    );
    const contentTranslatedText = createElement(
      "p",
      "content-translated-text",
      "Content Translated"
    );
    const contentSuggestionText = createElement(
      "p",
      "content-suggestion-text-p",
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry"
    );
    const textButton = request.message.login
      ? "Save to notion"
      : "Login with notion";

    const loginButton = createElement("button", "login-button", textButton);
    const logoutButton = createElement("button", "logout-button", "Logout");
    const generatedButton = createElement(
      "button",
      "generated-button",
      "Gegerate sentence"
    );
    const span = createElement(
      "span",
      "span-warn",
      "This text is generated by AI, it may contain errors."
    );

    const style = createStyle();

    shadow.appendChild(style);
    shadow.appendChild(modalLayout);
    body.insertAdjacentElement("afterbegin", root);
    modalLayout.appendChild(wrapperHeader);
    wrapperHeader.appendChild(title);
    wrapperMenu.appendChild(menu);
    wrapperHeader.appendChild(wrapperMenu);
    wrapperContentMenu.appendChild(logoutButton);
    wrapperMenu.appendChild(wrapperContentMenu);
    wrapperSelectedText.appendChild(titleSelectedText);
    wrapperSelectedText.appendChild(contentSelectedText);
    wrapperTranslateText.appendChild(titleTranslatedText);
    wrapperTranslateText.appendChild(contentTranslatedText);
    wrapperSuggestionText.appendChild(titleSuggestionText);
    wrapperSuggestionText.appendChild(contentSuggestionText);
    wrapperSuggestionText.appendChild(generatedButton);
    wrapperLoginButton.appendChild(loginButton);
    wrapperLoginButton.insertAdjacentElement("afterbegin", span);
    modalLayout.appendChild(wrapperSelectedText);
    modalLayout.appendChild(wrapperTranslateText);
    modalLayout.appendChild(wrapperSuggestionText);
    modalLayout.appendChild(wrapperLoginButton);
    const rootNode = document.querySelector(".root");
    const nodes = rootNode && root.shadowRoot;
    const loginButtonNode = nodes.querySelector(".login-button");
    const generatedButtonNode = nodes.querySelector(".generated-button");
    const suggestionText = nodes.querySelector(".content-suggestion-text-p");
    // console.log(loginButtonNode);

    // if (request.message.login) {
    //   logoutButton.style = "opacity: 1";
    // } else {
    //   logoutButton.style = "opacity: 0";
    // }
    // body.insertAdjacentElement("afterbegin", modalLayout);
    // console.log(request.message);
    loginButtonNode.addEventListener("click", (e) => {
      sendMessage({ type: "auth", ...request.message });
      console.log({ type: "auth", ...request.message });
    });

    logoutButton.addEventListener("click", async (e) => {
      console.log(e);
      console.log(request.message);
      loginButtonNode.textContent = "Login with notion";
      sendMessage({ type: "logout", login: false });
    });

    generatedButtonNode.addEventListener("click", async (e) => {
      console.log(e);
      generatedButtonNode.style = "display: none;";
      suggestionText.style = "filter: none";
      suggestionText.textContent = "Loading";
      await chrome.runtime.sendMessage({
        type: "suggestion",
        text: request.message?.text,
      });
    });
  }
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  const rootNode = document.querySelector(".root");
  const nodes = rootNode.shadowRoot;
  const suggestionText = nodes.querySelector(".content-suggestion-text-p");
  const generatedButton = nodes.querySelector(".generated-button");
  const loginButton = nodes.querySelector(".login-button");
  if (request.type === "suggestion") {
    const message = await request.message;
    console.log(suggestionText);
    console.log(message);

    suggestionText.innerText = message.data;
  }
  if (request.type === "login") {
    console.log("login", request);
    loginButton.innerText = "Save to notion";
  }

  if (request.type === "logout") {
    console.log("logout", request);
    loginButton.innerText = "Login with notion";
  }
});

// chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
//   const button = document.querySelector("#buton-extension");
//   if (button && !request.message.login) {
//     button.innerText = "Login with notion";
//     // button.addEventListener("click", () => {
//     //   // document.body.removeChild(modalLayout);
//     //   sendMessage(request.message);
//     // });
//   }
// });

function createElement(element, className, content = "Hello World") {
  const ele = document.createElement(element);
  ele.setAttribute("class", className);
  ele.innerText = content;
  return ele;
}

function createWrapper(classPlus = "") {
  const wrapper = document.createElement("div");
  wrapper.setAttribute("class", `wrapper ${classPlus}`);
  return wrapper;
}

function createStyle() {
  const style = document.createElement("style");
  style.textContent = `
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0
  }

  .modal-layout {
    border-radius: 16px;
    background: rgb(251, 251, 250);
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 1rem;
    width: 100%;
    max-width: 548px;
    z-index: 1000;
  }
  .title, .content-title {
    color: rgb(55, 53, 47);
  }
  .title {
    margin: 0;
  }
  .content-title {
    font-weight: 600;
    margin-bottom: .25rem;
  }
  .wrapper {
    border-bottom: 1px solid #ccc;
    color: rgba(25, 23, 17, 0.6);
    margin-bottom: 1rem;
    position: relative;
  }
  .wrapper.content-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 100;
  }

  .wrapper.content-content-menu {
    background: rgb(251, 251, 250);
    position: absolute;
    right: 0;
    top: 30px;
    padding: 1rem 0rem 1rem 1rem;
  }
  .wrapper:nth-child(4) {
    margin-bottom: 0;
  }
  .wrapper:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
  .wrapper.content-suggestion-text {
    min-height: 120px;
  }

  .content-suggestion-text-p {
    filter: blur(5px)
  }

  .generated-button {
    background: none;
    border: 2px solid rgb(18, 18, 18);
    border-radius: 4px;
    cursor: pointer;
    color: rgb(18, 18, 18);
    font-size: 1rem;
    padding: .25rem .875rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

  }
  .wrapper.content-login-button {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .span-warn {
    font-size: .75rem;
  }

  .login-button {
    background: none;
    border: none;
    border-radius: 4px;
    background: rgb(18, 18, 18);
    cursor: pointer;
    align-self: flex-end;
    font-size: 1rem;
    padding: .25rem .875rem;
    margin-top: 1rem;
  }

  .logout-button {
    background: none;
    border: none;
    color: rgb(18, 18, 18);
    cursor: pointer;
  }

  `;
  return style;
}

function sendMessage(message) {
  chrome.runtime.sendMessage(message);
}

function getTranslate() {
  return "Test translate";
}

// async function getSugestion(text) {
//   console.log(text);
//   try {
//     const response = await fetch("http://localhost:5400/v1/suggestion", {
//       method: "POST",
//       headers: {
//         accept: "application/json",
//         "content-type": "application/json",
//       },
//       body: JSON.stringify({ data: text }),
//     });
//     const result = await response.json();
//     console.log(result);
//   } catch (error) {
//     console.log(error);
//   }
// }

function saveToNotion() {
  return "Saved to notion";
}
