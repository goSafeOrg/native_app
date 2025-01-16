import { Idevice } from "@/components/TopBar/Topbar";
import { supabase } from "../utils/supabase";
import { IMember } from "@/app/(protected)/profile";
import { p1 } from "@/utils/constants/images";
import { decode } from "base64-arraybuffer";

export const getUserDevices = async (id: string): Promise<Idevice[]> => {
    const { data, error } = await supabase
      .from('Users')
      .select('device') // Select the 'device' field which contains the JSON array
      .eq('id', id);
  
    if (error) {
      console.error('Error fetching devices:', error);
      throw error;
    }
  
    // Check if we got any data
    if (!data || data.length === 0) {
      console.error('No devices found for user.');
      return [];
    }
  
    // Extract the device array from the first (and likely only) row
    const user = data[0];
    const devices = user.device as unknown as Idevice[]; // Assuming 'device' is the correct field and contains an array of objects
  
    return devices;
  };
  

  export const getUserProfile = async (id: string):Promise<IMember> => {
    const { data, error } = await supabase
      .from('Users')
      .select('name, id, phone_no, license_id, dob,image')
      .eq('id', id).single();
  
    if (error) {
      console.error('Error fetching Profile:', error);
      return(
        {id: "NotFound",
        name: "Not Found",
        phone_no: 'NaN',
        license_id: "Not Found",
        image: p1 ,
        dob:"null"
    }
    )
      
    }
    return {
        id: data.id,
        name: data.name!,
        phone_no: data.phone_no!,
        license_id: data.license_id!,
        image: data.image! ,
        dob:data.dob!
    }
      
    };
  
  
    interface Member {
        id: string; 
        name: string;
        phone_no: string;
        license_id: string;
        dob: string;
        image: string;
    }
    
    interface Utility {
        id: string; 
        members: string[];
    }
    
   export const addMember = async (
        userId: string,
        fullname: string,
        phoneNo: string,
        license_id: string,
        dob: string,
        image: string,
        fileName:string,


    ): Promise<string | void> => {
        if (!image) {
            return "Image Not Found";
        }
    
        try {


            const uniqueFileName = `profiles/${userId}/members/${fileName}`;
      
            // Upload the image to Supabase storage
            const { data, error } = await supabase.storage
              .from('user-images') // Replace with your Supabase storage bucket name
              .upload(uniqueFileName, decode(image), {contentType: 'image/jpg'});
        
            if (error) {
              console.error('Error uploading image:', error.message);
              return;
            }
        
            console.log('Image uploaded successfully:', data);
        
            // Get the public URL of the uploaded image (if needed)
            const { data: publicURL } = supabase.storage
              .from('user-images')
              .getPublicUrl(uniqueFileName);
        
           
    
            if (!publicURL) {
                throw new Error('Failed to retrieve public URL for the uploaded image');
            }
    
            // Step 3: Create an entry in the People table
            const { error: peopleError } = await supabase
            .from('people')
            .insert([
                {
                    name: fullname,
                    phone_no: phoneNo,
                    dob: dob,
                    license_id: license_id,
                    image: publicURL.publicUrl, // Image path from upload
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
            // Step 4: Fetch existing members from the Utility table
            const { data: utilityData, error: utilityError } = await supabase
                .from('utility') // Specify type for utility table
                .select('members')
                .eq('userId', userId) // Replace with the correct ID of the utility table row
                .single();
    
            if (utilityError) {
                throw new Error(`Error fetching utility table: ${utilityError.message}`);
            }
    
            // Step 5: Update the members array and save it back
            const updatedMembers = [...utilityData?.members!, personId ]; // Append the new member ID
            const { error: updateError } = await supabase
                .from('utility')
                .update({ members: updatedMembers })
                .eq('userId', userId); // Use the userId passed into the function
    
            if (updateError) {
                throw new Error(`Error updating utility table: ${updateError.message}`);
            }
    
            // Optionally return a success message
            return "Member added successfully!";
    
        } catch (error) {
            console.error(error);
       
        }
    };



    
    

    // Function to get members from utility and people tables
    export const getMembers = async (userId: string) => {
        try {
            // Step 1: Fetch the member IDs from the 'utility' table
            const { data: utilityData, error: utilityError } = await supabase
                .from('utility')
                .select('members')
                .eq('userId', userId)
                .single(); // Assuming only one row per userId in the utility table
        
            if (utilityError) {
                throw new Error(`Error fetching from utility table: ${utilityError.message}`);
            }
        
            if (!utilityData || !utilityData.members || utilityData.members.length === 0) {
                return []; // Return an empty array if no members are found in the utility table
            }
        
            // Extract the list of member IDs from utilityData.members
            const memberIds = utilityData.members;
        
            // Step 2: Fetch member details from the 'people' table using the member IDs
            const { data: peopleData, error: peopleError } = await supabase
                .from('people')
                .select('*') // Fetch all member details
                .in('id', memberIds); // 'id' is the column in 'people' table that corresponds to the member IDs
        
            if (peopleError) {
                throw new Error(`Error fetching from people table: ${peopleError.message}`);
            }
        
            // Return the fetched member details
            return peopleData;
        } catch (error) {
            console.error('Error in getMembers function:', error);
            return null;
        }
    };
    



    export const uploadImageToSupabase = async (base64: string, fileName: string, mimeType: any) => {
        try {
          // Fetch the image as a blob from the URI
          
         
      
          // Generate a unique file path for the image in Supabase storage
          const uniqueFileName = `test/${Date.now()}_${fileName}`;
      
          // Upload the image to Supabase storage
          const { data, error } = await supabase.storage
            .from('user-images') // Replace with your Supabase storage bucket name
            .upload(uniqueFileName, decode(base64), {contentType: 'image/jpg'});
      
          if (error) {
            console.error('Error uploading image:', error.message);
            return;
          }
      
          console.log('Image uploaded successfully:', data);
      
          // Get the public URL of the uploaded image (if needed)
          const { data: publicUrlData } = supabase.storage
            .from('user-images')
            .getPublicUrl(uniqueFileName);
      
         
      
          console.log('Public URL:', publicUrlData.publicUrl);
          return publicUrlData.publicUrl; // Return the public URL if needed
      
        } catch (error) {
          console.error('Error during image upload:', error);
        }
      };
      



// Function to upload document and save its link to Supabase
export const uploadDocument = async (userId: string, document: any, documentName: string, type:string) => {
    try {
      

        // Upload document to Supabase storage
        const { data, error } = await supabase.storage
            .from('user-images')
            .upload(`profiles/${userId}/documents/${documentName}`, decode(document),{contentType: type});

        if (error) {
            console.error('Document upload failed:', error);
            return;
        }

        const documentUrl = supabase.storage.from('user-images').getPublicUrl(`profiles/${userId}/documents/${documentName}`).data.publicUrl;

        // Insert document link into the utility table
        const { data: user, error: fetchError } = await supabase
        .from('utility')
        .select('documents')
        .eq('userId', userId)
        .single();

    if (fetchError) {
        console.error('Error fetching documents:', fetchError);
        return;
    }

    // If no documents field, initialize an empty array
    const currentDocuments = user?.documents || [];

    // Step 2: Append the new document to the array
    const updatedDocuments = [
        ...currentDocuments,
        { name: documentName, url: documentUrl ,type:type},
    ];

    // Step 3: Update the record with the new documents array
    const { error: updateError } = await supabase
        .from('utility')
        .update({ documents: updatedDocuments })
        .eq('userId', userId);

    if (updateError) {
        console.error('Error updating documents:', updateError);
        return;
    }

    console.log('Document added successfully.');
    } catch (error) {
        console.error('Error during document upload:', error);
    }
};

// Function to fetch documents
export const fetchUserDocuments = async (userId: string) => {
    try {
        const { data, error } = await supabase
            .from('utility')
            .select('documents')
            .eq('userId', userId);

        if (error) {
            console.error('Error fetching documents:', error);
            return [];
        }

        return data.length ? data[0].documents : [];
    } catch (error) {
        console.error('Error fetching documents:', error);
        return [];
    }
};
