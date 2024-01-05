// src/components/PageBuilder.js
import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";

const PageBuilder = () => {
  const [components, setComponents] = useState(() => {
    const savedComponents = localStorage.getItem('components');
    return savedComponents ? JSON.parse(savedComponents) : [];
  });
  const [selectedComponent, setSelectedComponent] = useState(null);

  useEffect(() => {
    saveToLocalStorage(components);
  }, [components]);

  const handleDrop = (e) => {
    e.preventDefault();
  
    // Get the id of the dragged component
    const id = parseInt(e.dataTransfer.getData('text/plain'), 10);
  
    // Find the component in your state
    const component = components.find(comp => comp.id === id);
    console.log('component***', component);
    // If the component exists, it's an existing one
    if (component) {
      // Calculate the new position
      const x = e.clientX - e.target.getBoundingClientRect().left;
      const y = e.clientY - e.target.getBoundingClientRect().top;
  
      // Update the position of the component in your state
      const updatedComponents = components.map((comp) =>
        comp.id === id
          ? { ...comp, x, y }
          : comp
      );
  
      // Update the components in the state
      setComponents(updatedComponents);
  
      // Return early to prevent the modal from opening
      return;
    }
  
    // If the component doesn't exist, it's a new one
    // Create a new component with type, id, and coordinates
    const componentType = e.dataTransfer.getData('text/plain');
    const x = e.clientX - e.target.getBoundingClientRect().left;
    const y = e.clientY - e.target.getBoundingClientRect().top;
    const newComponent = { type: componentType, id: Date.now(), x, y };
  
    // Update the components in the state
    setComponents([...components, newComponent]);
  
    // Open the modal for the newly dropped component
    setSelectedComponent(newComponent);
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  const handleClick = (id) => {
    const updatedComponents = components.map((component) =>
      component.id === id
        ? { ...component, isSelected: true }
        : { ...component, isSelected: false }
    );
  
    setComponents(updatedComponents);
  };

  const handleDoubleClick = (id) => {
    const updatedComponents = components.map((component) =>
      component.id === id
        ? { ...component, isSelected: false }
        : component
    );
  
    setComponents(updatedComponents);
  };

  const handleElementDrag = (e,id) => {
    console.log('drag event', e);
    e.dataTransfer.setData('text/plain', id.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleElementDragEnd = (e) => {
    console.log('drag end event', e);
    e.dataTransfer.clearData();
  };

  const handleKeyDown = (e, id) => {
    console.log('key down event', e);
    if (e.key === 'Enter') {
      const selectedComponent = components.find(component => component.id === id);
      setSelectedComponent(selectedComponent);
    } else if (e.key === 'Delete') {
      const updatedComponents = components.filter(component => component.id !== id);
      setComponents(updatedComponents);
    }
  };

  //Modal Form Component
  const ModalForm = ({component, onSubmit, onClose}) => {
    const [formData, setFormData] = useState({
      text: component.text || "This is a label",
      x: component.x || 0,
      y: component.y || 0,
      fontSize: component.fontSize || '',
      fontWeight: component.fontWeight || '',
    })

    const handleChange = (e) => {
      console.log('change event', e);
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    }

    return (
      <div className="modal-overlay fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
        <div className="modal bg-white p-4 rounded shadow-lg">
          <div>
          <h3 className="text-lg font-semibold mb-4">Edit Component</h3>
          <img src={require('../assets/timescross.png')} />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="text-lg font-semibold mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Text:
              <input type="text" name="text" value={formData.text} onChange={handleChange} className="mt-1 p-2 border rounded w-full"/>
            </label>
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-600">
              X:
              <input type="number" name="x" value={formData.x} onChange={handleChange} className="mt-1 p-2 border rounded w-full"/>
            </label>
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-600">
              Y:
              <input type="number" name="y" value={formData.y} onChange={handleChange} className="mt-1 p-2 border rounded w-full"/>
            </label>
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-600">
              Font Size:
              <input type="text" name="fontSize" value={formData.fontSize} onChange={handleChange} className="mt-1 p-2 border rounded w-full"/>
            </label>
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-600">
              Font Weight:
              <input
                type="text"
                name="fontWeight"
                value={formData.fontWeight}
                onChange={handleChange}
                className="mt-1 p-2 border rounded w-full"
              />
            </label>
            </div>
            <button type="submit">Save Changes</button>
          </form>
        </div>
      </div>
    );
  }

  const handleModalSubmit = (formData) => {
    // Update the properties of the selected component
    const updatedComponents = components.map((component) =>
      component.id === selectedComponent.id ? { ...component, ...formData } : component
    );

    // Close the modal and update the components in the state
    setSelectedComponent(null);
    setComponents(updatedComponents);
  };

  const saveToLocalStorage = (components) => {
    localStorage.setItem('components', JSON.stringify(components));
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(components, null, 2)], {type : 'application/json'});
    saveAs(blob, 'page-configuration.json');
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={allowDrop}
      className="h-screen w-screen border-dashed border-2 border-gray-100"
    >
      {components.map((component) => (
        <div 
         draggable="true"
         key={component.id}
         style={{ position: 'absolute', left: component.x, top: component.y, border: component.isSelected ? '2px solid red' : 'none', cursor: 'move', }}
         onClick={() => handleClick(component.id)}
         onDoubleClick={() => handleDoubleClick(component.id)}
         onDragStart={(e) => handleElementDrag(e, component.id)}
         onDragEnd={handleElementDragEnd}
         onDrop={handleDrop}
         onDragOver={allowDrop}
         onKeyDown={(e) => handleKeyDown(e, component.id)}
        >
          {component.type === "label" && <label>{component.text || 'Text Label'}</label>}
          {component.type === "input" && (
            <input type="text" placeholder={component.text || 'Input Field'} />
          )}
          {component.type === "button" && (
            <button className="bg-blue-800">{component.text || 'Button'}</button>
          )}
        </div>
      ))}

      {/* Modal for editing element properties */}
      {selectedComponent && (
        <ModalForm
          component={selectedComponent}
          onSubmit={handleModalSubmit}
          onClose={() => setSelectedComponent(null)}
        />
      )}

      <button onClick={handleExport} style={{ position: 'fixed', bottom: 0 }}>Export</button>
    </div>
  );
};

export default PageBuilder;
