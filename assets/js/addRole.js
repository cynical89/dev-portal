$("#roleSubmitButton").on("click", (e) => {
	e.preventDefault();
	var name = $("#name-text").val();
	// do an ajax request here.
	$.ajax({
			type: "POST",
			dataType: "json",
			url: "/portal/admin/addRole",
			data: {name: name},
		}).done((result) => {
				if (result.error === true) {
				console.error(result.message);
				}
			// do something with the success, like show a link
			alert("Role added successfully!");
			console.log(result);
		}).fail((err) => {
			// do something with the failure, like laugh at the user
			window.alert("hahahahaha! NO!");
			console.error(err);
	 });
});
