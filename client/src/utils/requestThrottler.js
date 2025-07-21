// Request throttling and caching utility to prevent API rate limiting
class RequestThrottler {
  constructor() {
    this.cache = new Map();
    this.requestTimes = new Map();
    this.CACHE_DURATION = 30000; // 30 seconds cache
    this.MIN_REQUEST_INTERVAL = 1000; // 1 second between same requests
    this.MAX_CONCURRENT_REQUESTS = 3; // Max concurrent requests
    this.pendingRequests = new Set();
  }

  // Generate cache key from URL and headers
  getCacheKey(url, options = {}) {
    const auth = options.headers?.Authorization || '';
    return `${url}_${auth}`;
  }

  // Check if we can make the request (not too frequent)
  canMakeRequest(key) {
    const lastRequestTime = this.requestTimes.get(key);
    if (!lastRequestTime) return true;
    
    const timeSinceLastRequest = Date.now() - lastRequestTime;
    return timeSinceLastRequest >= this.MIN_REQUEST_INTERVAL;
  }

  // Get cached response if valid
  getCachedResponse(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    const isExpired = Date.now() - cached.timestamp > this.CACHE_DURATION;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  // Cache response
  setCachedResponse(key, data) {
    this.cache.set(key, {
      data: JSON.parse(JSON.stringify(data)), // Deep clone to prevent mutations
      timestamp: Date.now()
    });
  }

  // Throttled fetch with caching and rate limiting
  async throttledFetch(url, options = {}) {
    const key = this.getCacheKey(url, options);
    
    // Return cached response if available
    const cachedResponse = this.getCachedResponse(key);
    if (cachedResponse) {
      console.log(`🚀 Cache hit for: ${url}`);
      return cachedResponse;
    }

    // Check if too many concurrent requests
    if (this.pendingRequests.size >= this.MAX_CONCURRENT_REQUESTS) {
      console.warn(`⚠️ Too many concurrent requests, delaying: ${url}`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Check rate limiting
    if (!this.canMakeRequest(key)) {
      const waitTime = this.MIN_REQUEST_INTERVAL - (Date.now() - this.requestTimes.get(key));
      console.log(`⏱️ Rate limiting: waiting ${waitTime}ms for ${url}`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    // Track request
    this.requestTimes.set(key, Date.now());
    this.pendingRequests.add(key);

    try {
      console.log(`📡 Making request to: ${url}`);
      const response = await fetch(url, options);
      
      // Handle rate limiting response
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After') || '5';
        const waitTime = parseInt(retryAfter) * 1000;
        console.warn(`🚫 Rate limited! Waiting ${waitTime}ms before retry...`);
        
        await new Promise(resolve => setTimeout(resolve, waitTime));
        // Retry once after waiting
        return this.throttledFetch(url, options);
      }

      // Check content type
      const contentType = response.headers.get("content-type");
      if (!response.ok || !contentType?.includes("application/json")) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text}`);
      }

      const data = await response.json();
      
      // Cache successful response
      if (response.ok) {
        this.setCachedResponse(key, data);
      }
      
      return data;
    } catch (error) {
      console.error(`❌ Request failed for ${url}:`, error.message);
      throw error;
    } finally {
      this.pendingRequests.delete(key);
    }
  }

  // Clear cache for specific key or all
  clearCache(key = null) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  // Get cache statistics
  getCacheStats() {
    return {
      cacheSize: this.cache.size,
      pendingRequests: this.pendingRequests.size,
      cachedKeys: Array.from(this.cache.keys())
    };
  }
}

// Export singleton instance
export const requestThrottler = new RequestThrottler();

// Utility function for easy use
export async function throttledApiCall(url, options = {}) {
  return requestThrottler.throttledFetch(url, options);
}

export default requestThrottler;
