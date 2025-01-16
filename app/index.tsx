import Loader from '@/components/Loader/Loader';
import Login from '@/components/auth/Login';
import SessionCheck from '@/components/auth/SessionCheck';
import { supabase } from '@/utils/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/native";
import { Session } from "@supabase/supabase-js";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
  
const Index = () => {
    const [loading, setLoading] = useState(true); // Loading state for session retrieval
    const [session, setSession] = useState<Session | null>(null);
    const router = useRouter();
    const isFocused = useIsFocused();

    useEffect(() => {
        
        const getSession = async () => {
            try {
                setLoading(true); // Set loading while fetching session

                // Fetch session from Supabase
                const { data: { session } } = await supabase.auth.getSession();
                setSession(session);

                // Listen for session changes (auth state changes)
                const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                    setSession(session);
                });

                return () => {
                    subscription?.unsubscribe(); // Clean up subscription on component unmount
                };
            } catch (error) {
                console.error("Error fetching session:", error);
            } finally {
                setLoading(false); // Stop loading once session is retrieved
            }
        };

        if (isFocused) {
            getSession(); // Re-fetch session when the screen is focused
        }
    }, [isFocused]);

    // Handle routing based on session
    useEffect(() => {
        if (!loading) {
            if (session && session.user) {
                // User is authenticated, redirect to home
                router.replace(`/(protected)/home`);
            } else {
                // No session, redirect to login/signup
                router.replace('/');
            }
        }
    }, [ session]);

    // While loading, show a loading indicator (SessionCheck or Loader)
    return loading ? <SessionCheck /> : <Login></Login>;
};

export default Index;
