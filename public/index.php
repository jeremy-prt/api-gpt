<?php
require_once '../model/OpenAIModel.php';
require_once '../controller/HomeController.php';

use Controller\HomeController;

$controller = new HomeController();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $controller->processForm();
} else {
    $controller->index();
}
?>
