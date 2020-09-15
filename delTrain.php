<?php

header("Access-Control-Allow-Origin: *");

$id = !empty($_POST['id']) ? json_decode($_POST['id'], true) : 0;

$dbh = new PDO("pgsql:host=localhost;port=5432;dbname=IOtheBest;user=postgres;password=481516");

$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$dbh->beginTransaction();

$UpdateQuery = "DELETE FROM train_in_tr WHERE id = :train_id";
$sth = $dbh->prepare($UpdateQuery);
$res = $sth->execute(array(':train_id' => $id));

$dbh->commit();
$struct = array("is_ok" => 1);
echo json_encode($struct);

?>