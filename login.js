
document.addEventListener("submit",pre);
function pre(event){
	event.preventDefault();
	var url = "https://someleltest.herokuapp.com/api/users";
	//sendData(url,createObj());
	sendData(url,createObj(),action());
	console.log(createObj());
	}




function createObj(){
	var email=document.getElementById("email").value;
	var psw=document.getElementById("psw").value;
	var log={
		"email":email,
		"password":psw
}
	return JSON.stringify(log);
	}
function action(){
	
	
	//	
}
function sendData(url,data,action){
var xhr = new XMLHttpRequest();
xhr.open("POST", url, true);
xhr.setRequestHeader("Content-type", "application/json");
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
       localStorage.setItem("SID",this.response);
		location.replace("office.html");
    } 
};
	
xhr.send(data);
	}
