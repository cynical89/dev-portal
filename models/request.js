"use strict";

module.exports = {
	newRequest: (user, type, id) => {
		const role = {
			error: false,
			user: user,
			type: type,
			reqId: id,
			requested: new Date()
		};
		return role;
	}
};
