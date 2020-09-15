var btn = document.getElementById("addSub");
var btnPrik = document.getElementById("addSubPrik");
var btnReason = document.getElementById("buttonReason");
var btnReasonPrik = document.getElementById("buttonReasonPrik");

var span = document.getElementsByClassName("close")[0];
var spanProb = document.getElementsByClassName("close")[1];
var spanRoads = document.getElementsByClassName("close")[2];
var spanRoadsPrik = document.getElementsByClassName("close")[3];
var spanStationsPrik = document.getElementsByClassName("close")[4];
var spanReasons= document.getElementsByClassName("close")[5];
var spanReasonsPrik= document.getElementsByClassName("close")[6];
var spanSelectPrik= document.getElementsByClassName("close")[7];

var modal = document.getElementById('dirStationsNaz');
var modalProb = document.getElementById('dirStationsProb');
var modalRoads = document.getElementById('dirRoads');

var modalRoadsPrik = document.getElementById('dirRoadsPrik');
var modalStationsPrik = document.getElementById('dirStationsNazPrik');

var modalReasons = document.getElementById('dirReasons');
var modalReasonsPrik = document.getElementById('dirReasonsPrik');
var modalbtnSelect = document.getElementById('dirbtnSelect');

var roads = [];

$(document).ready(function() {

    getLastDays($('#lblLastDays').val())
    getLastPrikDays($('#lblLastPrikDays').val())

    $('#inOrderBtn').prop("disabled", 'true')
    now = new Date()
    let nowMinutes;

    if (now.getMinutes()<10){
        nowMinutes = '0' + now.getMinutes();
    } else nowMinutes=now.getMinutes()


    $('#timeFrom').val(now.getHours()+':'+ nowMinutes)
    $('#dateFrom').val(now.getDate() + '.0' + (now.getMonth()+1) +'.'+ now.getFullYear().toString().substr(-2))

    $.getJSON('http://localhost:8080/task2/init.php', '', function (result) {
        //console.log(result)
        $('#dirReasonsList tbody tr').remove();
        $('#dirStationsList tbody tr').remove();
        $('#dirStationsProbList tbody tr').remove();
        $('#dirRoadsList tbody tr').remove();
        $('#dirRoadsPrikList tbody tr').remove();
        $('#dirStationsPrikList tbody tr').remove();
        $('#dirReasonsPrikList tbody tr').remove();

        roads = result.D_Roads;

        for (let x = 0; x < result.D_Reasons.length; x++){
            var tr =  '<tr data-id="' + result.D_Reasons[x].id + '"><td>'+result.D_Reasons[x].reason + '</td></tr>'
            $('#dirReasonsList tbody').append(tr);
            $('#dirReasonsPrikList tbody').append(tr);
        }
        for (let x = 0; x < result.D_Stations.length; x++){
            var tr =  '<tr data-id="' + result.D_Stations[x].id_station + '"><td>'+result.D_Stations[x].station_name + '</td></tr>'
            $('#dirStationsList tbody').append(tr);
            $('#dirStationsProbList tbody').append(tr);
            $('#dirStationsNazPrik tbody').append(tr);
        }
        for (let x = 0; x < result.D_Roads.length; x++){
            var tr =  '<tr data-id="' + result.D_Roads[x].id_road + '"><td>'+result.D_Roads[x].road_name + '</td></tr>'
            $('#dirRoadsList tbody').append(tr);
            $('#dirRoadsPrikList tbody').append(tr);
        }
    })

})


$('#refDays').on('click', function (){
    getLastDays($('#lblLastDays').val())
})

$('#refPrik').on('click', function (){
    getLastPrikDays($('#lblLastPrikDays').val())
})

$('#searchObr').on('click', function (){
    if ($('#numText').val()!=='' && !isNaN(Number($('#numText').val()))) {
        getLastDays($('#lblLastDays').val(), $('#numText').val())
    }
    else {
        alert('Введите номер обращения для поиска.');
    }
})

$('#searchOrder').on('click', function (){
    if ($('#numTextPrik').val()!=='' && !isNaN(Number($('#numTextPrik').val()))) {
        getLastPrikDays($('#lblLastPrikDays').val(), $('#numTextPrik').val())
    }
    else {
        alert('Введите номер приказа для поиска.');
    }
})

