import { useState, useEffect } from 'react';

import { Card, CardContent, FormControlLabel, FormGroup,
	Grid, Slider, Stack, Switch, Tooltip, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

import axios from '../api'

function Setting({ username }) {
	const [level, setLevel] = useState(0);
	const [onlyNew, setOnlyNew] = useState(false);
	const [onlyOld, setOnlyOld] = useState(false);
	const [showFirst, setShowFirst] = useState(false);
	const [multipleHole, setMultipleHole] = useState(false);
	const [freqNew, setFreqNew] = useState(0);
	const [finishHardness, setFinishHardness] = useState(0);

	const getSetting = async () => {
		const {
			data: { level, only_new, only_old, show_first, multiple_hole, freq_new, finish_hardness },
		} = await axios.get('/setting/', { params: { username } });

		setLevel(level);
		setOnlyNew(only_new);
		setOnlyOld(only_old);
		setShowFirst(show_first);
		setMultipleHole(multiple_hole);
		setFreqNew(freq_new);
		setFinishHardness(finish_hardness);
	};

	const updateLevel = async() => {
		await axios.post('/setting/level', { username, level });
	};

	const updateOnlyNew = async() => {
		await axios.post('/setting/onlyNew', { username, onlyNew });
	};

	const updateOnlyOld = async() => {
		await axios.post('/setting/onlyOld', { username, onlyOld });
	};

	const updateShowFirst = async() => {
		await axios.post('/setting/showFirst', { username, showFirst });
	}

	const updateMultipleHole = async() => {
		await axios.post('/setting/multipleHole', { username, multipleHole });
	};

	const updateFreqNew = async() => {
		await axios.post('/setting/freqNew', { username, freqNew });
	};

	const updateFinishHardness = async() => {
		await axios.post('/setting/finishHardness', { username, finishHardness });
	};

	useEffect(() => {
		getSetting();
		// eslint-disable-next-line
	}, []);

	return (
		<Card 
			raised 
			sx={{ 
				color: 'primary.main', 
				border: 1, 
				overflow: 'auto',
				width: { xs: 1.0, sm: 400, md: 600 } 
			}}
		>
			<CardContent>
				<Typography 
					variant='h5' 
					align='center' 
					color='common.black'
				>??????</Typography>
			</CardContent>
			
			<CardContent>
				<Typography>??????(Level)</Typography>
				<Grid container justifyContent='center'>
					<Slider
						track={false}
						min={1} max={6} step={1}
						value={level}
						onChange={ (e, value) => {
							setLevel(value);
							updateLevel();
						}}
						sx={{ width: { xs: 0.75, sm: 300, md: 450 } }}	
						marks={[{value: 1, label: 'Level1'},
								{value: 2, label: 'Level2'},
								{value: 3, label: 'Level3'},
								{value: 4, label: 'Level4'},
								{value: 5, label: 'Level5'},
								{value: 6, label: 'Level6'}]}
					/>	
				</Grid>
			</CardContent>

			<Grid container spacing={1}>
				<Grid item container xs={6} justifyContent="center">
					<FormGroup>
						<FormControlLabel control={
							<Switch 
								checked={onlyNew}
								disabled={onlyOld}
								onChange={ (e) => {
									setOnlyNew(e.target.checked);
									updateOnlyNew();
								}}
							/>
						} label='???????????????' />
						<FormControlLabel control={
							<Switch 
								checked={onlyOld}
								disabled={onlyNew}
								onChange={ (e) => {
									setOnlyOld(e.target.checked);
									updateOnlyOld();
								}}
							/>
						} label='???????????????' />
						<FormControlLabel control={
							<Switch
								checked={showFirst}
								onChange={ (e) => {
									setShowFirst(e.target.checked)
									updateShowFirst();
								}}
							/>
						} label='??????????????????' />
						<FormControlLabel control={
							<Switch
								checked={multipleHole}
								onChange={ (e) => {
									setMultipleHole(e.target.checked)
									updateMultipleHole();
								}}
							/>
							
						} label='??????????????????' />
						
					</FormGroup>
				</Grid>

				<Grid item container xs={6} justifyContent='center' direction='column'>
					<Grid item>
						<Stack direction='row' spacing={1}>
							<Typography>???????????????</Typography>
							<Tooltip title="????????????????????????????????????????????????" placement="right">
								<InfoIcon color='secondary'></InfoIcon>
							</Tooltip>
						</Stack>
						
						<Slider
							min={-50} max={50}
							value={freqNew}
							onChange={ (e, value) => {
								setFreqNew(value);
								updateFreqNew();
							}}
							sx={{ width: { xs: 0.75, sm: 150, md: 225 } }}
						/>
					</Grid>

					<Grid item>
						<Stack direction='row' spacing={1}>
							<Typography>????????????</Typography>
							<Tooltip title='????????????????????????????????????????????????????????????' placement='right'>
								<InfoIcon color='secondary'></InfoIcon>
							</Tooltip>
						</Stack>
						<Slider
							min={-50} max={50}
							value={finishHardness}
							onChange={ (e, value) => {
								setFinishHardness(value);
								updateFinishHardness();
							}}
							sx={{ width: { xs: 0.75, sm: 150, md: 225 } }}
						/>
					</Grid>
				</Grid>
			</Grid>
			<CardContent />	
		</Card>
	);
};

export default Setting;