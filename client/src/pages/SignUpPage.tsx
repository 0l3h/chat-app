import React, { useState } from 'react'
import { NavLink } from 'react-router';

function SignupPage() {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  //const [confirmPassword, setConfirmPassword] = useState<string>('');

  const signup = () => {
    fetch("http://localhost:5000/auth/signup", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phoneNumber,
        password,
        username,
      }),
    })
  }

  return (
    <main className='bg-gray-100 h-screen flex'>
        <form onSubmit={signup} className='bg-white flex flex-col w-1/2 max-w-sm p-5 gap-5 h-fit m-auto'>
          <h1 className='font-bold text-2xl text-center'>Sign up</h1>
          <input className='px-5 border-2 border-gray-300' type="text" placeholder='Enter username' onChange={e => setUsername(e.target.value)}/>
          <input className='px-5 border-2 border-gray-300' required pattern="[0-9]{10}" type="tel" placeholder='Your phone number...' onChange={e => setPhoneNumber(e.target.value)} name="phoneNumber"/>
          <input className='px-5 border-2 border-gray-300' type="password" placeholder='Type password here...' onChange={e => setPassword(e.target.value)}/>
          <input className='px-5 border-2 border-gray-300' type="password" placeholder='Confirm your password'/>
          <p>Already have an account? <NavLink to='/login' className='text-blue-600 hover:underline hover:cursor-pointer'>Log in</NavLink></p>
          <button type='submit' className='bg-blue-600 text-white py-3 rounded-md'>Submit</button>
        </form>
    </main>
  )
}

export default SignupPage