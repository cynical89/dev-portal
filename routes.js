"use strict";

const config = require("./config.json");

const app = require("./index.js").app;
const passport = require("./index.js").passport;
const Router = require("koa-router");

const routes = new Router();

const main = require("./controllers/main.js");
const account = require("./controllers/account.js");
const portal = require("./controllers/portal.js");

// routes

routes.get("/", main.index);

// for passport
routes.get("/login", account.login);
routes.get("/logout", account.logout);
routes.get("/account", account.index);

routes.get("/portal/tasks", portal.tasks);
routes.get("/portal/task/:id", portal.task);
routes.get("/portal/admin", portal.admin);
routes.post("/portal/admin/addTask", portal.addTask);

// you can add as many strategies as you want
routes.get("/auth/github",
	passport.authenticate("github")
);

routes.get("/auth/github/callback",
	passport.authenticate("github", {
		successRedirect: "/account",
		failureRedirect: "/"
	})
);

app.use(routes.middleware());
