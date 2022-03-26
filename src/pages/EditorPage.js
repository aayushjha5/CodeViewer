import React, { useEffect, useRef, useState } from 'react'
import ACTIONS from '../Actions';
import Client from '../components/Client';
import Editor from '../components/Editor';
import { initSocket } from '../socket';
import { useLocation, useParams } from 'react-router-dom';

const EditorPage = () => {
  const { roomId } = useParams();
  const location = useLocation();
  // will store the instance of socket  using useRef hook
  const socketRef = useRef(null);
  useEffect(() => {
    const init = async () => {
      // after runnig below function client will be connected to server
      socketRef.current = await initSocket();
      //below statement is used for sending roomId and username
       socketRef.current.emit(ACTIONS.JOIN, {
         roomId, username: location.state?.username
       });
    }
    init();
  }, []);

  const [clients, setClients] = useState([{ socketId: 1, username: 'Aayush Jha' }, { socketId: 2, username: 'Satya R' }, { socketId: 3, username: 'Amitabh D' }]);
  return (
    <div className='mainWrap'>
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img className="logoImage" src="/codeviewer.png" alt="Code Viewer" />
          </div>
          <h3>Connected</h3>
          <div className="clientsList">
            {
              clients.map((client) => (
                <Client username={client.username} key={client.socketId} />
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