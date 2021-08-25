import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState('');
  const [searchName, setSearchName] = useState('');
  const [isModalShow, setIsModalShow] = useState(false);
  const [currentId, setCurrentId] = useState('');

  useEffect(() => {
    axios.get('http://localhost:7542/users').then((resp) => {
      setUsers(resp.data);
    });
  }, []);

  const createUser = () => {
    axios.post('http://localhost:7542/users', { name: userName.trim() }).then((resp) => {
      setUsers(resp.data);
    });
  };

  const deleteUser = (id) => {
    axios
      .delete('http://localhost:7542/users', {
        params: {
          id,
        },
      })
      .then((resp) => {
        setUsers((state) => state.filter((u) => id !== u._id));
      });
  };

  const fetchFindUser = (name) => {
    return axios.get(`http://localhost:7542/users`, {
      params: {
        name,
      },
    });
  };

  const findUser = async () => {
    const resp = await fetchFindUser(searchName);
    setUsers(resp.data);
  };

  const updateUserClickHAndler = (id) => {
    setIsModalShow(true);
    setCurrentId(id);
  };
  const fetchUpdateUser = (name, isBanned) => {
    console.log(currentId, name, isBanned);
    axios
      .put('http://localhost:7542/users', {
        id: currentId,
        name,
        isBanned,
      })
      .then((resp) => {
        const { _id, name, isBanned } = resp.data;
        setUsers(state => state.map(u => u._id === _id ? {...u, id: _id, name, isBanned} : u));
        setIsModalShow(false);
      });
  };

  return (
    <div className='App'>
      {isModalShow && <Modal userId={currentId} users={users} setIsModalShow={setIsModalShow} fetchUpdateUser={fetchUpdateUser} />}
      <div>
        <input value={userName} onChange={(e) => setUserName(e.currentTarget.value)} />
        <button onClick={createUser}>Create user</button>
      </div>

      <div>
        <input value={searchName} onChange={(e) => setSearchName(e.currentTarget.value)} />
        <button onClick={findUser}>Find user</button>
      </div>

      {users.length
        ? users.map((user, i) => (
            <div key={i} style={{ display: 'flex' }}>
              <div key={user.id} style={{color: user.isBanned ? 'red' : 'green'}}>
                {user.name} {user._id}
              </div>
              <button onClick={() => deleteUser(user._id)}>Delete</button>
              <button onClick={() => updateUserClickHAndler(user._id)}>Update</button>
            </div>
          ))
        : 'No users found'}
    </div>
  );
}

export default App;

export const Modal = ({ userId, users, setIsModalShow, fetchUpdateUser }) => {
  const {name, isBanned} = users.find(user => user._id === userId) || {};
  const [formData, setFormData] = useState({
    name: name || '',
    isBanned: isBanned || false,
  });

  const submitForm = () => {
    const { name, isBanned } = formData;
    fetchUpdateUser(name, isBanned);
  };

  const inputChanged = (e) => {
    const { value } = e.currentTarget;
    setFormData((state) => ({ ...state, name: value }));
  };

  const checkboxChanged = (e) => {
    const { checked } = e.currentTarget;
    setFormData((state) => ({ ...state, isBanned: checked }));
  };

  return (
    <div className={'form'}>
      <div onClick={() => setIsModalShow(false)}>X</div>
      <div className={'form-item'}>
        <span>Name:</span>
        <input type='text' value={formData.name} onChange={inputChanged} />
      </div>
      <div className={'form-item'}>
        <span>Set user to a ban</span>
        <input type='checkbox' checked={formData.isBanned} onChange={checkboxChanged} />
      </div>
      <button onClick={submitForm}>Submit</button>
    </div>
  );
};