$('#inOrderBtn').on('click', function (){
    $('#savePrik').removeProp("disabled")

    $('#aggrTablePrik tbody tr').remove();
    $('#idObrPrik').val($('#idObr').val());
    $('#idRoadCodePrik').val($('#idRoadCodeObr').val());
    $('#lblObrPrik').val($('#numText').val());
    $('#dateFromPrik').val($('#dateFrom').val())
    $('#timeFromPrik').val($('#timeFrom').val())
    $('#reasonTextPrik').val($('#reasonText').val())
    $('#reasonTextPrikClassInput').val($('#reasonTextClassInput').val())
    for (x=0; x<$('#aggrTable tr').length-1; x++){
        createRowPrik($('#aggrTable tbody tr').eq(x).data('trainId'));
        $('input.indexTrainPrik').eq(x).val($('input.indexTrain').eq(x).val());
        $('input.countVagPrik').eq(x).val($('input.countVag').eq(x).val());
        $('input.roadBrosPrik').eq(x).val($('input.roadBros').eq(x).val());
        $('input.roadBrosPrikClassInput').eq(x).val($('input.roadBrosClassInput').eq(x).val());
        $('input.nazStationPrik').eq(x).val($('input.nazStation').eq(x).val());
        //$('input.nazStation').eq(x).val(result.D_Treatments[x].name_st_naz);
    }
    $("ul.tabs__caption")
        .addClass("active")
        .siblings()
        .removeClass("active")
        .closest("div.tabs")
        .find("div.tabs__content")
        .removeClass("active")
        .eq(1)
        .addClass("active")
    $("ul.tabs__caption li").eq(0).removeClass("active")
    $("ul.tabs__caption li").eq(1).addClass("active")
})

function getLastDays(n, numObr){
    var url='';
    var data='';
    if (numObr==undefined){
        data = 'onDays=' + n;
        url = 'http://localhost:8080/task2/loadTableTr.php';
    } else {
        data = 'onDays=' + n + '&onNum=' + numObr
        url = 'http://localhost:8080/task2/btnSearch.php';

    }

    $.getJSON(url, data, function (result) {
        $('#obrTable tbody tr').remove();
        $('#dirbtnSelectList tbody tr').remove();
       // console.log(result)
        for(let x=0; x<result.D_Treatments.length;x++){
            var tr='<tr data-id="' + result.D_Treatments[x].id_road + '"><td>'+ result.D_Treatments[x].id_tr +'</td>'+
                '<td>'+ result.D_Treatments[x].date_tr +'</td>'+
                '<td>'+ result.D_Treatments[x].road_name +'</td>'+
                '<td>'+ result.D_Treatments[x].sign +'</td>'+
                '<td>Бросание</td>'
            $('#obrTable tbody').append(tr);
            $('#dirbtnSelectList tbody').append(tr);
        }
        $('.selected').removeClass('selected');
        $('#t_obrTable').find($('Tr:nth-child(1)')).toggleClass('selected');
        $('.selected').removeClass('selected');
        $('#t_selTable').find($('Tr:nth-child(1)')).toggleClass('selected');
    })

}

function getLastPrikDays(n, numObr){
    var url='';
    var data='';
    if (numObr==undefined){
        data = 'onDays=' + n;
        url = 'http://localhost:8080/task2/loadTablePrikTr.php';
    } else {
        data = 'onDays=' + n + '&onNum=' + numObr
        url = 'http://localhost:8080/task2/btnSearchPrik.php';

    }

    $.getJSON(url, data, function (result) {
        $('#prikTable tbody tr').remove();
        for(let x=0; x<result.D_Treatments.length;x++){
            var tr=
                //var tr='<tr data-id="' + result.D_Treatments[x].id_road + '"><td>'+ result.D_Treatments[x].id_tr +'</td>'+
                '<tr data-id="' + result.D_Treatments[x].id_tr + '" data-roadId="' + result.D_Treatments[x].id_r+ '"><td>'+ result.D_Treatments[x].num_order +'</td>'+
                '<td>'+ result.D_Treatments[x].date +'</td>'+
                '<td>'+ result.D_Treatments[x].id_tr +'/' +result.D_Treatments[x].road_name+ '</td>'+
                '<td>'+ result.D_Treatments[x].sign +'</td>'+
                '</tr>'
            $('#prikTable tbody').append(tr);
        }
        $('.selected').removeClass('selected');
        $('#t_prikTable').find($('Tr:nth-child(1)')).toggleClass('selected');
    })

}

$('#obrTable').on('click', 'tr', function(){
    $('.selected').removeClass('selected');
    $(this).toggleClass('selected');
});

$('#prikTable').on('click', 'tr', function(){
    $('.selected').removeClass('selected');
    $(this).toggleClass('selected');
});

