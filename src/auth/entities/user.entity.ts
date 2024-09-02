import { ModelOptions, pre, prop } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

@ModelOptions({
	schemaOptions: {
		collection: 'pending-users',
		timestamps: true,
	},
})
@pre<PendingUser>('save', function (next) {
	if (!this.avatar) this.avatar = '/avatar.png';
	this.verify = this.verify || false;
	this.type = this.type || 'user';

	next();
})
export class PendingUser extends TimeStamps {
	@prop({ required: true, type: String, default: 'Username', trim: true, lowercase: true })
	userName: string;

	@prop({ required: true, type: String, trim: true, lowercase: true })
	email: string;

	@prop({ required: true, type: String })
	password: string;

	@prop({ required: false, type: String })
	avatar?: string;

	@prop({ required: false, type: Boolean })
	verify?: boolean;

	@prop({ required: false, type: String })
	type?: string;

	@prop({ required: false, type: String })
	verificationToken?: string;

	@prop({ required: false, type: Date })
	tokenExpiration?: Date;
}

@ModelOptions({
	schemaOptions: {
		collection: 'users',
		timestamps: true,
	},
})
export class User extends PendingUser {}
