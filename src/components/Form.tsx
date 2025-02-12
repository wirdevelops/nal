// app/components/Form.tsx
'use client';

import { useState } from 'react';
import { postRequest } from '../lib/app';
import Cookies from 'js-cookie';

interface FormProps {
  type: 'register' | 'login' | 'forgotPassword' | 'resetPassword';
  onSuccess?: (data: any) => void; // Optional callback
  token?: string; // Required only for resetPassword
}

const Form: React.FC<FormProps> = ({ type, onSuccess, token }) => {
  const [formData, setFormData] = useState<any>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // VERY IMPORTANT: Prevent default form behavior
    setError(null);
    setLoading(true);
    setMessage(null);

    let endpoint = '';
    let requestData = { ...formData };

    try {
      switch (type) {
        case 'register':
          endpoint = '/api/v1/auth/register';  // Use Go backend directly
          break;
        case 'login':
          endpoint = '/api/v1/auth/login'; // Use Go backend directly
          break;
        case 'forgotPassword':
          endpoint = '/api/v1/auth/forgot-password'; // Use Go backend directly
          break;
        case 'resetPassword':
          if (!token) {
            throw new Error('Token is required for password reset.');
          }
          endpoint = '/api/v1/auth/reset-password'; // Use Go backend directly
          requestData = { ...formData, token };  // Add token to the request
          break;
        default:
          throw new Error('Invalid form type');
      }

      const data = await postRequest(endpoint, requestData);

      if (type === 'login') {
        // Remove cookie setting from here, handled by Go backend
        setMessage("Login Successfully")
      } else {
        setMessage(data.message || 'Success!'); // Show a success message
      }

      if (onSuccess) {
        onSuccess(data); // Call the success callback
      }

    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderFormFields = () => {
    switch (type) {
      case 'register':
        return (
          <>
            <div>
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input type="password" id="password" name="password" onChange={handleChange} required />
            </div>
          </>
        );
      case 'login':
        return (
          <>
            <div>
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input type="password" id="password" name="password" onChange={handleChange} required />
            </div>
          </>
        );
      case 'forgotPassword':
          return (
            <div>
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" onChange={handleChange} required />
            </div>
          );
      case 'resetPassword':
          return (
            <>
              <div>
                <label htmlFor="newPassword">New Password:</label>
                <input type="password" id="newPassword" name="newPassword" onChange={handleChange} required />
              </div>
            </>
          );
      default:
        return null; // Should not happen
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container" method="post">
      {renderFormFields()}
      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Loading...' : type === 'register' ? 'Register' : type === "forgotPassword" ? "Submit" : type === "resetPassword" ? "Reset Password" : 'Login'}
      </button>
    </form>
  );
};

export default Form;