$('#obrTable').on('dblclick', 'tr', function() {
    let data = {
        id_road: $('.selected').data('id'),
        id_tr: $(this).find("td:eq(0)").html()
    }
    $('#numText').val($(this).find("td:eq(0)").html());

    $.getJSON('http://localhost:8080/task2/tableTrClick.php', data, function (result) {
        console.log(result)
        $('#aggrTable tbody tr').remove();

        $('#dateFrom').val(result.D_Treatments[0].date);
        $('#timeFrom').val(result.D_Treatments[0].time);
        $('#idObr').val(result.D_Treatments[0].obr_id);
        $('#idRoadCodeObr').val(result.D_Treatments[0].rc_obr);
        $('#reasonText').val(result.D_Treatments[0].reason);
        $('#reasonTextClassInput').val(result.D_Treatments[0].res_id);
        $('#lblSignature').val(result.D_Treatments[0].sign);

        for (x = 0; x < result.D_Treatments.length; x++) {
            createRowObr(result.D_Treatments[x].train_id);
            $('input.nazStation').eq(x).val(result.D_Treatments[x].name_st_naz);
            $('input.nazStationClassInput').eq(x).val(result.D_Treatments[x].id_st_naz);
            $('input.probStation').eq(x).val(result.D_Treatments[x].name_st_prob);
            $('input.probStationClassInput').eq(x).val(result.D_Treatments[x].id_st_prob);
            $('input.indexTrain').eq(x).val(result.D_Treatments[x].train_index);
            $('input.countVag').eq(x).val(result.D_Treatments[x].count_vag);
            $('input.roadBros').eq(x).val(result.D_Treatments[x].road_name);
            $('input.roadBrosClassInput').eq(x).val(result.D_Treatments[x].id_road);
            $('#inOrderBtn').removeProp("disabled")
        }
    })

})

$('#docTr').on('click', function (){
    let data = {
        id_road: $('.selected').data('id'),
        id_tr: $('.selected').find("td:eq(0)").html()
    }
    if ($('#aggrTable tr').length-1<=0){
        alert('Выберите обращение для печати из таблицы.')
        return false;
    }

    window.open('http://localhost:8080/task2/docTrPrint.php?id_road='+ data.id_road + '&id_tr=' + data.id_tr, 'print_doc',
        'Height=556,Width=700,top=50,left=50,status=0,fullscreen=0,location=0,scrollbars=0,resizable=0,menubar=0,titlebar=0,toolbar=0,autobars=0,resize=noneм ');

})

$('#docOr').on('click', function (){

    $('#numTextPrik').val($('.selected').find("td:eq(0)").html());
    let data = {
        id_o: $('.selected').find("td:eq(0)").html(),
        id_tr: $('.selected').data('id'),
        id_r: $('.selected').data('roadid'),
    }
    $('#lblObrPrik').val(data.id_tr);
    console.log(data)
    if ($('#aggrTablePrik tr').length-1<=0){
        alert('Выберите приказ для печати из таблицы.')
        return false;
    }

    window.open('http://localhost:8080/task2/docOrPrint.php?id_o='+ data.id_o + '&id_r=' + data.id_r + '&id_tr=' + data.id_tr, 'print_doc',
        'Height=556,Width=700,top=50,left=50,status=0,fullscreen=0,location=0,scrollbars=0,resizable=0,menubar=0,titlebar=0,toolbar=0,autobars=0');

})

$('#prikTable').on('dblclick', 'tr', function() {

    $('#numTextPrik').val($(this).find("td:eq(0)").html());
    let data = {
        id_o: $('#numTextPrik').val(),
        id_tr: $('.selected').data('id'),
        id_r: $('.selected').data('roadid'),
    }
    $('#lblObrPrik').val(data.id_tr);
    console.log(data)
    $.getJSON('http://localhost:8080/task2/tableTrPrikClick.php', data, function (result) {

        $('#aggrTablePrik tbody tr').remove();

        $('#dateFromPrik').val(result.D_Treatments[0].date);
        $('#timeFromPrik').val(result.D_Treatments[0].time);

        $('#idObrPrik').val(result.D_Treatments[0].tr_id);

        $('#reasonTextPrik').val(result.D_Treatments[0].reason);
        $('#reasonTextPrikClassInput').val(result.D_Treatments[0].res_id);
        $('#lblSignature').val(result.D_Treatments[0].sign);
        $('#lblOsnBros').val(result.D_Treatments[0].osn_br);

        for (x = 0; x < result.D_Treatments.length; x++) {
            createRowPrik(result.D_Treatments[x].train_id);
            $('#aggrTablePrik tbody tr').eq(x).data('trainPrikId', result.D_Treatments[x].train_prik_id);
            $('input.indexTrainPrik').eq(x).val(result.D_Treatments[x].train_index);
            $('input.countVagPrik').eq(x).val(result.D_Treatments[x].count_vag);
            $('input.roadBrosPrik').eq(x).val(result.D_Treatments[x].road_name);
            $('input.roadBrosPrikClassInput').eq(x).val(result.D_Treatments[x].id_road);
            $('input.nazStationPrik').eq(x).val(result.D_Treatments[x].station_name);
            $('input.nazStationPrikClassInput').eq(x).val(result.D_Treatments[x].id_station);
        }
    })

})

