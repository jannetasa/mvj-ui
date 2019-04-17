// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {formValueSelector, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import Authorization from '$components/authorization/Authorization';
import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import ExternalLink from '$components/links/ExternalLink';
import FormField from '$components/form/FormField';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import ListItem from '$components/content/ListItem';
import ListItems from '$components/content/ListItems';
import RelatedLeasesEdit from './RelatedLeasesEdit';
import SummaryLeaseInfo from './SummaryLeaseInfo';
import {receiveCollapseStates, receiveFormValidFlags} from '$src/leases/actions';
import {FormNames, Methods, ViewModes} from '$src/enums';
import {FieldTypes} from '$components/enums';
import {LeaseContractsFieldPaths, LeaseFieldTitles, LeaseFieldPaths} from '$src/leases/enums';
import {validateSummaryForm} from '$src/leases/formValidators';
import {getContentSummary} from '$src/leases/helpers';
import {getUiDataLeaseKey} from '$src/uiData/helpers';
import {
  getFieldAttributes,
  getReferenceNumberLink,
  isFieldAllowedToRead,
  isMethodAllowed,
} from '$util/helpers';
import {getRouteById, Routes} from '$src/root/routes';
import {getMethods as getInfillDevelopmentMethods} from '$src/infillDevelopment/selectors';
import {
  getAttributes,
  getCollapseStateByKey,
  getCurrentLease,
  getErrorsByFormName,
  getIsSaveClicked,
} from '$src/leases/selectors';
import {getMethods as getRentBasisMethods} from '$src/rentbasis/selectors';
import {referenceNumber} from '$components/form/validations';

import type {Attributes, Methods as MethodsType} from '$src/types';
import type {Lease} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  collapseStateBasic: boolean,
  collapseStateStatistical: boolean,
  currentLease: Lease,
  errors: ?Object,
  handleSubmit: Function,
  infillDevelopmentMethods: MethodsType,
  isSaveClicked: boolean,
  receiveCollapseStates: Function,
  receiveFormValidFlags: Function,
  rentBasisMethods: MethodsType,
  startDate: ?string,
  valid: boolean,
}

type State = {
  currentLease: Lease,
  summary: Object,
}

class SummaryEdit extends PureComponent<Props, State> {
  state = {
    currentLease: {},
    summary: {},
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.currentLease !== state.currentLease) {
      newState.currentLease = props.currentLease;
      newState.summary = getContentSummary(props.currentLease);
    }

