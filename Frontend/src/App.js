import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Navbar from './components/Navbar';
import Contact from './pages/Contact';
import About from './pages/About';
import Home from './pages/Home';
import AuthPage from './components/AuthPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import MemberDashboard from './pages/MemberDashboard';
import ProjectSummary from './pages/AdminContents/ProjectSummary';
import AnalyticsFeed from './pages/AdminContents/AnalyticsFeed';
import ActivityPage from './pages/ActivityPage';
import MemberActivityPage from './pages/TeamMember/ActivityList';
import MemberProjectPage from './pages/TeamMember/ProjectList';
function App() {



  return (
    <AuthProvider>  
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/adminDashboard/:adminId" element={<AdminDashboard />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["MEMBER"]} />}>
            <Route path="/memberDashboard/:memberId" element={<MemberDashboard />} />
          </Route>
          <Route path="/admin/:adminId/projects" element={<ProjectSummary />} />
          <Route path="/admin/:adminId/reports" element={<AnalyticsFeed />} /> 
          <Route path="/admin/:adminId/activity" element={<ActivityPage />} /> 
          <Route path="/member/:memberId/activity" element={<MemberActivityPage/>}/>
          <Route path="/member/:memberId/project" element={<MemberProjectPage/>}/>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
