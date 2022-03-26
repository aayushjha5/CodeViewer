import React, { useEffect, useRef, useState } from 'react'
import ACTIONS from '../Actions';
import Client from '../components/Client';
import Editor from '../components/Editor';
import { initSocket } from '../socket';
import { useLocation, useParams, useNavigate, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const EditorPage = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  // will store the instance of socket  using useRef hook
  const reactNavigator = useNavigate();
  const [clients, setClients] = useState([]);

 async function copyText() {
  try {
    await navigator.clipboard.writeText(roomId);
    toast.success("Room ID has been copied to your clipboard.");
  } catch (err) {
    toast.error("Could not copy the Room ID.");
  }
 }


function leaveRoom(){
  reactNavigator('/');
}

  useEffect(() => {
    const init = async () => {
      // after runnig below function client will be connected to server
      socketRef.current = await initSocket();
      //calling handleError function when connection is being error or failed
      socketRef.current.on('connect_error', (err) => handleErrors(err));
      socketRef.current.on('connect_failed', (err) => handleErrors(err));

      //handleError function
      function handleErrors(e) {
        console.log('socket error', e);
        toast.error('Socket connection failed, try again later.');
        reactNavigator('/');

      }

      //below statement is used for sending roomId and username
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });
      //listening for joined event
      socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
        //if username of viewing user is used then dont notify
        if (username !== location.state?.username) {
          toast.success(`${username} joined the room.`);
        }
        //when we login then the whole client list will be shown
        setClients(clients);
        socketRef.current.emit(ACTIONS.SYNC_CODE, {
          code: codeRef.current,
          socketId,
        });
      });

      //listening for disconnected event
      socketRef.current.on(
        ACTIONS.DISCONNECTED,
         ({ socketId, username }) => {
        toast.success(`${username} left the room.`);
        //remove removed user name from list in the left and return the updated
        setClients((prev) => {
          return prev.filter(
            (client) => client.socketId !== socketId);
        }) ;
      });
    };
     init();
     //anything inside return of useEffect func is cleaning func
      return () => {
        socketRef.current.disconnect();
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, []);


  if (!location.state) {
    return <Navigate to="/" />;
  }

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
        <button className='btn copyBtn' onClick={copyText}>Copy ROOM ID</button>
        <button className='btn leaveBtn' onClick={leaveRoom}>Leave </button>
      </div>
      <div className="editorWrap">
        <Editor  socketRef={socketRef} roomId={roomId} onCodeChange={
          (code) => {
            codeRef.current = code;
          }
        }/>
      </div>
    </div>
  )
}

export default EditorPage