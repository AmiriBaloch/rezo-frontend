import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
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

    const photoFiles = Array.isArray(files.photos) ? files.photos : [files.photos];
    
    if (!photoFiles || photoFiles.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    // Upload files to Cloudinary
    const uploadPromises = photoFiles.map(async (file) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'property-photos',
            resource_type: 'image',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        
        // Read file and upload to Cloudinary
        const fs = require('fs');
        const fileStream = fs.createReadStream(file.filepath);
        fileStream.pipe(uploadStream);
      });
    });

    const urls = await Promise.all(uploadPromises);
    return res.status(200).json({ urls });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: "Server error during upload" });
  }
}
