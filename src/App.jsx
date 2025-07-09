import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import Meditation from './pages/Meditation/Meditation';
import Journal from './pages/Journal/Journal';
import Breathwork from './pages/Breathwork/Breathwork';
import Walk from './pages/Walk/Walk';
import Profile from './pages/Profile/Profile';
import RelaxationTechniques from './pages/RelaxationTechniques/RelaxationTechniques';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/meditation" element={<Meditation />} />
            <Route path="/relaxation" element={<RelaxationTechniques />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/breathwork" element={<Breathwork />} />
            <Route path="/walk" element={<Walk />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;