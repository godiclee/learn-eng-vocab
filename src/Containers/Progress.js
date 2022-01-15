import { useState, useEffect } from 'react';

import { Card, CardContent, Grid, 
	LinearProgress, Stack, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import axios from '../api'

function Progress({ username }) {
	const [totalNew, setTotalNew] = useState(0);
	const [totalSkilled, setTotalSkilled] = useState(0);
	const [totalCorrectPercent, setTotalCorrectPercent] = useState(100);
	const [rows, setRows] = useState([]);

	const [level, setLevel] = useState(Array(6).fill({
		's': 0,
		'nl': 1,
		'lbns': 0
	}));

	const getProgress = async () => {
		const {
			data: { all, daily, level },
		} = await axios.get('/progress/', { params: { username } });

		setTotalNew(all.new);
		setTotalSkilled(all.skilled); 
		setTotalCorrectPercent(Math.round(all.correct * 1000 / 
			(all.correct + all.incorrect)) / 10);
		setLevel(level);
		setRows(daily);
	};

	const columns = [
		{ field: 'date', headerName: '日期', width: 120 },
		{ field: 'total', headerName: '卡片數', width: 90 },
		{ field: 'old', headerName: '舊卡片', width: 90 },
		{ field: 'new', headerName: '新卡片', width: 90 },
		{ field: 'skilled', headerName: '新精通', width: 90 },
		{ field: 'correctRate', headerName: '正確率', width: 90 }, /* type: 'number', */
	];
	  
	useEffect(() => {
		getProgress();
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
				>進度</Typography>
				
			</CardContent>
			
			<Grid container spacing={1}>
				<Grid item container xs={6} justifyContent='center'>
					<Stack>
						<Typography display='inline' color='common.black'> 
							已精通的總卡片數:{' '}<strong>{totalNew}</strong>
						</Typography>
						<Typography display='inline' color='common.black'>
							已學過的總卡片數: {' '}<strong>{totalSkilled}</strong>
						</Typography>
						<Typography display='inline' color='common.black'>
							答對百分比: {' '}<strong>{totalCorrectPercent}%</strong>
						</Typography>
					</Stack>
				</Grid>
				<Grid item container xs={6}>
					<Typography><strong>精通/已學習/未學習</strong></Typography> 
					{level.map((e, i) => {
						return <Stack>
							<Typography>
								Level{i+1} ({e.s}/{e.s + e.lbns}/{e.s + e.lbns + e.nl})
							</Typography>
							<LinearProgress 
								variant='buffer' 
								value={e.s/(e.s + e.lbns + e.nl)}  
								valueBuffer={(e.s + e.lbns)/(e.s + e.lbns + e.nl)}
								sx={{ width: 200 }}	
							/>
						</Stack>
					})}
				</Grid>
			</Grid>
			<CardContent></CardContent>
			<DataGrid
					rows={rows}
					columns={columns}
					pageSize={5}
					rowsPerPageOptions={[5]}
			/>
		</Card>
	);
};

export default Progress;
