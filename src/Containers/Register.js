import { useState } from 'react';
import { Button, Divider, FormControl, InputLabel, 
	MenuItem, Select, Stack, TextField } from '@mui/material';
import axios from '../api.js';

function Register( { clickReturnButton }) {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [level, setLevel] = useState('');

	const clickSubmitButton = async () => {
		const {
			data: { exist },
		} = await axios.get('/login/check-user-exist', {params: { username }}); 

		if (exist) {
			alert(`用戶名稱 ${username} 已經存在！`);
		} else {
			const {
				data: { success },
			} = await axios.post('/login/create-user', { username, password, level });
			
			if (!success) { 
				alert('不明原因新增帳號失敗，請重試或聯絡管理員!');
			} else {
				alert('新增帳號成功，請重新登入!');
				clickReturnButton();
			}	
		}
	};
	
	return (
		<>
			註冊新帳號
			<Stack direction='column' spacing={1}>
				<TextField label='用戶名稱' onChange={(e) => setUsername(e.target.value)}/>
				<TextField label='密碼 (至少6個字元)' onChange={(e) => setPassword(e.target.value)}/>
					<FormControl fullWidth>
					<InputLabel id='select-label'>初始難度 (註冊後可更改)</InputLabel>
					<Select
						labelId='select-label'
						label='選擇難度 (註冊後可更改)'
						value={level}
						onChange={(e) => setLevel(e.target.value)}
					>
						<MenuItem value=''>None</MenuItem>
						<MenuItem value={1}>Level 1 (國小程度)</MenuItem>
						<MenuItem value={2}>Level 2 (國小程度)</MenuItem>
						<MenuItem value={3}>Level 3 (國中程度)</MenuItem>
						<MenuItem value={4}>Level 4 (國中程度)</MenuItem>
						<MenuItem value={5}>Level 5 (高中程度)</MenuItem>
						<MenuItem value={6}>Level 6 (高中程度)</MenuItem>
						<MenuItem value={7}>Level 7 (地獄程度)</MenuItem>
					</Select>
				</FormControl>
			</Stack>
			
			<Stack direction='row' spacing={2} divider={<Divider orientation='vertical' />}>
				<Button variant='contained' onClick={clickReturnButton}>返回</Button>
				<Button variant='contained' 
					onClick={clickSubmitButton}
					disabled={!username || password.length < 6 || !level}
				>送出</Button>
			</Stack>
		</>
	)
};

export default Register;