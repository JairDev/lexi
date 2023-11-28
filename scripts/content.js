chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "openModal") {
    const translate = getTranslate();
    // console.log(translate);
    // console.log(sendResponse);
    const body = document.querySelector("body");
    const modalLayout = document.createElement("div");
    const wrapperSelectedTextDiv = document.createElement("div");
    const wrapperTranslateTextDiv = document.createElement("div");
    const wrapperSuggestionTextDiv = document.createElement("div");
    const selectedTextTitle = document.createElement("p");
    const translateTextTitle = document.createElement("p");
    const suggestionTextTitle = document.createElement("p");
    const contentSelectedText = document.createElement("div");
    const contentTranslateText = document.createElement("div");
    const contentSuggestionText = document.createElement("div");
    const selectedText = document.createElement("p");
    const translateText = document.createElement("p");
    const suggestionText = document.createElement("p");
    const button = document.createElement("button");
    const a = document.createElement("a");

    modalLayout.classList.add("modal-layout");
    wrapperSelectedTextDiv.classList.add("wrapper-content");
    wrapperTranslateTextDiv.classList.add("wrapper-content");
    wrapperSuggestionTextDiv.classList.add("wrapper-content");

    selectedTextTitle.classList.add("title");
    translateTextTitle.classList.add("title");
    suggestionTextTitle.classList.add("title");

    contentSelectedText.classList.add("text-content");
    contentTranslateText.classList.add("text-content");
    contentSuggestionText.classList.add("text-content");

    selectedText.setAttribute("id", "selected-text1");
    translateText.setAttribute("id", "selected-text2");
    suggestionText.setAttribute("id", "selected-text3");

    // button.classList.add("save-button-my-extension");
    // button.setAttribute("id", "buton-extension");
    a.setAttribute("id", "buton-extension");
    // a.setAttribute(
    //   "href",
    //   "https://api.notion.com/v1/oauth/authorize?client_id=6fe491a5-3b72-49a2-b321-66db7eb26c21&response_type=code"
    // );

    wrapperSelectedTextDiv.appendChild(selectedTextTitle);
    wrapperSelectedTextDiv.appendChild(contentSelectedText);
    selectedTextTitle.innerText = "Selected text";
    selectedText.innerText = request?.message?.text;
    contentSelectedText.appendChild(selectedText);

    wrapperTranslateTextDiv.appendChild(translateTextTitle);
    wrapperTranslateTextDiv.appendChild(contentTranslateText);
    translateTextTitle.innerText = "Translate text";
    translateText.innerText = getTranslate();
    contentTranslateText.appendChild(translateText);

    wrapperSuggestionTextDiv.appendChild(suggestionTextTitle);
    wrapperSuggestionTextDiv.appendChild(contentSuggestionText);
    suggestionTextTitle.innerText = "Suggestion text";
    suggestionText.innerText = getSugestion();
    contentSuggestionText.appendChild(suggestionText);

    modalLayout.appendChild(wrapperSelectedTextDiv);
    modalLayout.appendChild(wrapperTranslateTextDiv);
    modalLayout.appendChild(wrapperSuggestionTextDiv);
    modalLayout.appendChild(a);
    // button.innerText = "Save to notion";aa
    a.innerText = request.message.login ? "Save to notion" : "Login";
    body.insertAdjacentElement("afterbegin", modalLayout);

    a.addEventListener("click", () => {
      // document.body.removeChild(modalLayout);
      sendMessage(request.message.login);
    });
  }
});

function sendMessage(message) {
  chrome.runtime.sendMessage({ isLogged: message });
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