btn.addEventListener('click',function (event) {
    createRowObr(0)
})

$('#newObr').on('click', function (){
    $('#aggrTable tbody tr').remove();
    $('#aggrTablePrik tbody tr').remove();
    $('#numText').val('')
    $('#dateFrom').val('')
    $('#timeFrom').val('')
    $('#reasonText').val('')
    $('#inOrderBtn').prop("disabled", 'true')
})

$('#newOrder').on('click', function (){
    $('#aggrTable tbody tr').remove();
    $('#aggrTablePrik tbody tr').remove();
    $('#numTextPrik').val('')
    $('#dateFromPrik').val('')
    $('#timeFromPrik').val('')
    $('#reasonTextPrik').val('')
})

// $('#numObr').on('change', function(){
//     if($(this).val() == '')
// });

$('#saveObr').on('click', function (){
    let trains = [];
    let isOk = true;
    let obr_num = $('#numText').val();

    $('table#aggrTable tbody#t_Stations tr').each(function ()
    {
        let train = getTrainData($(this));
        if(train === null)
        {
            isOk = false;
            return false;
        }
        trains.push(train);
    });
        if (($('#reasonText').val()==='') || ($('#dateFrom').val()==='') || ($('#timeFrom').val()==='')|| ($('#lblSignature').val()==='')){
            isOk = false;
        }
    if(!isOk)
    {
        alert("Не все поля заполнены!")
        return false;
    }

    let data = {
        road: roads[Math.floor(Math.random() * roads.length)].id_road,
        obr_id: $('#idObr').val(),
        date: $('#dateFrom').val() + ' ' + $('#timeFrom').val(),
        trains: JSON.stringify(trains),
        type_doc: 1,
        reason_code: $('#reasonTextClassInput').val(),
        sign: $('#lblSignature').val()
    };
    
    $.ajax({
        url: 'http://localhost:8080/task2/' + ((+obr_num > 0) ? 'update.php' : 'save.php'),
        method: 'post',
        data: data,
        dataType: 'json',
        success: function(result){

            $('#inOrderBtn').removeProp("disabled")
            $('#saveObr').prop("disabled", 'true')
            $('.selected').removeClass('selected');
            $('#obrTable').find($('Tr:nth-child(1)')).addClass('selected');
            $('#obrTable tbody tr').remove();
            getLastDays($('#lblLastDays').val())
            $('#numText').val(result.obr_num);
            $('#obrId').val(result.obr_id);
            $('#idRoadCodeObr').val(result.road);
            alert('Успешное сохранение')
        },
        error: function(){
            console.log('error')
        }
    });
})

function getTrainData(tr)
{
    let train = {
        train_id: tr.data('trainId') + "",
        code_station_naz: tr.find('[name="nazStationNameInput"]').val(),
        code_station_prob: tr.find('[name="probStationNameInput"]').val(),
        road_code_bros: tr.find('[name="roadBrosNameInput"]').val(),
        train_index: tr.find('[name="indexTrain"]').val(),
        count_vag: tr.find('[name="countVag"]').val()
    };

    let isOk = true;
    for(key in train)
    {
        isOk = isOk && (train[key].length > 0);
    }
    if(isOk)
    {
        return train;
    }
    else
    {
        return null;
    }
}

function getTrainPrikData(tr)
{
    console.log(tr);
    let train = {
        train_id: tr.data('trainId') + "",
        train_prik_id: tr.data('trainPrikId') + "",
        //code_station_naz: tr.find('[name="nazStationNameInput"]').val(),
        //code_station_prob: tr.find('[name="probStationNameInput"]').val(),
        road_code_bros: tr.find('[name="roadBrosPrikNameInput"]').val(),
        train_index: tr.find('.indexTrainPrik').val(),
        count_vag: tr.find('.countVagPrik').val()
    };

    console.log(train);

    let isOk = true;
    for(key in train)
    {
        isOk = isOk && (train[key] !== undefined && train[key].length > 0);
    }
    if(isOk)
    {
        return train;
    }
    else
    {
        return null;
    }
}

