import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminComplaintsPage from './pages/AdminComplaintsPage';
import AdminAccountManagementPage from './pages/AdminAccountManagementPage'; // YENİ

function App() {
    return (
        <Router>
            <div className="bg-[#F8F5DE] min-h-screen">
                <Routes>
                    <Route path="/admin/complaints" element={<AdminComplaintsPage />} />
                    <Route path="/admin/account-management" element={<AdminAccountManagementPage />} /> {/* YENİ */}
                    {/* İleride buraya diğer admin/user route'ları eklenebilir */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
