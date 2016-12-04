"use strict";

const config = require("../config.json");
const db = require("../helpers/db");

let user = null;

module.exports.index = function* index() {
	if (this.isAuthenticated()) {
		user = yield db.getDocument(this.session.passport.user.username, "devs");
	}
	yield this.render("index", {
		title: config.site.name,
		user: user
	});
};
