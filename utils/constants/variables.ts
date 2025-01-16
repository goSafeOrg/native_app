export const monthMapper: { [key: string]: string } = {
    'JAN': '01',
    'FEB': '02',
    'MAR': '03',
    'APR': '04',
    'MAY': '05',
    'JUN': '06',
    'JUL': '07',
    'AUG': '08',
    'SEP': '09',
    'OCT': '10',
    'NOV': '11',
    'DEC': '12',
  };

  export const ReverseMonthMapper: { [key: string]: string } = {
    '01': 'JAN',
    '02': 'FEB',
    '03': 'MARCH',
    '04': 'APRIL',
    '05': 'MAY',
    '06': 'JUNE',
    '07': 'JULY',
    '08': 'AUG',
    '09': 'SEPT',
    '10': 'OCT',
    '11': 'NOV',
    '12': 'DEC'
};

// Function to convert an image URL to base64
export const convertImageToBase64 = async (imageUrl: string): Promise<string | null> => {
  try {
    // Fetch the image data from the provided URL
    const response = await fetch(imageUrl);
    const blob = await response.blob(); // Get the image data as a Blob

    // Use FileReader to convert Blob to Base64 string
    return new Promise<string | null>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string); // The Base64 string
      };
      reader.onerror = () => {
        reject('Error reading the Blob');
      };
      reader.readAsDataURL(blob); // Convert blob to Data URL (Base64)
    });
  } catch (error) {
    console.error('Error converting image to Base64:', error);
    return null;
  }
};

// // Example usage:
// (async () => {
//   const imageUrl = 'https://example.com/image.jpg'; // Replace with the actual image URL
//   const base64Image = await convertImageToBase64(imageUrl);
//   console.log(base64Image); // This will log the Base64-encoded image string
// })();
