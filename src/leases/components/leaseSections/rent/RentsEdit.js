// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {Field, FieldArray, formValueSelector, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import type {Element} from 'react';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButton from '$components/form/AddButton';
import Authorization from '$components/authorization/Authorization';
import BasisOfRentsEdit from './BasisOfRentsEdit';
import Button from '$components/button/Button';
import Divider from '$components/content/Divider';
import FormText from '$components/form/FormText';
import GreenBox from '$components/content/GreenBox';
import RentCalculator from '$components/rent-calculator/RentCalculator';
import RentItemEdit from './RentItemEdit';
import SuccessField from '$components/form/SuccessField';
import Title from '$components/content/Title';
import WarningContainer from '$components/content/WarningContainer';
import WarningField from '$components/form/WarningField';
import {receiveFormValidFlags, setRentInfoComplete, setRentInfoUncomplete} from '$src/leases/actions';
import {ConfirmationModalTexts, FormNames} from '$src/enums';
import {ButtonColors, RentCalculatorFieldPaths, RentCalculatorFieldTitles} from '$components/enums';
import {
  LeaseBasisOfRentsFieldPaths,
  LeaseBasisOfRentsFieldTitles,
  LeaseRentsFieldPaths,
  LeaseRentsFieldTitles,
} from '$src/leases/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {validateRentForm, warnRentForm} from '$src/leases/formValidators';
import {getContentRents} from '$src/leases/helpers';
import {getUiDataLeaseKey, getUiDataRentCalculatorKey} from '$src/uiData/helpers';
import {hasPermissions, isArchived, isFieldAllowedToRead} from '$util/helpers';
import {
  getAttributes as getLeaseAttributes,
  getCurrentLease,
  getErrorsByFormName,
  getIsSaveClicked,
} from '$src/leases/selectors';
import {getUsersPermissions} from '$src/usersPermissions/selectors';

import type {Attributes} from '$src/types';
import type {Lease} from '$src/leases/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

type WarningsProps = {
  leaseAttributes: Attributes,
  meta: Object,
}

const RentWarnings = ({
  leaseAttributes,
  meta: {warning},
}: WarningsProps): Element<*> => {
  return <Fragment>
    {warning && !!warning.length &&
      <WarningContainer style={{marginTop: isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.IS_RENT_INFO_COMPLETE) ? 0 : null}}>
        {warning.map((item, index) =>
          <WarningField
            key={index}
            meta={{warning: item}}
            showWarning={true}
          />
        )}
      </WarningContainer>
    }
  </Fragment>;
};

type RentsProps = {
  archived: boolean,
  fields: any,
  rents: Array<Object>,
  usersPermissions: UsersPermissionsType,
};

const renderRents = ({
  archived,
  fields,
  rents,
  usersPermissions,
}:RentsProps): Element<*> => {
  const handleAdd = () => {
    fields.push({
      contract_rents: [{}],
    });
  };

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Fragment>
            {!hasPermissions(usersPermissions, UsersPermissions.ADD_RENT) &&
              !archived &&
              (!fields || !fields.length) &&
              <FormText className='no-margin'>Ei vuokria</FormText>
            }

            {archived && !!fields && !!fields.length && <h3 style={{marginTop: 10, marginBottom: 5}}>Arkisto</h3>}

            {fields && !!fields.length && fields.map((item, index) => {
              const handleRemove = () => {
                dispatch({
                  type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                  confirmationFunction: () => {
                    fields.remove(index);
                  },
                  confirmationModalButtonClassName: ButtonColors.ALERT,
                  confirmationModalButtonText: ConfirmationModalTexts.DELETE_RENT.BUTTON,
                  confirmationModalLabel: ConfirmationModalTexts.DELETE_RENT.LABEL,
                  confirmationModalTitle: ConfirmationModalTexts.DELETE_RENT.TITLE,
                });
              };

              return <RentItemEdit
                key={index}
                field={item}
                index={index}
                onRemove={handleRemove}
                rents={rents}
              />;
            })}
            {!archived &&
              <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_RENT)}>
                <Row>
                  <Column>
                    <AddButton
                      label='Lisää vuokra'
                      onClick={handleAdd}
                    />
                  </Column>
                </Row>
              </Authorization>
            }
          </Fragment>
        );
      }}
    </AppConsumer>
  );
};

