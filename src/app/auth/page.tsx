'use client';

import { useState } from 'react';
import AnimatedShapes from '@/components/AnimatedShapes';
import SidebarManager from '@/components/SidebarManager';

interface SpawnedObject {
    id: string;
    type: 'cube' | 'sphere' | 'custom';
    position: [number, number, number];
}


export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [objects, setObjects] = useState<SpawnedObject[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedType, setSelectedType] = useState<'cube' | 'sphere' | 'custom'>('cube');

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
                            // change url to /dashboard
                            window.history.pushState({ view: 'dashboard' }, '', '/dashboard');
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
            // change url back to /auth
            window.history.pushState({ view: 'auth' }, '', '/auth');
            setIsAuthenticated(false);
            setUsername('');
            setPassword('');
            setObjects([]);
        };

        const handleAddObject = () => {
            const randomX = (Math.random() - 0.5) * 6;
            const randomY = (Math.random() - 0.5) * 4;
            const randomZ = (Math.random() - 0.5) * 2;

            const newObject: SpawnedObject = {
                id: `obj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                type: selectedType,
                position: [randomX, randomY, randomZ]
            };

            setObjects([...objects, newObject]);
            setIsModalOpen(false);
        };

        const handleUpdatePosition = (id: string, newPos: [number, number, number]) => {
            setObjects(prev => prev.map(obj => obj.id === id ? { ...obj, position: newPos } : obj));
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

                <SidebarManager 
                        objects={objects}
                        setObjects={setObjects}
                        onAddClick={() => setIsModalOpen(true)}
                    />
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
                    <AnimatedShapes 
                        key={isAuthenticated ? 'dashboard-view' : 'login-view'}
                        isAuthenticated={isAuthenticated} 
                        spawnedObjects={objects} 
                        onUpdatePosition={handleUpdatePosition}
                    />
                </div>
            </div>

            {isModalOpen && (
                <div className='absolute inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 transition-all duration-300'>
                    <div className='bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-[#e8c195]/20 text-[#4A3319] transform scale-100 transition-transform'>
                        <h3 className='text-lg font-bold mb-5 tracking-tight text-stone-800'>Add an Object</h3>
                        
                        <div className='space-y-2.5 mb-6'>
                            <button 
                                type='button'
                                onClick={() => setSelectedType('cube')}
                                className={`w-full flex items-center justify-between p-3.5 rounded-xl border-2 transition-all duration-200 text-left group
                                    ${selectedType === 'cube' 
                                        ? 'border-[#D9A066] bg-[#D9A066]/5 font-medium shadow-sm' 
                                        : 'border-stone-100 bg-stone-50/50 hover:bg-stone-50 hover:border-stone-200'}`}
                            >
                                <span className={selectedType === 'cube' ? 'text-[#4A3319]' : 'text-stone-600'}>Cube</span>
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all
                                    ${selectedType === 'cube' ? 'border-[#D9A066] bg-[#D9A066]' : 'border-stone-300'}`}>
                                    {selectedType === 'cube' && <div className='w-1.5 h-1.5 rounded-full bg-white' />}
                                </div>
                            </button>

                            <button 
                                type='button'
                                onClick={() => setSelectedType('sphere')}
                                className={`w-full flex items-center justify-between p-3.5 rounded-xl border-2 transition-all duration-200 text-left group
                                    ${selectedType === 'sphere' 
                                        ? 'border-[#D9A066] bg-[#D9A066]/5 font-medium shadow-sm' 
                                        : 'border-stone-100 bg-stone-50/50 hover:bg-stone-50 hover:border-stone-200'}`}
                            >
                                <span className={selectedType === 'sphere' ? 'text-[#4A3319]' : 'text-stone-600'}>Sphere</span>
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all
                                    ${selectedType === 'sphere' ? 'border-[#D9A066] bg-[#D9A066]' : 'border-stone-300'}`}>
                                    {selectedType === 'sphere' && <div className='w-1.5 h-1.5 rounded-full bg-white' />}
                                </div>
                            </button>

                            <button 
                                type='button'
                                onClick={() => setSelectedType('custom')}
                                className={`w-full flex items-center justify-between p-3.5 rounded-xl border-2 transition-all duration-200 text-left group
                                    ${selectedType === 'custom' 
                                        ? 'border-[#D9A066] bg-[#D9A066]/5 font-medium shadow-sm' 
                                        : 'border-stone-100 bg-stone-50/50 hover:bg-stone-50 hover:border-stone-200'}`}
                            >
                                <span className={selectedType === 'custom' ? 'text-[#4A3319]' : 'text-stone-600'}>Torus Knot</span>
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all
                                    ${selectedType === 'custom' ? 'border-[#D9A066] bg-[#D9A066]' : 'border-stone-300'}`}>
                                    {selectedType === 'custom' && <div className='w-1.5 h-1.5 rounded-full bg-white' />}
                                </div>
                            </button>
                        </div>

                        <div className='flex items-center justify-end space-x-3 pt-2 border-t border-stone-100'>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className='px-4 py-2.5 text-sm font-semibold text-stone-500 hover:text-stone-800 transition-colors'
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleAddObject}
                                className='px-5 py-2.5 bg-[#D9A066] hover:bg-[#c48e57] text-white text-sm font-semibold rounded-xl transition-colors shadow-sm active:scale-95'
                            >
                                Add to Scene
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}