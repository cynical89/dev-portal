"use strict";

const expect = require("chai").expect;
const reqModel = require("../models/request");

let req;

describe("Request Model - New Request", (done) => {
	before(() => {
		req = reqModel.newRequest("user", "task-request", "12345");
	});

	it("request should be a valid object", (done) => {
		expect(req).to.not.be.an("undefined");
		expect(req).to.be.an("object");
		return done();
	});

	it("request should contain require properties", (done) => {
		expect(req).to.have.property("error");
		expect(req).to.have.property("user");
		expect(req).to.have.property("type");
		expect(req).to.have.property("reqId");
		expect(req).to.have.property("requested");
		return done();
	});

	it("request should contain the proper starting values", (done) => {
		expect(req.error).to.equal(false);
		expect(req.user).to.equal("user");
		expect(req.type).to.equal("task-request");
		expect(req.reqId).to.equal("12345");
		expect(req.requested).to.be.a("Date");
		return done();
	});
});
