// src/components/Sidebar.js
import React from 'react';

const Sidebar = () => {
  const handleDragStart = (e, componentType) => {
    e.dataTransfer.setData('text/plain', componentType);
  };

  return (
    <div className='bg-gray-700 max-h-full'>
      <h2 className='text-xl font-bold text-white my-5 ml-5 mr-20'>BLOCKS</h2>
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, 'label')}
        className='bg-gray-100 flex flex-row text-black font-light my-2 rounded mx-3 p-2 w-60'
      >
        <img src={require('../assets/grip.png')} className='mr-2'/>
        Text Label
      </div>
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, 'input')}
        className='bg-gray-100 flex flex-row text-black font-light my-2 rounded mx-3 p-2 w-60'
      >
        <img src={require('../assets/grip.png')} className='mr-2'/>
        Input Field
      </div>
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, 'button')}
        className='bg-gray-100 flex flex-row text-black font-light my-2 rounded mx-3 p-2 w-60'
      >
        <img src={require('../assets/grip.png')} className='mr-2'/>
        Button
      </div>
    </div>
  );
};

export default Sidebar;
