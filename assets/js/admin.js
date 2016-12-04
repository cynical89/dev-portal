$("#taskSubmitButton").on("click", (e) => {
	console.log("submit");
	e.preventDefault();
	var title = $("#title-text").val();
	var desc = $("#content-text").val();
	// do an ajax request here.
	$.ajax({
			type: "POST",
			dataType: "json",
			url: "/portal/admin/addTask",
			data: {title: title, description: desc},
		}).done((result) => {
				if (result.error === true) {
				console.error(result.message);
				}
			// do something with the success, like show a link
			alert("Task added successfully!");
			console.log(result);
		}).fail((err) => {
			// do something with the failure, like laugh at the user
			window.alert("hahahahaha! NO!");
			console.error(err);
	 });
});
