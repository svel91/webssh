

window.onload = function() {
document.getElementById("login_btn").addEventListener("click", function(e) {
  console.log('basic auth');
  $.post("index.html", {type: "login",host:$("input[name='host']").val(),username:$("input[name='username']").val(),password:$("input[name='pwd']").val()}, function(result){
  	result = result.replace('"','').replace('"','');
        if(result == 'Failed'){
        	$("#login_result").html('Please check your credential!!');	
        }else{
        	window.location.href = result;
        }
        
    });
});
};