"use strict";

module.exports = {
	newTask: (title, project, description, role = "Any") => {
		const task = {
			error: false,
			title: title,
			role: role,
			project: project,
			description: description,
			created: new Date(),
			status: "Pending",
			assignedTo: null,
			completed: null,
			updates: []
		};
		return task;
	},
	updateTitle: (task, title) => {
		task.title = title;
		return task;
	},
	updateRole: (task, role) => {
		task.role = role;
		return task;
	},
	updateDescription: (task, desc) => {
		task.description = desc;
		return task;
	},
	updateStatus: (task, status) => {
		task.status = status;
		return task;
	},
	assignTask: (task, assignee) => {
		task.assignedTo = assignee;
		return task;
	},
	completeTask: (task) => {
		task.completed = Date.now();
		task.status = "Completed";
		return task;
	},
	addUpdate: (task, update) => {
		task.updates.push(update);
		return task;
	}
};
