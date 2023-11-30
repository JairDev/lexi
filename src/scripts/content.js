chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "openModal") {
    // const translate = getTranslate();
    // // console.log(translate);
    // // console.log(sendResponse);
    const body = document.querySelector("body");
    const root = document.createElement("div");
    root.setAttribute("class", "root");
    const shadow = root.attachShadow({ mode: "open" });
    const modalLayout = document.createElement("div");
    modalLayout.setAttribute("class", "modal-layout");
    const title = createElement("h1", "title", "Send To Notion");
    const wrapperSelectedText = createWrapper();
    const wrapperTranslateText = createWrapper();
    const wrapperSuggestionText = createWrapper();
    const wrapperLoginButton = createWrapper("content-login-button");
    const titleSelectedText = createElement(
      "div",
      "content-title",
      "Selected Text"
    );
    const titleTranslatedText = createElement(
      "div",
      "content-title",
      "Translated Text"
    );
    const titleSuggestionText = createElement(
      "div",
      "content-title",
      "Suggestion Text"
    );

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
      "content-suggestion-text",
      "Contend Suggestion"
    );
    const textButton = request.message.login
      ? "Save to notion"
      : "Login with notion";

    const loginButton = createElement("button", "login-button", textButton);
    const logoutButton = createElement("button", "logout-button", "Logout");

    const style = createStyle();

    shadow.appendChild(style);
    shadow.appendChild(modalLayout);
    body.insertAdjacentElement("afterbegin", root);
    modalLayout.appendChild(title);
    wrapperSelectedText.appendChild(titleSelectedText);
    wrapperSelectedText.appendChild(contentSelectedText);
    wrapperTranslateText.appendChild(titleTranslatedText);
    wrapperTranslateText.appendChild(contentTranslatedText);
    wrapperSuggestionText.appendChild(titleSuggestionText);
    wrapperSuggestionText.appendChild(contentSuggestionText);
    wrapperLoginButton.appendChild(loginButton);
    modalLayout.appendChild(wrapperSelectedText);
    modalLayout.appendChild(wrapperTranslateText);
    modalLayout.appendChild(wrapperSuggestionText);
    modalLayout.appendChild(wrapperLoginButton);
    const rootNode = document.querySelector(".root");
    const nodes = rootNode && root.shadowRoot;
    const loginButtonNode = nodes.querySelector(".login-button");
    console.log(loginButtonNode);

    // if (request.message.login) {
    //   logoutButton.style = "opacity: 1";
    // } else {
    //   logoutButton.style = "opacity: 0";
    // }
    // body.insertAdjacentElement("afterbegin", modalLayout);
    // console.log(request.message);
    loginButtonNode.addEventListener("click", (e) => {
      // document.body.removeChild(modalLayout);
      // sendMessage(request.message);
      console.log(e);
    });
    // logoutButton.addEventListener("click", async (e) => {
    //   console.log(e);
    //   console.log(request.message);
    //   // await chrome.storage.local.remove("authToken");
    //   sendMessage({ logout: true });
    // });
  }
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  const button = document.querySelector("#buton-extension");
  if (button && request.message.login) {
    button.innerText = "Save to notion";
    // button.addEventListener("click", () => {
    //   // document.body.removeChild(modalLayout);
    //   sendMessage(request.message);
    // });
  }
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  const button = document.querySelector("#buton-extension");
  if (button && !request.message.login) {
    button.innerText = "Login with notion";
    // button.addEventListener("click", () => {
    //   // document.body.removeChild(modalLayout);
    //   sendMessage(request.message);
    // });
  }
});

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
  .modal-layout {
    border-radius: 16px;
    background: blue;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 1rem;
    width: 100%;
    max-width: 768px;
    z-index: 1000;
  }
  .wrapper {
    border-bottom: 1px solid #ccc;
    margin-bottom: 0.5rem;
  }
  .wrapper.content-login-button {
    display: flex;
    justify-content: flex-end;
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

function getSugestion() {
  return "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make, Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to makeLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make ";
}

function saveToNotion() {
  return "Saved to notion";
}
