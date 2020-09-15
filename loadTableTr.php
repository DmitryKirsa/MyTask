<?php

header("Access-Control-Allow-Origin: *");

$onDays= !empty($_GET['onDays']) ? $_GET['onDays'] : '30';

$dbh = new PDO("pgsql:host=localhost;port=5432;dbname=IOtheBest;user=postgres;password=481516");

$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$dbh->beginTransaction();

$SelectQuery ="select id_tr, to_char(date_tr, 'dd.mm.yyyy') as date_tr, id_road, road_name, sign from treatments
inner join road_code rc on rc.id_road = treatments.road_code
where date_tr>(now()-Interval '$onDays DAY')
order by to_char(date_tr, 'yyyymmdd') desc";

$sth = $dbh->prepare($SelectQuery);
$res = $sth->execute();
$treatments = array();
$treatments = $sth->fetchAll(PDO::FETCH_ASSOC);

$struct = array("D_Treatments" => $treatments);
 
echo json_encode($struct);

?>