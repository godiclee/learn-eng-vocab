import express from 'express'
import Card from '../models/card.js'
import { User, User_Card, Daily_Stats, Level_Stats } from '../models/user.js'

const router = express.Router()

router.get('/get-card', async (req, res) => {
	const user = await User.findOne({ 'username' : req.query.username },
		{
			'_id' : 1,
			'learned_but_not_skilled' : 1,
			'level' : 1,
			'not_learned_cards' : 1,
			'only_old' : 1,
			'only_new' : 1,
			'show_first' : 1,
			'multiple_hole' : 1,
			'freq_of_new' : 1
		}
	);

	let date = new Date();
	date.setHours(0, 0, 0, 0);
	let daily_stats = await Daily_Stats.findOne(
		{ 
			'userId' : user._id, 
			'date' : date 
		}
	);
	if (!daily_stats) {
		daily_stats = new Daily_Stats({
			userId: user._id,
			date: date,
			old: 0,
			new: 0,
			add_old: 0,
			skilled: 0,
			correct: 0,
			incorrect: 0
		});
	}

	const numerator_least = 25 + user.freq_of_new * 0.5
	const numerator_most = 100 + user.freq_of_new

	const new_prob = Math.max(numerator_least, 
						numerator_most - daily_stats.add_old) / 
					(100 + user.learned_but_not_skilled);
	console.log(new_prob);
	if (user.only_new
		|| user.learned_but_not_skilled === 0 
		|| (!user.only_old && Math.random() < new_prob)) {
		console.log('new card');
		let newCard = await Card.aggregate([
			{ $match: { level: { $eq: user.level },
						_id: { $in: user.not_learned_cards } } },
			{ $sample: { size: 1 } },
		])
		
		if (newCard.length > 0) {
			newCard = newCard[0];
			res.json({
				card: newCard,  
				holes: user.multiple_hole ? newCard.holes : [newCard.hole],
				score: 0,
				newcard: true,
				show_first: user.show_first
			});
			return;
		}
		console.log('no new card :(');
	}

	console.log('old card');
	
	const oldUserCard = await User_Card.aggregate([
		{ $match: { 'userId': user._id } },
		{ $sample: { size: 1 } },
	])
	if (!oldUserCard.length) {
		const noMoreCard = new Card({
			engsen: '沒有舊的生字卡了! 有兩個可能你會到達這裏!!!!!!!!!!!!! \
				1: 你已經記熟對應等級的所有卡片，請更改等級!!!!!! \
				2: 你在設置設定只學舊單字了，請更改等級!!!!!!!!!!!!!! \
				嗯還有一個可能是你已經完成所有卡片，但我其實不太相信有人可以完成...'
		});
		res.json({ card: noMoreCard, holes: [] });
		return;
	}
	const oldCard = await Card.find({ '_id': oldUserCard[0].cardId });
	
	res.json({ 
		card: oldCard[0],
		holes: user.multiple_hole ? oldCard[0].holes : [oldCard[0].hole],
		score: oldUserCard[0].score,
		newcard: false,
		show_first: user.show_first
	});
});
  
router.post('/correct', async (req, res) => {
	const card = req.body.card;
	let user = await User.findOne({ 'username' : req.body.username },
		{
			'_id' : 1,
			'skilled' : 1,
			'not_learned' : 1,
			'learned_but_not_skilled' : 1,
			'finish_hardness' : 1,
		}
	);
	
	let date = new Date();
	date.setHours(0, 0, 0, 0);
	let daily_stats = await Daily_Stats.findOne(
		{ 
			'userId' : user._id, 
			'date' : date 
		}
	);
	if (!daily_stats) {
		daily_stats = new Daily_Stats({
			userId: user._id,
			date: date,
			old: 0,
			new: 0,
			add_old: 0,
			skilled: 0,
			correct: 0,
			incorrect: 0
		});
	}
		
	if (req.body.newCard) {
		await User.updateOne({'username' : req.body.username},
			{
				'skilled' : user.skilled + 1,
				'not_learned' : user.not_learned - 1,
				$push: { 'skilled_cards' : card._id },
				$pull: { 'not_learned_cards' : card._id }
			}
		);

		daily_stats.new += 1;
		daily_stats.skilled += 1;
		daily_stats.correct += 1;
		await daily_stats.save(); 

		let level_stats = await Level_Stats.findOne( 
			{ 
				'userId' : user._id, 
				'level' : card.level 
			}
		);
		level_stats.skilled += 1;
		level_stats.not_learned -= 1;
		await level_stats.save();

		res.json({ score: 1000 });
	} else {
		let userCard = await User_Card.findOne({
			'userId' : user._id,
			'cardId' : card._id
		});

		const base_add_score = 150 - user.finish_hardness;
		const bonus_add_score = 200 - user.finish_hardness * 4;
		userCard.score += base_add_score + bonus_add_score * Math.exp(-0.3 * (userCard.time - 1));
		userCard.time += 1;

		daily_stats.old += 1;
		daily_stats.correct += 1;

		if (userCard.score >= 1000) {
			await user.updateOne({'username' : req.body.username},
				{
					'skilled' : user.skilled + 1,
					'learned_but_not_skilled' : user.learned_but_not_skilled - 1,
					$push: { 'skilled_cards' : card._id },
				}
			);
			await User_Card.deleteOne({'_id' : userCard._id});

			daily_stats.skilled += 1;

			let level_stats = await Level_Stats.findOne( 
				{ 
					'userId' : user._id, 
					'level' : card.level 
				}
			);
			level_stats.skilled += 1;
			level_stats.learned_but_not_skilled -= 1;
			await level_stats.save();

		} else {
			await daily_stats.save(); 
			await userCard.save();
		}
		res.json({ score: userCard.score });
	}
});

