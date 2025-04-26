// useRestaurantApi.js
// Custom hook for easier API integration

import { useState, useEffect, useCallback } from 'react';
import API from './restaurantApi';

export const useRestaurantApi = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [popularCuisines, setPopularCuisines] = useState([]);
  const [currentRestaurant, setCurrentRestaurant] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all restaurants
  const fetchAllRestaurants = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await API.getAllRestaurants();
      setRestaurants(data);
      return data;
    } catch (err) {
      setError(err.message || 'Restoranlar yüklenirken bir hata oluştu');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch featured restaurants
  const fetchFeaturedRestaurants = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await API.getFeaturedRestaurants();
      setFeaturedRestaurants(data);
      return data;
    } catch (err) {
      setError(err.message || 'Öne çıkan restoranlar yüklenirken bir hata oluştu');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch restaurant by ID
  const fetchRestaurantById = useCallback(async (id) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await API.getRestaurantById(id);
      setCurrentRestaurant(data);
      return data;
    } catch (err) {
      setError(err.message || 'Restoran bilgileri yüklenirken bir hata oluştu');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Search restaurants
  const searchRestaurants = useCallback(async (query) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await API.searchRestaurants(query);
      setRestaurants(data);
      return data;
    } catch (err) {
      setError(err.message || 'Arama sonuçları yüklenirken bir hata oluştu');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch nearby restaurants
  const fetchNearbyRestaurants = useCallback(async (neighborhood) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await API.getNearbyRestaurants(neighborhood);
      setRestaurants(data);
      return data;
    } catch (err) {
      setError(err.message || 'Yakındaki restoranlar yüklenirken bir hata oluştu');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const data = await API.getCategories();
      setCategories(data);
      return data;
    } catch (err) {
      setError(err.message || 'Kategoriler yüklenirken bir hata oluştu');
      return [];
    }
  }, []);

  // Fetch neighborhoods
  const fetchNeighborhoods = useCallback(async (city = 'İstanbul') => {
    try {
      const data = await API.getNeighborhoods(city);
      setNeighborhoods(data);
      return data;
    } catch (err) {
      setError(err.message || 'Semtler yüklenirken bir hata oluştu');
      return [];
    }
  }, []);

  // Fetch popular cuisines
  const fetchPopularCuisines = useCallback(async () => {
    try {
      const data = await API.getPopularCuisines();
      setPopularCuisines(data);
      return data;
    } catch (err) {
      setError(err.message || 'Popüler mutfaklar yüklenirken bir hata oluştu');
      return [];
    }
  }, []);

  // Submit an order
  const submitOrder = useCallback(async (restaurantId, orderItems, address, paymentMethod) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await API.submitOrder(restaurantId, orderItems, address, paymentMethod);
      return data;
    } catch (err) {
      setError(err.message || 'Sipariş gönderilirken bir hata oluştu');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load initial data
  const loadInitialData = useCallback(async (neighborhood) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch data in parallel
      const [nearby, featured, cats, hoods, popular] = await Promise.all([
        API.getNearbyRestaurants(neighborhood),
        API.getFeaturedRestaurants(),
        API.getCategories(),
        API.getNeighborhoods(),
        API.getPopularCuisines()
      ]);
      
      setRestaurants(nearby);
      setFeaturedRestaurants(featured);
      setCategories(cats);
      setNeighborhoods(hoods);
      setPopularCuisines(popular);
      
      return {
        restaurants: nearby,
        featuredRestaurants: featured,
        categories: cats,
        neighborhoods: hoods,
        popularCuisines: popular
      };
    } catch (err) {
      setError(err.message || 'Veri yüklenirken bir hata oluştu');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    // State
    restaurants,
    featuredRestaurants,
    categories,
    neighborhoods,
    popularCuisines,
    currentRestaurant,
    isLoading,
    error,
    
    // Actions
    fetchAllRestaurants,
    fetchFeaturedRestaurants,
    fetchRestaurantById,
    searchRestaurants,
    fetchNearbyRestaurants,
    fetchCategories,
    fetchNeighborhoods,
    fetchPopularCuisines,
    submitOrder,
    loadInitialData
  };
};

export default useRestaurantApi;