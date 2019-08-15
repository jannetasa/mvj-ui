// @flow
import get from 'lodash/get';

import {getCoordinatesOfGeometry} from '$util/map';

import type {AreaNote} from './types';

/**
 * Convert area note list to geojson
 * @param {Object[]} areaNotes
 * @returns {Object}
 */
export const convertAreaNoteListToGeoJson = (areaNotes: Array<Object>): Object => {
  const features: Array<Object> = areaNotes.map((areaNote) => ({
    type: 'Feature',
    geometry: areaNote.geometry,
    properties: {
      id: areaNote.id,
      modified_at: areaNote.modified_at,
      note: areaNote.note,
      user: areaNote.user,
    },
  }));

  return {
    type: 'FeatureCollection',
    features: features,
  };
};

/**
 * Convert single feature to feature collection
 * @param {Object} feature
 * @returns {Object}
 */
export const convertFeatureToFeatureCollection = (feature: Object): Object => {
  const polygons = get(feature, 'geometry.coordinates', []);

  return {
    type: 'FeatureCollection',
    features: polygons.map((polygon) => ({
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: polygon,
      },
    })),
    properties: feature.properties,
  };
};

/**
 * Convert feature collection to a single feature
 * @param {Object[]} polygons
 * @returns {Object}
 */
export const convertFeatureCollectionToFeature = (polygons: Array<Object>): Object => {
  const coordinates: Array<Object> = polygons.map((polygon: Object) => get(polygon.geometry, 'coordinates'));

  return {
    geometry: {
      coordinates: coordinates,
      type: 'MultiPolygon',
    },
  };
};

/**
 * Find area note by id
 * @param {Object[]} araNotes
 * @param {number} id
 * @returns {Object}
 */
export const getAreaNoteById =(areaNotes: Array<AreaNote>, id: ?number) => 
  id 
    ? areaNotes.find((areaNote) => areaNote.id === id) 
    : null;

/**
 * Get coordinates of area note
 * @param {Object} areaNote
 * @returns {Object[]}
 */
export const getAreaNoteCoordinates = (areaNote: ?AreaNote): Array<Object> => 
  areaNote 
    ? getCoordinatesOfGeometry(areaNote.geometry) 
    : [];
