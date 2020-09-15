<?php

header("Access-Control-Allow-Origin: *");

$obr_id = !empty($_POST['obr_id']) ? $_POST['obr_id'] : 0;
$ord_num = !empty($_POST['ord_num']) ? $_POST['ord_num'] : 0;
$osn_br = !empty($_POST['osn_br']) ? $_POST['osn_br'] : "";
$trains = !empty($_POST['trains']) ? json_decode($_POST['trains'], true) : array();
//$typeDoc = !empty($_POST['type_doc']) ? $_POST['type_doc'] : 1;
$reasonCode = !empty($_POST['reason_code']) ? $_POST['reason_code'] : 1;
$sign = !empty($_POST['sign']) ? $_POST['sign'] : "";

$dbh = new PDO("pgsql:host=localhost;port=5432;dbname=IOtheBest;user=postgres;password=481516");

$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$dbh->beginTransaction();

$SelectQuery = "SELECT id as id_rec FROM orders WHERE id_tr = :obr_id AND num_order = :ord_num  LIMIT 1";
$sth = $dbh->prepare($SelectQuery);
$res = $sth->execute(array(':obr_id' => $obr_id, ':ord_num' => $ord_num));
$res = array();
$res = $sth->fetchAll(PDO::FETCH_ASSOC);

$ord_id = $res[0]['id_rec'];

$UpdateQuery = "UPDATE orders SET reason_code = :reason_code, osn_br = :osn_br, sign = :sign WHERE num_order = :ord_num AND id_tr = :obr_id";
$sth = $dbh->prepare($UpdateQuery);
$res = $sth->execute(array(':obr_id' => $obr_id, ':ord_num' => $ord_num, ':osn_br' => $osn_br, ':reason_code' => $reasonCode, ':sign' => $sign));

foreach ($trains as $val) {

    $UpdateQuery = "UPDATE trains_in_order SET osn_br = :osn_br, sign = :sign WHERE id_order = :id_order AND id_tr = :id_tr AND id_train_tr = :id_train_tr";
    $InsertQuery = "INSERT INTO trains_in_order (id_order, id_tr, id_train_tr, osn_br, sign) 
        SELECT :id_order, :id_tr, :id_train_tr, :osn_br, :sign
        WHERE NOT EXISTS (SELECT 1 FROM trains_in_order WHERE id_order = :id_order AND id_tr = :id_tr AND id_train_tr = :id_train_tr)";
    $sth = $dbh->prepare($UpdateQuery);
    $res = $sth->execute(array(':id_order' => $ord_id, ':id_tr' => $obr_id, ':id_train_tr' => $val['train_id'], ':osn_br' => $osn_br, ':sign' => $sign));
    $sth = $dbh->prepare($InsertQuery);
    $res = $sth->execute(array(':id_order' => $ord_id, ':id_tr' => $obr_id, ':id_train_tr' => $val['train_id'], ':osn_br' => $osn_br, ':sign' => $sign));

}
$dbh->commit();

echo json_encode($obr_id);

?>