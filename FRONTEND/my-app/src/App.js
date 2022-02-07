import { Route, Routes } from 'react-router-dom'
import FirstPage from './FirstPage';
import SecondPage from './SecondPage';
import "./App.css"

function App() {

  return (
    <Routes>
      <Route path="/" element={<FirstPage/>}/>
      <Route path="/:id" element={<SecondPage/>}/>
    </Routes>
  );
}

export default App;
