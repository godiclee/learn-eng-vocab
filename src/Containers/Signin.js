import { useState } from 'react';
import { Button, Divider, Stack, TextField, Typography } from '@mui/material';
import Register from '../Containers/Register'
import axios from '../api.js';

function Signin({ signIn }) {
	const [username, setUsername] = useState();
	const [password, setPassword] = useState('');
	const [registering, setRegistering] = useState(false);

	const clickLoginButton = async (e) => {
		e.preventDefault();
		
		const {
			data: { exist },
		} = await axios.get('/login/check-user-exist', {params: { username }}); 

		if (!exist) {
			alert(`用戶名稱 ${username} 不存在!`);
			return;
		}

		const {
			data: { success, user, last_login },
		} = await axios.post('/login/login', { username, password });

		if (!success) {
			alert('密碼不正確!');
		} else {
			signIn(user, last_login);
		}
	}

	const clickRegisterButton = (e) => {
		e.preventDefault();
		setRegistering(true);
	}

	const clickReturnButton = (e) => {
		if (e)
			e.preventDefault();
		setRegistering(false);
	}
	
	return (
		<>
			{registering ? 
				<Register clickReturnButton={clickReturnButton} /> 
				: 
				<>
					<Typography variant='h6' sx={{ mb : 1 }}>歡迎使用天堂英文單字訓練程式</Typography>

					<Stack direction='column' spacing={1}>
						<TextField label='用戶名稱' onChange={(e) => setUsername(e.target.value)}/>
						<TextField label='密碼' onChange={(e) => setPassword(e.target.value)}　/>
					</Stack>
					
					<Stack direction='row' spacing={2} divider={<Divider orientation='vertical' />}>
						<Button variant='contained' 
							onClick={clickLoginButton}　
							disabled={!username || !password}
						>登入</Button>
						<Button variant='contained' onClick={clickRegisterButton}>註冊</Button>
					</Stack>
				</> 
			}	
		</>
	)
}

export default Signin;