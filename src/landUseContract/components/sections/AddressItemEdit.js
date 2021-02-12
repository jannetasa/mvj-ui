// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {formValueSelector, change, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import Authorization from '$components/authorization/Authorization';
import FormField from '$components/form/FormField';
import {FieldTypes, FormNames} from '$src/enums';
import RemoveButton from '$components/form/RemoveButton';
import {getUsersPermissions} from '$src/usersPermissions/selectors';
import type {Attributes} from '$src/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';
import {
  isFieldAllowedToRead,
  isEmptyValue,
} from '$util/helpers';

type Props = {
  attributes: Attributes,
  disabled: boolean,
  field: any,
  formName: string,
  isSaveClicked: boolean,
  onRemove: Function,
  usersPermissions: UsersPermissionsType,
  change: Function,
}


class AddressItemEdit extends Component<Props> {
  
  handleAddressChange = (details: Object) => {
    const {change, field} = this.props;

    if(!isEmptyValue(details.postalCode)) {
      change(`${field}.postal_code`, details.postalCode);
    }
    if(!isEmptyValue(details.city)) {
      change(`${field}.city`, details.city);
    }
  };

  render() {
    const {  
      disabled,
      field,
      isSaveClicked,
      attributes,
      onRemove,
    } = this.props;
    return(
      <Row>
        <Authorization allow={isFieldAllowedToRead(attributes, 'addresses.child.children.address')}>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'addresses.child.children.address')}
              name={`${field}.address`}
              valueSelectedCallback={this.handleAddressChange}
              overrideValues={{
                fieldType: FieldTypes.ADDRESS,
              }}
              invisibleLabel
            />
          </Column>
        </Authorization>
        <Authorization allow={isFieldAllowedToRead(attributes, 'addresses.child.children.postal_code')}>
          <Column small={6} medium={4} large={2}> 
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'addresses.child.children.postal_code')}
              name={`${field}.postal_code`}
              invisibleLabel
            />
          </Column>
        </Authorization>
        <Authorization allow={isFieldAllowedToRead(attributes, 'addresses.child.children.city')}>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'addresses.child.children.city')}
              name={`${field}.city`}
              invisibleLabel
            />
          </Column>
        </Authorization>
        <Authorization allow={isFieldAllowedToRead(attributes, 'addresses.child.children.is_primary')}>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'addresses.child.children.is_primary')}
              name={`${field}.is_primary`}
              invisibleLabel
            />
          </Column>
        </Authorization>
        <Column large={1}>
          <Authorization allow={true}>
            {!disabled &&
              <RemoveButton
                className='third-level'
                onClick={onRemove}
                style={{height: 'unset'}}
                title='Poista päätös'
              />
            }
          </Authorization>
        </Column>
      </Row>
    );
  }
}

const formName = FormNames.PLOT_SEARCH_BASIC_INFORMATION;
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state, props) => {
      return {
        type: selector(state, `${props.field}.type`),
        usersPermissions: getUsersPermissions(state),
      };
    },
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
    change,
  }),
)(AddressItemEdit);
