import { supabase } from "../utils/supabase";

// Sign up function
export const signUp = async (fullname: string, device_id: string, email: string, phone_no: number, password: string) => {
    // Step 1: Sign up the user with email and password
   
    const { data, error } = await supabase.auth.signUp({
        email,
        password
    });

    if (error) {
        console.error('Error signing up:', error);
        throw error; // Propagate the error
    }

    const user = data.user;

    // Step 2: After successful sign-up, store additional user details in 'Users' table
    if (user) {
        
        const { error: profileError } = await supabase
            .from('Users')
            .insert([
                {
                    // Only include fields that are necessary and ensure their types match
                    name: fullname,
                    device_id: device_id,
                    phone_no: phone_no,
                    // If you have a field for created_at, you can set it to the current date/time
                    created_at: new Date().toISOString() // Optional if required
                }
            ]);

        if (profileError) {
            console.error('Error inserting profile:', profileError);
            // Optionally, handle error for profile insertion (e.g., rollback auth sign up)
            throw profileError; // Propagate the error
        }
    }

    return data;
};

// Sign in function
export const signIn = async (email: string, password: string) => {
 
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user; // Access user from the data object
};

// Sign out function
export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};
