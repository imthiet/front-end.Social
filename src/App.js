import './App.css';
import Messages from './component/Messages/Messages';
import Login from './component/Login/Login';
import Navbar from './component/Navbar/Navbar';
import Newsfeed from './component/Newsfeed/Newsfeed';
import SignUp from './component/SignUp/SignUp';  // Path to your SignUp component
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Correct import
import 'font-awesome/css/font-awesome.min.css';
import SearchPage from './component/Search/Search';
import Profile from './component/Profile/Profile';



function App() {
  

  return (
    
    <div className="container mt-2">
      
      <Router>
       
          <Routes>
            <Route path="/" element={<Login />} /> {/* This will display the Login page at the root URL */}
            <Route path="/signup" element={<SignUp />} />
            <Route path="/Newsfeed" element={<Newsfeed />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/search_page" element={<SearchPage />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
      </Router>
    </div>
  );
}

export default App;
