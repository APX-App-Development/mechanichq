# Solutions for Real Product Images

## Problem
AI cannot directly scrape retailer websites for images. `add_context_from_internet` searches web content but doesn't download images.

## Solutions (Ranked by Effectiveness)

### 1. ⭐ Unsplash API (FREE, HIGH-QUALITY)
**Best for: Magazine-quality automotive photos**

```javascript
// Set in Dashboard > Environment Variables
UNSPLASH_ACCESS_KEY=your_key_here

// Get key: https://unsplash.com/developers
// Free tier: 50 requests/hour
```

### 2. 🛒 Retailer Affiliate APIs
**Best for: Real product data with actual images**

- **Amazon Product Advertising API**
  - Real product images, prices, availability
  - Requires approval for Amazon Associates
  - Link: https://affiliate-program.amazon.com/

- **eBay Browse API**
  - Access to eBay Motors listings
  - Free tier available
  - Link: https://developer.ebay.com/

- **AutoZone API** (Contact for partner access)
- **RockAuto** (CSV catalog available)

### 3. 🔍 Google Custom Search API
**Best for: Finding product images across the web**

```javascript
// searches specifically for images
const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${query}&searchType=image`;
```

Setup: https://developers.google.com/custom-search

### 4. 📸 Pexels API (FREE Alternative to Unsplash)
High-quality automotive photos
- Link: https://www.pexels.com/api/

### 5. 🏗️ Build Product Database
**Best for: Long-term magazine-quality catalog**

Create entity: `ProductImage`
```json
{
  "part_name": "string",
  "category": "string",
  "image_urls": ["array of strings"],
  "source": "string"
}
```

Manually curate or bulk import from wholesaler catalogs.

### 6. 🤖 AI Image Generation
Generate product images with DALL-E or Midjourney
- Use base44.integrations.Core.GenerateImage()
- Good for generic parts
- Not ideal for specific branded products

## Quick Fix (No API Keys)
Use Unsplash direct URLs with better search terms:

```javascript
const getUnsplashImage = (query) => {
  const encoded = encodeURIComponent(query);
  return `https://source.unsplash.com/500x500/?${encoded},automotive,car-parts`;
};

// Usage:
image: getUnsplashImage("brake pads automotive")
```

## Recommended Approach
1. Start with Unsplash API (free, high-quality)
2. Add Amazon/eBay APIs for real products
3. Build curated database over time
4. Use AI as fallback for missing images