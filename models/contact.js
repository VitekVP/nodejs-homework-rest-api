import { Schema, model } from "mongoose";

import { handleSaveErrorMongoose, handleUpdateValidateMongoose } from "./hooks.js";

const contactSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, "Set name for contact"],
		},
		email: {
			type: String,
			required: [true, "Set email for contact"],
		},
		phone: {
			type: String,
			required: [true, "Set phone for contact"],
		},
		favorite: {
			type: Boolean,
			default: false,
		},
	},
	{ versionKey: false, timestamps: true },
);

contactSchema.pre("findOneAndUpdate", handleUpdateValidateMongoose);

contactSchema.post("save", handleSaveErrorMongoose);
contactSchema.post("findOneAndUpdate", handleSaveErrorMongoose);

const Contact = model("contact", contactSchema);

export default Contact;
