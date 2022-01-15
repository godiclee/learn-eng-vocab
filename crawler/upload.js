import data from './level6.json'
import { strict as assert } from 'assert'


import mongoose from 'mongoose';
mongoose.connect("INSERT YOUR OWN MONGODB URL HERE", {useNewUrlParser: true, useUnifiedTopology: true,}).then((res) => console.log("mongo db connection created"));
console.log(data.length)
import card from '../backend/models/card.js';

try {
	card.insertMany(data)
} catch (e) {
	console.log(e)
}

console.log('done');

