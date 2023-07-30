import { Schema, model } from "mongoose";

import { handleSaveErrorMongoose, handleUpdateValidateMongoose } from "./hooks.js";
import { emailRegexp, subscriptionList } from "../constants/userConstants.js";

const userSchema = new Schema(
	{
		email: {
			type: String,
			match: emailRegexp,
			required: [true, "Email is required"],
			unique: true,
		},
		password: {
			type: String,
			minlength: 6,
			required: [true, "Password is required"],
		},
		subscription: {
			type: String,
			enum: subscriptionList,
			default: "starter",
		},
		token: {
			type: String,
			default: null,
		},
	},
	{ versionKey: false, timestamps: true },
);

userSchema.pre("findOneAndUpdate", handleUpdateValidateMongoose);

userSchema.post("save", handleSaveErrorMongoose);
userSchema.post("findOneAndUpdate", handleSaveErrorMongoose);

const User = model("user", userSchema);

export default User;
