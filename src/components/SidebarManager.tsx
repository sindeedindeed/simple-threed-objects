'use client';

import { useState } from 'react';

interface SpawnedObject {
    id: string;
    type: 'cube' | 'sphere' | 'custom';
    position: [number, number, number];
}

interface SidebarManagerProps {
    objects: SpawnedObject[];
    setObjects: React.Dispatch<React.SetStateAction<SpawnedObject[]>>;
    onAddClick: () => void;
}

export default function SidebarManager({ objects, setObjects, onAddClick }: SidebarManagerProps) {
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleDelete = (id: string) => {
        setObjects(objects.filter(obj => obj.id !== id));
        if (editingId === id) setEditingId(null);
    };

    const handleTypeChange = (id: string, newType: 'cube' | 'sphere' | 'custom') => {
        setObjects(objects.map(obj => obj.id === id ? { ...obj, type: newType } : obj));
    };

    return (
        <div className='flex flex-col items-center w-full h-full justify-between'>
            {/* Top Control Block */}
            <div className='flex flex-col items-center w-full space-y-4 border-b border-[#e8c195]/20 pb-4'>
                <button
                    onClick={onAddClick}
                    className='w-12 h-12 rounded-xl bg-[#D9A066] hover:bg-[#c48e57] text-white flex items-center justify-center transition-all shadow-sm active:scale-95 group'
                    title='Add Object'
                >
                    <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={2.5} stroke='currentColor' className='w-5 h-5 group-hover:rotate-90 transition-transform duration-200'>
                        <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
                    </svg>
                </button>
            </div>

            {/* Scrollable Inventory List Container */}
            <div className='flex-1 w-full my-4 overflow-y-auto no-scrollbar space-y-3 px-1'>
                {objects.map((obj, index) => (
                    <div key={obj.id} className='relative group flex flex-col items-center'>
                        {/* Compact Shape Badge Wrapper */}
                        <button
                            onClick={() => setEditingId(editingId === obj.id ? null : obj.id)}
                            className={`w-12 h-12 rounded-xl border flex flex-col items-center justify-center transition-all relative text-xs font-bold uppercase tracking-tighter shadow-xs
                                ${editingId === obj.id 
                                    ? 'border-[#D9A066] bg-[#D9A066]/10 text-[#4A3319]' 
                                    : 'border-stone-200 bg-stone-50 text-stone-500 hover:border-stone-300 hover:bg-stone-100'}`}
                            title={`Manage Object ${index + 1}`}
                        >
                            <span>{obj.type === 'custom' ? 'KNOT' : obj.type}</span>
                            <span className='text-[9px] opacity-60 font-mono mt-0.5'>#{index + 1}</span>
                        </button>

                        {/* Inline Micro Configuration Dropdown Drawer Panel */}
                        {editingId === obj.id && (
                            <div className='absolute left-14 top-0 bg-white rounded-xl shadow-xl border border-stone-200 p-2.5 z-50 flex flex-col space-y-1.5 min-w-[110px] animate-fadeIn'>
                                <div className='text-[10px] font-bold uppercase tracking-wider text-stone-400 px-1 mb-0.5'>Swap Geometry</div>
                                <button 
                                    onClick={() => handleTypeChange(obj.id, 'cube')}
                                    className={`text-xs px-2 py-1 rounded-md text-left font-medium transition-colors ${obj.type === 'cube' ? 'bg-[#D9A066]/10 text-[#4A3319]' : 'hover:bg-stone-50 text-stone-600'}`}
                                >
                                    Cube
                                </button>
                                <button 
                                    onClick={() => handleTypeChange(obj.id, 'sphere')}
                                    className={`text-xs px-2 py-1 rounded-md text-left font-medium transition-colors ${obj.type === 'sphere' ? 'bg-[#D9A066]/10 text-[#4A3319]' : 'hover:bg-stone-50 text-stone-600'}`}
                                >
                                    Sphere
                                </button>
                                <button 
                                    onClick={() => handleTypeChange(obj.id, 'custom')}
                                    className={`text-xs px-2 py-1 rounded-md text-left font-medium transition-colors ${obj.type === 'custom' ? 'bg-[#D9A066]/10 text-[#4A3319]' : 'hover:bg-stone-50 text-stone-600'}`}
                                >
                                    Torus Knot
                                </button>
                                <div className='border-t border-stone-100 my-1' />
                                <button 
                                    onClick={() => handleDelete(obj.id)}
                                    className='text-xs px-2 py-1 rounded-md text-left font-semibold text-red-600 hover:bg-red-50 transition-colors flex items-center justify-between'
                                >
                                    <span>Delete</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Bottom Actions Frame */}
            <div className='w-full border-t border-[#e8c195]/20 pt-4 flex flex-col items-center'>
                <button
                    onClick={() => {}}
                    className='w-12 h-12 rounded-xl bg-[#7A6B58] hover:bg-[#635645] text-white flex items-center justify-center transition-all shadow-sm active:scale-95'
                    title='Save Layout'
                >
                    <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={2} stroke='currentColor' className='w-5 h-5'>
                        <path strokeLinecap='round' strokeLinejoin='round' d='M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z' />
                    </svg>
                </button>
            </div>
        </div>
    );
}