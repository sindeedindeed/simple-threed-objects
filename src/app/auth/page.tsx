'use client';

import { useState } from 'react';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className='flex min-h-screen bg-white'>
            {/* left column */}
            <div className='flex w-full  flex-col justify-center bg-white lg:w-[45%] lg:px-24 text-[#4A3319]'>
                <div className='mx-auto w-full max-w-md'>
                    <div className='relative h-10 w-full mb-6'>
                        <h2 
                            className={`absolute inset-0 text-3xl font-semibold tracking-tight transition-all duration-300 ease-in-out
                                ${isLogin ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
                        >
                            Sign In
                        </h2>
                        <h2 
                            className={`absolute inset-0 text-3xl font-semibold tracking-tight transition-all duration-300 ease-in-out
                                ${!isLogin ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}
                        >
                            Create Account
                        </h2>
                    </div>

                    <div>
                        <label htmlFor='username' className='block text-sm font-medium text-[#7A6B58] uppercase tracking-wider mb-1.5 my-1'>
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

                    <div>
                        <label htmlFor='password' className='block text-sm font-medium text-[#7A6B58] uppercase tracking-wider mb-1.5 my-1'>
                            Password
                        </label>
                        <input
                            id='password'
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='w-full rounded-xl border border-[#e8c195] bg-white py-3 px-4 placeholder-[#BAB3A9] focus:border-[#D9A066] focus:outline-none focus:ring-1 focus:ring-[#D9A066] text-sm transition-all'
                            placeholder='*********'
                        />
                    </div>
                    
                    {/* toggle view link */}
                    <div className='mt-8 text-center'>
                        <button
                            type='button'
                            onClick={() => setIsLogin(!isLogin)}
                            className='relative w-full h-5 text-sm font-medium text-[#7A6B58] hover:text-[#D9A066] transition-colors group'
                        >
                            <span 
                                className={`absolute inset-0 flex justify-center items-center transition-all duration-300 ease-in-out
                                    ${isLogin ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2 pointer-events-none'}`}
                            >
                                Dont have an account? Sign up
                            </span>

                            <span 
                                className={`absolute inset-0 flex justify-center items-center transition-all duration-300 ease-in-out
                                    ${!isLogin ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2 pointer-events-none'}`}
                            >
                                Already have an account? Log in
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* right column */}
            <div className='w-[55%] lg:block bg-[#edd2a5] flex items-center justify-center text-[#7A6B58]'>
                <p> place holder </p>
            </div>

        </div>
    );
}