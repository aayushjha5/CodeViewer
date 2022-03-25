import React, { useState } from 'react'
import Client from '../components/Client';
import Editor from '../components/Editor';

const EditorPage = () => {
  const [clients, setClients] = useState([{socketId: 1, username: 'Aayush Jha'},{socketId: 2, username: 'Satya R'},{socketId: 3, username: 'Amitabh D'}]);
  return (
    <div className='mainWrap'>
        <div className="aside">
          <div className="asideInner">
            <div className="logo">
              <img  className="logoImage" src="/codeviewer.png" alt="Code Viewer" />
            </div>
            <h3>Connected</h3>
            <div className="clientsList">
               {
                 clients.map((client) => (
                 <Client username={client.username} key={client.socketId}/>
                 ))}
            </div>
          </div>
          <button className='btn copyBtn'>Copy ROOM ID</button>
          <button className='btn leaveBtn'>Leave </button>
        </div>
        <div className="editorWrap">
          <Editor />
        </div>
    </div>
  )
}

export default EditorPage