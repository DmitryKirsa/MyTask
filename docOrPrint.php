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

$docDate=$treatments[0]['date'];

$tbody = "";
$i=0;




$_monthsList = array(
    ".01." => "января",
    ".02." => "февраля",
    ".03." => "марта",
    ".04." => "апреля",
    ".05." => "мая",
    ".06." => "июня",
    ".07." => "июля",
    ".08." => "августа",
    ".09." => "сентября",
    ".10." => "октября",
    ".11." => "ноября",
    ".12." => "декабря"
);

$_mD = date(".m.", strtotime($docDate)); //для замены
$docDate = str_replace($_mD, " ".$_monthsList[$_mD]." ", $docDate);

foreach($treatments as $val)
{
    $i++;
    $tbody .= "<tr>
    <td>".$i."</td>
    <td>".$val['train_index']."</td>
    <td>".$val['count_vag']."</td>
    <td>".$val['station_name']."</td>
    <td>".$val['road_name']."</td>
    <td>".$id_tr." - ".$val['date']."</td>
    </tr>";
};

echo
"<!DOCTYPE html>
<html lang=\"en\">
<head>
    <meta charset=\"UTF-8\">
    <title>Документ на печать</title>
    <style type=\"text/css\">
        .header{
    text-align: center;
            font-weight:bold;
            font-size: 18px;
            margin: 0;
        }
        .textDoc{
    text-align: justify;
            font-size: 14px;
            margin: 0;
        }
        
    table {
      border-collapse: collapse;
    }
    th, td {
      border: 1px solid black;
    }

    </style>
</head>
<body style=\"font-family: 'Times New Roman'\">
<p class=\"header\">Оперативный приказ ЦУП</p>
<p class=\"header\">на временное отставление от движения грузового поезда</p>
<br><p class=\"header\" style=\"text-decoration: underline\">".$docDate." ".$treatments[0]['time']. " № " .$id_o."</p><br>
<p class=\"textDoc\">В связи с невозможностью приема по причине \"" .$treatments[0]['reason']. "\" временно отставьте от движения поезда, указанные в таблице</p><br>
                <table width=\"680\" id=\"aggrTableOrderPrint\" >
                <thead class=\"aggrTableThPrint\">
                <tr>
                    <th>№ п/п</th>
                    <th>Индекс поезда</th>
                    <th>Количество вагонов</th>
                    <th>Станция назначения</th>
                    <th>Дорога бросания</th>
                    <th>Обращение ДЦУП</th>

                </tr>
                </thead>
                <tbody id=\"t_StationsOrderPrint\">
                ".$tbody."
                </tbody>

            </table>
            <br>
            <br>
            <p><ins>".$treatments[0]['sign']."</ins>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; Подпись_______________</p>
</body>
</html>";

?>