import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Loader2 } from 'lucide-react';
import { loginUser } from '../../store/authSlice';
import api from '../../api/axiosConfig';

export function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: ''
  });
  const [errorMsg, setErrorMsg] = useState('');
  
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (isLogin) {
      const resultAction = await dispatch(loginUser({
        username: formData.username,
        password: formData.password
      }));
      if (loginUser.fulfilled.match(resultAction)) {
        onClose();
      }
    } else {
      // Register
      try {
        const response = await api.post('register/', formData);
        if (response.status === 201) {
          // Log them in immediately after register
          const loginResult = await dispatch(loginUser({
            username: formData.username,
            password: formData.password
          }));
          if (loginUser.fulfilled.match(loginResult)) {
            onClose();
          }
        }
      } catch (err) {
        setErrorMsg(err.response?.data?.username?.[0] || 'Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md p-8 relative shadow-2xl animate-fade-in-down">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {isLogin ? 'Welcome Back' : 'Create an Account'}
        </h2>

        {(errorMsg || error) && (
          <div className="mb-4 p-3 rounded bg-red-50 text-red-600 text-sm border border-red-200">
            {errorMsg || (typeof error === 'string' ? error : 'Authentication failed')}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1055A8] focus:ring-1 focus:ring-[#1055A8] outline-none transition-all"
            required
          />
          
          {!isLogin && (
            <>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1055A8] focus:ring-1 focus:ring-[#1055A8] outline-none transition-all"
                required
              />
              <div className="flex gap-4">
                <input
                  type="text"
                  name="first_name"
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1055A8] focus:ring-1 focus:ring-[#1055A8] outline-none transition-all"
                />
                <input
                  type="text"
                  name="last_name"
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1055A8] focus:ring-1 focus:ring-[#1055A8] outline-none transition-all"
                />
              </div>
            </>
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1055A8] focus:ring-1 focus:ring-[#1055A8] outline-none transition-all"
            required
          />

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-[#1055A8] to-[#0076BC] text-white font-bold hover:shadow-lg transition-all flex justify-center items-center h-[50px]"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (isLogin ? 'Sign In' : 'Register')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#1055A8] font-bold hover:underline"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
