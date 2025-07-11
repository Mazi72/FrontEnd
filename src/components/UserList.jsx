import { useSelector } from 'react-redux';

// UserList component to display a list of users
function UserList() {
  const users = useSelector(state => state.user.usersList);

  if (!users || users.length === 0) {
    return <p>Nessun utente trovato.</p>;
  }

  return (
    <div>
      <h2>Lista Utenti</h2>
      <ul>
        {users.map(u => (
          <li key={u.id}>{u.name} - {u.role}</li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
// non utilizzato...