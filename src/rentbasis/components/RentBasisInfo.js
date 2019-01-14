// @flow
import React from 'react';
import {connect} from 'react-redux';

import Authorization from '$components/authorization/Authorization';
import FormTextTitle from '$components/form/FormTextTitle';
import {RentBasisFieldPaths, RentBasisFieldTitles} from '$src/rentbasis/enums';
import {isFieldAllowedToRead} from '$util/helpers';
import {getAttributes as getRentBasisAttributes} from '$src/rentbasis/selectors';

import type {Attributes} from '$src/types';

type Props = {
  identifier: ?string,
  rentBasisAttributes: Attributes,
}

const RentBasisInfo = ({identifier, rentBasisAttributes}: Props) => {
  if(!identifier) return null;

  return (
    <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisFieldPaths.ID)}>
      <div className='rent-basis-page_info'>
        <FormTextTitle>{RentBasisFieldTitles.IDENTIFIER}</FormTextTitle>
        <h1 className='rent-basis-page__info_identifier'>{identifier}</h1>
      </div>
    </Authorization>
  );
};

export default connect(
  (state) => {
    return {
      rentBasisAttributes: getRentBasisAttributes(state),
    };
  }
)(RentBasisInfo);
