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
    formattedContent += `- ${Object.keys(task)[0]}: ${Object.values(task)[0]}\n`;
  }

  formattedContent += "\n<h2 class='list-heading'>Drop Task List:</h2>";

  for (const task of parsedContent.drop_task_list) {
    formattedContent += `- ${Object.keys(task)[0]}: ${Object.values(task)[0]}\n`;
  }

  responseContainer.innerHTML = formattedContent;
};

submitButton.addEventListener("click", () => {
  startLoadingAnimation();
  const roleValue = roleInput.value;
  const inputValue = textInput.value;
  const myHeaders = new Headers();

  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    input: {
      request: inputValue,
      job_role: roleValue
    }
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("https://pms.chasm.net/api/prompts/execute/204", requestOptions)
    .then(response => response.json())
    .then(result => {
      const content = result.content;

      let keepTaskList = JSON.parse(content).keep_task_list;
      let taskNames = "";

      for (let taskObj of keepTaskList) {
        for (let taskName in taskObj) {
          taskNames += taskName + ", ";
        }
      }

      taskNames = taskNames.slice(0, -2);

      stopLoadingAnimation();
      showResponse(content);

      const secondRequestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify({
          "input": {
            "verified_tasks": taskNames
          }
        }),
        redirect: 'follow'
      };

      return fetch("https://pms.chasm.net/api/prompts/execute/224", secondRequestOptions);
    })
    .then(response => response.json())
    .then(secondResult => {
      const secondContent = secondResult.content;
      console.log(secondContent);
    })
    .catch(error => {
      stopLoadingAnimation();
      responseContainer.innerHTML = "<h2 class='list-heading'>Error, please try again later</h2>";
    });
});