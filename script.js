document.addEventListener("DOMContentLoaded", function () {
  const submitButton = document.getElementById("submit");
  const answerInput = document.getElementById("answer");
  const responseContainer = document.getElementById("response");

  submitButton.addEventListener("click", function () {
    const inputValue = answerInput.value;

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "input": {
        "programming_language": inputValue
      }
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("https://stagingpms.chasm.net/api/prompts/execute/64", requestOptions)
      .then(response => response.json())
      .then(result => {
        const content = result.content;

        responseContainer.style.display = "block";

        responseContainer.textContent = content;
      })
      .catch(error => console.log('error', error));
  });
});