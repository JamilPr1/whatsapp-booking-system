const { Client } = require('@googlemaps/google-maps-services-js');
const axios = require('axios');

class MapsService {
  constructor() {
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY;
    this.client = new Client({});
  }

  async reverseGeocode(latitude, longitude) {
    try {
      if (!this.apiKey) {
        throw new Error('Google Maps API key is not configured');
      }

      const response = await axios.get(
        'https://maps.googleapis.com/maps/api/geocode/json',
        {
          params: {
            latlng: `${latitude},${longitude}`,
            key: this.apiKey,
            language: 'en'
          }
        }
      );

      if (response.data.status !== 'OK') {
        throw new Error(`Geocoding failed: ${response.data.status}`);
      }

      const result = response.data.results[0];
      const address = result.formatted_address;
      
      // Extract district from address components
      const district = this.extractDistrict(result.address_components);

      return {
        address,
        district,
        components: result.address_components,
        location: {
          lat: latitude,
          lng: longitude
        }
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      throw error;
    }
  }

  extractDistrict(addressComponents) {
    // Try to find district from various address components
    // This may need adjustment based on your location's address structure
    const districtTypes = [
      'sublocality_level_1',
      'sublocality',
      'administrative_area_level_3',
      'neighborhood'
    ];

    for (const component of addressComponents) {
      for (const type of districtTypes) {
        if (component.types.includes(type)) {
          return component.long_name;
        }
      }
    }

    // Fallback to city or area
    for (const component of addressComponents) {
      if (component.types.includes('locality')) {
        return component.long_name;
      }
    }

    return 'Unknown District';
  }

  async getRoute(origin, destination, waypoints = []) {
    try {
      const response = await axios.get(
        'https://maps.googleapis.com/maps/api/directions/json',
        {
          params: {
            origin: `${origin.lat},${origin.lng}`,
            destination: `${destination.lat},${destination.lng}`,
            waypoints: waypoints.map(wp => `${wp.lat},${wp.lng}`).join('|'),
            key: this.apiKey,
            optimize: waypoints.length > 0 ? true : false
          }
        }
      );

      if (response.data.status !== 'OK') {
        throw new Error(`Directions failed: ${response.data.status}`);
      }

      return {
        route: response.data.routes[0],
        distance: response.data.routes[0].legs.reduce((sum, leg) => sum + leg.distance.value, 0),
        duration: response.data.routes[0].legs.reduce((sum, leg) => sum + leg.duration.value, 0)
      };
    } catch (error) {
      console.error('Route calculation error:', error);
      throw error;
    }
  }

  generateRouteLink(waypoints) {
    // Generate Google Maps route link for driver
    const baseUrl = 'https://www.google.com/maps/dir/';
    const points = waypoints.map(wp => `${wp.lat},${wp.lng}`).join('/');
    return `${baseUrl}${points}`;
  }
}

const mapsService = new MapsService();

module.exports = mapsService;
