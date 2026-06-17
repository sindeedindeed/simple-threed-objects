'use client';

import { useState } from 'react';
import AnimatedShapes from '@/components/AnimatedShapes';


export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleAuthSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setError('');
        setLoading('processing...')

        if (!username || !password) {
            setError('Please fill in all fields');
            setLoading('');
            return;
        }

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';

                try {
                    const response = await fetch(endpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ username, password }),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        // Read the specific error text returned by your catch block
                        setError(data.error ? `${data.message}: ${data.error}` : (data.message || 'Something went wrong'));
                        setLoading('');
                        return;
                    }

                    if (isLogin) {
                        setLoading('Success! Redirecting...');
                        setTimeout(() => {
                            setIsAuthenticated(true);
                            setLoading('');
                        }, 800);
                    } else {
                        setLoading('Account created! Switching to sign in.');
                        setUsername('');
                        setPassword('');
                        setIsLogin(true);
                    }
                } catch (err) {
                    setError(err instanceof Error ? err.message : 'Failed to connect to the authentication server');
                    setLoading('');
                }
        }

        const handleSignOut = () => {
            setIsAuthenticated(false);
            setUsername('');
            setPassword('');
        };

    return (
        <div className='flex h-screen w-screen overflow-hidden bg-white relative'>
            {/* left column */}
            <div 
                className={`flex h-full flex-col justify-between bg-white text-[#4A3319] z-20 border-r border-[#e8c195]/30 transition-all duration-700 ease-in-out
                ${isAuthenticated ? 'w-20 px-2 py-6 items-center' : 'w-full lg:w-[45%] px-6 md:px-12 lg:px-24 justify-center'}`}
            >
                {!isAuthenticated ? (
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
                        <form onSubmit={handleAuthSubmit} className='space-y-4'>
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
                            

                            {error && (
                                <p className='text-sm font-medium text-red-600 pt-1'>
                                    {error}
                                </p>
                            )}

                            {loading && !error && (
                                <p className='text-sm font-medium text-[#D9A066] pt-1'>
                                    {loading}
                                </p>
                            )}

                            <button
                                type='submit'
                                className='w-full rounded-xl bg-[#D9A066] hover:bg-[#c48e57] text-white py-3 px-4 font-medium text-sm transition-colors mt-4 shadow-sm'
                            >
                                Submit
                            </button>

                            {/* toggle view link */}
                            <div className='mt-8 text-center'>
                                <button
                                    type='button'
                                    onClick={() => {
                                        setIsLogin(!isLogin);
                                        setError('');
                                        setLoading('');
                                    }}
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

                        </form>
                    </div>
                ) : (
                    <div className='flex flex-col items-center space-y-2 mt-4 transition-all duration-300'>
                        <div className='h-10 w-10 rounded-full bg-[#D9A066] flex items-center justify-center text-white font-bold text-sm shadow-sm uppercase'>
                            {username.slice(0, 2)}
                        </div>
                        <span className='text-xs font-semibold tracking-tight text-[#7A6B58] max-w-[70px] truncate text-center'>
                            {username}
                        </span>
                    </div>
                )}

                {isAuthenticated && (
                    <button
                        onClick={handleSignOut}
                        className='w-12 h-12 rounded-xl bg-[#7A6B58]/10 hover:bg-red-50 text-[#7A6B58] hover:text-red-600 flex items-center justify-center transition-all group shadow-sm mb-2'
                        title='Sign Out'
                    >
                        <svg 
                            xmlns='http://www.w3.org/2000/svg' 
                            fill='none' 
                            viewBox='0 0 24 24' 
                            strokeWidth={2} 
                            stroke='currentColor' 
                            className='w-5 h-5 group-hover:scale-105 transition-transform'
                        >
                            <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75' />
                        </svg>
                    </button>
                )}
            </div>

            {/* right column */}
            <div 
                className={`bg-[#edd2a5] relative overflow-hidden h-full transition-all duration-700 ease-in-out z-10
                ${isAuthenticated ? 'w-[calc(100vw-80px)]' : 'hidden lg:block lg:w-[55%]'}`}
            >
                <div className='absolute inset-0 w-full h-full'>
                    <AnimatedShapes />
                </div>
            </div>

        </div>
    );
}