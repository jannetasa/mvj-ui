// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import capitalize from 'lodash/capitalize';
import get from 'lodash/get';

import {formatDate} from '../../../../util/helpers';

type Props = {
  item: Object,
}

const PropertyUnitPlotItem = (props: Props) => {
  const {item} = props;

  const getIdentifier = () => {
    if(item.explanation === 'määräala') {
      return `${capitalize(get(item, 'explanation', ''))} ${get(item, 'municipality', '')}-${get(item, 'district', '')}-${get(item, 'group_number', '')}-${get(item, 'unit_number', '')}-M${get(item, 'unseparate_parcel_number', '')}`;
    }
    return `${capitalize(get(item, 'explanation', ''))} ${get(item, 'municipality', '')}-${get(item, 'district', '')}-${get(item, 'group_number', '')}-${get(item, 'unit_number', '')}`;
  };

  return (
    <div className='section-item'>
      <Row>
        <Column medium={12}>
          <svg className='map-icon-smaller' viewBox="0 0 30 30">
            <path d="M28.5 2.06v21.52l-.7.28-7.88 3.37-.42.22-.42-.15-8.58-3.23-7.45 3.16-1.55.71V6.42l.7-.28 7.88-3.37.42-.22.42.15 8.58 3.23L27 2.77zM9.38 5.44L3.75 7.83v16.73l5.63-2.39zm2.24-.07V22.1l6.76 2.53V7.9zm14.63.07l-5.63 2.39v16.73l5.63-2.39z"/>
          </svg>
          <p className='section-item__subtitle'>{getIdentifier()}</p>
        </Column>
      </Row>
      <Row>
        <Column medium={6}>
          <label>Osoite</label>
          <p>{`${capitalize(item.address)}, ${item.zip_code} ${item.town}`}</p>
          <label>Rekisteröintipäivä</label>
          <p>{item.registration_date ? formatDate(item.registration_date) : ''}</p>
        </Column>
        <Column medium={6}>
          <label>Kokonaisala</label>
          <p>{item.full_area}</p>
          <label>Leikkausala</label>
          <p>{item.intersection_area}</p>
        </Column>
        <Column medium={12}>
          <label>KTJ-dokumentit</label>
          <div className='multiple-textrows'>
            <p className='text-no-margin'>
              <a>Lainhuutotodistus</a> /&nbsp;
              <a>Kiinteistörekisteriote</a> /&nbsp;
              <a>Rasitustodistus</a>
            </p>
          </div>
        </Column>
      </Row>
    </div>
  );
};

export default PropertyUnitPlotItem;
