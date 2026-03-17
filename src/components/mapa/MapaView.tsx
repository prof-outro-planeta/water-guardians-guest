import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

/** Centro aproximado de Goiás (lat, lng) */
const GOIAS_CENTER: [number, number] = [-15.98, -49.86];
const DEFAULT_ZOOM = 7;

interface MapaViewProps {
  center?: [number, number];
  zoom?: number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const MapaView = ({
  center = GOIAS_CENTER,
  zoom = DEFAULT_ZOOM,
  className = '',
  style,
  children,
}: MapaViewProps) => {
  return (
    <div
      className={`rounded-lg overflow-hidden border border-white/20 ${className}`}
      style={{ minHeight: '400px', ...style }}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full"
        style={{ height: '100%', minHeight: '300px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {children}
      </MapContainer>
    </div>
  );
};

export default MapaView;
export { GOIAS_CENTER };
