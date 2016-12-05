"use strict";

const config = require("../config.json");
const db = require("../helpers/db");

let user = null;

module.exports.login = function* login() {
	if (this.isAuthenticated()) {
		return this.redirect("/login_success");
	}
	yield this.render("login", {
		title: config.site.name
	});
};

module.exports.logout = function* logout() {
	this.logout();
	return this.redirect("/");
};

module.exports.success = function* success() {
	if (this.isAuthenticated()) {
		user = yield db.getDocument(this.session.passport.user.username, "devs");
	} else {
		return this.redirect("/login");
	}
	if (user !== null && user.admin === true) {
		yield this.render("login_success", {
			title: config.site.name,
			admin: user
		});
	} else {
		yield this.render("login_success", {
			title: config.site.name,
			user: user
		});
	}
};

module.exports.index = function* index() {
	if (this.isAuthenticated()) {
		user = yield db.getDocument(this.session.passport.user.username, "devs");
	} else {
		return this.redirect("/");
	}
	if (user !== null && user.admin === true) {
		yield this.render("account", {title: config.site.name, admin: JSON.stringify(user, null, 2)});
	} else {
		yield this.render("account", {title: config.site.name, user: JSON.stringify(user, null, 2)});
	}
};
