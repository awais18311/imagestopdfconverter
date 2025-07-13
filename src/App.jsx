import { Routes, Route } from 'react-router-dom';
import LandingPage from './Components/LandingPage';
import Auth from './Components/Auth';
import './index.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<Auth />} />
    </Routes>
  );
}

export default App;
