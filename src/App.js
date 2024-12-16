import { useState } from 'react';
import Swal from 'sweetalert2';

function LoginPage() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  // Handle input changes for the login form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    const { username, password } = credentials;

    try {
      const response = await fetch('http://localhost:8081/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.mixin({
          toast: true,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          target: document.getElementById('app'),
          position: 'top',
        }).fire({
          icon: 'success',
          title: data.message,
        });
      } else {
        Swal.mixin({
          toast: true,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          target: document.getElementById('app'),
          position: 'top',
        }).fire({
          icon: 'error',
          title: data.error,
        });
      }
    } catch (error) {
      Swal.fire('Error', 'An error occurred. Please try again.', 'error');
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-600 min-h-screen flex items-center justify-center text-white">
      <div className="w-full max-w-sm bg-gray-800 p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-semibold mb-4 text-center text-cyan-400">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-xs font-medium text-gray-300 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Username"
              value={credentials.username}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-2 rounded text-xs transition-colors focus:outline-none focus:ring-1 focus:ring-cyan-300"
          >
            Login
          </button>
        </form>
        <p className="text-xs text-center text-gray-400 mt-4">
          Don't have an account? <a href="/" className="text-cyan-400 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
