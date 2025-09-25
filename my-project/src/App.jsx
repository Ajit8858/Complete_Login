import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import axios from 'axios';

function App() {
  const [formType, setFormType] = useState('register'); // or 'login'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [dashboardData, setDashboardData] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `http://localhost:3000/auth/${formType}`; // Update this to your backend URL

    try {
      const response = await axios.post(url, formData);
      const { token } = response.data;

      // Save token
      localStorage.setItem('token', token);

      setMessage(`${formType} successful!`);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Something went wrong');
    }
  };

  // Toggle between login/register
  const toggleForm = () => {
    setFormType(formType === 'register' ? 'login' : 'register');
    setMessage('');
    setFormData({ name: '', email: '', password: '' });
  };

  // Call protected dashboard route
  const getDashboard = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('No token found. Please login first.');
      return;
    }

    try {
      const response = await axios.get('http://localhost:3000/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDashboardData(response.data);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Error accessing dashboard');
    }
  };

  return (
    <div>
      <h2>{formType === 'register' ? 'Register' : 'Login'}</h2>

      <form onSubmit={handleSubmit}>
        {formType === 'register' && (
          <>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required /><br /><br />
          </>
        )}

        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required /><br /><br />

        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required /><br /><br />

        <button type="submit">{formType === 'register' ? 'Register' : 'Login'}</button>
      </form>

      <br />
      <button onClick={toggleForm}>
        {formType === 'register' ? 'Already have an account? Login' : 'New user? Register'}
      </button>

      <br /><br />
      <button onClick={getDashboard}>Access Dashboard</button>

      <p>{message}</p>

      {dashboardData && (
        <div>
          <h3>Dashboard Data:</h3>
          <pre>{JSON.stringify(dashboardData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
