import React, {Component} from 'react';
import {FeatureGroup, Polygon, ScaleControl, Tooltip} from 'react-leaflet';
import {EditControl} from 'react-leaflet-draw';
import MapContainer from '../../../components/map/Map';
import {defaultCoordinates, defaultZoom} from '../../../constants';

import '../../../../node_modules/leaflet-draw/dist/leaflet.draw.css';

import {localizeMap} from '../../../util/helpers';

localizeMap();

type Props = {
  areas: Array<Object>,
}

class Map extends Component {
  props: Props

  handleAreaClick = () => {
    console.log('polygon clicked!');
  };

  render() {
    return (
      <div className='map'>
        <MapContainer center={defaultCoordinates}
          zoom={defaultZoom}
        >

          <FeatureGroup>
            <EditControl
              position='topright'
              draw={{
                circlemarker: false,
                marker: false,
                polyline: false,
              }}
            />
          </FeatureGroup>
          <Polygon
            color="#009246" // tram green
            positions={[
              [60.19, 24.924],
              [60.19, 24.926],
              [60.194, 24.929],
              [60.196, 24.924],
            ]}
            onClick={() => this.handleAreaClick()}
          >
            <Tooltip sticky="true">
              <span>teksti tähän!</span>
            </Tooltip>
          </Polygon>
          <ScaleControl imperial={false} />
        </MapContainer>
      </div>
    );
  }
}

export default Map;
