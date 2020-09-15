<?php

header("Access-Control-Allow-Origin: *");

$id_road= !empty($_GET['id_road']) ? $_GET['id_road'] : '1';
$id_tr= !empty($_GET['id_tr']) ? $_GET['id_tr'] : '1';

$dbh = new PDO("pgsql:host=localhost;port=5432;dbname=IOtheBest;user=postgres;password=481516");

$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$dbh->beginTransaction();

$SelectQuery ="select naz.id_station as id_st_naz, naz.station_name as name_st_naz, prob.id_station as id_st_prob, 
prob.station_name as name_st_prob, train_index, count_vag, rc.id_road, rc.road_name, to_char(date_tr,'dd.mm.yyyy') as date, 
to_char(date_tr,'hh:mm') as time, r.reason, r.id as res_id, tit.id_tr as obr_id, tit.id as train_id, sign, treatments.road_code as rc_obr from treatments
inner join train_in_tr tit on treatments.id = tit.id_tr
inner join stations naz on tit.code_station_naz = naz.id_station
inner join stations prob on tit.code_station_prob =prob.id_station
inner join road_code rc on tit.road_code_bros = rc.id_road
inner join reasons r on treatments.reason_code = r.id
where treatments.id_tr = $id_tr and treatments.road_code= $id_road";

$sth = $dbh->prepare($SelectQuery);
$res = $sth->execute();
$treatments = array();
$treatments = $sth->fetchAll(PDO::FETCH_ASSOC);

$struct = array("D_Treatments" => $treatments);
 
echo json_encode($struct);

?>