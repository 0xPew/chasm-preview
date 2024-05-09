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
const answer1Input = document.getElementById("answer1-input");
const answer2Input = document.getElementById("answer2-input");
const answer3Input = document.getElementById("answer3-input");
const answer1Button = document.getElementById("answer1-send-button");
const answer2Button = document.getElementById("answer2-send-button");
const answer3Button = document.getElementById("answer3-send-button");
const answer4Button = document.getElementById("answer4-send-button");
const choice = document.getElementById("choice");

const startLoadingAnimation = (button) => {
  if (button === "submitButton") {
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    submitButton.style.cursor = "not-allowed";
  } else if (button === "answer4Button") {
    answer4Button.disabled = true;
    answer4Button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    answer4Button.style.cursor = "not-allowed";
  }
};

const stopLoadingAnimation = (button) => {
  if (button === "submitButton") {
    submitButton.disabled = false;
    submitButton.innerHTML = '<i class="fas fa-check"></i>';
    submitButton.style.cursor = "pointer";
  } else if (button === "answer4Button") {
    answer4Button.disabled = false;
    answer4Button.innerHTML = '<i class="fas fa-check"></i>';
    answer4Button.style.cursor = "pointer";
  }
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
};

answer1Button.addEventListener("click", () => {
  question2Container.style.display = "block";
});

answer2Button.addEventListener("click", () => {
  question3Container.style.display = "block";
});

answer3Button.addEventListener("click", () => {
  question4Container.style.display = "block";
});

answer4Button.addEventListener("click", () => {
  startLoadingAnimation("answer4Button");

  const inputValue = textInput.value;
  const choiceValue = choice.value;
  const questionsValue =
    "1. " +
    question1.innerHTML +
    " 2. " +
    question2.innerHTML +
    " 3. " +
    question3.innerHTML;
  const responseValue =
    "1. " +
    answer1Input.value +
    " 2. " +
    answer2Input.value +
    " 3. " +
    answer3Input.value;

  const myHeaders = new Headers();

  myHeaders.append("Content-Type", "application/json");
  myHeaders.append(
    "Authorization",
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4ZDJiYWQ5Ni03ZTFlLTQxMGMtOTQwNC01MWVhODZiYTE3YmEiLCJpYXQiOjE3MTUyMjA2MTF9.PGv_vpHu84J407v6eVDBta57V8gzciZbzXpDlJ0AL0U"
  );

  const raw = JSON.stringify({
    input: {
      worries: inputValue,
      questions: questionsValue,
      response: responseValue,
      choice: choiceValue,
    },
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("https://pms.chasm.net/api/prompts/execute/222", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      const content = result.content;
      showResponse(content);
      stopLoadingAnimation("answer4Button");
    })
    .catch((error) => {
      stopLoadingAnimation("answer4Button");
      responseContainer.innerHTML =
        "<h2 class='list-heading'>Error, please try again later</h2>";
    });
});

submitButton.addEventListener("click", () => {
  startLoadingAnimation("submitButton");
  question1Container.style.display = "none";
  question2Container.style.display = "none";
  question3Container.style.display = "none";
  question4Container.style.display = "none";
  responseContainer.style.display = "none";
  const inputValue = textInput.value;
  const myHeaders = new Headers();

  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    input: {
      Worries: inputValue,
    },
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("https://pms.chasm.net/api/prompts/execute/221", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      const content = result.content;
      displayQuestions(content);
      stopLoadingAnimation("submitButton");
    })
    .catch((error) => {
      stopLoadingAnimation("submitButton");
      responseContainer.innerHTML =
        "<h2 class='list-heading'>Error, please try again later</h2>";
    });
});
