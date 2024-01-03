import './App.css';
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import PageBuilder from './components/PageBuilder';

function App() {
  const [position, setPosition] = useState({ x: 100, y: 100 });

  const onDragStart = (event) => {
    const clientRect = event.target.getBoundingClientRect();
    console.log('clientRect***', clientRect);
    event.dataTransfer.setData('application/reactflow', JSON.stringify({x: event.clientX - clientRect.left, y: event.clientY - clientRect.top}))
    event.dataTransfer.effectAllowed = 'move';
  }

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }

  const onDrop = (event) => {
    console.log('DROP event', event);
    const data = JSON.parse(event.dataTransfer.getData('application/reactflow'));
    setPosition({ x: event.clientX - data.x, y: event.clientY - data.y });
  }

  return (
    <div className="h-screen flex flex-row items-stretch" >
      {/* <p className='text-3xl'>HELLO</p> */}
      {/* <div onDragOver={onDragOver} onDrop={onDrop} style={{backgroundColor: 'green', width: 400, height: 400, marginLeft: 500, marginTop: 200}}></div>
      <div draggable="true" onDragStart={onDragStart} style={{ position: 'absolute', left: position.x, top: position.y }}>I CAN MOOVEEEE</div> */}
      
      <PageBuilder />
      <Sidebar />
    </div>
  );
}

export default App;
