document.addEventListener("DOMContentLoaded", function () {
  const chatWindow = document.getElementById("chat-window");
  const messageInput = document.getElementById("message-input");
  const sendButton = document.getElementById("send-button");

  messageInput.focus();

  function apiCall(message) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append(
      "Authorization",
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4ZDJiYWQ5Ni03ZTFlLTQxMGMtOTQwNC01MWVhODZiYTE3YmEiLCJpYXQiOjE3MTUyMjA2MTF9.PGv_vpHu84J407v6eVDBta57V8gzciZbzXpDlJ0AL0U"
    );

    var raw = JSON.stringify({
      input: {
        informations: "The cat's available for purchase is MiMi.",
        question: message,
      },
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("https://pms.chasm.net/api/workflows/execute/131", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        displayMessage(result.output, "received");
      })
      .catch((error) => {
        console.log(error);
        displayMessage("Error, please try again", "error");
      })
      .finally(() => {
        const loadingElement = chatWindow.querySelector(".loading");
        if (loadingElement) {
          chatWindow.removeChild(loadingElement);
        }
        messageInput.disabled = false;
        sendButton.disabled = false;
        messageInput.focus();
      });
  }

  function showLoadingIndicator() {
    const loadingBubble = document.createElement("div");
    loadingBubble.classList.add("message", "received", "loading");
    chatWindow.appendChild(loadingBubble);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  function displayMessage(text, type) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", type);
    messageDiv.textContent = text;
    chatWindow.appendChild(messageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  function sendMessage() {
    if (messageInput.value.trim() === "") {
      return;
    }

    apiCall(messageInput.value);

    displayMessage(messageInput.value, "sent");
    messageInput.value = "";
    messageInput.disabled = true;
    sendButton.disabled = true;

    showLoadingIndicator();
  }

  sendButton.addEventListener("click", sendMessage);

  messageInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter" && !messageInput.disabled) {
      sendMessage();
      event.preventDefault();
    }
  });
});
