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

$docDate=$treatments[0]['date'];

$tbody = "";
$i=0;

foreach($treatments as $val)
{
    $i++;
    $tbody .= "<tr>
    <td>".$i."</td>
    <td>".$val['name_st_naz']."</td>
    <td>".$val['name_st_prob']."</td>
    <td>".$val['road_name']."</td>
    <td>".$val['train_index']."</td>
    <td>".$val['count_vag']."</td>
    </tr>";
};


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
    body {
    resize: none; /* Запрещаем изменять размер */
   } 
    </style>
</head>
<body style=\"font-family: 'Times New Roman'\">
<p class=\"header\">Обращение</p>
<p class=\"header\">о необходимости задержки в пути следования вагонов, контейнеров</p>
<br><p class=\"header\" style=\"text-decoration: underline\">".$docDate." ".$treatments[0]['time']. " № " .$id_tr."</p><br>
<p class=\"textDoc\">В связи с невыполнением технологических норм переработки вагонов грузополучателями (владельцами или пользователями путей необщего пользования) 
прошу временно отставить от движения по причине \"" .$treatments[0]['reason']. "\" поезда с вагонами в адрес грузополучателей, указанных в таблице</p><br>
                <table width=\"680\" id=\"aggrTablePrint\" >
                <thead class=\"aggrTableThPrint\">
                <tr>
                    <th>№ п/п</th>
                    <th>Станция назначения</th>
                    <th>Станция проблемы</th>
                    <th>Дорога бросания</th>
                    <th>Индекс поезда</th>
                    <th>Количество Вагонов</th>

                </tr>
                </thead>
                <tbody id=\"t_StationsPrint\">
                ".$tbody."
                </tbody>

            </table>
            <br>
            <br>
            <p><ins>".$treatments[0]['sign']."</ins>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; Подпись_______________</p>
</body>
</html>";

?>