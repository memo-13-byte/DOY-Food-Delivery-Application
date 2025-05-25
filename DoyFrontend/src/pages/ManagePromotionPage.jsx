// src/services/PromotionForm.js
import { useEffect, useState } from 'react'; // Keep useEffect and useState
import axios from 'axios';
import PromotionForm from '../services/PromotionForm';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AuthorizedRequest from '../services/AuthorizedRequest';


function ManagePromotionPage() {
    const [existingPromoData, setExistingPromoData] = useState(null); // Re-enable state
    const [loading, setLoading] = useState(true); // Re-enable state

    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(false);

    const handleCreatePromotion = async (data) => {
        try {
            const response =await AuthorizedRequest.postRequest(`http://localhost:8080/api/promotion/post`, data);
            console.log('Promotion created:', response.data);
            alert('Promotion created successfully!');
            // Optional: Re-fetch the list or navigate after creation
            // navigate('/promotions-list');
        } catch (error) {
            console.error('Error creating promotion:', error.response ? error.response.data : error.message);
            alert('Failed to create promotion: ' + (error.response?.data?.message || 'An error occurred.'));
        }
    };

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        if (newDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    };

    // Re-enable handleUpdatePromotion
    const handleUpdatePromotion = async (data) => {
        try {
            // IMPORTANT: Replace '123' with the actual ID of the promotion you want to update
            // In a real application, this ID would come from the URL parameter (e.g., /manage-promotion/:id)
            // or from a selection mechanism on the page. For now, it's a placeholder.
            const promoIdToUpdate = existingPromoData?.id; // Or however you get the ID for update

            if (!promoIdToUpdate) {
                alert('No promotion ID available for update.');
                return;
            }

            const response = await axios.put(`http://localhost:8080/promotion/${promoIdToUpdate}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer YOUR_JWT_TOKEN_HERE`
                }
            });
            console.log('Promotion updated:', response.data);
            alert('Promotion updated successfully!');
            // You might want to update the existingPromoData state or refetch after update
            setExistingPromoData(response.data); // Update the form with fresh data
        } catch (error) {
            console.error('Error updating promotion:', error.response ? error.response.data : error.message);
            alert('Failed to update promotion: ' + (error.response?.data?.message || 'An error occurred.'));
        }
    };

    // Re-enable useEffect to fetch existing promo data
    useEffect(() => {
        const fetchExistingPromo = async () => {
            try {
                // IMPORTANT: You need a dynamic way to get the ID here, e.g., from URL params
                // For demonstration, let's assume you're always fetching a specific ID or the first one.
                // Replace '123' with an actual existing promotion ID from your database for testing.
                const PROMOTION_ID_TO_FETCH = 1; // Example: Fetching promotion with ID 1
                const response = await axios.get(`http://localhost:8080/promotion/${PROMOTION_ID_TO_FETCH}`);
                setExistingPromoData(response.data);
            } catch (error) {
                console.error('Failed to fetch promotion:', error.response ? error.response.data : error.message);
                // If fetching fails, existingPromoData remains null
            } finally {
                setLoading(false);
            }
        };

        fetchExistingPromo();
    }, []); // Empty dependency array means this runs once on mount

    return (
        <div className={`flex flex-col min-h-screen ${darkMode ? "bg-[#1c1c1c] text-white" : "bg-[#F2E8D6]"} transition-colors duration-300`} >
            <Header darkMode={darkMode} setDarkMode={setDarkMode}/>

            <div className="flex-grow flex justify-center items-start px-4 pb-8">
                <div className={`w-full md:w-4/5 max-w-5xl ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"} rounded-xl p-6 shadow-xl`}>
                    <h1 className={`text-2xl font-bold ${darkMode ? "text-amber-400" : "text-amber-800"} text-center mb-6`}>
                        Manage Promotions
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Create New Promotion */}
                        <div className={`${darkMode ? "bg-gray-700" : "bg-amber-50"} rounded-lg p-4 shadow-md`}>
                            <h2 className={`text-lg font-semibold ${darkMode ? "text-amber-300" : "text-amber-700"} mb-4`}>
                                Create New Promotion
                            </h2>
                            <PromotionForm onSubmit={handleCreatePromotion} darkMode={darkMode} />
                        </div>

                        {/* Edit Promotion */}
                        <div className={`${darkMode ? "bg-gray-700" : "bg-amber-50"} rounded-lg p-4 shadow-md`}>
                            <h2 className={`text-lg font-semibold ${darkMode ? "text-amber-300" : "text-amber-700"} mb-4`}>
                                Edit Promotion
                            </h2>
                            {loading ? (
                                <p className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>Loading existing promotion...</p>
                            ) : existingPromoData ? (
                                <PromotionForm
                                    onSubmit={handleUpdatePromotion}
                                    initialData={existingPromoData} // Pass fetched data
                                    darkMode={darkMode}
                                />
                            ) : (
                                <p className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                    No existing promotion found for editing (check ID in useEffect).
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer darkMode={darkMode}></Footer>
        </div>
    );
}

export default ManagePromotionPage;