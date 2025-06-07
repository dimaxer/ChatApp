import React from 'react';
import { AuthContext } from './AuthProvider';
import LoginPage from './LoginPage'; // Assuming you have a LoginPage component
import './App.css'; // Make sure to import your CSS file if you have one

function App() {
  const auth = React.useContext(AuthContext);

  return (
    <div className="App">
      <header className="App-header">
        {auth?.user ? (
          <>
            <p>Welcome, {auth.user}!</p>
            <button onClick={auth.logout}>Log Out</button>
          </>
        ) : (
          <LoginPage />
        )}
      </header>
    </div>
  );
}

export default App;