"use strict";

module.exports = {
	newRequest: (user, type) => {
		const role = {
			error: false,
			user: user,
			type: type,
			requested: new Date()
		};
		return role;
	}
};
