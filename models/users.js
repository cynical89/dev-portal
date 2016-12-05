"use strict";

module.exports = {
	newUser: (username, email, avatar) => {
		const user = {
			error: false,
			id: username,
			username: username,
			email: email,
			avatarUrl: avatar,
			role: "user",
			lead: false,
			admin: false
		};
		return user;
	},
	changeUsername: (user, username) => {
		user.username = username;
		return user;
	},
	changeEmail: (user, email) => {
		user.email = email;
		return user;
	},
	changeAvatar: (user, avatar) => {
		user.avatarUrl = avatar;
		return user;
	},
	changeRole: (user, role) => {
		user.role = role;
		return user;
	},
	changeAdmin: (user, admin) => {
		user.admin = admin;
		return user;
	},
	changeLead: (user, lead) => {
		user.lead = lead;
		return user;
	}
};
