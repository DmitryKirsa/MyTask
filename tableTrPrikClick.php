<?php

header("Access-Control-Allow-Origin: *");
header("Cache-Control: no-cache, no-store, must-revalidate"); // HTTP 1.1.
header("Pragma: no-cache"); // HTTP 1.0.
header("Expires: 0"); // Proxies.

$id_o= !empty($_GET['id_o']) ? $_GET['id_o'] : '1';
$id_r= !empty($_GET['id_r']) ? $_GET['id_r'] : '1';
$id_tr= !empty($_GET['id_tr']) ? $_GET['id_tr'] : '1';

$dbh = new PDO("pgsql:host=localhost;port=5432;dbname=IOtheBest;user=postgres;password=481516");

$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$dbh->beginTransaction();

$SelectQuery ="select train_index, count_vag, id_road, road_name, id_station, station_name, tio.sign, tio.osn_br, tio.id as train_prik_id, reason, orders.reason_code, orders.id_tr as tr_id, to_char(date_tr, 'dd.mm.yyyy') as date, to_char(date_tr, 'hh:mm') as time from orders
inner join treatments t on orders.id_tr = t.id
inner join trains_in_order tio on orders.id = tio.id_order
inner join train_in_tr tit on tio.id_train_tr = tit.id
inner join road_code rc on tit.road_code_bros = rc.id_road
inner join stations s on tit.code_station_naz = s.id_station
inner join reasons r on orders.reason_code = r.id
where num_order=$id_o and t.id_tr=$id_tr and road_code =$id_r";

$sth = $dbh->prepare($SelectQuery);
$res = $sth->execute();
$treatments = array();
$treatments = $sth->fetchAll(PDO::FETCH_ASSOC);

$struct = array("D_Treatments" => $treatments);
 
echo json_encode($struct);

?>