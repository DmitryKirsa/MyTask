<?php

header("Access-Control-Allow-Origin: *");

$trains = !empty($_POST['trains']) ? json_decode($_POST['trains'], true) : array();
$typeDoc = !empty($_POST['type_doc']) ? $_POST['type_doc'] : 1;
$date = !empty($_POST['date']) ? $_POST['date'] : "";
$reasonCode = !empty($_POST['reason_code']) ? $_POST['reason_code'] : 1;
$sign = !empty($_POST['sign']) ? $_POST['sign'] : "";
$road = !empty($_POST['road']) ? $_POST['road'] : 1;

$dbh = new PDO("pgsql:host=localhost;port=5432;dbname=IOtheBest;user=postgres;password=481516");

$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$dbh->beginTransaction();

$SelectQuery = " SELECT
                        id_rec
                FROM table_num
                WHERE road_code = :roadCode AND type_doc = :typeDoc 
                ORDER BY id_rec DESC
                LIMIT 1";
$sth = $dbh->prepare($SelectQuery);
$res = $sth->execute(array(':roadCode' => $road, ':typeDoc' => $typeDoc));
$res = array();
$res = $sth->fetchAll(PDO::FETCH_ASSOC);

$id_tr = 1;

if(count($res) > 0) {
    $id_tr = $res[0]['id_rec'] + 1;
    $UpdateQuery = "UPDATE table_num SET id_rec = :id_rec WHERE road_code = :roadCode AND type_doc = :typeDoc";
    $sth = $dbh->prepare($UpdateQuery);
    $res = $sth->execute(array(':id_rec' => $id_tr, ':roadCode' => $road, ':typeDoc' => $typeDoc));
} else {
    $InsertQuery = "INSERT INTO table_num (id_rec, road_code, type_doc) VALUES (1, :roadCode, :typeDoc)";
    $sth = $dbh->prepare($InsertQuery);
    $res = $sth->execute(array(':roadCode' => $road, ':typeDoc' => $typeDoc));
}

$InsertQuery = "INSERT INTO treatments (id_tr, date_tr, road_code, reason_code, sign) VALUES  (:id_tr, :date_tr, :road_code, :reason_code, :sign)";
$sth = $dbh->prepare($InsertQuery);
$res = $sth->execute(array(':id_tr' => $id_tr, ':road_code' => $road, ':date_tr' => $date, ':reason_code' => $reasonCode, ':sign' => $sign));
$obr_id = $dbh->lastInsertId();

foreach ($trains as $val) {
    $InsertQuery = "INSERT INTO train_in_tr (id_tr, code_station_naz, code_station_prob, road_code_bros, train_index, count_vag) VALUES (:id_tr, :code_station_naz, :code_station_prob, :road_code_bros, :train_index, :count_vag)";
    $sth = $dbh->prepare($InsertQuery);
    $res = $sth->execute(array(':id_tr' => $obr_id, ':code_station_naz' => $val['code_station_naz'], ':code_station_prob' => $val['code_station_prob'], ':road_code_bros' => $val['road_code_bros'], ':train_index' => $val['train_index'], ':count_vag' => $val['count_vag']));
}

$dbh->commit();

echo json_encode(array('obr_num' => $id_tr, 'obr_idr' => $obr_id, 'road' => $road));

?>