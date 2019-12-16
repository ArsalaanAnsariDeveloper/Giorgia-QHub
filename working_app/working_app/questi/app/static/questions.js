// import { userInfo } from "os";

loadMoreClicked = false;
loadingIndex = 0;
ladingItemsAtATime = 6;

$(document).ready(function () {

    $("#submit_question").click(function () {
        submitQuestion()
    });

    $("#display_more_button").click(function () {
        loadMore();
    });

    $("#enter_question").keypress(function (e) {
        if (e.which === 13) {
            submitQuestion();
        }
    });
    reorderQuestions();

    console.log("HERE ", user_type);
    if (user_type === 'ta') {
        $("#session_name_id").click(function () {
            // $("#session_name_id").hide();
            $("#session_name_update_container").show();
            $("#session_name_edit_box").val($("#session_name_id").html());
        });

        $("#session_name_edit_button").click(function () {
            var new_session_name = $("#session_name_edit_box").val();
            new_session_name = new_session_name.trim();
            if (new_session_name == '') {
                alert("Session name cannot be emptry");
                return;
            }

            update_session_name(new_session_name, session_code);
        });
    }
});

var reorderQuestions = function () {
    var sorted_questions_list = questions.sort(function (a, b) {
        return a["votes"] - b["votes"]
    });
    recipes = sorted_questions_list;
    display_questions_list(sorted_questions_list);
};

var highlightQuestion = function () {
    var q = event.target;
    if (user_type === 'ta') {
        $('.question_statement').css('border', '');
        $(q).css('border', '3px solid black');
    }
};

var loadMore = function () {
    loadMoreClicked = true;
    loadingIndex += ladingItemsAtATime;

    for (var i = loadingIndex; (i < questions.length) && (i < loadingIndex + ladingItemsAtATime); ++i) {
        question = questions[i];
        var row = $("<div class='row bottom_row_padding'>");
        var col1 = $("<div class='col-md-2'>");
        $(row).append(col1);

        var votes = $("<div class='question_votes'>");
        $(votes).append(question["votes"]);
        $(row).append(votes);

        var vote_button_container = $("<div style='margin-left: 5px;'>");

        var id = question["id"];
        var vote_button = $("<input type='image' src='https://i.ibb.co/grKw26W/bluearrow.png' data-id='" + id + "' alt='Submit' width='20' height='20'>");

        $(vote_button).click(function () {
            t = event.target;
            p = $(t).parent().parent();
            v = $(p).find(".question_votes").html();

            var el = parseInt(v);
            var new_vote_count = el + 1;
            $(votes).text(new_vote_count);

            var this_id = $(this).data("id");
            update_question(this_id, new_vote_count);
            // added
            reorderQuestions();
        });

        $(vote_button_container).append(vote_button);
        $(row).append(vote_button_container);

        var col_votes = $("<div onclick='highlightQuestion()' class='question_statement col-md-6'>");
        $(col_votes).append(question["question"]);
        $(row).append(col_votes);

        if (user_type === 'ta') {
            var delete_question_button = $("<input  data-id='" + id + "' style='cursor: pointer; width: 25px; height: 25px; border: none; background: #fff; font-weight: bold;' type='button' value='X'/>");

            $(delete_question_button).click(function () {
                var this_id = $(this).data("id");
                delete_question(this_id);
            });

            $(row).append(delete_question_button);
        }

        $("#questions_list").append(row);
    }

};

