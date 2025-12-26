import React, { useEffect } from 'react';

// Affiliate IDs - Update these with your actual affiliate credentials
const AFFILIATE_IDS = {
  amazon: 'YOUR_AMAZON_TAG', // Amazon Associates tag
  ebay: 'YOUR_EBAY_CAMPAIGN_ID', // eBay Partner Network
  autozone: 'YOUR_AUTOZONE_ID',
  advanceauto: 'YOUR_ADVANCE_ID',
  carid: 'YOUR_CARID_ID',
  rockauto: 'YOUR_ROCKAUTO_ID',
  fcpeuro: 'YOUR_FCPEURO_ID',
  summitracing: 'YOUR_SUMMIT_ID'
};

// Add affiliate tracking to URLs
export function addAffiliateTracking(url, storeName) {
  if (!url) return url;
  
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    // Amazon
    if (hostname.includes('amazon.com') && AFFILIATE_IDS.amazon !== 'YOUR_AMAZON_TAG') {
      urlObj.searchParams.set('tag', AFFILIATE_IDS.amazon);
      return urlObj.toString();
    }
    
    // eBay
    if ((hostname.includes('ebay.com') || hostname.includes('ebay')) && AFFILIATE_IDS.ebay !== 'YOUR_EBAY_CAMPAIGN_ID') {
      urlObj.searchParams.set('campid', AFFILIATE_IDS.ebay);
      return urlObj.toString();
    }
    
    // AutoZone
    if (hostname.includes('autozone.com') && AFFILIATE_IDS.autozone !== 'YOUR_AUTOZONE_ID') {
      urlObj.searchParams.set('affiliateid', AFFILIATE_IDS.autozone);
      return urlObj.toString();
    }
    
    // Advance Auto Parts
    if (hostname.includes('advanceautoparts.com') && AFFILIATE_IDS.advanceauto !== 'YOUR_ADVANCE_ID') {
      urlObj.searchParams.set('affiliateid', AFFILIATE_IDS.advanceauto);
      return urlObj.toString();
    }
    
    // CARiD
    if (hostname.includes('carid.com') && AFFILIATE_IDS.carid !== 'YOUR_CARID_ID') {
      urlObj.searchParams.set('affid', AFFILIATE_IDS.carid);
      return urlObj.toString();
    }
    
    return url;
  } catch (e) {
    return url;
  }
}

// Track affiliate clicks
export function trackAffiliateClick(storeName, partName, price) {
  const click = {
    timestamp: new Date().toISOString(),
    store: storeName,
    part: partName,
    price: price
  };
  
  // Store in localStorage
  const clicks = JSON.parse(localStorage.getItem('affiliateClicks') || '[]');
  clicks.push(click);
  localStorage.setItem('affiliateClicks', JSON.stringify(clicks.slice(-100))); // Keep last 100
  
  // You can also send to backend for tracking
  // await base44.entities.AffiliateClick.create(click);
}

// Get affiliate stats
export function getAffiliateStats() {
  const clicks = JSON.parse(localStorage.getItem('affiliateClicks') || '[]');
  const stats = {
    totalClicks: clicks.length,
    byStore: {},
    totalPotentialValue: 0
  };
  
  clicks.forEach(click => {
    if (!stats.byStore[click.store]) {
      stats.byStore[click.store] = { clicks: 0, value: 0 };
    }
    stats.byStore[click.store].clicks++;
    stats.byStore[click.store].value += click.price || 0;
    stats.totalPotentialValue += click.price || 0;
  });
  
  return stats;
}