$('#savePrik').on('click', function (){
    let trains = [];
    let isOk = true;
    let obr_num = $('#numText').val();

    $('table#aggrTablePrik tbody#t_Stations_Prik tr').each(function ()
    {
        let train = getTrainPrikData($(this));
        if(train === null)
        {
            isOk = false;
            return false;
        }
        trains.push(train);
    });
    if (($('#reasonTextPrik').val()==='') || ($('#dateFromPrik').val()==='') || ($('#timeFromPrik').val()==='')|| ($('#lblSignaturePrik').val()==='')){
        isOk = false;
    }
    if(!isOk)
    {
        alert("Не все поля заполнены!")
        return false;
    }

    let data = {
        road: $('#idRoadCodePrik').val(),
        ord_num: $('#numTextPrik').val(),
        obr_id: $('#idObrPrik').val(),
        osn_br: $('#lblOsnBros').val(),
        date: $('#dateFromPrik').val() + ' ' + $('#timeFrom').val(),
        trains: JSON.stringify(trains),
        type_doc: 2,
        reason_code: $('#reasonTextPrikClassInput').val(),
        sign: $('#lblSignature_Prik').val()
    };
    console.log($('#numTextPrik').val());
    $.ajax({
        url: 'http://localhost:8080/task2/' + (($('#numTextPrik').val() !== '') ? 'updatePrik.php' : 'savePrik.php'),
        method: 'post',
        data: data,
        dataType: 'json',
        success: function(result){

           // $('#inOrderBtn').removeProp("disabled")
            $('#savePrik').prop("disabled", 'true')
            $('.selected').removeClass('selected');
            $('#prikTable tbody tr').remove();
            getLastPrikDays($('#lblLastPrikDays').val())
            //$('#numText').val(result);
            alert('Успешное сохранение')
        },
        error: function(){
            console.log('error')
        }
    });
})

btnPrik.addEventListener('click',function (event) {
    //console.log('Нажатие')
    createRowPrik(0)
})

btnReason.addEventListener('click',function (event) {
    modalReasons.style.display = "block";

    $('.selected').removeClass('selected');
    $('#dirReasons').find($('Tr:first-child')).addClass('selected');
    let td = $(this).closest('td');

    $('#dirReasons').on('click', 'tr', function(){
        $('.selected').removeClass('selected');
        $(this).toggleClass('selected');
    });

    $('#dirReasons').on('click', '.btnPrikForm', function() {
        $('#reasonText').val($('.selected').text());
        $('#reasonTextClassInput').val($('.selected').data('id'));
        modalReasons.style.display = "none";
        $('#dirReasons').off();
    });

    $('#dirReasons').on('dblclick', 'tr', function() {
        $('#reasonText').val($('.selected').text());
        $('#reasonTextClassInput').val($('.selected').data('id'));
        modalReasons.style.display = "none";
        $('#dirReasons').off();
    })

})

$('#btnSelect').on('click', function (){
    modalbtnSelect.style.display= 'block';
    $('.modal-content').css('width', '40%')
    $('.selected').removeClass('selected');
    $('#dirbtnSelect').find($('Tr:first-child')).addClass('selected');
})

$('#dirbtnSelect').on('click', 'tr', function (){
    $('.selected').removeClass('selected');
    $(this).toggleClass('selected');
})

$('#dirbtnSelect').on('dblclick', 'tr', function (){

    $('#lblObrPrik').val($(this).find("td:eq(0)").html());
    let data = {
        id_road: $('.selected').data('id'),
        id_tr: $(this).find("td:eq(0)").html()
    }

    $.getJSON('http://localhost:8080/task2/tableTrClick.php', data, function (result) {

        $('#aggrTablePrik tbody tr').remove();
        $('#dateFromPrik').val(result.D_Treatments[0].date);
        $('#timeFromPrik').val(result.D_Treatments[0].time);
        $('#reasonTextPrik').val(result.D_Treatments[0].reason);
        $('#reasonTextPrikClassInput').val(result.D_Treatments[0].res_id);
        $('#lblSignature_Prik').val(result.D_Treatments[0].sign);
        $('#idObrPrik').val(result.D_Treatments[0].obr_id);
        $('#idRoadCodePrik').val(result.D_Treatments[0].rc_obr);

        for (x = 0; x < result.D_Treatments.length; x++) {
            createRowPrik(result.D_Treatments[x].train_id);
            $('input.nazStationPrik').eq(x).val(result.D_Treatments[x].name_st_naz);
            $('input.roadBrosPrik').eq(x).val(result.D_Treatments[x].road_name);
            $('input.countVagPrik').eq(x).val(result.D_Treatments[x].count_vag);
            $('input.indexTrainPrik').eq(x).val(result.D_Treatments[x].train_index);
            $('input.nazStationPrikClassInput').eq(x).val(result.D_Treatments[x].id_st_naz);
            $('input.roadBrosPrikClassInput').eq(x).val(result.D_Treatments[x].id_road);
        }
    })
    modalbtnSelect.style.display = "none";
    $('.selected').removeClass('selected');
    $('.modal-content').css('width', '20%')
})

