import { p1 } from "@/utils/constants/images";
import { supabase } from "../utils/supabase";
import { decode } from "base64-arraybuffer";
import { setExpoToken } from "./notifications";


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
// TODO:
function authenticateCredentials(license_id: string, dob: Date) {
    // Replace with actual authentication logic
    return { status: true, imageUri: 'https://unsplash.com/photos/woman-wearing-red-long-sleeved-shirt-beside-wall-XttWKETqCCQ'}; // Mock authentication success with image
}

export const signUp = async (image_b_64:string, fullname: string, device_id: string, email: string, phone_no: number, password: string,license_id:string,dob?:Date) => {
    const isAuthenticated = authenticateCredentials(license_id, dob!);
    if (!isAuthenticated) {
        throw new Error('Authentication failed. Invalid license ID or DOB.');
    }
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });
    
    if (error) {
        console.error('Error signing up:', error);
        throw error;
    }
    
    const user = data.user;
    
    if (!user) {
        throw new Error('User creation failed.');
    }
    else{
        setExpoToken(user.id)
    }


const image=image_b_64;
const fileName=`${fullname}-${license_id}`
    // Upload image to Supabase storage
const { data: imageUploadData, error: imageUploadError } = await supabase
.storage
.from('user-images')
.upload(`profiles/${user.id}/profile-image/${fileName}`, decode(image),{contentType: 'image/jpg'});

if (imageUploadError) {
console.error('Error uploading image:', imageUploadError);
throw imageUploadError;
}

const { data: publicUrlData } = supabase.storage
.from('user-images')
.getPublicUrl(`profiles/${user.id}/profile-image/${fileName}`);

// Insert user details into 'users' table
const { error: profileError } = await supabase
.from('Users')
.insert([
    {
        id:user.id,
        name: fullname,
        phone_no: phone_no,
        dob: dob,
        license_id: license_id,
        device: [{ id: device_id, name: "gosafe" }], 
        image: publicUrlData.publicUrl, 
    },
]);

if (profileError) {
console.error('Error inserting profile:', profileError);
throw profileError;
}


const { error: peopleError } = await supabase
    .from('people')
    .insert([
        {
            name: fullname,
            phone_no: phone_no,
            dob: dob,
            license_id: license_id,
            image: publicUrlData.publicUrl, // Image path from upload
        },
    ]);

if (peopleError) {
    console.error('Error inserting into people table:', peopleError);
    throw peopleError;
}

// Fetch the created person ID
const { data: personData, error: personFetchError } = await supabase
    .from('people')
    .select('id')
    .eq('license_id', license_id);

if (personFetchError || !personData?.length) {
    console.error('Error fetching person ID:', personFetchError);
    throw personFetchError;
}

const personId = personData[0].id;

// Append the person ID to the members array in the 'utility' table
// Fetch the current members array
const { data: utilityData, error: utilityUploadError } = await supabase
    .from('utility')
    .insert([{
        userId:user.id,
       members:[personId]
    }])
    

if (utilityUploadError) {
    console.error('Error fetching utility members:', utilityUploadError);
    throw utilityUploadError;
}




   
    return data;
};


