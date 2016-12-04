"use strict";

module.exports = {
	newUpdate: (user, subject, comments) => {
		const update = {
			error: false,
			user: user,
			date: Date.now(),
			subject: subject,
			comments: comments
		};
		return update;
	}
};
