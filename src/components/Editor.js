import React, { useEffect, useRef } from 'react'
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../Actions';
const Editor = ({ socketRef, roomId , onCodeChange}) => {
    //ref to store textarea data
    const editorRef = useRef(null);
    //will be called when component is rendered for the first time
    useEffect(() => {
        async function init() {
            editorRef.current = Codemirror.fromTextArea(document.getElementById('realtimeEditor'), {
                mode: { name: 'javascript', json: true },
                theme: 'dracula',
                autoCloseTags: true,
                autoCloseBrackets: true,
                lineNumbers: true
            });

            //add event listener 
            editorRef.current.on('change', (instance, changes) => {
                //  console.log('changes', changes);
                const { origin } = changes;
                //get all the text inside using getValue of that instance
                const code = instance.getValue();
                onCodeChange(code);
                if (origin !== 'setValue') {
                    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                        roomId,
                        code,
                    });
                }
            });
        }
        init();
    }, []);

    useEffect(() => {
        if (socketRef.current) {
            //receiving at another client side
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                if (code !== null) {
                    //to insert something in textarea without entering i.e dynamically
                    editorRef.current.setValue(code);
                }
            });
        }
        return () => {
            socketRef.current.off(ACTIONS.CODE_CHANGE);
        }
    }, [socketRef.current]);


    return (
        <textarea id="realtimeEditor"></textarea>
    )
}

export default Editor