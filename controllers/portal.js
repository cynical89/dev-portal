"use strict";

const config = require("../config.json");
const db = require("../helpers/db");

const taskModel = require("../models/task");

let user = null;
let tasks;
let task;
/**
* GET 'portal/tasks'
* @returns {view} tasks - all available tasks
*/
module.exports.tasks = function* tasks() {
	const tasks = yield db.getAllTasks();
	if (tasks.error === true) {
		this.status = 400;
		return this.body = {error: true, message: tasks.message};
	}
	if (this.isAuthenticated()) {
		user = yield db.getDocument(this.session.passport.user.username, "devs");
		if (user.error === true) {
			this.status = 400;
			return this.body = {error: true, message: user.message};
		}
	} else {
		return this.redirect("/login");
	}

	if (user !== null && user.admin === true) {
		yield this.render("/portal/tasks", {
			script: "tasks",
			title: config.site.name,
			admin: user,
			tasks: tasks
		});
	} else {
		yield this.render("/portal/tasks", {
			script: "tasks",
			title: config.site.name,
			user: user,
			tasks: tasks
		});
	}
};

/**
* GET 'portal/tasks/:id'
* @param {string} id - id of the task we wish to view
* @returns {view} task:id - the specific task requested
*/
module.exports.task = function* task() {
	if (this.params.id === null) {
		this.status = 400;
		return this.body = {error: true, message: "You need to provide a task id"};
	}
	const task = yield db.getDocument(this.params.id, "tasks");
	if (task.error === true) {
		this.status = 400;
		return this.body = {error: true, message: task.message};
	}

	if (this.isAuthenticated()) {
		user = yield db.getDocument(this.session.passport.user.username, "devs");
		if (user.error === true) {
			this.status = 400;
			return this.body = {error: true, message: user.message};
		}
	} else {
		return this.redirect("/login");
	}
	if (user.admin === true) {
		yield this.render("/portal/task", {
			script: "task",
			title: config.site.name,
			admin: user,
			task: task
		});
	} else {
		yield this.render("/portal/task", {
			script: "task",
			title: config.site.name,
			user: user,
			task: task
		});
	}
};

/**
* GET 'portal/admin'
* @returns {view} admin - the admin panel
*/
module.exports.admin = function* admin() {
	if (this.isAuthenticated()) {
		user = yield db.getDocument(this.session.passport.user.username, "devs");
		if (user.error === true) {
			this.status = 400;
			return this.body = {error: true, message: user.message};
		}

		if (user.admin === true) {
			yield this.render("/portal/admin", {
				script: "admin",
				title: config.site.name,
				admin: user
			});
		} else {
			return this.redirect("/portal/tasks");
		}
	} else {
		return this.redirect("/login");
	}
};

/**
* POST 'portal/admin/addTask'
* @param {string} title - title of the task to be added
* @param {string} description - the content information for the task
* @param {string} role - the role of the user meant to complete the task
* @returns {object} task - the full task object that was added
*/
module.exports.addTask = function* addTask() {
	const params = this.request.body;
	if (!this.isAuthenticated()) {
		this.status = 404;
		return this.body = {error: true, message: "You are not authorized to complete this action"};
	}
	if (!params.title && !params.description) {
		this.status = 400;
		return this.body = {error: true, message: "You must provie valid parameters"};
	}
	const task = taskModel.newTask(params.title, params.description);
	if (task.error === true) {
		this.status = 400;
		return this.body = {error: true, message: task.message};
	}
	const result = yield db.saveDocument(task, "tasks");
	if (result.error === true) {
		this.status = 400;
		return this.body = {error: true, message: result.message};
	}

	return this.body = result;
};
