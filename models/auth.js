"use strict";

const passport = require("../index.js").passport;
const config = require("../config.json");
const co = require("co");

const db = require("../helpers/db");
const userModel = require("../models/users");

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});

const GithubStrategy = require("passport-github").Strategy;
// if we have a port other than 80, add it to our callback url
let port = "";
if (config.site.port !== 80) {
	port = `:${config.site.port}`;
}
passport.use(new GithubStrategy({
	clientID: config.site.oauth.github.clientID,
	clientSecret: config.site.oauth.github.clientSecret,
	callbackURL: `${config.site.oauth.host}/auth/github/callback`
	// for testing -- callbackURL: `${config.site.oauth.host}${port}/auth/github/callback`
}, (token, tokenSecret, profile, done) => {
	// retrieve user ...
	co(function* auth() {
		// do some async/yield stuff here to get/set profile data
		// check if the user exists in the db.
		const document = yield db.getDocument(profile.username, "devs");
		// if not create the user.
		if (document.error === true) {
			const username = profile.username;
			const avatar = profile._json.avatar_url;
			let email = "none";
			if (profile.emails !== null || profile.emails !== undefined) {
				email = profile.emails[0].value;
			}
			const user = userModel.newUser(username, email, avatar);
			const doc = yield db.saveDocument(user, "devs");
		}
		done(null, profile);
	}).catch(function onError(e) {
		console.error("Something went terribly wrong!");
		console.error(e.stack);
		done(e, null);
	});
}));