var display_questions_list = function (questions) {
    $("#questions_list").empty();

    if (questions.length === 0) {
        var row = $("<div class='row'>");
        var col_questions = $("<div class='col-md-4'>");
        $(col_questions).append("No Questions");
        $("#questions_list").append(row);
    } else {
        questions.reverse();
        if (questions.length < ladingItemsAtATime) {
            ladingItemsAtATime = questions.length;
        }
        question_list_len = loadingIndex + ladingItemsAtATime;

        console.log("HERE 2", questions.length);
        console.log("HERE 3", ladingItemsAtATime);
        if (questions.length > ladingItemsAtATime) {
            $("#display_more_button").removeClass("hidden");
            $("#questions_list").removeClass("questions_list_min_width");
        }

        for (var i = 0; i < question_list_len; ++i) {
            question = questions[i];
            var row = $("<div class='row bottom_row_padding'>");
            var col1 = $("<div class='col-md-2'>");
            $(row).append(col1);

            var votes = $("<div class='question_votes'>");
            $(votes).append(question["votes"]);
            $(row).append(votes);

            var vote_button_container = $("<div style='margin-left: 5px;'>");

            var id = question["id"];
            var vote_button = $("<input type='image' src='https://i.ibb.co/grKw26W/bluearrow.png' data-id='" + id + "' alt='Submit' width='20' height='20'>");

            $(vote_button).click(function () {
                t = event.target;
                p = $(t).parent().parent();
                v = $(p).find(".question_votes").html();

                var el = parseInt(v);
                var new_vote_count = el + 1;

                var this_id = $(this).data("id");
                update_question(this_id, new_vote_count);
                // added
                reorderQuestions();
            });

            $(vote_button_container).append(vote_button);
            $(row).append(vote_button_container);

            var col_votes = $("<div onclick='highlightQuestion()' class='question_statement col-md-6'>");
            $(col_votes).append(question["question"]);
            $(row).append(col_votes);

            if (user_type === 'ta') {
                var delete_question_button = $("<input  data-id='" + id + "' style='cursor: pointer; width: 25px; height: 25px; border: none; background: #fff; font-weight: bold;' type='button' value='X'/>");

                $(delete_question_button).click(function () {
                    var this_id = $(this).data("id");
                    delete_question(this_id);
                });

                $(row).append(delete_question_button);
            }
            $("#questions_list").append(row);
        }
    }
};

var save_question = function (new_question) {
    $.ajax({
        type: "POST",
        url: "save_question",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(new_question),
        success: function (data, text) {
            question_data = data["question_data"];
            questions.push(question_data);
            ladingItemsAtATime = 6;

            questions.reverse();
            console.log("HERE ", questions.length);
            display_questions_list(questions);

            $("#enter_question").val("").focus();
        },
        error: function (request, status, error) {
            console.log("Error");
            console.log(request);
            console.log(status);
            console.log(error);
        }
    });
};

var submitQuestion = function () {
    var question = $("#enter_question").val();
    var votes = 0;

    if ($.trim(question) === "") {
        alert("Hey! The question can't be empty!");
        $("#enter_question").val("").focus();
    } else {
        var new_question = {
            "question": question,
            "votes": votes,
            "session_code": session_code,
            "upvoted_users": []
        };
        save_question(new_question)
    }
};

var update_question = function (id, new_count) {
    $.ajax({
        type: "POST",
        url: "update_question",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            "id": id,
            "new_count": new_count,
            "session_code": session_code
        }),
        success: function (data, text) {
            questions = data["questions"];
            reorderQuestions();
            $("#enter_question").val("");
        },
        error: function (request, status, error) {
            console.log("Error");
            console.log(request);
            console.log(status);
            console.log(error);
        }
    });
};

var delete_question = function (id) {
    $.ajax({
        type: "POST",
        url: "delete_question",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({"id": id, "session_code": session_code}),
        success: function (data, text) {
            questions = data["questions"];
            display_questions_list(questions);
        },
        error: function (request, status, error) {
            console.log("Error");
            console.log(request);
            console.log(status);
            console.log(error);
        }
    });
};

var update_session_name = function (new_session_name, session_code) {
    $.ajax({
        type: "POST",
        url: "update_session_name",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            "session_code": session_code,
            "new_session_name": new_session_name
        }),
        success: function (data, text) {
            questions = data["questions"];
            reorderQuestions();
            $("#enter_question").val("");

            new_sesion_name = data["session_name"];
            $("#session_name_id").html(new_session_name).show();
            // $("#session_name_id").show();

            $("#session_name_update_container").hide();
        },
        error: function (request, status, error) {
            console.log("Error");
            console.log(request);
            console.log(status);
            console.log(error);
        }
    });
};