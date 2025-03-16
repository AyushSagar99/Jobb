import React from 'react'

function Sidebar() {
  return (
    <>
    <div className='bg-slate-400 h-screen w-[10rem]'>
        <div className='p-3'>
        <p className='text-2xl font-bold mb-4'>JobB</p>
        </div>
        <div className='p-2'>
            <button className='bg-indigo-500 p-1 whitespace-nowrap rounded-lg cursor-pointer'>Create new report</button>
        </div>
    </div>
    </>
  )
}

export default Sidebar