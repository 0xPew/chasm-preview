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

const showResponse = (chosenCard, content) => {
  responseContainer.style.display = "block";
  responseContainer.textContent = "Card category: " + chosenCard + "\n\n" + content;
};

submitButton.addEventListener("click", () => {
  const inputValue = textInput.value;

  const cards = [
    "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
    "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit",
    "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance",
    "The Devil", "The Tower", "The Star", "The Moon", "The Sun", "Judgement", "The World"
  ];

  const chooseRandomCard = () => cards[Math.floor(Math.random() * cards.length)];
  const chosenCard = chooseRandomCard();

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "input": {
      "question": inputValue,
      "name": chosenCard,
      "json_only": "format the result in JSON Object"
    }
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("https://pms.chasm.net/api/prompts/execute/31", requestOptions)
    .then(response => response.json())
    .then(result => {
      const content = JSON.parse(result.content).quatrain;
      stopLoadingAnimation();
      showResponse(chosenCard, content);
    })
    .catch(error => {
      console.log('error', error);
      stopLoadingAnimation();
      submitButton.textContent = "Error";
    });
});