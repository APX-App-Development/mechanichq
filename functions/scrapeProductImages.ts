import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

// This function demonstrates web scraping for product images
// NOTE: Most retailers block scraping - use their APIs or affiliate programs instead

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { partName, category } = await req.json();

    // Use Unsplash API for high-quality automotive images
    const unsplashAccessKey = Deno.env.get('UNSPLASH_ACCESS_KEY');
    
    if (!unsplashAccessKey) {
      // Fallback: Use AI to generate realistic image searches
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Find 5 high-quality product image URLs for: ${partName} (${category})
        
Search Unsplash, manufacturer websites, and automotive retailers.
Return real, accessible image URLs only.`,
        response_json_schema: {
          type: "object",
          properties: {
            images: {
              type: "array",
              items: { type: "string" }
            }
          }
        },
        add_context_from_internet: true
      });
      
      return Response.json({ 
        images: response.images || [],
        source: 'ai_search'
      });
    }

    // If Unsplash API key is available
    const searchQuery = `${partName} ${category} automotive`.replace(/\s+/g, '+');
    const unsplashResponse = await fetch(
      `https://api.unsplash.com/search/photos?query=${searchQuery}&per_page=5&orientation=squarish`,
      {
        headers: {
          'Authorization': `Client-ID ${unsplashAccessKey}`
        }
      }
    );

    const data = await unsplashResponse.json();
    const images = data.results?.map(img => img.urls.regular) || [];

    return Response.json({ 
      images,
      source: 'unsplash_api'
    });

  } catch (error) {
    return Response.json({ 
      error: error.message,
      images: []
    }, { status: 500 });
  }
});