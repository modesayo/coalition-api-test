import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Home';
import About from './about';
import Contact from './contact';

const AppRoutes = () => {
  return (
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    
  );
};

export default AppRoutes;