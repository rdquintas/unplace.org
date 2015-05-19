<?php
if (isset($_GET['data'])) {
	$json = $_GET['data'];
	$filename = $_GET['filename'];
	header("Content-disposition: attachment; filename='$filename'");
	header('Content-type: application/json');
	echo $json;
} else {
	echo "Erro na criacao do ficheiro";
}

?>