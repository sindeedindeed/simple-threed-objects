'use client';

interface SpawnedObject {
    id: string;
    type: 'cube' | 'sphere' | 'custom';
    position: [number, number, number];
    scale?: number;
}

interface SidebarManagerProps {
    objects: SpawnedObject[];
    setObjects: React.Dispatch<React.SetStateAction<SpawnedObject[]>>;
    onAddClick: () => void;
}

export default function SidebarManager({ objects, onAddClick }: SidebarManagerProps) {
    return (
        <div className='flex flex-col items-center w-full h-full justify-between relative'>
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

            <div className='flex-1 w-full my-4 overflow-y-auto no-scrollbar space-y-3 px-1 relative'>
                {objects.map((obj, index) => (
                    <div key={obj.id} className='relative flex flex-col items-center'>
                        <div
                            className="w-12 h-12 rounded-xl border border-stone-200 bg-stone-50 text-stone-500 flex flex-col items-center justify-center text-xs font-bold uppercase tracking-tighter shadow-xs select-none"
                            title={`Object ${index + 1}`}
                        >
                            <span>{obj.type === 'custom' ? 'KNOT' : obj.type}</span>
                            <span className='text-[9px] opacity-60 font-mono mt-0.5'>#{index + 1}</span>
                        </div>
                    </div>
                ))}
            </div>

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