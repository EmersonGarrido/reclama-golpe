import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HttpsRedirectMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Skip HTTPS redirect in development
    if (process.env.NODE_ENV !== 'production') {
      return next();
    }

    // Check if request is already HTTPS
    const isHttps = 
      req.secure || 
      req.headers['x-forwarded-proto'] === 'https' ||
      req.protocol === 'https';

    if (!isHttps) {
      // Redirect to HTTPS
      const httpsUrl = `https://${req.headers.host}${req.url}`;
      return res.redirect(301, httpsUrl);
    }

    // Add security headers for HTTPS connections
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    
    next();
  }
}