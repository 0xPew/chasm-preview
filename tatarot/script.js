const submitButton = document.getElementById("submit");
const answerInput = document.getElementById("answer");
const responseContainer = document.getElementById("response");

const startLoadingAnimation = () => {
  submitButton.disabled = true;
  submitButton.classList.add("loading");
  submitButton.style.cursor = "not-allowed";
  let dots = "";
  const addDot = () => {
    if (dots.length === 3) {
      dots = "";
    } else {
      dots += ".";
    }
    submitButton.textContent = `Scrying${dots}`;
  };
  const dotInterval = setInterval(addDot, 500);
  return dotInterval;
};

const stopLoadingAnimation = (dotInterval) => {
  clearInterval(dotInterval);
  submitButton.disabled = false;
  submitButton.classList.remove("loading");
  submitButton.style.cursor = "pointer";
  submitButton.textContent = "Scry";
};

const showResponse = (chosenCard, content) => {
  responseContainer.style.display = "block";
  responseContainer.textContent =
    "Card category: " + chosenCard + "\n\n" + content;
};

submitButton.addEventListener("click", () => {
  const dotInterval = startLoadingAnimation();
  const inputValue = answerInput.value;

  const cards = [
    "The Fool",
    "The Magician",
    "The High Priestess",
    "The Empress",
    "The Emperor",
    "The Hierophant",
    "The Lovers",
    "The Chariot",
    "Strength",
    "The Hermit",
    "Wheel of Fortune",
    "Justice",
    "The Hanged Man",
    "Death",
    "Temperance",
    "The Devil",
    "The Tower",
    "The Star",
    "The Moon",
    "The Sun",
    "Judgement",
    "The World",
  ];

  const chooseRandomCard = () =>
    cards[Math.floor(Math.random() * cards.length)];

  const chosenCard = chooseRandomCard();

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append(
    "Authorization",
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4ZDJiYWQ5Ni03ZTFlLTQxMGMtOTQwNC01MWVhODZiYTE3YmEiLCJpYXQiOjE3MTUyMjA2MTF9.PGv_vpHu84J407v6eVDBta57V8gzciZbzXpDlJ0AL0U"
  );

  const raw = JSON.stringify({
    input: {
      question: inputValue,
      name: chosenCard,
      json_only: "format the result in JSON Object",
    },
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("https://pms.chasm.net/api/prompts/execute/31", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      const content = JSON.parse(result.content).quatrain;
      stopLoadingAnimation(dotInterval);
      showResponse(chosenCard, content);
    })
    .catch((error) => {
      console.log("error", error);
      stopLoadingAnimation(dotInterval);
      submitButton.textContent = "Error";
    });
});
