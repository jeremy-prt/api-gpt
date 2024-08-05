<?php
namespace Model;

// Inclure le fichier de configuration
require_once '../config/env.php';

class OpenAIModel {
    private $openai_endpoint = "https://api.openai.com/v1/chat/completions";
    private $openai_token = API_KEY;

    public function callOpenAI($message) {
        $data = array(
            "model" => "gpt-3.5-turbo",
            "messages" => array(
                array(
                    "role" => "system",
                    "content" => "Vous êtes un assistant utile qui fournit un titre, un genre et un résumé pour un texte donné en français. La sortie doit être formatée en JSON avec les clés 'title', 'genre' et 'summary'."
                ),
                array(
                    "role" => "user",
                    "content" => $message
                ),
            ),
            "max_tokens" => 300, // Augmentez cette valeur pour permettre des réponses plus longues
            "temperature" => 0.9 // Ajustez cette valeur pour contrôler la créativité des réponses
        );

        $headers = array(
            "Content-Type: application/json",
            "Authorization: Bearer ".$this->openai_token
        );

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->openai_endpoint);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        $response = curl_exec($ch);

        if (curl_errno($ch)) {
            $error_msg = curl_error($ch);
        }

        $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if (isset($error_msg)) {
            die('Error: ' . $error_msg);
        }

        return json_decode($response, true);
    }
}
?>
