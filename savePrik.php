<?php

header("Access-Control-Allow-Origin: *");

$trains = !empty($_POST['trains']) ? json_decode($_POST['trains'], true) : array();
$typeDoc = !empty($_POST['type_doc']) ? $_POST['type_doc'] : 2;
$obr_id = !empty($_POST['obr_id']) ? $_POST['obr_id'] : 0;
$osn_br = !empty($_POST['osn_br']) ? $_POST['osn_br'] : '';
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

$order_id = 1;

if(count($res) > 0) {
    $order_id = $res[0]['id_rec'] + 1;
    $UpdateQuery = "UPDATE table_num SET id_rec = :id_rec WHERE road_code = :roadCode AND type_doc = :typeDoc";
    $sth = $dbh->prepare($UpdateQuery);
    $res = $sth->execute(array(':id_rec' => $order_id, ':roadCode' => $road, ':typeDoc' => $typeDoc));
} else {
    $InsertQuery = "INSERT INTO table_num (id_rec, road_code, type_doc) VALUES (1, :roadCode, :typeDoc)";
    $sth = $dbh->prepare($InsertQuery);
    $res = $sth->execute(array(':roadCode' => $road, ':typeDoc' => $typeDoc));
}

$InsertQuery = "INSERT INTO orders (id_tr, num_order, reason_code, osn_br, sign)  VALUES  (:id_tr, :num_order, :reason_code, :osn_br, :sign)";
$sth = $dbh->prepare($InsertQuery);
$res = $sth->execute(array(':id_tr' => $obr_id, ':num_order' => $order_id, ':osn_br' => $osn_br, ':reason_code' => $reasonCode, ':sign' => $sign));
$ord_id = $dbh->lastInsertId();

foreach ($trains as $val) {
    $InsertQuery = "INSERT INTO trains_in_order (id_order, id_tr, id_train_tr, osn_br, sign) VALUES  (:id_order, :id_tr, :id_train_tr, :osn_br, :sign)";
    $sth = $dbh->prepare($InsertQuery);
    $res = $sth->execute(array(':id_order' => $ord_id, ':id_train_tr' => $val['train_id'], ':id_tr' => $obr_id, ':osn_br' => $osn_br, ':sign' => $sign));
}

$dbh->commit();

echo json_encode($order_id);

?>