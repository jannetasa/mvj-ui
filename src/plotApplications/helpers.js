import get from 'lodash/get';

import {
  getApiResponseResults,
} from '$util/helpers';

import type {LeafletFeature, LeafletGeoJson} from '$src/types';

/** 
 * Get plotApplication list results
 * @param {Object} plotApplication
 * @return {Object[]}
 */
export const getContentPlotApplicationsListResults = (content: Object): Array<Object> =>
  getApiResponseResults(content).map((plotApplication) => getContentApplicationListItem(plotApplication));

/** 
 * Get plotApplication list item
 * @param {Object} application
 * @return {Object}
 */
export const getContentApplicationListItem = (plotApplication: Object): Object => {
  return {
    id: plotApplication.id,
    plot_search: plotApplication.plot_search,
    applicant: plotApplication.applicant,
    plot_search_type: plotApplication.plot_search_type,
    plot_search_subtype: plotApplication.plot_search_subtype,
    target_identifier: plotApplication.targets.map(target => target.identifier),
    target_address: plotApplication.targets.map(target => target.address.address),
    target_reserved: plotApplication.targets.map(target => target.reserved),
  };
};

/**
 * Get application target features for geojson data
 * @param {Object[]} targets
 * @returns {Object[]}
 */
export const getApplicationTargetFeatures = (targets: Array<Object>): Array<LeafletFeature> => {
  return targets.map((target) => {
    const coordinates = [];
    const areas = get(target, 'targets', []);

    areas.forEach((area) => {
      const coords = get(area, 'geometry.coordinates', []);

      if(coords.length) {
        coordinates.push(coords[0]);
      }
    });

    return {
      type: 'Feature',
      geometry: {
        coordinates: coordinates,
        type: 'MultiPolygon',
      },
      properties: {
        id: target.id,
        feature_type: 'plotApplication',
        identifier: target.targets[0].identifier,
        state: get(target, 'state.id') || target.state,
      },
    };
  });
};

/**
 * Get application target geojson data
 * @param {Object[]} leases
 * @returns {Object}
 */
export const getApplicationTargetGeoJson = (targets: Array<Object>): LeafletGeoJson => {
  const features = getApplicationTargetFeatures(targets);

  return {
    type: 'FeatureCollection',
    features: features,
  };
};
