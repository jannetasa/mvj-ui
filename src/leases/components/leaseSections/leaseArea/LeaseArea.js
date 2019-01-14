// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {Link, withRouter} from 'react-router';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import Authorization from '$components/authorization/Authorization';
import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import ListItem from '$components/content/ListItem';
import ListItems from '$components/content/ListItems';
import PlanUnitItem from './PlanUnitItem';
import PlotItem from './PlotItem';
import SubTitle from '$components/content/SubTitle';
import {receiveCollapseStates} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {
  FormNames,
  LeaseAreaAddressesFieldPaths,
  LeaseAreaAddressesFieldTitles,
  LeaseAreasFieldPaths,
  LeaseAreasFieldTitles,
  LeasePlanUnitsFieldPaths,
  LeasePlotsFieldPaths,
} from '$src/leases/enums';
import {
  formatNumber,
  getFieldOptions,
  getLabelOfOption,
  getSearchQuery,
  isEmptyValue,
  isFieldAllowedToRead,
} from '$util/helpers';
import {getAttributes, getCollapseStateByKey, getIsEditMode} from '$src/leases/selectors';

import type {Attributes} from '$src/types';

type Props = {
  area: ?Object,
  attributes: Attributes,
  isActive: boolean,
  isEditMode: boolean,
  planUnitsContractCollapseState: boolean,
  planUnitsCurrentCollapseState: boolean,
  plotsContractCollapseState: boolean,
  plotsCurrentCollapseState: boolean,
  receiveCollapseStates: Function,
  router: Object,
}

