const submitButton = document.getElementById("submit");
const textInput = document.getElementById("text-input");
const responseContainer = document.getElementById("response");
const question1 = document.getElementById("question1");
const question2 = document.getElementById("question2");
const question3 = document.getElementById("question3");
const question1Container = document.getElementById("question1-container");
const question2Container = document.getElementById("question2-container");
const question3Container = document.getElementById("question3-container");
const question4Container = document.getElementById("question4-container");
const answer1Button = document.getElementById("answer1-send-button");
const answer2Button = document.getElementById("answer2-send-button");
const answer3Button = document.getElementById("answer3-send-button");
const answer4Button = document.getElementById("answer4-send-button");


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

const displayQuestions = (content) => {
  const parsedContent = JSON.parse(content);
  question1.innerHTML = parsedContent.question1;
  question2.innerHTML = parsedContent.question2;
  question3.innerHTML = parsedContent.question3;
  question1Container.style.display = "block";
}

answer1Button.addEventListener("click", () => {
  question2Container.style.display = "block";
});

answer2Button.addEventListener("click", () => {
  question3Container.style.display = "block";
});

answer3Button.addEventListener("click", () => {
  question4Container.style.display = "block";
});

submitButton.addEventListener("click", () => {
  startLoadingAnimation();
  question1Container.style.display = "none";
  question2Container.style.display = "none";
  question3Container.style.display = "none";
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
      displayQuestions(content);
      // showResponse(content);
      stopLoadingAnimation();
    })
    .catch(error => {
      stopLoadingAnimation();
      responseContainer.innerHTML = "<h2 class='list-heading'>Error, please try again later</h2>";
    });
});