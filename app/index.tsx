
import Login from '@/components/auth/Login';
import { supabase } from '@/utils/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/native";
import { Session } from "@supabase/supabase-js";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";


const index = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [session, setSession] = useState<Session | null>(null);
    const isFocused = useIsFocused();
    useEffect(() => {
        const getSession = async () => {
            try {
                const email = await AsyncStorage.getItem('email');
                const userId = await AsyncStorage.getItem('id');



                supabase.auth.getSession().then(({ data: { session } }) => {
                    setSession(session)
                })

                supabase.auth.onAuthStateChange((_event, session) => {
                    setSession(session)
                })
            } catch (error) {
                console.error("Error fetching role from AsyncStorage:", error);
            } finally {
                setLoading(false);
            }
        };
        getSession();
    }, [isFocused]);

    useEffect(() => {
        if (!loading && session && session.user) {
            try {

                router.replace(`/(protected)/home`);
            } catch (error) {
                console.log(error);
            }
        }
    }, [loading, session]);
    return (
        <>
            <Login />
        </>
    )
}

export default index