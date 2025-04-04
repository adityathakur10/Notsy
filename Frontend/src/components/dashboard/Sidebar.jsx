import React from 'react'

const Sidebar = () => {
  return (
    <div>
        <div className="flex flex-col h-screen bg-transparent min-w-64">
            <div className="flex items-center justify-center h-16 bg-gray-800 text-white text-xl font-bold">
            Notsy
            </div>
            <nav className="flex flex-col p-4 space-y-2">
            <a href="#" className="text-gray-700 hover:text-gray-900">Home</a>
            <a href="#" className="text-gray-700 hover:text-gray-900">Notes</a>
            <a href="#" className="text-gray-700 hover:text-gray-900">Settings</a>
            <a href="#" className="text-gray-700 hover:text-gray-900">Logout</a>
            </nav>
        </div>
    </div>
  )
}

export default Sidebar;
