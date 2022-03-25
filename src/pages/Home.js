import React, { useState } from 'react'
import { v4 as uuidV4 } from 'uuid';
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';
const Home = () => {

    const navigate = useNavigate();
    //for storing id's generated and username
    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');

    //on clicking 'new room'
    const createNewRoom = (e) => {
        //to stop loading page on clicking 'Join' button
        e.preventDefault();
        // for generating id
        const id = uuidV4();
        //here ids are stored in setRoomId
        setRoomId(id);
        //giving alert box i.e toast at top right
        toast.success('Created a new room');
    }
    //on clicking 'join' button
    const joinRoom = (e) => {
        //first check whether room id and/or username is available or not
        //if not
        if (!roomId || !username) {
            toast.error('ROOM ID & Username required');
            return;
        }
        //if available then redirect using useNavigate hook
        //first give location then for passing username , use state for accessing it to the location provided (can be done using Redux store too)
        navigate(`/editor/${roomId}`, {
            state: {
                username,
            },
        });
    };
    // adding keybinding
    const handleInputEnter = (e) => {
        if (e.code === 'Enter') {
            joinRoom();
        }
    }

    return (
        <div className='homePageWrapper'>
            <div className="formWrapper">
                <img className='homepageLogo' src="/codeviewer.png" alt="Code Viewer" />
                <h4 className="mainLabel">Paste invitation ROOM ID</h4>
                <div className="inputGroup">
                    <input type="text" className='inputBox' placeholder='ROOM ID'  //onchange added so if any value is entered then it will also get added to setRoomId
                        onChange={(e) => setRoomId(e.target.value)} value={roomId} onKeyUp={handleInputEnter} />
                    <input type="text" className='inputBox' placeholder='USERNAME' //onchange added so if any value is entered then it will also get added to setUsername
                        onChange={(e) => setUsername(e.target.value)} value={username} onKeyUp={handleInputEnter} />
                    <button className='btn joinBtn' onClick={joinRoom}>Join</button>
                    <span className='createInfo'>
                        If you don't have an invite then create &nbsp;
                        <a href="/" onClick={createNewRoom} className='createNewBtn'>new room </a>
                    </span>
                </div>
            </div>
            <footer>
                <h4>Built with ❤️ &nbsp;by{' '}<a href="https://github.com/aayushjha5">Aayush</a></h4>
            </footer>
        </div>
    )
}

export default Home