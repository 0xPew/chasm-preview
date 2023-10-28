const submitButton = document.getElementById("submit");
const roleInput = document.getElementById("role-input");
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
  responseContainer.textContent = content;
};

submitButton.addEventListener("click", () => {
  startLoadingAnimation(); // Start loading animation when the button is clicked

  const roleValue = roleInput.value;
  const inputValue = textInput.value;

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "input": {
      "request": inputValue,
      "job_role": roleValue
    }
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("https://pms.chasm.net/api/prompts/execute/220", requestOptions)
    .then(response => response.json())
    .then(result => {
      const content = result.content;
      stopLoadingAnimation(); // Stop loading animation when the response is received
      showResponse(content);
    })
    .catch(error => {
      console.log('error', error);
      stopLoadingAnimation(); // Stop loading animation in case of an error
      submitButton.textContent = "Error";
    });
});