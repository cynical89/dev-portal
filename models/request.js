"use strict";

module.exports = {
	newRequest: (user, type, id, name, project) => {
		const role = {
			error: false,
			user: user,
			type: type,
			reqId: id,
			reqName: name,
			reqProject: project,
			requested: new Date()
		};
		return role;
	}
};
