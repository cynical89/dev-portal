"use strict";

module.exports = {
	newProject: (name, description) => {
		const project = {
			error: false,
			name: name,
			description: description
		};
		return project;
	}
};
