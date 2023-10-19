document.addEventListener("DOMContentLoaded", function () {
  const submitButton = document.getElementById("submit");
  const answerInput = document.getElementById("answer");
  const responseContainer = document.getElementById("response");

  submitButton.addEventListener("click", function () {
    submitButton.disabled = true;
    
    let dots = "";
    const addDot = () => {
      if (dots.length === 3) {
        dots = "";
      } else {
        dots += ".";
      }
      submitButton.textContent = `Scrying${dots}`;
    };

    addDot();

    const dotInterval = setInterval(addDot, 500);

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
      "The World"
    ];

    const chooseRandomCard = () => { return cards[Math.floor(Math.random() * cards.length)];};

    const chosenCard = chooseRandomCard();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "input": {
        "question": inputValue,
        "name": chosenCard,
        "json_only": "format the result in JSON Object"
      }
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("https://pms.chasm.net/api/prompts/execute/31", requestOptions)
      .then(response => response.json())
      .then(result => {
        const content = JSON.parse(result.content).quatrain;
        clearInterval(dotInterval);
        submitButton.disabled = false;
        submitButton.textContent = "Scry";

        responseContainer.style.display = "block";

        responseContainer.textContent = "Card category: " + chosenCard + "\n\n" + content;
      })
      .catch(error => {
        console.log('error', error);
        clearInterval(dotInterval);
        submitButton.disabled = false;
        submitButton.textContent = "Error";
      });
  });
});