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

  const parsedContent = JSON.parse(content);
  let formattedContent = "<h2 class='list-heading'>Keep Task List:</h2>";

  for (const task of parsedContent.keep_task_list) {
    formattedContent += `- ${Object.keys(task)[0]}: ${
      Object.values(task)[0]
    }\n`;
  }

  formattedContent += "\n<h2 class='list-heading'>Drop Task List:</h2>";

  for (const task of parsedContent.drop_task_list) {
    formattedContent += `- ${Object.keys(task)[0]}: ${
      Object.values(task)[0]
    }\n`;
  }

  responseContainer.innerHTML = formattedContent;
};

submitButton.addEventListener("click", () => {
  startLoadingAnimation();
  const roleValue = roleInput.value;
  const inputValue = textInput.value;
  const myHeaders = new Headers();

  myHeaders.append("Content-Type", "application/json");
  myHeaders.append(
    "Authorization",
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4ZDJiYWQ5Ni03ZTFlLTQxMGMtOTQwNC01MWVhODZiYTE3YmEiLCJpYXQiOjE3MTUyMjA2MTF9.PGv_vpHu84J407v6eVDBta57V8gzciZbzXpDlJ0AL0U"
  );

  const raw = JSON.stringify({
    input: {
      request: inputValue,
      job_role: roleValue,
    },
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("https://pms.chasm.net/api/prompts/execute/204", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      const content = result.content;
      stopLoadingAnimation();
      showResponse(content);
    })
    .catch((error) => {
      stopLoadingAnimation();
      responseContainer.innerHTML =
        "<h2 class='list-heading'>Error, please try again later</h2>";
    });
});
