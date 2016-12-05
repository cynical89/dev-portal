"use strict";

const config = require("../config.json");
const db = require("../helpers/db");

const taskModel = require("../models/task");
const reqModel = require("../models/request");

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
* POST 'requests/:type/:id'
*
*/
module.exports.request = function* request() {
	if (!this.isAuthenticated()) {
		this.status = 401;
		return this.body = {error: true, message: "You are not authorized to perform this action"};
	}
	if (this.params.type === null) {
		this.status = 400;
		return this.body = {error: true, message: "You need to provide a type of request"};
	}
	if (this.params.id === null) {
		this.status = 400;
		return this.body = {error: true, message: "You need to provide a request id"};
	}
	const user = yield db.getDocument(this.session.passport.user.username, "devs");
	if (user.error === true) {
		this.status = 400;
		return this.body = {error: true, message: user.message};
	}
	const task = yield db.getDocument(this.params.id, `${this.params.type}s`);
	if (task.error === true) {
		this.status = 400;
		return this.body = {error: true, message: task.message};
	}
	const req = reqModel.newRequest(user.username, this.params.type, this.params.id, task.title);
	if (req.error === true) {
		this.status = 400;
		return this.body = {error: true, message: req.message};
	}
	const result = yield db.saveDocument(req, "reqs");
	return this.body = result;
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

module.exports.requests = function* requests() {
	const reqs = yield db.getAllReqs();
	if (reqs.error === true) {
		this.status = 400;
		return this.body = {error: true, message: reqs.message};
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
		yield this.render("/portal/requests", {
			script: "requests",
			title: config.site.name,
			admin: user,
			reqs: reqs
		});
	} else {
		return this.redirect("/portal/tasks");
	}
};

module.exports.deleteReq = function* deleteReq() {
	if (!this.isAuthenticated()) {
		this.status = 404;
		return this.body = {error: true, message: "You are not authorized to complete this action"};
	}
	// TODO: Authenticate user as admin!

	if (this.params.id === null) {
		this.status = 400;
		return this.body = {error: true, message: "You must provie a request id"};
	}
	const result = yield db.removeDocument(this.params.id, "reqs");
	if (result.error === true) {
		this.status = 400;
		return this.body = {error: true, message: result.message};
	}

	return this.body = result;
};

module.exports.assigning = function* assingin() {

};

module.exports.assign = function* assign() {

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
	// TODO: Authenticate user as admin!

	if (!params.title || !params.description || !params.role || !params.project) {
		this.status = 400;
		return this.body = {error: true, message: "You must provie valid parameters"};
	}
	const task = taskModel.newTask(params.title, params.project, params.description, params.role);
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

module.exports.deleteTask = function* deleteTask() {
	if (!this.isAuthenticated()) {
		this.status = 404;
		return this.body = {error: true, message: "You are not authorized to complete this action"};
	}
	// TODO: Authenticate user as admin!

	if (this.params.id === null) {
		this.status = 400;
		return this.body = {error: true, message: "You must provie a task id"};
	}
	const result = yield db.removeDocument(this.params.id, "tasks");
	if (result.error === true) {
		this.status = 400;
		return this.body = {error: true, message: result.message};
	}

	return this.body = result;
};
