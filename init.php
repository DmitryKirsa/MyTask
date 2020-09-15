<?php

header("Access-Control-Allow-Origin: *");

$dbh = new PDO("pgsql:host=localhost;port=5432;dbname=IOtheBest;user=postgres;password=481516");

$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$dbh->beginTransaction();

$SelectQuery ="select * from reasons";
$sth = $dbh->prepare($SelectQuery);
$res = $sth->execute();
$reasons = array();
$reasons = $sth->fetchAll(PDO::FETCH_ASSOC);

$SelectQuery ="select * from road_code";
$sth = $dbh->prepare($SelectQuery);
$res = $sth->execute();
$roads = array();
$roads = $sth->fetchAll(PDO::FETCH_ASSOC);

$SelectQuery ="select * from stations";
$sth = $dbh->prepare($SelectQuery);
$res = $sth->execute();
$stations = array();
$stations = $sth->fetchAll(PDO::FETCH_ASSOC);


$struct = array("D_Reasons" => $reasons, "D_Roads" => $roads, "D_Stations" => $stations);
 
echo json_encode($struct);

?>