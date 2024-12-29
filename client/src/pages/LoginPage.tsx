import React, { useContext, useState } from 'react'
import { NavLink } from 'react-router';
import { AuthContext } from './AuthPage';

function LoginPage() {
  const auth = useContext(AuthContext);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    auth.login({ phoneNumber, password });
  }

  return (
    <main className='bg-gray-100 h-screen flex'>
      <form onSubmit={submit} className='bg-white flex flex-col w-1/2 max-w-sm p-5 gap-5 h-fit m-auto'>
        <h1 className='font-bold text-2xl text-center'>Log In</h1>
        <input className='px-5 border-2 border-gray-300' type="tel" required pattern="[0-9]{10}" onChange={e => setPhoneNumber(e.target.value)} placeholder='Enter your phone number (10 digits)'/>
        <input className='px-5 border-2 border-gray-300' type="password" onChange={e => setPassword(e.target.value)} placeholder='Type password here...'/>
        <p>Have no account? <NavLink to='/signup' className='text-blue-600 hover:underline hover:cursor-pointer'>Register</NavLink></p> 
        <button type='submit' className='bg-blue-600 text-white py-3 rounded-md'>Submit</button>
      </form>
    </main>
  )
}

export default LoginPage