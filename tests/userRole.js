"use strict";

const expect = require("chai").expect;
const roleModel = require("../models/userRole");

let role;

describe("User Role Model - New Role", (done) => {
	before(() => {
		role = roleModel.newRole("Developer");
	});

	it("role should be a valid object", (done) => {
		expect(role).to.not.be.an("undefined");
		expect(role).to.be.an("object");
		return done();
	});

	it("role should contain require properties", (done) => {
		expect(role).to.have.property("error");
		expect(role).to.have.property("name");
		return done();
	});

	it("role should contain the proper starting values", (done) => {
		expect(role.error).to.equal(false);
		expect(role.name).to.equal("Developer");
		return done();
	});

});
