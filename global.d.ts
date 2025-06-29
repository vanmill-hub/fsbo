// global.d.ts
export {}; // Ensure this file is treated as a module if other global types are added elsewhere.

declare global {
  interface Window {
    // Google Maps API related objects
    google?: {
      maps?: {
        // Basic types for objects used in MapPreview.tsx and mapsLoader.ts
        // For a more robust setup, you might install @types/google.maps
        // and use more specific types, but 'any' suffices for dynamic loading checks.
        Map: any; // Typically: typeof google.maps.Map
        Geocoder: any; // Typically: typeof google.maps.Geocoder
        Marker: any; // Typically: typeof google.maps.Marker
        GeocoderStatus: {
            OK: string; // Add other statuses if needed
        };
        // You can add more specific types here as needed, e.g.
        // LatLng: any;
        // MapOptions: any;
        // MarkerOptions: any;
        // GeocoderResult: any;
        // etc.
      };
    };

    // Custom properties used in mapsLoader.ts
    initMapCallback?: () => void;
    googleMapsApiInitialized?: boolean;
    googleMapsApiLoading?: boolean;
  }
}
