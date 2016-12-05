$("#projectSubmitButton").on("click", (e) => {
	e.preventDefault();
	var name = $("#name-text").val();
	var desc = $("#description-text").val();
	// do an ajax request here.
	$.ajax({
			type: "POST",
			dataType: "json",
			url: "/portal/admin/addProject",
			data: {name: name, description: desc},
		}).done((result) => {
				if (result.error === true) {
				console.error(result.message);
				}
			// do something with the success, like show a link
			alert("Project added successfully!");
			console.log(result);
		}).fail((err) => {
			// do something with the failure, like laugh at the user
			window.alert("hahahahaha! NO!");
			console.error(err);
	 });
});
