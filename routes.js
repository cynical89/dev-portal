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
routes.get("/login_success", account.success);

// GET requests for dev portal
routes.get("/portal/tasks", portal.tasks);
routes.get("/portal/task/:id", portal.task);
// POST requests for dev portal
routes.post("/requests/:type/:id", portal.request);

// GET requests for admin portal
routes.get("/portal/admin", portal.admin);
routes.get("/portal/admin/requests", portal.requests);
routes.get("/portal/admin/assign", portal.assigning);

// POST requests for admin portal
routes.post("/portal/requests/delete/:id", portal.deleteReq);
routes.post("/portal/admin/assign", portal.assign);
routes.post("/portal/admin/addTask", portal.addTask);
routes.post("/portal/task/delete/:id", portal.deleteTask);

// you can add as many strategies as you want
routes.get("/auth/github",
	passport.authenticate("github")
);

routes.get("/auth/github/callback",
	passport.authenticate("github", {
		successRedirect: "/login_success",
		failureRedirect: "/"
	})
);

app.use(routes.middleware());
