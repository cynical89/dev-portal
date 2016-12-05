$("#req").on("click", "button", (e) => {
	e.preventDefault();
	$.ajax({
			type: "POST",
			dataType: "json",
			url: `/request/task/${e.target.id}`
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
});
