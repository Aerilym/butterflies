import { MarkerProps } from 'react-simple-maps';
import Map from '../components/godview/Map';

const markers: MarkerProps[] = [{ coordinates: [144.9669, -37.8159] }];

export default function GodView() {
  return (
    <div className="top-container">
      <div className="content">
        <Map markers={markers} />
      </div>
    </div>
  );
}
