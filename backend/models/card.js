import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const CardSchema = new Schema({
	word: String,
	chi: String,
	eng: String,
	pos: String,
	chisen: String,
	engsen: String,
	level: Number,
	hole: Number,
	holes: [Number],
	reported: Boolean,
})

const Card = mongoose.model('Card', CardSchema);

export default Card;