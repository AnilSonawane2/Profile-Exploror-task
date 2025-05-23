import { useEffect, useRef } from 'react';
import { MapPin, User, X } from 'lucide-react';

const MapComponent = ({ profile, onClose }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    const loadLeaflet = () => {
      if (window.L) {
        initializeMap();
        return;
      }

      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      cssLink.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      cssLink.crossOrigin = '';
      document.head.appendChild(cssLink);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = '';
      script.onload = () => {
        setTimeout(initializeMap, 100);
      };
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (mapRef.current && window.L && !mapInstanceRef.current) {
        try {
          mapRef.current.innerHTML = '';
          mapInstanceRef.current = window.L.map(mapRef.current, {
            center: [profile.coordinates.lat, profile.coordinates.lng],
            zoom: 15,
            zoomControl: true,
            scrollWheelZoom: true,
            dragging: true,
            touchZoom: true,
            doubleClickZoom: true,
            boxZoom: true,
            keyboard: true,
            attributionControl: true
          });

          const tileLayer = window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
            subdomains: ['a', 'b', 'c']
          });

          tileLayer.on('tileerror', function(error) {
            console.log('Tile loading error, trying alternative source:', error);
            const altTileLayer = window.L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
              maxZoom: 19,
              subdomains: ['a', 'b', 'c']
            });
            mapInstanceRef.current.removeLayer(tileLayer);
            altTileLayer.addTo(mapInstanceRef.current);
          });

          tileLayer.addTo(mapInstanceRef.current);

          const marker = window.L.marker([profile.coordinates.lat, profile.coordinates.lng], {
            title: profile.name
          }).addTo(mapInstanceRef.current);

          const popupContent = `
            <div style="text-align: center; min-width: 200px; font-family: system-ui, -apple-system, sans-serif;">
              <div style="margin-bottom: 8px;">
                <div style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #8b5cf6); margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                  <span style="color: white; font-size: 20px;">👤</span>
                </div>
              </div>
              <h3 style="margin: 8px 0 4px 0; font-size: 16px; font-weight: bold; color: #1f2937;">${profile.name}</h3>
              <p style="margin: 4px 0; font-size: 12px; color: #6b7280; line-height: 1.4;">${profile.description}</p>
              <p style="margin: 8px 0 4px 0; font-size: 11px; color: #374151; font-weight: 500;">📍 ${profile.address}</p>
            </div>
          `;

          marker.bindPopup(popupContent, {
            maxWidth: 280,
            className: 'custom-popup',
            closeButton: true,
            autoClose: false
          }).openPopup();

          setTimeout(() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.invalidateSize();
              mapInstanceRef.current.setView([profile.coordinates.lat, profile.coordinates.lng], 15);
            }
          }, 200);

        } catch (error) {
          console.error('Error initializing map:', error);
          if (mapRef.current) {
            mapRef.current.innerHTML = `
              <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background: #f3f4f6; border-radius: 8px;">
                <div style="text-align: center; padding: 20px;">
                  <div style="font-size: 48px; margin-bottom: 16px;">🗺️</div>
                  <h3 style="margin: 0 0 8px 0; color: #374151;">${profile.name}</h3>
                  <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">${profile.address}</p>
                  <p style="margin: 0; color: #9ca3af; font-size: 12px;">Map loading issue - Location: ${profile.coordinates.lat}, ${profile.coordinates.lng}</p>
                </div>
              </div>
            `;
          }
        }
      }
    };

    loadLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [profile]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Location Summary - {profile.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="rounded-lg h-96 mb-4 overflow-hidden border-2 border-gray-200 bg-gray-50">
            <div 
              ref={mapRef} 
              className="w-full h-full"
              style={{ 
                minHeight: '384px',
                background: '#f9fafb',
                position: 'relative'
              }}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile Summary
              </h4>
              <p className="text-gray-700">{profile.description}</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location Details
              </h4>
              <p className="text-gray-700 text-sm mb-1">
                <strong>Address:</strong> {profile.address}
              </p>
              <p className="text-gray-600 text-sm">
                <strong>Coordinates:</strong> {profile.coordinates.lat}, {profile.coordinates.lng}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;