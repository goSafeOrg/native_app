import { createClient } from '@supabase/supabase-js';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState } from "react-native";
import { Database } from '@/database.types';


const SUPABASE_URL="https://igbtezppidteqhbauxlv.supabase.co"
const SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlnYnRlenBwaWR0ZXFoYmF1eGx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkxODU5MDUsImV4cCI6MjA0NDc2MTkwNX0.MnP_05Bb5fA4G3DEyzeO4KmU6xVkyazj6ruzosPZyJk"
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY,{
    auth:{
        storage:AsyncStorage,
        autoRefreshToken:true,
        persistSession:true,
        detectSessionInUrl: false,
    }
});


AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh()
    } else {
      supabase.auth.stopAutoRefresh()
    }
  })
