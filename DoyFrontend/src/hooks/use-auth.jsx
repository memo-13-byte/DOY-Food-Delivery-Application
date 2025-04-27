import React, { createContext, useContext } from "react";
import {
  useQuery,
  useMutation,
} from "@tanstack/react-query";
import { apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "./use-toast";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { toast } = useToast();
  
  const {
    data: user,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["/api/user"],
    queryFn: async ({ queryKey }) => {
      try {
        const res = await fetch(queryKey[0], { credentials: 'include' });
        if (res.status === 401) {
          return null;
        }
        if (!res.ok) {
          throw new Error("Kullanıcı bilgileri alınamadı");
        }
        return await res.json();
      } catch (e) {
        if (e.message.includes('401')) {
          return null;
        }
        throw e;
      }
    },
    refetchOnWindowFocus: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      return await res.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Giriş başarılı",
        description: "Hesabınıza hoş geldiniz",
      });
    },
    onError: (error) => {
      toast({
        title: "Giriş başarısız",
        description: error.message || "Kullanıcı adı veya şifre hatalı",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData) => {
      const res = await apiRequest("POST", "/api/register", userData);
      return await res.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Kayıt başarılı",
        description: "Hesabınız oluşturuldu",
      });
    },
    onError: (error) => {
      toast({
        title: "Kayıt başarısız",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout", {});
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Çıkış yapıldı",
        description: "Tekrar görüşmek üzere!",
      });
    },
    onError: (error) => {
      toast({
        title: "Çıkış başarısız",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}