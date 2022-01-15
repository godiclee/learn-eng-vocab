import { useState, createContext } from 'react';
import Wrapper from './Components/Wrapper';
import Main from './Containers/Main';
import Signin from './Containers/Signin';

const UserContext = createContext();

function App() {
  const saved_user = JSON.parse(localStorage.getItem('user'));
  const [user, setUser] = useState(saved_user || { user: '', username: '', auth: false, last_login: '' });

  const signIn = (user, last_login) => {
    setUser({ user: user, username: user.username, auth: true, last_login: last_login });
    localStorage.setItem('user', JSON.stringify({ user: user, username: user.username, auth: true, last_login: last_login }));
  }

  const signOut = () => {
    setUser({ user: '', username: '', auth: false, last_login: '' });
    localStorage.setItem('user', JSON.stringify({ user: '', username: '', auth: false, last_login: '' }));
  }

  return (
    <Wrapper>
      <UserContext.Provider value={user}>
        {user.auth ? <Main signOut={signOut} /> : <Signin signIn={signIn} />}
      </UserContext.Provider>
    </Wrapper>
  )
}

export { App, UserContext };