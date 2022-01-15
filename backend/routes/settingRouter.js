import express from 'express'
import { User } from '../models/user.js'

const router = express.Router()

router.get('/', async (req, res) => {
	const user = await User.findOne({ 'username' : req.query.username },
		{
			'level' : 1,
			'only_new' : 1,
			'only_old' : 1,
			'show_first' : 1,
			'multiple_hole' : 1,
			'freq_of_new' : 1,
			'finish_hardness' : 1
		}
	);
	res.json({ 
		level: user.level, 
		only_new: user.only_new,
		only_old: user.only_old,
		show_first: user.show_first,
		multiple_hole: user.multiple_hole,
		freq_new: user.freq_of_new,
		finish_hardness: user.finish_hardness
	});
});
  
router.post('/level', async (req, res) => {
	await User.updateOne(
		{ 'username' : req.body.username }, 
		{ 'level' : req.body.level }
	);
	res.json({ msg: 'done' });
});

router.post('/onlyNew', async (req, res) => {
	await User.updateOne(
		{ 'username' : req.body.username }, 
		{ 'only_new' : !req.body.onlyNew }
	);
	res.json({ msg: 'done' });
});

router.post('/onlyOld', async (req, res) => {
	await User.updateOne(
		{ 'username' : req.body.username }, 
		{ 'only_old' : !req.body.onlyOld }
	);
	res.json({ msg: 'done' });
});

router.post('/showFirst', async (req, res) => {
	await User.updateOne(
		{ 'username' : req.body.username },
		{ 'show_first' : !req.body.showFirst }
	);
	res.json({ msg: 'done' });
})

router.post('/multipleHole', async (req, res) => {
	await User.updateOne(
		{ 'username' : req.body.username }, 
		{ 'multiple_hole' : !req.body.multipleHole }
	);
	res.json({ msg: 'done' });
});

router.post('/freqNew', async (req, res) => {
	await User.updateOne(
		{ 'username' : req.body.username }, 
		{ 'freq_of_new' : req.body.freqNew }
	);
	res.json({ msg: 'done' });
});

router.post('/finishHardness', async (req, res) => {
	await User.updateOne(
		{ 'username' : req.body.username }, 
		{ 'finish_hardness' : req.body.finishHardness }
	);
	res.json({ msg: 'done' });
});

export default router;


  