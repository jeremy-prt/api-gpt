// Ajoute un écouteur d'événement sur le formulaire pour intercepter la soumission
document
  .getElementById("textForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Empêche le rechargement par défaut de la page lors de la soumission du formulaire

    const form = event.target; // Récupère le formulaire soumis
    const formData = new FormData(form); // Crée un objet FormData avec les données du formulaire

    // Envoie les données du formulaire au serveur en utilisant fetch
    const response = await fetch(form.action, {
      method: form.method,
      body: formData,
    });

    // Vérifie si la réponse n'est pas OK, et log une erreur si c'est le cas
    if (!response.ok) {
      console.error("Error:", response.statusText);
      return;
    }

    // Convertit la réponse en JSON
    const jsonResponse = await response.json();

    // Vérifie si la réponse contient une erreur et affiche le message d'erreur
    if (jsonResponse.error) {
      document.getElementById("defaultText").style.display = "none";
      document.getElementById("errorMessage").style.display = "block";
      document.getElementById("errorMessage").textContent = jsonResponse.error;
      document.getElementById("result").innerHTML = "";
      document.getElementById("downloadButton").style.display = "none";
      return;
    }

    // Masque les messages par défaut et d'erreur, puis affiche le résultat formaté
    document.getElementById("defaultText").style.display = "none";
    document.getElementById("errorMessage").style.display = "none";
    displayFormattedResult(
      jsonResponse.title,
      jsonResponse.genre,
      jsonResponse.summary,
      20 // Ajustez la vitesse ici (20 ms par caractère)
    );

    // Affiche le bouton de téléchargement et définit son comportement lors du clic
    document.getElementById("downloadButton").style.display = "block";
    document.getElementById("downloadButton").onclick = () =>
      downloadResult(jsonResponse);
  });

// Fonction pour afficher le résultat formaté avec effet de machine à écrire
function displayFormattedResult(title, genre, summary, speed) {
  const resultElement = document.getElementById("result");
  resultElement.innerHTML = ""; // Réinitialise le contenu du résultat

  // Crée et configure les éléments HTML pour le titre, le genre et le résumé
  const titleElement = document.createElement("p");
  const genreElement = document.createElement("p");
  const summaryElement = document.createElement("p");

  titleElement.innerHTML =
    '<strong>Titre : </strong><span id="titleText"></span>';
  genreElement.innerHTML =
    '<br><strong>Genre : </strong><span id="genreText"></span>';
  summaryElement.innerHTML =
    '<br><strong>Résumé : </strong><span id="summaryText"></span>';

  // Ajoute les éléments créés au conteneur de résultat
  resultElement.appendChild(titleElement);
  resultElement.appendChild(genreElement);
  resultElement.appendChild(summaryElement);

  // Applique l'effet de machine à écrire aux différents textes
  typeWriter(document.getElementById("titleText"), title, speed, () => {
    typeWriter(document.getElementById("genreText"), genre, speed, () => {
      typeWriter(document.getElementById("summaryText"), summary, speed);
    });
  });
}

// Fonction pour créer l'effet de machine à écrire
function typeWriter(element, text, speed, callback) {
  let i = 0;

  // Fonction interne pour ajouter progressivement chaque caractère au texte de l'élément
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else if (callback) {
      callback(); // Appelle le callback une fois l'animation terminée
    }
  }

  type(); // Démarre l'animation de machine à écrire
}

// Fonction pour télécharger le résultat sous forme de fichier .txt
function downloadResult(data) {
  const now = new Date(); // Récupère la date et l'heure actuelles
  const timestamp = now.toLocaleString(); // Formate la date et l'heure en chaîne de caractères
  const content = {
    Timestamp: timestamp,
    Titre: data.title,
    Genre: data.genre,
    Résumé: data.summary,
  };

  // Crée un blob à partir du contenu JSON formaté
  const blob = new Blob([JSON.stringify(content, null, 2)], {
    type: "application/json",
  });

  // Crée une URL pour le blob et déclenche le téléchargement du fichier
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "result.txt";
  document.body.appendChild(a);
  a.click(); // Simule un clic pour démarrer le téléchargement
  document.body.removeChild(a); // Supprime le lien du DOM
  URL.revokeObjectURL(url); // Libère l'URL créée
}