type Props = {
  change: Function,
  currentLease: Lease,
  editedActiveBasisOfRents: Array<Object>,
  editedArchivedBasisOfRents: Array<Object>,
  isRentInfoComplete: boolean,
  isSaveClicked: boolean,
  leaseAttributes: Attributes,
  params: Object,
  receiveFormValidFlags: Function,
  setRentInfoComplete: Function,
  setRentInfoUncomplete: Function,
  usersPermissions: UsersPermissionsType,
  valid: boolean,
}

type State = {
  lease: Lease,
  rents: Array<Object>,
  rentsArchived: Array<Object>,
};

class RentsEdit extends PureComponent<Props, State> {
  activeBasisOfRentsComponent: any
  archivedBasisOfRentsComponent: any

  state = {
    lease: {},
    rents: [],
    rentsArchived: [],
  }

  static getDerivedStateFromProps(props, state) {
    const newState = {};

    if(props.currentLease !== state.lease) {
      const rents = getContentRents(props.currentLease);

      newState.lease = props.currentLease;
      newState.rents = rents.filter((rent) => !isArchived(rent));
      newState.rentsArchived = rents.filter((rent) => isArchived(rent));
    }
    return newState;
  }

  componentDidUpdate(prevProps) {
    const {receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [formName]: this.props.valid,
      });
    }
  }

  setRentInfoComplete = () => {
    const {currentLease, setRentInfoComplete} = this.props;

    setRentInfoComplete(currentLease.id);
  }

  setRentInfoUncomplete = () => {
    const {currentLease, setRentInfoUncomplete} = this.props;

    setRentInfoUncomplete(currentLease.id);
  }

  setActiveBasisOfRentsRef = (ref: any) => {
    this.activeBasisOfRentsComponent = ref;
  }

  setArchivedBasisOfRentsRef = (ref: any) => {
    this.archivedBasisOfRentsComponent = ref;
  }

  handleArchive = (index: number, item: Object) => {
    this.activeBasisOfRentsComponent.getRenderedComponent().removeBasisOfRent(index);
    this.addArchivedItemToUnarchivedItems(item);
  }

  addArchivedItemToUnarchivedItems = (item: Object) => {
    const {change, editedArchivedBasisOfRents} = this.props,
      newItems = [...editedArchivedBasisOfRents, {...item, archived_at: new Date().toISOString()}];

    change('basis_of_rents_archived', newItems);
  }

  handleUnarchive = (index: number, item: Object) => {
    this.archivedBasisOfRentsComponent.getRenderedComponent().removeBasisOfRent(index);
    this.addUnarchivedItemToArchivedItems(item);
  }

  addUnarchivedItemToArchivedItems = (item: Object) => {
    const {change, editedActiveBasisOfRents} = this.props,
      newItems = [...editedActiveBasisOfRents, {...item, archived_at: null}];

    change('basis_of_rents', newItems);
  }

  render() {
    const {
      editedActiveBasisOfRents,
      editedArchivedBasisOfRents,
      isRentInfoComplete,
      isSaveClicked,
      leaseAttributes,
      usersPermissions,
    } = this.props;
    const {rents, rentsArchived} = this.state;

    return (
      <AppConsumer>
        {({dispatch}) => {
          const handleSetRentInfoComplete = () => {
            dispatch({
              type: ActionTypes.SHOW_CONFIRMATION_MODAL,
              confirmationFunction: () => {
                this.setRentInfoComplete();
              },
              confirmationModalButtonClassName: ButtonColors.SUCCESS,
              confirmationModalButtonText: ConfirmationModalTexts.SET_RENT_INFO_COMPLETE.BUTTON,
              confirmationModalLabel: ConfirmationModalTexts.SET_RENT_INFO_COMPLETE.LABEL,
              confirmationModalTitle: ConfirmationModalTexts.SET_RENT_INFO_COMPLETE.TITLE,
            });
          };

          const handleSetRentInfoUncomplete = () => {
            dispatch({
              type: ActionTypes.SHOW_CONFIRMATION_MODAL,
              confirmationFunction: () => {
                this.setRentInfoUncomplete();
              },
              confirmationModalButtonClassName: ButtonColors.ALERT,
              confirmationModalButtonText: ConfirmationModalTexts.SET_RENT_INFO_UNCOMPLETE.BUTTON,
              confirmationModalLabel: ConfirmationModalTexts.SET_RENT_INFO_UNCOMPLETE.LABEL,
              confirmationModalTitle: ConfirmationModalTexts.SET_RENT_INFO_UNCOMPLETE.TITLE,
            });
          };

          return(
            <form>
              <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.RENTS)}>
                <Title enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseRentsFieldPaths.RENTS)}>
                  {LeaseRentsFieldTitles.RENTS}
                </Title>

                <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.IS_RENT_INFO_COMPLETE)}>
                  <WarningContainer
                    alignCenter
                    buttonComponent={
                      <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.CHANGE_LEASE_IS_RENT_INFO_COMPLETE)}>
                        {isRentInfoComplete
                          ? <Button
                            className={ButtonColors.NEUTRAL}
                            onClick={handleSetRentInfoUncomplete}
                            text='Merkitse keskeneräisiksi'
                          />
                          : <Button
                            className={ButtonColors.NEUTRAL}
                            onClick={handleSetRentInfoComplete}
                            text='Merkitse valmiiksi'
                          />
                        }
                      </Authorization>
                    }
                    success={isRentInfoComplete}
                  >
                    {isRentInfoComplete
                      ? <SuccessField
                        meta={{warning: 'Tiedot kunnossa'}}
                        showWarning={true}
                      />
                      : <WarningField
                        meta={{warning: 'Tiedot keskeneräiset'}}
                        showWarning={true}
                      />
                    }
                  </WarningContainer>
                </Authorization>

                <Field
                  name='rentWarnings'
                  component={RentWarnings}
                  leaseAttributes={leaseAttributes}
                  showWarning={true}
                />
                <Divider />

                <FieldArray
                  component={renderRents}
                  archive={false}
                  name='rents'
                  rents={rents}
                  usersPermissions={usersPermissions}
                />

                {/* Archived rents */}
                <FieldArray
                  component={renderRents}
                  archived={true}
                  name='rentsArchived'
                  rents={rentsArchived}
                  usersPermissions={usersPermissions}
                />
              </Authorization>

              <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICE)}>
                <Title enableUiDataEdit uiDataKey={getUiDataRentCalculatorKey(RentCalculatorFieldPaths.RENT_CALCULATOR)}>
                  {RentCalculatorFieldTitles.RENT_CALCULATOR}
                </Title>
                <Divider />
                <GreenBox>
                  <RentCalculator />
                </GreenBox>
              </Authorization>

              <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.BASIS_OF_RENTS)}>
                <Title enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.BASIS_OF_RENTS)}>
                  {LeaseBasisOfRentsFieldTitles.BASIS_OF_RENTS}
                </Title>
                <Divider />
                <FieldArray
                  ref={this.setActiveBasisOfRentsRef}
                  archived={false}
                  basisOfRents={editedActiveBasisOfRents}
                  component={BasisOfRentsEdit}
                  formName={formName}
                  isSaveClicked={isSaveClicked}
                  name="basis_of_rents"
                  onArchive={this.handleArchive}
                  forwardRef
                />

                <FieldArray
                  ref={this.setArchivedBasisOfRentsRef}
                  archived={true}
                  basisOfRents={editedArchivedBasisOfRents}
                  component={BasisOfRentsEdit}
                  formName={formName}
                  isSaveClicked={isSaveClicked}
                  name="basis_of_rents_archived"
                  onUnarchive={this.handleUnarchive}
                  forwardRef
                />
              </Authorization>
            </form>
          );
        }}
      </AppConsumer>
    );
  }
}

const formName = FormNames.LEASE_RENTS;
const selector = formValueSelector(formName);

export default flowRight(
  withRouter,
  connect(
    (state) => {
      const currentLease = getCurrentLease(state);

      return {
        currentLease: currentLease,
        editedActiveBasisOfRents: selector(state, 'basis_of_rents'),
        editedArchivedBasisOfRents: selector(state, 'basis_of_rents_archived'),
        errors: getErrorsByFormName(state, formName),
        isRentInfoComplete: currentLease ? currentLease.is_rent_info_complete : null,
        isSaveClicked: getIsSaveClicked(state),
        leaseAttributes: getLeaseAttributes(state),
        usersPermissions: getUsersPermissions(state),
      };
    },
    {
      receiveFormValidFlags,
      setRentInfoComplete,
      setRentInfoUncomplete,
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
    validate: validateRentForm,
    warn: warnRentForm,
  }),
)(RentsEdit);
