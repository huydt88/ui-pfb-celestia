import React from 'react';
import { Routes, Route } from "react-router-dom";
import Hehe from "./Hehe";
import Footer from "./Footer";

const App = () => {
  return (
    <div>
      <Routes>
        <Route exact path="/" element={<Hehe />} />
      </Routes>
      <Footer />
    </div>
  ); 
};

export default App;
