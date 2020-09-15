<?php

header("Access-Control-Allow-Origin: *");

$onDays= !empty($_GET['onDays']) ? $_GET['onDays'] : '30';
$numSearch = !empty($_GET['onNum']) ? $_GET['onNum'] : '1';

$dbh = new PDO("pgsql:host=localhost;port=5432;dbname=IOtheBest;user=postgres;password=481516");

$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$dbh->beginTransaction();

$SelectQuery ="select num_order, to_char(date_tr,'dd.mm.yyyy') as date, t.id_tr, road_name, rc.id_road as id_r, orders.sign from orders
inner join treatments t on orders.id_tr = t.id
inner join road_code rc on t.road_code = rc.id_road
where date_tr>(now()-Interval '$onDays DAY') and num_order=$numSearch
order by to_char(date_tr, 'yyyymmdd') desc";

$sth = $dbh->prepare($SelectQuery);
$res = $sth->execute();
$treatments = array();
$treatments = $sth->fetchAll(PDO::FETCH_ASSOC);

$struct = array("D_Treatments" => $treatments);
 
echo json_encode($struct);

?>