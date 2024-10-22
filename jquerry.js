const API_Token = "Bearer 75bf179960c5aec087b007ffd851179cc0f505af0854c970a988e86af1c8a648";

function displayData() {
    $.ajax({
        url: "https://gorest.co.in/public/v2/users",
        method: "GET",
        dataType: "json",
        headers: {
            'Authorization': API_Token
        },
        success: handleResponse, 
        error: function (error) {
            console.error("Error fetching the data:", error);
            alert("Error fetching the data. Please try again.");
        }
    });
}

function handleResponse(data) {
    var dataList = $("#displayData");
    dataList.empty();
    $.each(data, function (index, story) {
        dataList.append(`
            <div class="mt-2">
                <h3>${story.name}</h3>
                <div>${story.email}</div>
                <div>${story.gender}</div>
                <div>${story.status}</div>
                <div>
                    <button class="btn btn-info btn-sm mr-2 btn-edit" data-id="${story.id}">Edit</button>
                    <button class="btn btn-danger btn-sm mr-2 btn-del" data-id="${story.id}">Delete</button>
                </div>
            </div>
        `);
    });
}

function deleteData() {
    let dataId = $(this).attr("data-id");
    $.ajax({
        url: "https://gorest.co.in/public/v2/users/" + dataId,
        method: "DELETE",
        headers: {
            'Authorization': API_Token
        },
        success: function () {
            displayData();
            alert("User deleted successfully");
        },
        error: function (error) {
            console.error("Error deleting the data:", error);
            alert("Error deleting the user. Please try again.");
        }
    });
}

function handleFormSubmission(event) {
    event.preventDefault();
    let dataId = $("#createbtn").attr("data-id");
    var name = $("#name").val();
    var email = $("#email").val();
    var gender = $("input[name='gender']:checked").val();
    var status = $("input[name='status']:checked").val();

    var url = dataId 
        ? "https://gorest.co.in/public/v2/users/" + dataId
        : "https://gorest.co.in/public/v2/users";

    var method = dataId ? "PUT" : "POST";

    $.ajax({
        url: url,
        method: method,
        headers: {
            'Authorization': API_Token,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({ name, email, gender, status }),
        success: function () {
            displayData();
            resetForm();
            alert(dataId ? "User updated successfully" : "User created successfully");
        },
        error: function (error) {
            console.error("Error " + (dataId ? "updating" : "inserting") + " the data:", error);
            alert("Error " + (dataId ? "updating" : "creating") + " the user. Please try again.");
        }
    });
}

function editBtn(event) {
    event.preventDefault();
    let dataId = $(this).attr("data-id");
    $.ajax({
        url: "https://gorest.co.in/public/v2/users/" + dataId,
        method: "GET",
        headers: {
            'Authorization': API_Token
        },
        success: function (data) {
            console.log(data);
            $("#clearbtn").show();
            $("#name").val(data.name);
            $("#email").val(data.email);
            $("input[name='gender'][value='" + data.gender + "']").prop('checked', true);
            $("input[name='status'][value='" + data.status + "']").prop('checked', true);
            $("#createbtn").html("Update");
            $("#createbtn").attr("data-id", data.id);
        },
        error: function (error) {
            console.error("Error while editing the data:", error);
            alert("Error fetching user data for editing. Please try again.");
        }
    });
}

function resetForm() {
    $("#createbtn").removeAttr("data-id").html("Submit");
    $("#name").val("");
    $("#email").val("");
    $("input[name='gender']").prop("checked", false);
    $("input[name='status']").prop("checked", false);
    $("#clearbtn").hide();
}

$(document).ready(function () {
    displayData();
    $(document).on("click", ".btn-del", deleteData);
    $(document).on("click", ".btn-edit", editBtn);
    $("#userForm").submit(handleFormSubmission);
    $("#clearbtn").on("click", function (e) {
        e.preventDefault();
        resetForm();
    });
});