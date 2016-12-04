"use strict";

module.exports = {
	newUpdate: (user, subject, comments) => {
		const update = {
			error: false,
			user: user,
			date: new Date(),
			subject: subject,
			comments: comments
		};
		return update;
	}
};