const LeaseArea = ({
  area,
  attributes,
  isActive,
  isEditMode,
  planUnitsContractCollapseState,
  planUnitsCurrentCollapseState,
  plotsContractCollapseState,
  plotsCurrentCollapseState,
  receiveCollapseStates,
  router,
}: Props) => {
  const handlePlanUnitContractCollapseToggle = (val: boolean) => {
    if(!area || !area.id) return;

    receiveCollapseStates({
      [isEditMode ? ViewModes.EDIT : ViewModes.READONLY]: {
        [FormNames.LEASE_AREAS]: {
          [area.id]: {
            plan_units_contract: val,
          },
        },
      },
    });
  };

  const handlePlanUnitCurrentCollapseToggle = (val: boolean) => {
    if(!area || !area.id) return;

    receiveCollapseStates({
      [isEditMode ? ViewModes.EDIT : ViewModes.READONLY]: {
        [FormNames.LEASE_AREAS]: {
          [area.id]: {
            plan_units_current: val,
          },
        },
      },
    });
  };

  const handlePlotsContractCollapseToggle = (val: boolean) => {
    if(!area || !area.id) return;

    receiveCollapseStates({
      [isEditMode ? ViewModes.EDIT : ViewModes.READONLY]: {
        [FormNames.LEASE_AREAS]: {
          [area.id]: {
            plots_contract: val,
          },
        },
      },
    });
  };

  const handlePlotsCurrentCollapseToggle = (val: boolean) => {
    if(!area || !area.id) return;

    receiveCollapseStates({
      [isEditMode ? ViewModes.EDIT : ViewModes.READONLY]: {
        [FormNames.LEASE_AREAS]: {
          [area.id]: {
            plots_current: val,
          },
        },
      },
    });
  };

  const getMapLinkUrl = () => {
    const {location: {pathname, query}} = router;
    const tempQuery = {...query};
    delete tempQuery.plan_unit;
    delete tempQuery.plot;
    tempQuery.lease_area = area ? area.id : undefined,
    tempQuery.tab = 7;

    return `${pathname}${getSearchQuery(tempQuery)}`;
  };

  const locationOptions = getFieldOptions(attributes, LeaseAreasFieldPaths.LOCATION);
  const typeOptions = getFieldOptions(attributes, LeaseAreasFieldPaths.TYPE);
  const addresses = get(area, 'addresses', []);
  const mapLinkUrl = getMapLinkUrl();

  if(!area) return null;

  return (
    <div>
      <Row>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.IDENTIFIER)}>
            <FormTextTitle>{LeaseAreasFieldTitles.IDENTIFIER}</FormTextTitle>
            <FormText>{area.identifier || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.TYPE)}>
            <FormTextTitle>{LeaseAreasFieldTitles.TYPE}</FormTextTitle>
            <FormText>{getLabelOfOption(typeOptions, area.type) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.AREA)}>
            <FormTextTitle>{LeaseAreasFieldTitles.AREA}</FormTextTitle>
            <FormText>{!isEmptyValue(area.area) ? `${formatNumber(area.area)} m²` : '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.LOCATION)}>
            <FormTextTitle>{LeaseAreasFieldTitles.LOCATION}</FormTextTitle>
            <FormText>{getLabelOfOption(locationOptions, area.location) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.GEOMETRY)}>
            {(isActive && !isEmpty(area.geometry)) &&
              <Link to={mapLinkUrl}>{LeaseAreasFieldTitles.GEOMETRY}</Link>
            }
          </Authorization>
        </Column>
      </Row>
      <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaAddressesFieldPaths.ADDRESSES)}>
        <SubTitle>{LeaseAreaAddressesFieldTitles.ADDRESSES}</SubTitle>
        {!addresses || !addresses.length && <FormText>Ei osoitteita</FormText>}
        {!!addresses.length &&
          <div>
            <Row>
              <Column small={6} large={4}>
                <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaAddressesFieldPaths.ADDRESS)}>
                  <FormTextTitle>{LeaseAreaAddressesFieldTitles.ADDRESS}</FormTextTitle>
                </Authorization>
              </Column>
              <Column small={3} large={2}>
                <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaAddressesFieldPaths.POSTAL_CODE)}>
                  <FormTextTitle>{LeaseAreaAddressesFieldTitles.POSTAL_CODE}</FormTextTitle>
                </Authorization>
              </Column>
              <Column small={3} large={2}>
                <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaAddressesFieldPaths.CITY)}>
                  <FormTextTitle>{LeaseAreaAddressesFieldTitles.CITY}</FormTextTitle>
                </Authorization>
              </Column>
            </Row>
            <ListItems>
              {addresses.map((address) => {
                return (
                  <Row key={address.id}>
                    <Column small={6} large={4}>
                      <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaAddressesFieldPaths.ADDRESS)}>
                        <ListItem>{address.address || '-'}</ListItem>
                      </Authorization>
                    </Column>
                    <Column small={3} large={2}>
                      <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaAddressesFieldPaths.POSTAL_CODE)}>
                        <ListItem>{address.postal_code || '-'}</ListItem>
                      </Authorization>
                    </Column>
                    <Column small={3} large={2}>
                      <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaAddressesFieldPaths.CITY)}>
                        <ListItem>{address.city || '-'}</ListItem>
                      </Authorization>
                    </Column>
                  </Row>
                );
              })}
            </ListItems>
          </div>
        }
      </Authorization>

      <Authorization allow={isFieldAllowedToRead(attributes, LeasePlotsFieldPaths.PLOTS)}>
        <Row>
          <Column small={12} large={6}>
            <Collapse
              className='collapse__secondary'
              defaultOpen={plotsContractCollapseState !== undefined ? plotsContractCollapseState : true}
              headerTitle='Kiinteistöt / määräalat sopimuksessa'
              onToggle={handlePlotsContractCollapseToggle}
            >
              <BoxItemContainer>
                {!area.plots_contract || !area.plots_contract.length &&
                  <FormText>Ei kiinteistöjä/määräaloja sopimuksessa</FormText>
                }
                {area.plots_contract && !!area.plots_contract.length && area.plots_contract.map((item, index) =>
                  <PlotItem
                    key={index}
                    isAreaActive={isActive}
                    plot={item}
                  />
                )}
              </BoxItemContainer>
            </Collapse>
          </Column>
          <Column small={12} large={6}>
            <Collapse
              className='collapse__secondary'
              defaultOpen={plotsCurrentCollapseState !== undefined ? plotsCurrentCollapseState : true}
              headerTitle='Kiinteistöt / määräalat nykyhetkellä'
              onToggle={handlePlotsCurrentCollapseToggle}
            >
              {!area.plots_current || !area.plots_current.length &&
                <FormText>Ei kiinteistöjä/määräaloja nykyhetkellä</FormText>
              }
              <BoxItemContainer>
                {area.plots_current && !!area.plots_current.length && area.plots_current.map((item, index) =>
                  <PlotItem
                    key={index}
                    isAreaActive={isActive}
                    plot={item}
                  />
                )}
              </BoxItemContainer>
            </Collapse>
          </Column>
        </Row>
      </Authorization>

      <Authorization allow={isFieldAllowedToRead(attributes, LeasePlanUnitsFieldPaths.PLAN_UNITS)}>
        <Row>
          <Column small={12} large={6}>
            <Collapse
              className='collapse__secondary'
              defaultOpen={planUnitsContractCollapseState !== undefined ? planUnitsContractCollapseState : true}
              headerTitle='Kaavayksiköt sopimuksessa'
              onToggle={handlePlanUnitContractCollapseToggle}
            >
              <BoxItemContainer>
                {!area.plan_units_contract || !area.plan_units_contract.length &&
                  <FormText>Ei kaavayksiköitä sopimuksessa</FormText>
                }
                {area.plan_units_contract && !!area.plan_units_contract.length && area.plan_units_contract.map((item, index) =>
                  <PlanUnitItem
                    key={index}
                    isAreaActive={isActive}
                    planUnit={item}
                  />
                )}
              </BoxItemContainer>
            </Collapse>
          </Column>
          <Column small={12} large={6}>
            <Collapse
              className='collapse__secondary'
              defaultOpen={planUnitsCurrentCollapseState !== undefined ? planUnitsCurrentCollapseState : true}
              headerTitle='Kaavayksiköt nykyhetkellä'
              onToggle={handlePlanUnitCurrentCollapseToggle}
            >
              <BoxItemContainer>
                {!area.plan_units_current || !area.plan_units_current.length &&
                  <FormText>Ei kaavayksiköitä nykyhetkellä</FormText>
                }
                {area.plan_units_current && !!area.plan_units_current.length && area.plan_units_current.map((item, index) =>
                  <PlanUnitItem
                    key={index}
                    isAreaActive={isActive}
                    planUnit={item}
                  />
                )}
              </BoxItemContainer>
            </Collapse>
          </Column>
        </Row>
      </Authorization>
    </div>
  );
};

export default flowRight(
  withRouter,
  connect(
    (state, props) => {
      const id = get(props, 'area.id');
      const isEditMode = getIsEditMode(state);

      return {
        attributes: getAttributes(state),
        isEditMode: isEditMode,
        planUnitsContractCollapseState: getCollapseStateByKey(state, `${isEditMode ? ViewModes.EDIT : ViewModes.READONLY}.${FormNames.LEASE_AREAS}.${id}.plan_units_contract`),
        planUnitsCurrentCollapseState: getCollapseStateByKey(state, `${isEditMode ? ViewModes.EDIT : ViewModes.READONLY}.${FormNames.LEASE_AREAS}.${id}.plan_units_current`),
        plotsContractCollapseState: getCollapseStateByKey(state, `${isEditMode ? ViewModes.EDIT : ViewModes.READONLY}.${FormNames.LEASE_AREAS}.${id}.plots_contract`),
        plotsCurrentCollapseState: getCollapseStateByKey(state, `${isEditMode ? ViewModes.EDIT : ViewModes.READONLY}.${FormNames.LEASE_AREAS}.${id}.plots_current`),
      };
    },
    {
      receiveCollapseStates,
    }
  ),
)(LeaseArea);
