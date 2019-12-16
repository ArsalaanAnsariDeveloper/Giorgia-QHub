$(document).ready(function() {
    console.log(is_authenticated);
    
    $("#enter_button").click(function() {
        if (is_authenticated == 'False') {
            alert("Cannot open a session without logging in.");
            return;
        }
        var session_code = $("#session_code").val();
        session_code = session_code.trim();

        if (session_code == '') {
            alert("Session code cannot be empty");
            return;
        }
        console.log(session_code);
        window.location = "/questions?session_code=" + session_code;
    });
});