'use client';

import { useState } from 'react';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');

    return (
        <div className='flex min-h-screen items-center justify-center bg-zinc-900 text-white'>
            <div className='rounded-xl bg-zinc-800 p-8 border border-zinc-700 text-center'>
                <h2 className='text-2xl font-bold'>
                    {isLogin ? 'Sign In' : 'Create Account'}
                </h2>

                <div>
                    <label htmlFor='username'>
                        Username
                    </label>
                    <input 
                        id='username'
                        type='text'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <button
                    type='button'
                    onClick={() => setIsLogin(!isLogin)}
                    className='mt-4 text-sm text-zinc-400 hover:text-red-400 transition-colors'
                >
                    {isLogin ? 'Switch to Sign Up' : 'Switch to Sign In'}
                </button>
            </div>
        </div>
    );
}