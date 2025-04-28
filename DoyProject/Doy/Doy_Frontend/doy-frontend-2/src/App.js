import React, {useState} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminComplaintsPage from './pages/AdminComplaintsPage';
import AdminAccountManagementPage from './pages/AdminAccountManagementPage';
import PendingRegistrationsPage from './pages/PendingRegistrationsPage';
import PlatformConfigurationsPage from './pages/PlatformConfigurationsPage';



function App() {
    const [darkMode, setDarkMode] = useState(false);
    return (
        <Router>
            <div className="bg-[#F8F5DE] min-h-screen">
                <Routes>
                    <Route path="/admin/complaints" element={<AdminComplaintsPage darkMode={darkMode} setDarkMode={setDarkMode} />} />
                    <Route path="/admin/account-management" element={<AdminAccountManagementPage darkMode={darkMode} setDarkMode={setDarkMode} />} />
                    <Route path="/admin/pending-registrations" element={<PendingRegistrationsPage darkMode={darkMode} setDarkMode={setDarkMode} />} />
                    <Route path="/admin/platform-configurations" element={<PlatformConfigurationsPage darkMode={darkMode} setDarkMode={setDarkMode} />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
