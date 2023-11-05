const submitButton = document.getElementById("submit");
const textInput = document.getElementById("text-input");
const responseContainer = document.getElementById("response");

const startLoadingAnimation = () => {
  submitButton.disabled = true;
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  submitButton.style.cursor = "not-allowed";
};

const stopLoadingAnimation = () => {
  submitButton.disabled = false;
  submitButton.innerHTML = '<i class="fas fa-check"></i>';
  submitButton.style.cursor = "pointer";
};

const showResponse = (content) => {
  responseContainer.style.display = "block";
  responseContainer.innerHTML = content;
};


submitButton.addEventListener("click", () => {
  startLoadingAnimation();
  const inputValue = textInput.value;
  const myHeaders = new Headers();

  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    input: {
      Worries: inputValue,
    }
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("https://pms.chasm.net/api/prompts/execute/221", requestOptions)
    .then(response => response.json())
    .then(result => {
      const content = result.content;
      showResponse(content);
      stopLoadingAnimation();
    })
    .catch(error => {
      stopLoadingAnimation();
      responseContainer.innerHTML = "<h2 class='list-heading'>Error, please try again later</h2>";
    });
});