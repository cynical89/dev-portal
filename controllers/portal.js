"use strict";

const config = require("../config.json");
const db = require("../helpers/db");

const taskModel = require("../models/task");

let user = null;

module.exports.tasks = function* tasks() {
	if (this.isAuthenticated()) {
		user = yield db.getDocument(this.session.passport.user.username, "devs");
		if (user !== null && user.admin === true) {
			yield this.render("/portal/tasks", {
				title: config.site.name,
				admin: user
			});
		}
	}

	const tasks = yield db.getAllTasks();

	yield this.render("/portal/tasks", {
		title: config.site.name,
		user: user,
		tasks: tasks
	});
};

module.exports.task = function* task() {
	if (this.isAuthenticated()) {
		user = yield db.getDocument(this.session.passport.user.username, "devs");
	}
	if (user.admin === true) {
		yield this.render("/portal/task/:id", {
			title: config.site.name,
			admin: user
		});
	}
	yield this.render("/portal/task/:id", {
		title: config.site.name,
		user: user
	});
};

module.exports.admin = function* admin() {
	if (this.isAuthenticated()) {
		user = yield db.getDocument(this.session.passport.user.username, "devs");
	}
	// if (user.admin === false) {
	// 	yield this.redirect("/portal/tasks");
	// } else {
	// 	yield this.render("/portal/admin", {
	// 		title: config.site.name,
	// 		admin: user
	// 	});
	// }
	yield this.render("/portal/admin", {
		script: "admin",
		title: config.site.name,
		user: user
	});
};

module.exports.addTask = function* addTask() {
	const params = this.request.body;
	if (!params.title && !params.description) {
		this.status = 400;
		return this.body = {error: true, message: "You must provie valid parameters"};
	}
	const task = taskModel.newTask(params.title, params.description);
	const result = yield db.saveDocument(task, "tasks");

	return this.body = result;
};
