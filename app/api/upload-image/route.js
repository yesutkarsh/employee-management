import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Configure Cloudinary with credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Helper function to upload to Cloudinary
function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'employee-profiles',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    
    Readable.from(buffer).pipe(uploadStream);
  });
}

export async function POST(request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    console.log('Content-Type:', contentType); // Debug log
    
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { message: 'Content type must be multipart/form-data' },
        { status: 400 }
      );
    }
    
    // Get form data
    const formData = await request.formData();
    const file = formData.get('file');
    
    console.log('File received:', file ? 'Yes' : 'No'); // Debug log
    console.log('File type:', file?.type); // Debug log
    console.log('File size:', file?.size); // Debug log
    
    if (!file) {
      return NextResponse.json(
        { message: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Add file validation
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: 'Invalid file type. Only JPEG, PNG and WebP are allowed' },
        { status: 400 }
      );
    }
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Upload to Cloudinary
    const result = await uploadToCloudinary(buffer);
    
    // Return the URL and other relevant data
    return NextResponse.json({
      secure_url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      success: true
    });
    
  } catch (error) {
    console.error('Detailed error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // More specific error messages
    if (error.message.includes('rate limit')) {
      return NextResponse.json(
        { message: 'Upload rate limit exceeded', error: error.message },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      { 
        message: 'Error uploading image', 
        error: error.message,
        details: error.stack // Adding stack trace to response
      },
      { status: error.http_code || 500 }
    );
  }
}