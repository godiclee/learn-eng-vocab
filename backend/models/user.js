import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const Daily_Stats_Schema = new Schema({
	userId: Schema.Types.ObjectId,
	date: Date,
	old: Number,
	new: Number,
	add_old: Number,
	skilled: Number,
	correct: Number,
	incorrect: Number	
});

const Level_Stats_Schema = new Schema({
	userId: Schema.Types.ObjectId,
	level: Number,
	skilled: Number,
	not_learned: Number,
	learned_but_not_skilled: Number,
});
	
const User_Card_Schema = new Schema({
	userId: Schema.Types.ObjectId,
	cardId: Schema.Types.ObjectId,
	time: Number,
	score: Number,
});

const UserSchema = new Schema({
	username: String,
	password_hash: String,
	
	/* statistics */
	skilled: Number,
	not_learned: Number,
	learned_but_not_skilled: Number,
	last_login: Date,
	/*daily_stats: [Daily_Stats_Schema],*/
	
	/* settings */
	level: Number,
	only_new: Boolean,
	only_old: Boolean,
	show_first: Boolean,
	multiple_hole: Boolean,
	freq_of_new: Number,
	finish_hardness: Number,
	
	/* cards */
	skilled_cards: [Schema.Types.ObjectId],
	not_learned_cards: [Schema.Types.ObjectId],
	/*learned_but_not_skilled_cards: [Schema.Types.ObjectId],*/
	black_cards: [Schema.Types.ObjectId],
})

const User = mongoose.model('User', UserSchema);
const User_Card = mongoose.model('User_Card', User_Card_Schema);
const Daily_Stats = mongoose.model('Daily_Stats', Daily_Stats_Schema);
const Level_Stats = mongoose.model('Level_Stats', Level_Stats_Schema);

export { User, User_Card, Daily_Stats, Level_Stats };
