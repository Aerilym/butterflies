import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from 'react-simple-maps';
import type { MarkerProps } from 'react-simple-maps';

interface Props {
  markers: MarkerProps[];
}

//const geoUrl ='https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_0_countries.geojson';

const geoUrl =
  'https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries-sans-antarctica.json';

export default function Map({ markers }: Props) {
  return (
    <ComposableMap projection="geoMercator">
      <ZoomableGroup center={[144, -30]} zoom={5}>
        <Geographies geography={geoUrl} fill="#f9f9f9f9" stroke="#000000">
          {({ geographies }) =>
            geographies.map((geo) => <Geography key={geo.rsmKey} geography={geo} />)
          }
        </Geographies>
        {markers && markers.length > 0
          ? markers.map((marker, i) => (
              <Marker key={i} coordinates={marker.coordinates}>
                <circle r={1} fill="#FF5533" />
              </Marker>
            ))
          : null}
      </ZoomableGroup>
    </ComposableMap>
  );
}
