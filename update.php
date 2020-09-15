<?php

header("Access-Control-Allow-Origin: *");

$obr_id = !empty($_POST['obr_id']) ? json_decode($_POST['obr_id'], true) : 0;
$trains = !empty($_POST['trains']) ? json_decode($_POST['trains'], true) : array();
//$typeDoc = !empty($_POST['type_doc']) ? $_POST['type_doc'] : 1;
$date = !empty($_POST['date']) ? $_POST['date'] : "";
$reasonCode = !empty($_POST['reason_code']) ? $_POST['reason_code'] : 1;
$sign = !empty($_POST['sign']) ? $_POST['sign'] : "";

$dbh = new PDO("pgsql:host=localhost;port=5432;dbname=IOtheBest;user=postgres;password=481516");

$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$dbh->beginTransaction();

$UpdateQuery = "UPDATE treatments SET date_tr = :date_tr, reason_code = :reason_code, sign = :sign WHERE id = :obr_id";
$sth = $dbh->prepare($UpdateQuery);
$res = $sth->execute(array(':obr_id' => $obr_id, ':date_tr' => $date, ':reason_code' => $reasonCode, ':sign' => $sign));

foreach ($trains as $val) {

    $UpdateQuery = "UPDATE train_in_tr SET code_station_naz = :code_station_naz, code_station_prob = :code_station_prob, 
        road_code_bros = :road_code_bros, train_index = :train_index, count_vag = :count_vag WHERE id = :train_id";
    $InsertQuery = "INSERT INTO train_in_tr (id_tr, code_station_naz, code_station_prob, road_code_bros, train_index, count_vag) SELECT :obr_id, :code_station_naz, :code_station_prob, :road_code_bros, :train_index, :count_vag 
        WHERE NOT EXISTS (SELECT 1 FROM train_in_tr WHERE id = :train_id)";
    $sth = $dbh->prepare($UpdateQuery);
    $res = $sth->execute(array(':train_id' => $val['train_id'], ':code_station_naz' => $val['code_station_naz'], ':code_station_prob' => $val['code_station_prob'],
        ':road_code_bros' => $val['road_code_bros'], ':train_index' => $val['train_index'], ':count_vag' => $val['count_vag']));
    $sth = $dbh->prepare($InsertQuery);
    $res = $sth->execute(array(':obr_id' => $obr_id, ':train_id' => $val['train_id'], ':code_station_naz' => $val['code_station_naz'], ':code_station_prob' => $val['code_station_prob'],
        ':road_code_bros' => $val['road_code_bros'], ':train_index' => $val['train_index'], ':count_vag' => $val['count_vag']));

}
$dbh->commit();

echo json_encode($obr_id);

?>