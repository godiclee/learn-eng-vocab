import { useState, useContext } from 'react';
import { BottomNavigation, BottomNavigationAction, Button, 
	Stack, Typography } from '@mui/material';
import PlayCircleIcons from '@mui/icons-material/PlayCircle';
import SettingsIcon  from '@mui/icons-material/Settings';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import VocabCard from './VocabCard.js';
import Progress from './Progress.js';
import Setting from './Setting.js';
import Wrapper from '../Components/Wrapper';
import { UserContext } from '../App';

function Main({ signOut }) {
	const [page, setPage] = useState('練習');
	const user = useContext(UserContext);

	return (
		<Wrapper>
			<Stack direction='row' spacing={1}>
				<Typography sx={{fontSize: 12}}>
					歡迎回來 {user.username}，上次登入 {' '}
					{new Date(user.last_login).toDateString()}{' '}
					{new Date(user.last_login).toLocaleTimeString()}	
				</Typography>
				<Button variant='contained' size='small' onClick={signOut}>登出</Button>
			</Stack>
			
			{ page === '練習' ? 
				<VocabCard username={user.username} /> :
				page === '進度' ?
				<Progress username={user.username} /> : 
				<Setting username={user.username} />
			}
			<BottomNavigation showLabels sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
				<BottomNavigationAction 
					label='練習' 
					icon={<PlayCircleIcons />}
					onClick={() => setPage('練習')} />
				<BottomNavigationAction 
					label='進度'
					icon={<QueryStatsIcon />}
					onClick={() => setPage('進度')} />
				<BottomNavigationAction 
					label='設定' 
					icon={<SettingsIcon />}
					onClick={() => setPage('設定')} />
			</BottomNavigation>
		</Wrapper>
	)
};

export default Main;