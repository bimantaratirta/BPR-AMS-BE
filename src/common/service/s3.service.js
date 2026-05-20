import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import s3Config from '../../config/s3.config.js';
import BaseError from '../../base_classes/base-error.js';

class S3Service {
  constructor() {
    this.config = s3Config();

    const accessKeyId = this.config.IS3_ACCESS_KEY_ID;
    const secretAccessKey = this.config.IS3_SECRET_ACCESS_KEY_ID;
    const region = this.config.IS3_REGION || 'id-jakarta-1';
    this.bucket = this.config.IS3_BUCKET_NAME;
    this.endpoint = this.config.IS3_END_POINT;

    this.s3 = new S3Client({
      region,
      endpoint: this.endpoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async uploadFile(file, folder = 'uploads') {
    const ext = extname(file.originalname);
    const key = `${folder}/${randomUUID()}${ext}`;

    const params = {
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ContentLength: file.buffer.length,
      ACL: 'public-read',
    };

    try {
      await this.s3.send(new PutObjectCommand(params));
      return `/${key}`;
    } catch (err) {
      console.error('❌ Failed to upload to S3:', err);

      if (err?.$response?.body) {
        let rawBody = '';
        try {
          for await (const chunk of err.$response.body) {
            rawBody += chunk;
          }
          console.error('Raw S3 Response:', rawBody);
        } catch (streamErr) {
          console.error('Error reading raw response body:', streamErr);
        }
      }

      throw BaseError.badGateway('S3', 'Failed to upload to S3');
    }
  }

  async getSignedUrl(key, { expiresIn = 600 } = {}) {
    const normalizedKey = key.startsWith('/') ? key.slice(1) : key;
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: normalizedKey,
    });

    try {
      return await getSignedUrl(this.s3, command, { expiresIn });
    } catch (err) {
      console.error('❌ Failed to generate signed URL:', err);
      throw BaseError.badGateway('S3', 'Failed to generate signed URL');
    }
  }
}

export default S3Service;
