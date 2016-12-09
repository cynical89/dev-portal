var taskId;

$("#task-view").on("click", "button", (e) => {
	e.preventDefault();
	if(e.target.id === "modelbutton") {
		return;
	}
	if (e.target.id.includes("rm:")) {
		var id = e.target.id.substring(3);
		$.ajax({
				type: "POST",
				dataType: "json",
				url: `/portal/task/delete/${id}`
			}).done((result) => {
					if (result.error === true) {
					console.error(result.message);
					}
				// do something with the success, like show a link
				location = "/portal/tasks";
				console.log(result);
			}).fail((err) => {
				// do something with the failure, like laugh at the user
				window.alert("hahahahaha! NO!");
				console.error(err);
		 });
	} else {
	$.ajax({
			type: "POST",
			dataType: "json",
			url: `/requests/task/${e.target.id}`
		}).done((result) => {
				if (result.error === true) {
				console.error(result.message);
				}
			// do something with the success, like show a link
			alert("Request has been submitted!");
			console.log(result);
		}).fail((err) => {
			// do something with the failure, like laugh at the user
			window.alert("hahahahaha! NO!");
			console.error(err);
	 });
 }
});

$("#updateButton").on("click", (e) => {
	e.preventDefault();
	var taskId = $("#taskInput").val();
	var subject = $("#subject").val();
	var comments = $("#comment-text").val()
	$.ajax({
			type: "POST",
			dataType: "json",
			url: "/portal/task/update",
			data: { id: taskId, subject: subject, comments: comments }
		}).done((result) => {
				if (result.error === true) {
				console.error(result.message);
				}
			// do something with the success, like show a link
			location.reload();
			console.log(result);
		}).fail((err) => {
			// do something with the failure, like laugh at the user
			window.alert("hahahahaha! NO!");
			console.error(err);
	 });
});
