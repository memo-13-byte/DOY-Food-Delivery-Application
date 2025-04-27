import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminComplaintsPage from './pages/AdminComplaintsPage';
import AdminAccountManagementPage from './pages/AdminAccountManagementPage';
import PendingRegistrationsPage from './pages/PendingRegistrationsPage';
import PlatformConfigurationsPage from './pages/PlatformConfigurationsPage'; // ✨ yeni import

function App() {
    return (
        <Router>
            <div className="bg-[#F8F5DE] min-h-screen">
                <Routes>
                    <Route path="/admin/complaints" element={<AdminComplaintsPage />} />
                    <Route path="/admin/account-management" element={<AdminAccountManagementPage />} />
                    <Route path="/admin/pending-registrations" element={<PendingRegistrationsPage />} />
                    <Route path="/admin/platform-configurations" element={<PlatformConfigurationsPage />} /> {/* ✨ yeni route */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
