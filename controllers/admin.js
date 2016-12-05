"use strict";

const config = require("../config.json");
const db = require("../helpers/db");

const taskModel = require("../models/task");
const reqModel = require("../models/request");
const projectModel = require("../models/project");
const roleModel = require("../models/userRole");

let user;

module.exports.addProject = function* addProject() {
	const params = this.request.body;
	if (this.isAuthenticated()) {
		user = yield db.getDocument(this.session.passport.user.username, "devs");
		if (user.admin !== true) {
			this.status = 401;
			return this.body = {error: true, message: "You're not authorized to perform this action!"};
		}
	}
	if (!params.name || !params.description) {
		this.status = 400;
		return this.body = {error: true, message: "You need to provide valid arguments"};
	}
	const project = projectModel.newProject(params.name, params.description);
	if (project.error === true) {
		this.status = 400;
		return this.body = {error: true, message: project.message};
	}
	const result = yield db.saveDocument(project, "projects");
	if (result.error === true) {
		this.status = 400;
		return this.body = {error: true, message: result.message};
	}
	return this.body = result;
};

module.exports.addProjectView = function* addProjectView() {
	if (this.isAuthenticated()) {
		user = yield db.getDocument(this.session.passport.user.username, "devs");
		if (user.error === true) {
			this.status = 400;
			return this.body = {error: true, message: user.message};
		}

		if (user.admin === true) {
			yield this.render("/portal/admin_add_project", {
				script: "addProject",
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

module.exports.addRole = function* addRole() {
	const params = this.request.body;
	if (this.isAuthenticated()) {
		user = yield db.getDocument(this.session.passport.user.username, "devs");
		if (user.admin !== true) {
			this.status = 401;
			return this.body = {error: true, message: "You're not authorized to perform this action!"};
		}
	}
	if (!params.name) {
		this.status = 400;
		return this.body = {error: true, message: "You need to provide valid arguments"};
	}
	const role = roleModel.newRole(params.name);
	if (role.error === true) {
		this.status = 400;
		return this.body = {error: true, message: role.message};
	}
	const result = yield db.saveDocument(role, "roles");
	if (result.error === true) {
		this.status = 400;
		return this.body = {error: true, message: result.message};
	}
	return this.body = result;
};

module.exports.addRoleView = function* addRoleView() {
	if (this.isAuthenticated()) {
		user = yield db.getDocument(this.session.passport.user.username, "devs");
		if (user.error === true) {
			this.status = 400;
			return this.body = {error: true, message: user.message};
		}

		if (user.admin === true) {
			yield this.render("/portal/admin_add_role", {
				script: "addRole",
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

module.exports.addTaskView = function* addTaskView() {
	const roles = yield db.getAllRoles();
	if (roles.error === true) {
		this.status = 400;
		return this.body = {error: true, message: roles.message};
	}
	const projects = yield db.getAllProjects();
	if (projects.error === true) {
		this.status = 400;
		return this.body = {error: true, message: projects.message};
	}
	if (this.isAuthenticated()) {
		user = yield db.getDocument(this.session.passport.user.username, "devs");
		if (user.error === true) {
			this.status = 400;
			return this.body = {error: true, message: user.message};
		}

		if (user.admin === true) {
			yield this.render("/portal/admin_add_task", {
				script: "addTask",
				title: config.site.name,
				admin: user,
				projects: projects,
				roles: roles
			});
		} else {
			return this.redirect("/portal/tasks");
		}
	} else {
		return this.redirect("/login");
	}
};