btnReasonPrik.addEventListener('click',function (event) {
    modalReasonsPrik.style.display = "block";

    $('.selected').removeClass('selected');
    $('#dirReasonsPrik').find($('Tr:first-child')).addClass('selected');
    let td = $(this).closest('td');

    $('#dirReasonsPrik').on('click', 'tr', function(){
        $('.selected').removeClass('selected');
        $(this).toggleClass('selected');
    });

    $('#dirReasonsPrik').on('click', '.btnPrikForm', function() {
        $('#reasonTextPrik').val($('.selected').text());
        $('#reasonTextPrikClassInput').val($('.selected').data('id'));
        modalReasonsPrik.style.display = "none";
        $('#dirReasonsPrik').off();
    });

    $('#dirReasonsPrik').on('dblclick', 'tr', function() {
        $('#reasonTextPrik').val($('.selected').text());
        $('#reasonTextPrikClassInput').val($('.selected').data('id'));
        modalReasonsPrik.style.display = "none";
        $('#dirReasonsPrik').off();
    })

})

span.onclick = function () {
    modal.style.display = "none";
    $('.selected').removeClass('selected');

}

spanProb.onclick = function () {
    modalProb.style.display = "none";
    $('.selected').removeClass('selected');

}

spanRoads.onclick = function () {
    modalRoads.style.display = "none";
    $('.selected').removeClass('selected');

}

spanRoadsPrik.onclick = function () {
    modalRoadsPrik.style.display = "none";
    $('.selected').removeClass('selected');
}

spanStationsPrik.onclick = function () {
    modalStationsPrik.style.display = "none";
    $('.selected').removeClass('selected');
}

spanReasons.onclick = function () {
    modalReasons.style.display = "none";
    $('.selected').removeClass('selected');
}

spanReasonsPrik.onclick = function () {
    modalReasonsPrik.style.display = "none";
    $('.selected').removeClass('selected');
}

spanSelectPrik.onclick = function () {
    modalbtnSelect.style.display = "none";
    $('.selected').removeClass('selected');
    $('.modal-content').css('width', '20%')
}


window.onclick = function (event) {
    switch (event.target) {
        case modal:
            modal.style.display = "none";
            break;
        case modalProb:
            modalProb.style.display = "none";
            break;
        case modalRoads:
            modalRoads.style.display = "none";
            break;
        case modalRoadsPrik:
            modalRoadsPrik.style.display = "none";
            break;
        case modalStationsPrik:
            modalStationsPrik.style.display = "none";
            break;
        case modalReasons:
            modalReasons.style.display = "none";
            break;
        case modalReasonsPrik:
            modalReasonsPrik.style.display = "none";
            break;
        case modalbtnSelect:
            modalbtnSelect.style.display = "none";
            $('.modal-content').css('width', '20%')
            break;
    }
}

function sendDataToInput(td, input, inputHidden, idModal){
    $(idModal).css('display','none')
    td.find(input).val($('.selected').text());
    td.find(inputHidden).val($('.selected').data('id'));
    $(idModal).off();
}

///////////////Вызов модалок//////////////
$('#aggrTable').on('click', '.nazStationSub', function(){
    modal.style.display = "block"

    $('.selected').removeClass('selected');
    $('#dirStationsNaz').find($('Tr:first-child')).addClass('selected');
    let td = $(this).closest('td');
    //console.log()
    $('#dirStationsNaz').on('click', 'tr', function(){
        $('.selected').removeClass('selected');
        $(this).toggleClass('selected');
    });
    $('#dirStationsNaz').on('click', '.btnPrikForm', function() {
        sendDataToInput(td, 'input.nazStation', 'input.nazStationClassInput', '#dirStationsNaz')
    });
    $('#dirStationsNaz').on('dblclick', 'tr', function() {
        sendDataToInput(td, 'input.nazStation', 'input.nazStationClassInput', '#dirStationsNaz')
    })
})


$('#aggrTable').on('click', '.probStationSub', function(){
    modalProb.style.display = "block";
    $('.selected').removeClass('selected');
    $('#dirStationsProb').find($('Tr:first-child')).addClass('selected');
    let td = $(this).closest('td');
    $('#dirStationsProb').on('click', 'tr', function(){
        $('.selected').removeClass('selected');
        $(this).toggleClass('selected');
    });
    $('#dirStationsProb').on('click', '.btnPrikForm', function() {
        sendDataToInput(td, 'input.probStation', 'input.probStationClassInput', '#dirStationsProb')
    });
    $('#dirStationsProb').on('dblclick', 'tr', function() {
        sendDataToInput(td, 'input.probStation', 'input.probStationClassInput', '#dirStationsProb')
    })
})


