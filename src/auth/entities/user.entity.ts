import { ModelOptions, prop } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

@ModelOptions({
	schemaOptions: {
		collection: 'users',
		timestamps: true,
	},
})
export class User extends TimeStamps {
	@prop({ required: true, type: String, default: 'Username', trim: true, lowercase: true })
	userName: string;

	@prop({ required: true, type: String, trim: true, lowercase: true })
	email: string;

	@prop({ required: true, type: String })
	password: string;

	@prop({ required: true, type: String })
	cPassword: string;

	@prop({ required: false, type: String })
	avatar?: string;

	@prop({ required: false, type: Boolean })
	verify?: boolean;

	@prop({ required: false, type: String })
	type?: string;
}
