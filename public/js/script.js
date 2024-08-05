// Ajoute un écouteur d'événement pour le formulaire avec l'ID "textForm" qui se déclenche lors de la soumission du formulaire
document
  .getElementById("textForm")
  .addEventListener("submit", async function (event) {
    // Empêche le comportement par défaut de la soumission du formulaire (rechargement de la page)
    event.preventDefault();

    // Récupère le formulaire à partir de l'événement
    const form = event.target;
    // Crée un objet FormData à partir du formulaire, contenant tous les champs du formulaire
    const formData = new FormData(form);
    // Envoie une requête fetch au serveur avec les données du formulaire
    const response = await fetch(form.action, {
      method: form.method,
      body: formData,
    });

    // Vérifie si la réponse du serveur n'est pas correcte (code HTTP différent de 2xx)
    if (!response.ok) {
      console.error("Error:", response.statusText);
      return; // Arrête l'exécution si une erreur est survenue
    }

    // Récupère la réponse JSON du serveur
    const jsonResponse = await response.json();

    // Si la réponse JSON contient une erreur
    if (jsonResponse.error) {
      // Masque le texte par défaut
      document.getElementById("defaultText").style.display = "none";
      // Affiche le message d'erreur
      document.getElementById("errorMessage").style.display = "block";
      document.getElementById("errorMessage").textContent = jsonResponse.error;
      // Vide le contenu du résultat
      document.getElementById("result").innerHTML = "";
      // Cache le bouton de téléchargement
      document.getElementById("downloadButton").style.display = "none";
      return; // Arrête l'exécution si une erreur est survenue
    }

    // Si aucune erreur, masque le texte par défaut et le message d'erreur
    document.getElementById("defaultText").style.display = "none";
    document.getElementById("errorMessage").style.display = "none";
    // Affiche le résultat formaté
    displayFormattedResult(
      jsonResponse.title,
      jsonResponse.genre,
      jsonResponse.summary,
      20 // Ajustez la vitesse ici (20 ms par caractère)
    );

    // Affiche le bouton de téléchargement et lui attribue une action de clic pour télécharger le résultat
    document.getElementById("downloadButton").style.display = "block";
    document.getElementById("downloadButton").onclick = () =>
      downloadResult(jsonResponse);
  });

// Fonction pour afficher le résultat formaté
function displayFormattedResult(title, genre, summary, speed) {
  const resultElement = document.getElementById("result");
  resultElement.innerHTML = ""; // Vide le contenu précédent du résultat

  // Crée des éléments de paragraphe pour le titre, le genre et le résumé
  const titleElement = document.createElement("p");
  const genreElement = document.createElement("p");
  const summaryElement = document.createElement("p");

  // Remplit les éléments avec le contenu HTML
  titleElement.innerHTML =
    '<strong>Titre : </strong><span id="titleText"></span>';
  genreElement.innerHTML =
    '<br><strong>Genre : </strong><span id="genreText"></span>';
  summaryElement.innerHTML =
    '<br><strong>Résumé : </strong><span id="summaryText"></span>';

  // Ajoute les éléments de paragraphe au conteneur du résultat
  resultElement.appendChild(titleElement);
  resultElement.appendChild(genreElement);
  resultElement.appendChild(summaryElement);

  // Utilise la fonction typeWriter pour afficher progressivement le texte du titre, du genre et du résumé
  typeWriter(document.getElementById("titleText"), title, speed, () => {
    typeWriter(document.getElementById("genreText"), genre, speed, () => {
      typeWriter(document.getElementById("summaryText"), summary, speed);
    });
  });
}

// Fonction pour afficher le texte caractère par caractère (effet machine à écrire)
function typeWriter(element, text, speed, callback) {
  let i = 0;

  function type() {
    if (i < text.length) {
      // Ajoute un caractère au contenu de l'élément
      element.innerHTML += text.charAt(i);
      i++;
      // Appelle la fonction type après un délai défini par speed
      setTimeout(type, speed);
    } else if (callback) {
      // Appelle la fonction de rappel si elle est définie
      callback();
    }
  }

  type(); // Démarre l'animation de typewriter
}

// Fonction pour télécharger le résultat au format JSON
function downloadResult(data) {
  const now = new Date();
  const timestamp = now.toLocaleString(); // Récupère la date et l'heure actuelle
  const content = {
    Timestamp: timestamp,
    Titre: data.title,
    Genre: data.genre,
    Résumé: data.summary,
  };
  // Crée un blob avec le contenu JSON
  const blob = new Blob([JSON.stringify(content, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob); // Crée une URL pour le blob
  const a = document.createElement("a");
  a.href = url;
  a.download = "result.txt"; // Définit le nom du fichier à télécharger
  document.body.appendChild(a);
  a.click(); // Simule un clic pour déclencher le téléchargement
  document.body.removeChild(a);
  URL.revokeObjectURL(url); // Révoque l'URL pour libérer la mémoire
}
