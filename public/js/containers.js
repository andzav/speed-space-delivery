var url = "https://sspacedelivery.herokuapp.com/api/orders";
var urlGet = "https://sspacedelivery.herokuapp.com/api/orders/containers?SID=";
urlGet += JSON.parse(localStorage.getItem("SID"));
var table = document.getElementById("containers");

document.addEventListener("submit", function (event) {
    event.preventDefault();
});

$(document).ready(function () {
    loadСontainers();
});

function loadСontainers() {
    $.ajax({
        type: 'GET',
        url: urlGet,
        success: function (data) {
            buildHtmlTable(table, data)
        },
        error: function (status) {
            alert(status.responseText);
        }
    })
}

$('#Accept').click(function(){
    var container_JSON={
		  "SID":JSON.parse(localStorage.getItem("SID")),
		  "containerID":$("#cID").val()
    }
     $.ajax({
         type: "POST",
         url: url+"/acceptContainer",
         data: container_JSON,
         success: function () {
             loadContainers();
         },
         error: function (status) {
             alert(status.responseText)
         }
     })
});

var getImageFromUrl = function(data, callback) {
    let url = 'https://chart.googleapis.com/chart?chs=512x512&cht=qr&chl='+data+'&choe=UTF-8&chld=H';
    var img = new Image();

    img.onError = function() {
        alert('Cannot load image: "'+url+'"');
    };
    img.onload = function() {
        callback(img);
    };
    img.src = url;
    img.crossOrigin = "";
}


var createPDF = function(imgData) {
    var doc = new jsPDF();
    doc.setFontSize(40)
    doc.addImage(imgData, 'JPEG', 20, 20, 170, 170);
    doc.text(50, 25, 'SSDC000000001')
    doc.autoPrint()
    window.open(doc.output('bloburl'), '_blank');
}

function buildHtmlTable(selector, responseArr) {
    var keys = [];
    responseArr.map(function (el) {
        for (var k in el) {
            if (keys.indexOf(k) === -1) keys.push(k);
        }
    });

    keys.push('Apply'); 
    var table = "<table class='table-bordered table-hover table-responsive' style='margin: 0 auto; border-collapse: collapse;'>";

    table += "<tr>"

    for (i = 0; i < keys.length; ++i) {
        table += "<th>" + keys[i] + "</th>";
    }
    let unconfirmed = false;
    for (i = 0; i < responseArr.length; ++i) {
        var temp = responseArr[i];
        table += "<tr>";
        for (j = 0; j < keys.length; ++j) {
            table += "<td>";
            if (temp[keys[j]] !== undefined) {
                if (keys[j] !== 'properties'||!temp[keys[j]][0].shipID){

                    if(keys[j]=='Apply'){
                        console.log("LEL");
                        table += '<i class="fa fa-times-circle fa-2x"></i>'
                    } 
                    else if (keys[j] == 'properties'){
                        let totalTime=0, totalPrice=0;
                        temp[keys[j]].forEach(function(el){
                            totalPrice += el.price;
                            totalTime += el.time;
                        });
                        table += "Time " + formatTime(totalTime) + ", price " + totalPrice;
                        
                    } 
                    else{
                        if(Array.isArray(temp[keys[j]])&&keys[j]!=='ordersIDArray'){
                            temp[keys[j]].forEach(function(el,i){
                                if(Array.isArray(el)) table += "" + (i+1) + ": " + el.join(", ") + "<br>";
                                else table += "" + (i+1) + ": " + el + "<br>";
                            })
                        }
                        else table += temp[keys[j]];
                    }
                } 
                else {
                    unconfirmed = true;
                    table += "<select><option disabled selected value> -- select an option -- </option>";
                    temp[keys[j]].forEach(function (el) {
                        let totalTime=0, totalPrice=0;
                        el.properties.forEach(function(el){
                            totalPrice += el.price;
                            totalTime += el.time;
                        });
                        table += "<option>Time " + formatTime(totalTime) + ", price " + totalPrice + ", ship " + el.shipID + " </option>";
                    });
                    table += "</select>";
                }
                
            }else if(keys[j]=='Apply'&&unconfirmed) table += "<i class='fa fa-check-circle-o fa-2x' style='color:green'></i>";
            else table += "";
            table += "</td>";
        }
    }


    table += "</table>";
    selector.innerHTML = table;
}

table.addEventListener('click', confirmContainer);

function confirmContainer(e){
    if(e.target.localName==='i'){
        let trArray = e.target.parentNode.parentNode.childNodes;
        let containerID = trArray[0].innerText;
        let params = "";
        trArray.forEach(function(el){
            if(el.childNodes[0] && el.childNodes[0].value && el.childNodes[0].value.length>0) params = el.childNodes[0].value;
        })
        let shipID = params.split(' ').pop();
        
        getImageFromUrl("SSDС"+(1000000000+containerID).toString().substr(1), createPDF);
        
        if(containerID&&shipID){
            var confirm = {
                "SID": JSON.parse(localStorage.getItem("SID")),
                "shipID": shipID,
                "containerID": containerID
            }
            $.ajax({
                type: "POST",
                url: url+"/confirmContainer",
                data: confirm,
                success: function () {
                    loadСontainers();
                },
                error: function (status) {
                    alert(status.responseText)
                }
            })
        }
    }
}

function formatTime(val) {
    let date = new Date(0);
    date.setHours(date.getHours() - Math.abs(date.getTimezoneOffset() / 60));
    let formatString = '';
    date.setSeconds(val * 24 * 3600);
    if (date.getDate() - 1 > 0) formatString += date.getDate() - 1 + ' days ';
    formatString += date.toTimeString().split(' ')[0];
    return formatString;
}
