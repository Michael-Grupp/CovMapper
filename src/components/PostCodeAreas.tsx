import React from "react";
import {Source, Layer} from 'react-map-gl';

export type Props = {
  postCodeAreas: any; 
  currentDataset: any;
}

export class PostCodeAreas extends React.Component<Props> { // TODO: use geojson type
  mergedGeoJSON = null;
  // TODO: GUI to choose which key should be displayed (from currentDataset.types)
  dataField = 'coughs';
  postCodeAreas = null;
  currentDataset = null;

  shouldComponentUpdate({ postCodeAreas, currentDataset }) {
    if (postCodeAreas !== this.postCodeAreas || currentDataset !== this.currentDataset) {
      this.postCodeAreas = postCodeAreas;
      this.currentDataset = currentDataset;
      this.mergeDataWithGeoFeatures({ postCodeAreas, currentDataset });
      console.log('UPDATIGN')
      return true;
    }
    return false;
  }

  mergeDataWithGeoFeatures({ postCodeAreas, currentDataset }) {
    if (!postCodeAreas || !currentDataset) {
      return;
    }

    this.mergedGeoJSON = Object.assign({}, postCodeAreas, {
      features: postCodeAreas.features.map(feature => ({
        ...feature,
        properties: {
          ...feature.properties,
          ...currentDataset.data[feature.properties.PLZ99]
        }
      }))
    })
  }

  render() {
    if (!this.mergedGeoJSON) {
      return null;
    }

    return (
      <Source id="postCodeAreas" type="geojson" data={this.mergedGeoJSON}>
        <Layer
          id="data"
          type="fill"
          paint={{
            'fill-color': {
              property: this.dataField,
              stops: [
                [0, '#FFEDA0'],
                [10, '#FED976'],
                [20, '#FEB24C'],
                [30, '#FD8D3C'],
                [40, '#FC4E2A'],
                [50, '#E31A1C'],
                [60, '#BD0026'],
                [70, '#800026'],
              ]
            },
            'fill-opacity': 0.8
          }} />
      </Source>
    )
  }
}