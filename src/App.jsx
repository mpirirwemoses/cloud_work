import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './assets/Components/Auth';
import RoutineApp from './assets/Components/Activity';

function App() {
  return (
    <Router>
      <Auth />
      <Routes>
        {/* Default route */}
        <Route path="/" element={<RoutineApp />} />

        {/* Dashboard route */}
        <Route path="/dashboard" element={<RoutineApp />} />

        {/* Auth route */}
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </Router>
  );
}

export default App;