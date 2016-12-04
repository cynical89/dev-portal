"use strict";

const config = require("../config.json");
const db = require("../helpers/db");

let user = null;

module.exports.login = function* login() {
	if (this.isAuthenticated()) {
		user = yield db.getDocument(this.session.passport.user.username, "devs");
	}
	if (user !== null && user.admin === true) {
		yield this.render("login", {
			admin: user
		});
	} else {
		yield this.render("login", {
			user: user
		});
	}
};

module.exports.logout = function* logout() {
	this.logout();
	yield this.redirect("/");
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
