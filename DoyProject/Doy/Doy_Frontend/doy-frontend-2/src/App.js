import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminComplaintsPage from './pages/AdminComplaintsPage';
import AdminAccountManagementPage from './pages/AdminAccountManagementPage';
import PendingRegistrationsPage from './pages/PendingRegistrationsPage'; // ✨ yeni import

function App() {
    return (
        <Router>
            <div className="bg-[#F8F5DE] min-h-screen">
                <Routes>
                    <Route path="/admin/complaints" element={<AdminComplaintsPage />} />
                    <Route path="/admin/account-management" element={<AdminAccountManagementPage />} />
                    <Route path="/admin/pending-registrations" element={<PendingRegistrationsPage />} /> {/* ✨ yeni route */}
                    {/* İleride diğer admin/user route'lar da eklenebilir */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
