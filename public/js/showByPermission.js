$(document).ready(function(){
	
if (localStorage.getItem("permission")===null){
	console.log("You are not authorized");
}
	var permission=JSON.parse(localStorage.getItem("permission"));
	switch(permission){
	case "admin":{
		var admin=document.getElementsByClassName("admin");
		console.log("switch admin");
		for (i=0;i<admin.length;i++){
			admin[i].style.display="block";
		}
		break;
	}
		
	case "operator" :{
		console.log("switch operator");
		var operator=document.getElementsByClassName("operator");
			for (i=0;i<admins.length;i++){
				operator[i].style.display="block";
			}
		console.log(admin.length);
		break;
	}	
	default:{
		console.log("switch default");
		var defaultUser=document.getElementsByClassName("default");
		console.log(defaultUser.length);
		for (i=0;i<defaultUser.length;i++){
			defaultUser[i].style.display="block";
		}
		/*var admin=document.getElementsByClassName("admin");
		for (i=0;i<admin.length;i++){
			admin[i].style.display="none";
		}
		var operator=document.getElementsByClassName("operator");
		for (i=0;i<operator.length;i++){
			operator[i].style.display="none";
		}
		console.log("admin length= "+admin.length);
		console.log("operator length= "+operator.length);*/
		break;
		}
}
})

