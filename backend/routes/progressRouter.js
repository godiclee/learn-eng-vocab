import express from 'express'
import { User, Daily_Stats, Level_Stats } from '../models/user.js'

const router = express.Router()

router.get('/', async (req, res) => {
	const user = await User.findOne(
		{ 'username' : req.query.username }, { '_id' : 1 });
	
	const daily_stats = await Daily_Stats.find(
		{ 'userId' : user._id }).sort({ 'date' : -1 });
	
	/* really don't know why date --> 0:00 / 16:00 seperately (UTC issue?) */
	var all_dict = {
		'new' : 0,
		'skilled' : 0,
		'correct' : 0,
		'incorrect' : 0
	}
	
	var daily_dict = {};
	for (let i = 0; i < daily_stats.length; i++) {
		let daily_stat = daily_stats[i];
		let date = daily_stat.date.toDateString()
		if (date in daily_dict) {
			daily_dict[date].old += daily_stat.old;
			daily_dict[date].new += daily_stat.new;
			daily_dict[date].skilled += daily_stat.skilled;
			daily_dict[date].correct += daily_stat.correct;
			daily_dict[date].incorrect += daily_stat.incorrect;
		} else {
			daily_dict[date] = {
				'id' : i,
				'date' : date,
				'old' : daily_stat.old,
				'new' : daily_stat.new,
				'skilled' : daily_stat.skilled,
				'correct' : daily_stat.correct,
				'incorrect' : daily_stat.incorrect,
			}
		}
		all_dict.new += daily_stat.new;
		all_dict.skilled += daily_stat.skilled;
		all_dict.correct += daily_stat.correct;
		all_dict.incorrect += daily_stat.incorrect;
	}

	let new_daily_dict = [];
	for (let [key, value] of Object.entries(daily_dict)) {
		let temp = value;
		temp['total'] = value['new'] + value['old'];
		temp['correctRate'] = Math.round(value['correct'] / (value['correct'] 
			+ value['incorrect']) * 100) / 100;
		new_daily_dict.push(temp);
	} 

	var level_stats = []
	for (let level = 1; level <= 6; level++) {
		const level_stat = await Level_Stats.findOne( 
			{ 'userId' : user._id, 'level' : level });
		level_stats.push({
			's' : level_stat.skilled,
			'nl' : level_stat.not_learned,
			'lbns' : level_stat.learned_but_not_skilled
		});
	}
	
	res.json({ 
		all: all_dict,
		daily: new_daily_dict,
		level: level_stats
	});
});
  
export default router;


  