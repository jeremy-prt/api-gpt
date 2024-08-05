document
  .getElementById("textForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const response = await fetch(form.action, {
      method: form.method,
      body: formData,
    });

    if (!response.ok) {
      console.error("Error:", response.statusText);
      return;
    }

    const jsonResponse = await response.json();

    if (jsonResponse.error) {
      document.getElementById("defaultText").style.display = "none";
      document.getElementById("errorMessage").style.display = "block";
      document.getElementById("errorMessage").textContent = jsonResponse.error;
      document.getElementById("result").innerHTML = "";
      document.getElementById("downloadButton").style.display = "none";
      return;
    }

    document.getElementById("defaultText").style.display = "none";
    document.getElementById("errorMessage").style.display = "none";
    displayFormattedResult(
      jsonResponse.title,
      jsonResponse.genre,
      jsonResponse.summary,
      20 // Ajustez la vitesse ici (20 ms par caractère)
    );

    document.getElementById("downloadButton").style.display = "block";
    document.getElementById("downloadButton").onclick = () =>
      downloadResult(jsonResponse);
  });

function displayFormattedResult(title, genre, summary, speed) {
  const resultElement = document.getElementById("result");
  resultElement.innerHTML = "";

  const titleElement = document.createElement("p");
  const genreElement = document.createElement("p");
  const summaryElement = document.createElement("p");

  titleElement.innerHTML =
    '<strong>Titre : </strong><span id="titleText"></span>';
  genreElement.innerHTML =
    '<br><strong>Genre : </strong><span id="genreText"></span>';
  summaryElement.innerHTML =
    '<br><strong>Résumé : </strong><span id="summaryText"></span>';

  resultElement.appendChild(titleElement);
  resultElement.appendChild(genreElement);
  resultElement.appendChild(summaryElement);

  typeWriter(document.getElementById("titleText"), title, speed, () => {
    typeWriter(document.getElementById("genreText"), genre, speed, () => {
      typeWriter(document.getElementById("summaryText"), summary, speed);
    });
  });
}

function typeWriter(element, text, speed, callback) {
  let i = 0;

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else if (callback) {
      callback();
    }
  }

  type();
}

function downloadResult(data) {
  const now = new Date();
  const timestamp = now.toLocaleString();
  const content = {
    Timestamp: timestamp,
    Titre: data.title,
    Genre: data.genre,
    Résumé: data.summary,
  };
  const blob = new Blob([JSON.stringify(content, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "result.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
