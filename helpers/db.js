const co = require("co");
const Promise = require("bluebird");
const cradle	= Promise.promisifyAll(require("cradle"));
const config = require("../config.json");

// A custom Error just for database problems.
function CouchDBError(message) {
	this.name = "CouchDBError";
	this.message = (message || "");
}
CouchDBError.prototype = Error.prototype;

// Connects to a database and returns the DB object.
const connectToDatabase = (dbName) => {
	try {
		return new(cradle.Connection)({auth: {username: config.db.username, password: config.db.password}}).database(dbName);
		// for local system return new(cradle.Connection)().database(dbname);
	} catch (err) {
		throw new CouchDBError(`DB: Get: Connection to database [${dbName}] failed`);
	}
};

// Grabs a document from the database in CouchDB.
exports.getDocument = function* getDocument(id, database) {
	try {
		const db = connectToDatabase(database);
		const doc = yield db.getAsync(id);
		doc.error = false;
		return doc;
	} catch (err) {
		return {
			error: true,
			message: `DB: Get of [${id}] failed`
		};
	}
};

// Saves a document in the database in CouchDB.
exports.saveDocument = function* saveDocument(document, database) {
	try {
		const db = connectToDatabase(database);
		const returnVal = yield db.saveAsync(document.id, document);
		document.id = returnVal.id;
		document.error = false;
		return document;
	} catch (err) {
		return {
			error: true,
			message: `DB: Save of [${document.id}] failed`
		};
	}
};

// Removes a document in the database in CouchDB.
exports.removeDocument = function* removeDocument(id, database) {
	try {
		const db = connectToDatabase(database);
		const returnVal = yield db.removeAsync(id);
		returnVal.error = false;
		return returnVal;
	} catch (err) {
		return {
			error: true,
			message: `DB: Delete of [${id}] failed`
		};
	}
};

// TODO: Put these into a runView function - DRY

exports.getAllTasks = function* getAllTasks() {
	try {
		const db = connectToDatabase("tasks");
		const doc = yield db.viewAsync("gettasks/all");
		doc.error = false;
		return doc;
	} catch (err) {
		return {
			error: true,
			message: "DB: Get of all task docs failed"
		};
	}
};

exports.getAllReqs = function* getAllReqs() {
	try {
		const db = connectToDatabase("reqs");
		const doc = yield db.viewAsync("getreqs/all");
		doc.error = false;
		return doc;
	} catch (err) {
		return {
			error: true,
			message: "DB: Get of all request docs failed"
		};
	}
};

exports.getAllRoles = function* getAllRoles() {
	try {
		const db = connectToDatabase("roles");
		const doc = yield db.viewAsync("getroles/all");
		doc.error = false;
		return doc;
	} catch (err) {
		return {
			error: true,
			message: "DB: Get of all project docs failed"
		};
	}
};

exports.getAllProjects = function* getAllProjects() {
	try {
		const db = connectToDatabase("projects");
		const doc = yield db.viewAsync("getprojects/all");
		doc.error = false;
		return doc;
	} catch (err) {
		return {
			error: true,
			message: "DB: Get of all project docs failed"
		};
	}
};
