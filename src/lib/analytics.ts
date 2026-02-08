import { createClient } from '@/lib/supabase/client';

export async function trackEvent(eventName: string, metadata: Record<string, any> = {}) {
  try {
    // Fire and forget - don't await this in the UI thread
    const supabase = createClient();
    
    // We use a simple fetch to a lightweight API route to avoid loading large Supabase libs if not needed,
    // but direct insert is fine too since we already have the client.
    // To protect against spam, we'll let RLS handle it, or use the API route for IP hashing.
    
    // For MVP: Direct insert (Client-side)
    // Note: In a real high-load app, send to an API route /api/analytics
    
    await supabase.from('analytics_events').insert({
      event_name: eventName,
      path: window.location.pathname,
      metadata,
      // user_id will be automatically attached by Supabase if auth is present
      // created_at is automatic
    });

  } catch (e) {
    // Silently fail analytics errors so they don't break the app
    console.error('Analytics error:', e);
  }
}
