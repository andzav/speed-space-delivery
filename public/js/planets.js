var url="https://sspacedelivery.herokuapp.com/api/planets";
var urlGet=url+"?SID=";
	urlGet+=JSON.parse(localStorage.getItem("SID"));
var planets_NODE=document.getElementById("planets");

$(document).ready(function() {
	document.addEventListener("submit",function(event){
		event.preventDefault();
	});
	myGet(buildHtmlTablePlanets);// завантаження таблиці планет
});

function myGet(responseFunction){
	if(localStorage.getItem("SID")){
	$.ajax({
		 url:urlGet,
		 type:'GET',
		 success:function(data){responseFunction(planets_NODE,data)},
		 error:function(status){alert(status.responseText);}
			});
		}else {$.ajax({
			url:"https://sspacedelivery.herokuapp.com/api/planets/getAll",
			type:'GET',
			success:function (data){console.log(data);buildHtmlTablePlanetsUsers(planets_NODE,data)}
		})}
}
function buildHtmlTablePlanetsUsers(selector,array){

	var table="<table class='table-bordered table-hover table-responsive'>";
	
	table+="<tr>"
	table+="<th>name</th><th>moonOf</th><th>galactic</th>"
	table+="</tr>"
	for (i=0;i<array.length;++i){
		table+="<tr>"
		table+="<td>"+array[i].name;
		table+="</td>";
		if(array[i].moonOf){table+="<td>"+array[i].moonOf;table+="</td>"}
		table+="<td>"+array[i].galactic;
		table+="</td>";
		table+="</tr>";
	}
	table+="</table>";
	selector.innerHTML=table;
	
}

//<i class='fa fa-times-circle'></i>
function myPost(obj_JSON){
	console.log(obj_JSON);
 $.ajax({
	 url:url,
	 type:'POST',
	 data:obj_JSON,
	 success:function(){alert("O`k");myGet(buildHtmlTablePlanets)},
	 error:function(status){alert(status.responseText); return false;}
		})
}



function deletePlanet (param) {
	console.log(param);
	$.ajax({
		"url":url,
		type:'DELETE',
		data:{
			"SID":JSON.parse(localStorage.getItem("SID")),
			"planetName":param
		},
		success:function(){console.log("success in delete");myGet(buildHtmlTablePlanets)},
	 	error:function(status){alert(status.responseText);}
		
	//})
})
}

$("#add").click(function(){addPlanet()});
$("#reload").click(function (){console.log("reload");myGet(buildHtmlTablePlanets)}); // обновленя таблиці
$("#delete").click(function(){var name=$("#name").val();deletePlanet(name);myGet(buildHtmlTablePlanets)}); // видалення планети по параметру

function buildHtmlTablePlanets(selector,responseArr)
	{
		var position = responseArr.map(function(el){
return el.position;
		});
		
		responseArr = responseArr.map(function(el){
return el.data;
		});
		
			var keys = [];
responseArr.map(function(el){
    for(var k in el){
  if(keys.indexOf(k)===-1) keys.push(k);
    }
});
keys.sort();
		

	
	var table="<table class='table-bordered table-hover table-responsive'>";
	
	table+="<tr>"
	
	for (i=0;i<keys.length;++i){
		table+="<th>"+keys[i]+"</th>";
	}
		table+="<th>X</th><th>Y</th><th style='color:red;'>Delete</th><th style='color:#FFED00;'>Change</th>";
	table+="</tr>"
	
	
	for (i=0;i<responseArr.length;++i){
		var temp=responseArr[i];
		table+="<tr>";
	for (j=0;j<keys.length;++j){
		if(j==0){
			table+='<td style="background-color:';
			table+=temp[keys[j]];
			table+='">';
			table+=temp[keys[j]];
			table+='</td>';;
		}
		else
		{
			table+="<td>";
			if(temp[keys[j]]) table+=temp[keys[j]];else table+="";
			table+="</td>";
			}
	}
		if(position[0]){
			table+="<td>"+position[i].x+"</td>";
			table+="<td>"+position[i].y+"</td>";
			}
			table+="<td><i class='fa fa-times-circle fa-2x' style='color:red;' onclick='";
			table+="removePlanet(\"";
			table+=temp.name;
			table+="\")'</i></td>";
			table+'</tr>';
		}

	
	table+="</table>";
	selector.innerHTML=table;
		}
 function removePlanet(name){
	  $.confirm({
	animation:'rotate',
	closeAnimation:'scale',	 
    title: 'Removing Planet',
    content: 'Do you realy want to remove '+ name,
    type: 'red',
    typeAnimated: true,
	autoClose: 'cancel|4000',
    buttons: {
        remove: {
            text: 'Remove!',
            btnClass: 'btn-red',
            action: function(){
				$.ajax({
		 type:'DELETE',
		 url:url,
		 data:{
			 "SID":JSON.parse(localStorage.getItem("SID")),
			 "planetName":name
		 },
		 success:function (){
		myGet(buildHtmlTablePlanets);
	},
		erorr:function(status){
			alert(status.responseText);
		}
	 })
            }
        },
        cancel: function () {
        }
    }
})
 }
			




function addPlanet(){
	var planetJSON={
		"SID":JSON.parse(localStorage.getItem("SID")),
		"planet":{
		"name":$("#name").val(),
		"diameter":$("#diameter").val(),
		"type":$("#type").val(),
		"galactic":$("#galactic").val(),
		"position":{
			"x":$("#x").val(),
			"y":$("#y").val()
		},
		"image":$("#image").val(),
		
		"color":$("#color").val()
	}
	}
	myPost(planetJSON);// mypost
};


