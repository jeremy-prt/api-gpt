<?php
namespace Controller;

use Model\OpenAIModel;



class HomeController {
    public function index() {
        include '../view/home.php';
    }

    public function processForm() {
        if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['text'])) {
            $text = trim($_POST['text']);
            
            if (empty($text) || strlen($text) < 10) { // Exemple de validation simple
                echo json_encode([
                    'error' => 'Veuillez donner plus d\'informations dans votre texte.'
                ]);
                return;
            }
            
            $openAI = new OpenAIModel();
            $response = $openAI->callOpenAI($text);

            $result = $response['choices'][0]['message']['content'] ?? 'Une erreur s\'est produite.';

            // Décodez le JSON produit par l'IA
            $jsonResult = json_decode($result, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                $jsonResult = [
                    'title' => 'Erreur',
                    'genre' => 'Erreur',
                    'summary' => 'Le format de la réponse de l\'IA n\'était pas valide JSON.'
                ];
            }

            echo json_encode($jsonResult);
        } else {
            $this->index();
        }
    }
}
?>