    return !isEmpty(newState) ? newState : null;
  }

  componentDidUpdate(prevProps) {
    const {receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [formName]: this.props.valid,
      });
    }
  }

  handleCollapseToggle = (key: string, val: boolean) => {
    const {receiveCollapseStates} = this.props;

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [formName]: {
          [key]: val,
        },
      },
    });
  }

  handleBasicInfoCollapseToggle = (val: boolean) => {
    this.handleCollapseToggle('basic', val);
  }

  handleStatisticalInfoCollapseToggle = (val: boolean) => {
    this.handleCollapseToggle('statistical', val);
  }

  referenceNumberReadOnlyRenderer = (value: ?string) => {
    if(value) {
      return <FormText><ExternalLink
        className='no-margin'
        href={getReferenceNumberLink(value)}
        text={value} /></FormText>;
    } else {
      return <FormText>-</FormText>;
    }
  }

  render () {
    const {
      attributes,
      collapseStateBasic,
      collapseStateStatistical,
      errors,
      handleSubmit,
      infillDevelopmentMethods,
      isSaveClicked,
      rentBasisMethods,
    } = this.props;
    const {summary} = this.state;
    const infillDevelopmentCompensations = summary.infill_development_compensations;
    const matchingBasisOfRents = summary.matching_basis_of_rents;

    return (
      <form onSubmit={handleSubmit}>
        <h2>Yhteenveto</h2>
        <Divider />
        <Row className='summary__content-wrapper'>
          <Column small={12} medium={8} large={9}>
            <Collapse
              defaultOpen={collapseStateBasic !== undefined ? collapseStateBasic : true}
              hasErrors={isSaveClicked && !isEmpty(errors)}
              headerTitle='Perustiedot'
              onToggle={this.handleBasicInfoCollapseToggle}
            >
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.STATE)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={getFieldAttributes(attributes, LeaseFieldPaths.STATE)}
                      name='state'
                      overrideValues={{label: LeaseFieldTitles.STATE}}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.STATE)}
                    />
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.START_DATE)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={getFieldAttributes(attributes, LeaseFieldPaths.START_DATE)}
                      name='start_date'
                      overrideValues={{label: LeaseFieldTitles.START_DATE}}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.START_DATE)}
                    />
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.END_DATE)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={getFieldAttributes(attributes, LeaseFieldPaths.END_DATE)}
                      name='end_date'
                      overrideValues={{label: LeaseFieldTitles.END_DATE}}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.END_DATE)}
                    />
                  </Authorization>
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.LESSOR)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={getFieldAttributes(attributes, LeaseFieldPaths.LESSOR)}
                      name='lessor'
                      overrideValues={{
                        fieldType: FieldTypes.LESSOR,
                        label: LeaseFieldTitles.LESSOR,
                      }}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.LESSOR)}
                    />
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.PREPARER)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={getFieldAttributes(attributes, LeaseFieldPaths.PREPARER)}
                      name='preparer'
                      overrideValues={{
                        fieldType: FieldTypes.USER,
                        label: LeaseFieldTitles.PREPARER,
                      }}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.PREPARER)}
                    />
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.CLASSIFICATION)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={getFieldAttributes(attributes, LeaseFieldPaths.CLASSIFICATION)}
                      name='classification'
                      overrideValues={{label: 'Julkisuusluokka'}}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.CLASSIFICATION)}
                    />
                  </Authorization>
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.INTENDED_USE)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={getFieldAttributes(attributes, LeaseFieldPaths.INTENDED_USE)}
                      name='intended_use'
                      overrideValues={{label: LeaseFieldTitles.INTENDED_USE}}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.INTENDED_USE)}
                    />
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={8}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.INTENDED_USE_NOTE)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={getFieldAttributes(attributes, LeaseFieldPaths.INTENDED_USE_NOTE)}
                      name='intended_use_note'
                      overrideValues={{label: LeaseFieldTitles.INTENDED_USE_NOTE}}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.INTENDED_USE_NOTE)}
                    />
                  </Authorization>
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.FINANCING)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={getFieldAttributes(attributes, LeaseFieldPaths.FINANCING)}
                      name='financing'
                      overrideValues={{label: LeaseFieldTitles.FINANCING}}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.FINANCING)}
                    />
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.MANAGEMENT)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={getFieldAttributes(attributes, LeaseFieldPaths.MANAGEMENT)}
                      name='management'
                      overrideValues={{label: LeaseFieldTitles.MANAGEMENT}}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.MANAGEMENT)}
                    />
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.TRANSFERABLE)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={getFieldAttributes(attributes, LeaseFieldPaths.TRANSFERABLE)}
                      name='transferable'
                      overrideValues={{label: LeaseFieldTitles.TRANSFERABLE}}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.TRANSFERABLE)}
                    />
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.HITAS)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={getFieldAttributes(attributes, LeaseFieldPaths.HITAS)}
                      name='hitas'
                      overrideValues={{label: LeaseFieldTitles.HITAS}}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.HITAS)}
                    />
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isMethodAllowed(rentBasisMethods, Methods.GET)}>
                    <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.MATCHING_BASIS_OF_RENTS)}>
                      {LeaseFieldTitles.MATCHING_BASIS_OF_RENTS}
                    </FormTextTitle>
                    {!matchingBasisOfRents || !matchingBasisOfRents.length
                      ? <FormText>-</FormText>
                      : <ListItems>
                        {matchingBasisOfRents.map((item, index1) => {
                          return get(item, 'property_identifiers', []).map((property, index2) =>
                            <ListItem key={`${index1}_${index2}`}>
                              <ExternalLink
                                className='no-margin'
                                href={`${getRouteById(Routes.RENT_BASIS)}/${item.id}`}
                                text={property.identifier}
                              />
                            </ListItem>
                          );
                        })}
                      </ListItems>
                    }
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isMethodAllowed(infillDevelopmentMethods, Methods.GET)}>
                    <FormTextTitle
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.INFILL_DEVELOPMENT_COMPENSATIONS)}
                    >
                      {LeaseFieldTitles.INFILL_DEVELOPMENT_COMPENSATIONS}
                    </FormTextTitle>
                    {!infillDevelopmentCompensations || !infillDevelopmentCompensations.length
                      ? <FormText>-</FormText>
                      : <ListItems>
                        {infillDevelopmentCompensations.map((item) =>
                          <ListItem key={item.id}>
                            <ExternalLink
                              className='no-margin'
                              href={`${getRouteById(Routes.INFILL_DEVELOPMENTS)}/${item.id}`}
                              text={item.name || item.id}
                            />
                          </ListItem>
                        )}
                      </ListItems>
                    }
                  </Authorization>
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.NOTICE_PERIOD)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={getFieldAttributes(attributes, LeaseFieldPaths.NOTICE_PERIOD)}
                      name='notice_period'
                      overrideValues={{label: LeaseFieldTitles.NOTICE_PERIOD}}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.NOTICE_PERIOD)}
                    />
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={8}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.NOTICE_NOTE)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={getFieldAttributes(attributes, LeaseFieldPaths.NOTICE_NOTE)}
                      name='notice_note'
                      overrideValues={{label: LeaseFieldTitles.NOTICE_NOTE}}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.NOTICE_NOTE)}
                    />
                  </Authorization>
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.REFERENCE_NUMBER)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={getFieldAttributes(attributes, LeaseFieldPaths.REFERENCE_NUMBER)}
                      name='reference_number'
                      validate={referenceNumber}
                      readOnlyValueRenderer={this.referenceNumberReadOnlyRenderer}
                      overrideValues={{
                        label: LeaseFieldTitles.REFERENCE_NUMBER,
                        fieldType: FieldTypes.REFERENCE_NUMBER,
                      }}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.REFERENCE_NUMBER)}
                    />
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={8}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.NOTE)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={getFieldAttributes(attributes, LeaseFieldPaths.NOTE)}
                      name='note'
                      overrideValues={{label: LeaseFieldTitles.NOTE}}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.NOTE)}
                    />
                  </Authorization>
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.IS_SUBJECT_TO_VAT)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={getFieldAttributes(attributes, LeaseFieldPaths.IS_SUBJECT_TO_VAT)}
                      name='is_subject_to_vat'
                      overrideValues={{label: LeaseFieldTitles.IS_SUBJECT_TO_VAT}}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.IS_SUBJECT_TO_VAT)}
                    />
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.CONTRACTS)}>
                    <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.ARRANGEMENT_DECISION)}>
                      {LeaseFieldTitles.ARRANGEMENT_DECISION}
                    </FormTextTitle>
                    <FormText>{summary.arrangement_decision ? 'Kyllä' : 'Ei'}</FormText>
                  </Authorization>
                </Column>
              </Row>

              <SummaryLeaseInfo />
            </Collapse>

            <Collapse
              defaultOpen={collapseStateStatistical !== undefined ? collapseStateStatistical : true}
              headerTitle='Tilastotiedot'
              onToggle={this.handleStatisticalInfoCollapseToggle}
            >
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.SPECIAL_PROJECT)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={getFieldAttributes(attributes, LeaseFieldPaths.SPECIAL_PROJECT)}
                      name='special_project'
                      overrideValues={{label: LeaseFieldTitles.SPECIAL_PROJECT}}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.SPECIAL_PROJECT)}
                    />
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.SUPPORTIVE_HOUSING)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={getFieldAttributes(attributes, LeaseFieldPaths.SUPPORTIVE_HOUSING)}
                      name='supportive_housing'
                      overrideValues={{label: LeaseFieldTitles.SUPPORTIVE_HOUSING}}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.SUPPORTIVE_HOUSING)}
                    />
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.STATISTICAL_USE)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={getFieldAttributes(attributes, LeaseFieldPaths.STATISTICAL_USE)}
                      name='statistical_use'
                      overrideValues={{label: LeaseFieldTitles.STATISTICAL_USE}}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.STATISTICAL_USE)}
                    />
                  </Authorization>
                </Column>
              </Row>

              <Row>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.REAL_ESTATE_DEVELOPER)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={getFieldAttributes(attributes, LeaseFieldPaths.REAL_ESTATE_DEVELOPER)}
                      name='real_estate_developer'
                      overrideValues={{label: LeaseFieldTitles.REAL_ESTATE_DEVELOPER}}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.REAL_ESTATE_DEVELOPER)}
                    />
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.CONVEYANCE_NUMBER)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={getFieldAttributes(attributes, LeaseFieldPaths.CONVEYANCE_NUMBER)}
                      name='conveyance_number'
                      overrideValues={{label: LeaseFieldTitles.CONVEYANCE_NUMBER}}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.CONVEYANCE_NUMBER)}
                    />
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.BUILDING_SELLING_PRICE)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={getFieldAttributes(attributes, LeaseFieldPaths.BUILDING_SELLING_PRICE)}
                      name='building_selling_price'
                      overrideValues={{label: LeaseFieldTitles.BUILDING_SELLING_PRICE}}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.BUILDING_SELLING_PRICE)}
                    />
                  </Authorization>
                </Column>
              </Row>

              <Row>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.REGULATED)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={getFieldAttributes(attributes, LeaseFieldPaths.REGULATED)}
                      name='regulated'
                      overrideValues={{label: LeaseFieldTitles.REGULATED}}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.REGULATED)}
                    />
                  </Authorization>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.REGULATION)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={getFieldAttributes(attributes, LeaseFieldPaths.REGULATION)}
                      name='regulation'
                      overrideValues={{label: LeaseFieldTitles.REGULATION}}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.REGULATION)}
                    />
                  </Authorization>
                </Column>
              </Row>
            </Collapse>
          </Column>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.RELATED_LEASES)}>
            <Column small={12} medium={4} large={3}>
              <RelatedLeasesEdit />
            </Column>
          </Authorization>
        </Row>
      </form>
    );
  }
}

const formName = FormNames.LEASE_SUMMARY;
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
        collapseStateBasic: getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.basic`),
        collapseStateStatistical: getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.statistical`),
        currentLease: getCurrentLease(state),
        errors: getErrorsByFormName(state, formName),
        infillDevelopmentMethods: getInfillDevelopmentMethods(state),
        isSaveClicked: getIsSaveClicked(state),
        rentBasisMethods: getRentBasisMethods(state),
        startDate: selector(state, 'start_date'),
      };
    },
    {
      receiveCollapseStates,
      receiveFormValidFlags,
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
    validate: validateSummaryForm,
  }),
)(SummaryEdit);
