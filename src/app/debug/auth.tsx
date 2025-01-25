// app/debug/auth.tsx
'use client';
import { AuthService } from '@/lib/auth-service';
import { useUserStore } from '@/stores/useUserStore';

export default function AuthDebug() {
  const user = useUserStore(state => state.user);

  const testSignup = async () => {
    try {
      const user = await AuthService.signUp(
        { email: 'test@example.com', password: 'Test123!' },
        { first: 'Test', last: 'User' }
      );
      console.log('Signup Success:', user);
      AuthService.debugStorage();
    } catch (error) {
      console.error('Signup Error:', error);
    }
  };

  const testLogin = async () => {
    try {
      const user = await AuthService.login(
        { email: 'test@example.com', password: 'Test123!' }
      );
      console.log('Login Success:', user);
      AuthService.debugStorage();
    } catch (error) {
      console.error('Login Error:', error);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Auth Debug</h1>
      
      <div className="space-y-2">
        <button 
          onClick={testSignup}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Test Signup
        </button>
        
        <button 
          onClick={testLogin}
          className="px-4 py-2 bg-green-500 text-white rounded ml-4"
        >
          Test Login
        </button>
        
        <button 
          onClick={AuthService.clearDebugData}
          className="px-4 py-2 bg-red-500 text-white rounded ml-4"
        >
          Clear Data
        </button>
      </div>

      <div className="p-4 border rounded">
        <h2 className="font-bold mb-2">Current User State:</h2>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>
    </div>
  );
}