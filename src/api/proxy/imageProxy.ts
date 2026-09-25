import { Router, Request, Response } from 'express';
import axios from 'axios';

const router = Router();

// ALLOW_LIST prevents SSRF attacks. We only proxy to known image providers.
const ALLOWED_DOMAINS = [
  'mangadex.org',
  'mangadex.network',
  'uploads.mangadex.org'
];

router.get('/image', async (req: Request, res: Response) => {
  const targetUrl = req.query.url as string;

  if (!targetUrl) {
    return res.status(400).send('URL parameter is required');
  }

  try {
    const urlObj = new URL(targetUrl);
    
    // Check SSRF
    const isAllowed = ALLOWED_DOMAINS.some(domain => urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`));
    
    if (!isAllowed) {
      return res.status(403).send('Forbidden: Host not in allowlist');
    }

    // Fetch the image as stream
    const imageRes = await axios({
      method: 'get',
      url: targetUrl,
      responseType: 'stream',
      timeout: 10000 // 10 seconds timeout
    });

    // Validate content-type
    const contentType = imageRes.headers['content-type'];
    if (!contentType || !contentType.startsWith('image/')) {
      return res.status(415).send('Unsupported Media Type: Not an image');
    }

    // Set cache headers (Cache for 1 week)
    res.setHeader('Cache-Control', 'public, max-age=604800');
    res.setHeader('Content-Type', contentType);

    // Pipe image to client
    imageRes.data.pipe(res);

  } catch (error: any) {
    if (error.code === 'ECONNABORTED') {
      return res.status(408).send('Request Timeout');
    }
    if (error.response) {
      return res.status(error.response.status).send('Upstream server error');
    }
    return res.status(500).send('Failed to fetch image');
  }
});

export default router;
