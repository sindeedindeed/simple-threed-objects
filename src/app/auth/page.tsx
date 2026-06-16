'use client';

import { useState } from 'react';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');

    return (
        <div className='flex min-h-screen bg-white'>
            {/* left column */}
            <div className='flex w-full  flex-col justify-center bg-white lg:w-[45%] lg:px-24 text-[#4A3319]'>
                <div className='mx-auto w-full max-w-md'>
                    <h2 className='text-3xl font-semibold tracking-tight'>
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </h2>

                    <div>
                        <label htmlFor='username' className='block text-sm font-medium text-[#7A6B58] uppercase tracking-wider mb-1.5'>
                            Username
                        </label>
                        <input 
                            id='username'
                            type='text'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className='w-full rounded-xl border border-[#e8c195] bg-white py-3 px-4 placeholder-[#BAB3A9] focus:border-[#D9A066] focus:outline-none focus:ring-1 focus:ring-[#D9A066] text-sm transition-all'
                            placeholder='Please enter your username'
                        />
                    </div>

                    <button
                        type='button'
                        onClick={() => setIsLogin(!isLogin)}
                        className='mt-6 text-sm font-medium text-[#D9A066] hover:underline'
                    >
                        {isLogin ? 'Switch to Sign Up' : 'Switch to Sign In'}
                    </button>
                </div>
            </div>

            {/* right column */}
            <div className='w-[55%] lg:block bg-[#edd2a5] flex items-center justify-center text-[#7A6B58]'>
                <p> place holder </p>
            </div>

        </div>
    );
}