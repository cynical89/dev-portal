"use strict";

const config = require("../config.json");
const db = require("../helpers/db");

let user = null;

module.exports.tasks = function* tasks() {
	if (this.isAuthenticated()) {
		user = yield db.getDocument(this.session.passport.user.username, "devs");
	}
	if (user.admin === true) {
		yield this.render("/portal/tasks", {
			title: config.site.name,
			admin: user
		});
	}
	yield this.render("/portal/tasks", {
		title: config.site.name,
		user: user
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
	if (user.admin === false) {
		yield this.redirect("/portal/tasks");
	} else {
		yield this.render("/portal/admin", {
			title: config.site.name,
			admin: user
		});
	}
	yield this.render("/portal/admin", {
		title: config.site.name,
		user: user
	});
};
