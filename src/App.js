import './App.css';
import EditorPage from './pages/EditorPage';
import Home from './pages/Home';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import {Toaster} from 'react-hot-toast';

function App() {
  return (
   <>
   <div>
     <Toaster position='top-right' toastOptions={{success: {
       theme: {
         primary: '#E7870C',
       },
     },}}>
     </Toaster>
   </div>
   <Router>
     <Routes>
       <Route path='/' element={<Home />}></Route>
       <Route path='/editor/:roomId' element={<EditorPage />}></Route>
     </Routes>
   </Router>
   </>
  )}

export default App;
