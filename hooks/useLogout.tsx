// import { removeExpoToken } from '@/api/supabase/Notifications';

import { signOut } from '@/api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRouter } from 'expo-router';

export default function useLogout() {
    // const dispatch = useAppDispatch();
    // const username=useAppSelector((state)=>state.auth.username)
    const router = useRouter();
    const logout = async ()=>{
        try {
            // removeExpoToken(username)
            AsyncStorage.clear();
            await signOut()
            router.replace('/');
        } catch (error) {
            console.log(error);
        }
    }
    return logout;
}