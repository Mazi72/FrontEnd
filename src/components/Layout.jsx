import { Link, Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <Link to="/" style={styles.titleLink}>
          <h1 style={styles.title}>GymPro</h1>
        </Link>

        <nav style={styles.nav}>
          <Link to="/allenamento" style={styles.link}>Allenamento</Link>
          <Link to="/progressioni" style={styles.link}>Progressioni</Link>
          <Link to="/metriche" style={styles.link}>Metriche</Link>
          <Link to="/profilo" style={styles.link}>Profilo</Link>
          <Link to="/dashboard" style={styles.link}>Dashboard</Link>
          <Link to="/market" style={styles.link}>Market</Link>
          <Link to="/note" style={styles.link}>Note</Link>
        </nav>
      </header>

      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

const styles = {// Define styles for the layout
  container: {
    backgroundColor: '#121212',
    minHeight: '100vh',
    color: '#f0f0f0',
  },
  header: {
    backgroundColor: '#00bfa6',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  titleLink: {
    textDecoration: 'none',
    color: '#121212',
  },
  title: {
    margin: 0,
    fontSize: '1.8rem',
  },
  nav: {
    marginTop: '0.5rem',
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  link: {
    color: '#121212',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  main: {
    padding: '2rem',
  },
};

export default Layout;
