const functions = require('@google-cloud/functions-framework');
const { Storage } = require('@google-cloud/storage');

// Inisialisasi Storage client
const storage = new Storage();

/**
 * Cloud Function untuk mendapatkan public URL dari Google Cloud Storage
 * 
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * 
 * Request body:
 * {
 *   "bucket": "nama-bucket",
 *   "path": "folder/file.jpg"
 * }
 */
functions.http('getPublicUrl', async (req, res) => {
  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
    return;
  }

  try {
    // Ambil parameter dari request body atau query string
    const bucket = req.body?.bucket || req.query?.bucket;
    const path = req.body?.path || req.query?.path;

    // Validasi input
    if (!bucket) {
      res.status(400).json({
        success: false,
        error: 'Parameter "bucket" diperlukan'
      });
      return;
    }

    if (!path) {
      res.status(400).json({
        success: false,
        error: 'Parameter "path" diperlukan'
      });
      return;
    }

    // Buat referensi ke file
    const file = storage.bucket(bucket).file(path);

    // Cek apakah file exists
    const [exists] = await file.exists();
    
    if (!exists) {
      res.status(404).json({
        success: false,
        error: `File tidak ditemukan: gs://${bucket}/${path}`
      });
      return;
    }

    // Generate public URL menggunakan method bawaan Storage SDK
    const publicUrl = file.publicUrl();

    // Dapatkan metadata file (opsional)
    const [metadata] = await file.getMetadata();

    // Response sukses
    res.status(200).json({
      success: true,
      data: {
        bucket: bucket,
        path: path,
        publicUrl: publicUrl,
        metadata: {
          contentType: metadata.contentType,
          size: metadata.size,
          updated: metadata.updated,
          name: metadata.name
        }
      }
    });

  } catch (error) {
    console.error('Error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Terjadi kesalahan saat mengakses storage',
      message: error.message
    });
  }
});