router.post('/incorrect', async (req, res) => {
	let card = req.body.card;
	const user = await User.findOne({ 'username' : req.body.username },
		{
			'_id' : 1,
			'not_learned' : 1,
			'learned_but_not_skilled' : 1,
			'finish_hardness' : 1
		}
	);

	let date = new Date();
	date.setHours(0, 0, 0, 0);
	let daily_stats = await Daily_Stats.findOne(
		{ 
			'userId' : user._id, 
			'date' : date 
		}
	);
	if (!daily_stats) {
		daily_stats = new Daily_Stats({
			userId: user._id,
			date: date,
			old: 0,
			new: 0,
			add_old: 0,
			skilled: 0,
			correct: 0,
			incorrect: 0
		});
	}

	if (req.body.newCard) {
		const newUserCard = new User_Card({
			userId: user._id,
			cardId: card._id,
			time: 1,
			score: 250
		});
		await newUserCard.save();

		await User.updateOne({'username' : req.body.username},
			{
				'not_learned' : user.not_learned - 1,
				'learned_but_not_skilled' : user.learned_but_not_skilled + 1,
				'$pull' : { 'not_learned_cards' : card._id }
			}
		)

		daily_stats.new += 1;
		daily_stats.add_old += 1;
		daily_stats.incorrect += 1;
		await daily_stats.save(); 

		let level_stats = await Level_Stats.findOne( 
			{ 
				'userId' : user._id, 
				'level' : card.level 
			}
		);
		level_stats.not_learned -= 1;
		level_stats.learned_but_not_skilled += 1;
		await level_stats.save();

		res.json({ score: 250 });
	} else {
		let userCard = await User_Card.findOne({
			'userId' : user._id,
			'cardId' : card._id
		});

		const single_reduction_score = 250 + user.finish_hardness * 4 
		userCard.score = Math.max(0, userCard.score - single_reduction_score);
		userCard.time += 1;
		await userCard.save();

		daily_stats.old += 1;
		daily_stats.incorrect += 1;
		await daily_stats.save();

		res.json({ score: userCard.score });
	}
});

router.post('/delete-card', async (req, res) => {
	const card = req.body.card;
	
	const user = await User.findOne({ 'username' : req.body.username },
		{
			'_id' : 1,
			'not_learned' : 1,
			'learned_but_not_skilled' : 1,
		}
	);

	if (req.body.newCard) {
		await User.updateOne({ 'username' : req.body.username },
			{
				'not_learned' : user.not_learned - 1,
				$pull : { 'not_learned_cards' : card._id }
			}
		)
		await Level_Stats.updateOne( 
			{ 
				'userId' : user._id, 
				'level' : card.level 
			},
			{ $inc: { 'not_learned' : -1 } }
		);
		
	} else {
		let userCard = await User_Card.findOne({
			'userId' : user._id,
			'cardId' : card._id
		});
		await User.updateOne({ 'username' : req.body.username },
			{ 
				'learned_but_not_skilled' : user.learned_but_not_skilled - 1 
			}
		);
		await User_Card.deleteOne({'_id' : userCard._id});
	}
	res.json({ msg: 'success' });
});

export default router;
  