$('#aggrTable').on('click', '.roadBrosSub', function(){
    modalRoads.style.display = "block";
    $('.selected').removeClass('selected');
    $('#dirRoads').find($('Tr:first-child')).addClass('selected');
    let td = $(this).closest('td');
    $('#dirRoads').on('click', 'tr', function(){
        $('.selected').removeClass('selected');
        $(this).toggleClass('selected');
    });
    $('#dirRoads').on('click', '.btnPrikForm', function() {
        sendDataToInput(td, 'input.roadBros', 'input.roadBrosClassInput', '#dirRoads')
    });
    $('#dirRoads').on('dblclick', 'tr', function() {
        sendDataToInput(td, 'input.roadBros', 'input.roadBrosClassInput', '#dirRoads')
    })
})

$('#aggrTablePrik').on('click', '.roadBrosPrikSub', function(){
    modalRoadsPrik.style.display = "block";
    $('.selected').removeClass('selected');
    $('#dirRoadsPrik').find($('Tr:first-child')).addClass('selected');
    let td = $(this).closest('td');
    $('#dirRoadsPrik').on('click', 'tr', function(){
        $('.selected').removeClass('selected');
        $(this).toggleClass('selected');
    });
    $('#dirRoadsPrik').on('click', '.btnPrikForm', function() {
        sendDataToInput(td, 'input.roadBrosPrik', 'input.roadBrosPrikClassInput', '#dirRoadsPrik')
    });
    $('#dirRoadsPrik').on('dblclick', 'tr', function() {
        sendDataToInput(td, 'input.roadBrosPrik', 'input.roadBrosPrikClassInput', '#dirRoadsPrik')
    })
})


$('#aggrTablePrik').on('click', '.nazStationPrikSub', function(){
    modalStationsPrik.style.display = "block";
    $('.selected').removeClass('selected');
    $('#dirStationsNazPrik').find($('Tr:first-child')).addClass('selected');
    let td = $(this).closest('td');
    $('#dirStationsNazPrik').on('click', 'tr', function(){
        $('.selected').removeClass('selected');
        $(this).toggleClass('selected');
    });
    $('#dirStationsNazPrik').on('click', '.btnPrikForm', function() {
        sendDataToInput(td, 'input.nazStationPrik', 'input.nazStationPrikClassInput', '#dirStationsNazPrik')
    });
    $('#dirStationsNazPrik').on('dblclick', 'tr', function() {
        sendDataToInput(td, 'input.nazStationPrik', 'input.nazStationPrikClassInput', '#dirStationsNazPrik')
    })
})
//////////////////////////

////////////Добавление строк в таблицах/////////////
/*function createRowObr(train_id){
    var tr = '<tr data-train-id="'+train_id+'">' +
        '<td>'+
        '<input type="text" disabled class="nazStation" value="" size="40">'+
        '<input type="hidden" class="nazStationClassInput" name="nazStationNameInput" value="">'+
        '<button type="button" class="nazStationSub" style="width: 20px; height: 20px"><img src="up.jpg"> </button>'+
        '</td>'+
        '<td>'+
        '<input type="text" disabled class="probStation" value="" size="40">'+
        '<input type="hidden" class="probStationClassInput" name="probStationNameInput" value="">'+
        '<button type="button" class="probStationSub" style="width: 20px; height: 20px"><img src="up.jpg"></button></td>'+
        '<td>'+
        '<input type="text" class="indexTrain" name="indexTrain" value="" size="40">'+
        '</td>'+
        '<td>'+
        '<input type="text" class="countVag" name="countVag" value="" size="10">'+
        '</td>'+

        '<td>'+
        '<input type="text" disabled class="roadBros" value="" size="10">'+
        '<input type="hidden" class="roadBrosClassInput" name="roadBrosNameInput" value="">'+
        '<button type="button" class="roadBrosSub" style="width: 20px; height: 20px"><img src="up.jpg"></button></td>'+
        '<td>'+
        '<button type="button" class="delSub" style="width: 15px; height: 15px"><img src="mns.jpg"></button></td>'+
        '</tr>';
    $('#aggrTable tbody').append(tr);
}

function createRowPrik(train_id){
    var tr = '<tr data-train-id="'+train_id+'">' +
        '<td>' +
        '<input type="text" class="indexTrainPrik" value="" size="40">'+
        '</td>'+
        '<td>'+
        '<input type="text" class="countVagPrik" value="" size="40">' +
        '</td>' +
        '<td>' +
        '<input type="text" disabled class="roadBrosPrik" value="" size="40">'+
        '<input type="hidden" class="roadBrosPrikClassInput" name="roadBrosPrikNameInput" value="">'+
        '<button type="button" class="roadBrosPrikSub" style="width: 20px; height: 20px"><img src="up.jpg"></button></td>' +
        '</td>' +
        '<td>' +
        '<input type="text" disabled class="nazStationPrik" value="" size="10">' +
        '<input type="hidden" class="nazStationPrikClassInput" name="nazStationPrikNameInput" value="">'+
        '<button type="button" class="nazStationPrikSub" style="width: 20px; height: 20px"><img src="up.jpg"></button></td>' +
        '</td>'+
        '<td>' +
        '<button type="button" class="delSubPrik" style="width: 15px; height: 15px"><img src="mns.jpg"></button></td>' +
        '</tr>';
    $('#aggrTablePrik tbody').append(tr);
}*/

