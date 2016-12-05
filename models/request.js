"use strict";

module.exports = {
	newRequest: (user, type, id, name) => {
		const role = {
			error: false,
			user: user,
			type: type,
			reqId: id,
			reqName: name,
			requested: new Date()
		};
		return role;
	}
};
