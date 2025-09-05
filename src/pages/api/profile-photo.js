import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dxaommd67',
  api_key: process.env.CLOUDINARY_API_KEY || '784829818659687',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'tVPYBK2wgfG5Mw4COIyMBvGd_i',
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const form = formidable({
      maxFileSize: 5 * 1024 * 1024, // 5MB
      filter: ({ mimetype }) => {
        return mimetype && mimetype.includes("image");
      },
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    if (!files.avatar) {
      return res.status(400).json({ error: "No avatar file uploaded" });
    }

    const file = files.avatar;
    
    // Upload file to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'profile-pictures',
          resource_type: 'image',
          transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' },
            { quality: 'auto', fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      // Read file and upload to Cloudinary
      const fs = require('fs');
      const fileStream = fs.createReadStream(file.filepath);
      fileStream.pipe(uploadStream);
    });

    return res.status(200).json({ 
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      message: "Profile photo uploaded successfully"
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: "Server error during upload" });
  }
}