function createRowObr(train_id){
    var tr = '<tr data-train-id="'+train_id+'">' +
        '<td>'+
        '<input type="text" disabled class="nazStation" value="">'+
        '<input type="hidden" class="nazStationClassInput" name="nazStationNameInput" value="">'+
        '<button type="button" class="nazStationSub" style="width: 20px; height: 20px"><img src="up.jpg"> </button>'+
        '</td>'+
        '<td>'+
        '<input type="text" disabled class="probStation" value="">'+
        '<input type="hidden" class="probStationClassInput" name="probStationNameInput" value="">'+
        '<button type="button" class="probStationSub" style="width: 20px; height: 20px"><img src="up.jpg"></button></td>'+
        '<td>'+
        '<input type="text" class="indexTrain" name="indexTrain" value="">'+
        '</td>'+
        '<td>'+
        '<input type="text" class="countVag" name="countVag" value="">'+
        '</td>'+

        '<td>'+
        '<input type="text" disabled class="roadBros" value="">'+
        '<input type="hidden" class="roadBrosClassInput" name="roadBrosNameInput" value="">'+
        '<button type="button" class="roadBrosSub" style="width: 20px; height: 20px"><img src="up.jpg"></button></td>'+
        '<td>'+
        '<button type="button" class="delSub" style="width: 15px; height: 15px"><img src="mns.jpg"></button></td>'+
        '</tr>';
    $('#aggrTable tbody').append(tr);
}

function createRowPrik(train_id){
    var tr = '<tr data-train-id="'+train_id+'">' +
        '<td>' +
        '<input type="text" class="indexTrainPrik" value=""">'+
        '</td>'+
        '<td>'+
        '<input type="text" class="countVagPrik" value="">' +
        '</td>' +
        '<td>' +
        '<input type="text" disabled class="roadBrosPrik" value="">'+
        '<input type="hidden" class="roadBrosPrikClassInput" name="roadBrosPrikNameInput" value="">'+
        '<button type="button" class="roadBrosPrikSub" style="width: 20px; height: 20px"><img src="up.jpg"></button></td>' +
        '</td>' +
        '<td>' +
        '<input type="text" disabled class="nazStationPrik" value="">' +
        '<input type="hidden" class="nazStationPrikClassInput" name="nazStationPrikNameInput" value="">'+
        '<button type="button" class="nazStationPrikSub" style="width: 20px; height: 20px"><img src="up.jpg"></button></td>' +
        '</td>'+
        '<td>' +
        '<button type="button" class="delSubPrik" style="width: 15px; height: 15px"><img src="mns.jpg"></button></td>' +
        '</tr>';
    $('#aggrTablePrik tbody').append(tr);
}
////////////////////////////

////////////////Удаление строк///////////
$('#aggrTable').on('click', '.delSub', function(){
    let train_id = $(this).closest('tr').data('trainId');

    if(+train_id > 0)
    {
        $.ajax({
            url: 'http://localhost:8080/task2/delTrain.php',
            method: 'post',
            data: {id: train_id},
            dataType: 'json',
            success: function(data){
                console.log('deleted')
            },
            error: function(){
                console.log('error')
            }
        });
    }

    $(this).closest('tr').remove()
})

$('#aggrTablePrik').on('click', '.delSubPrik', function(){
    let train_prik_id = $(this).closest('tr').data('trainPrikId');

    if(+train_prik_id > 0)
    {
        $.ajax({
            url: 'http://localhost:8080/task2/delTrainPrik.php',
            method: 'post',
            data: {id: train_prik_id},
            dataType: 'json',
            success: function(data){
                console.log('deleted')
            },
            error: function(){
                console.log('error')
            }
        });
    }

    $(this).closest('tr').remove()
})
////////////////////////////////////////