$(document).ready(function() {
    var html_string = "";
    for (var i = 0; i < sessions_created.length; ++i) {
        html_string += "<div>" + sessions_created[i]["session_code"] + "</div>"
    }

    $("#sessions_created_div").html(html_string);

    function generate_string(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
     
    $("#generate_new_session").click(function() {
        var random_string = generate_string(10);
        
        save_session(random_string, username);
    });

});

function createInput(){
    $input.appendTo($("#go_session_code"));
}

var save_session = function(session_code, created_by_user){
	$.ajax({
	        type: "POST",
	        url: "save_session",                
	        dataType : "json",
	        contentType: "application/json; charset=utf-8",
	        data : JSON.stringify({
                "session_code": session_code,
                "created_by_user": created_by_user
            }),

		    success: function(data, text) {

               $("#new_session_code").html("Session: " + data["session_code"]);

               $("#other_session_code").html(data["session_code"]);

               var $input = $('<input type="button" value="Enter Session" />');
               $input.appendTo($("#go_session_code"));
               $input.click(function() {
                    window.location = "/questions?session_code=" + session_code;
               }); 
            },
            
		    error: function(request, status, error){
		    	console.log("error: ", error);
		        console.log(request)
		        console.log(status)
		        console.log(error)
		    }
	    });	
}
