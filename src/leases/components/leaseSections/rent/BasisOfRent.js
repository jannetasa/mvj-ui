// @flow
import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import ActionButtonWrapper from '$components/form/ActionButtonWrapper';
import Authorization from '$components/authorization/Authorization';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import Divider from '$components/content/Divider';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import RemoveButton from '$components/form/RemoveButton';
import SubTitle from '$components/content/SubTitle';
import UnarchiveButton from '$components/form/UnarchiveButton';
import WhiteBox from '$components/content/WhiteBox';
import {
  BasisOfRentManagementSubventionsFieldPaths,
  BasisOfRentManagementSubventionsFieldTitles,
  BasisOfRentTemporarySubventionsFieldPaths,
  BasisOfRentTemporarySubventionsFieldTitles,
  LeaseBasisOfRentsFieldPaths,
  LeaseBasisOfRentsFieldTitles,
  SubventionTypes,
} from '$src/leases/enums';
import {
  calculateBasisOfRentAmountPerArea,
  calculateBasisOfRentBasicAnnualRent,
  calculateBasisOfRentDiscountedInitialYearRent,
  calculateBasisOfRentInitialYearRent,
  calculateBasisOfRentSubventionAmount,
  calculateReLeaseDiscountPercent, 
  calculateRentAdjustmentSubventionPercent,
  getBasisOfRentIndexValue,
} from '$src/leases/helpers';
import {getUiDataLeaseKey} from '$src/uiData/helpers';
import {getUserFullName} from '$src/users/helpers';
import {
  formatDate,
  formatNumber,
  getLabelOfOption,
  isEmptyValue,
  isFieldAllowedToEdit,
  isFieldAllowedToRead,
} from '$util/helpers';
import {getAttributes as getLeaseAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/types';

type Props = {
  areaUnitOptions: Array<Object>,
  basisOfRent: Object,
  indexOptions: Array<Object>,
  intendedUseOptions: Array<Object>,
  leaseAttributes: Attributes,
  managementTypeOptions: Array<Object>,
  onRemove?: Function,
  onUnarchive?: Function,
  showTotal: boolean,
  subventionTypeOptions: Array<Object>,
  totalDiscountedInitialYearRent: number,
}

const BasisOfRent = ({
  areaUnitOptions,
  basisOfRent,
  indexOptions,
  intendedUseOptions,
  leaseAttributes,
  managementTypeOptions,
  onRemove,
  onUnarchive,
  showTotal,
  subventionTypeOptions,
  totalDiscountedInitialYearRent,
}: Props) => {
  const getAreaText = (amount: ?number) => {
    if(isEmptyValue(amount)) return '-';
    if(isEmptyValue(basisOfRent.area_unit)) return `${formatNumber(amount)} €`;
    return `${formatNumber(amount)} ${getLabelOfOption(areaUnitOptions, basisOfRent.area_unit) || ''}`;
  };

  const getAmountPerAreaText = (amount: ?number) => {
    if(isEmptyValue(amount)) return '-';
    if(isEmptyValue(basisOfRent.area_unit)) return `${formatNumber(amount)} €`;
    return `${formatNumber(amount)} € / ${getLabelOfOption(areaUnitOptions, basisOfRent.area_unit) || ''}`;
  };

  const getPlansInspectedText = () => {
    if(!basisOfRent.plans_inspected_at) return '-';
    if(!basisOfRent.plans_inspected_by) return formatDate(basisOfRent.plans_inspected_at) || '-';
    return `${formatDate(basisOfRent.plans_inspected_at) || ''} ${getUserFullName(basisOfRent.plans_inspected_by)}`;
  };

  const getLockedText = () => {
    if(!basisOfRent.locked_at) return '-';
    if(!basisOfRent.locked_by) return formatDate(basisOfRent.locked_at) || '-';
    return `${formatDate(basisOfRent.locked_at) || ''} ${getUserFullName(basisOfRent.locked_by)}`;
  };

  const getReLeaseDiscountPercent = () => {
    return calculateReLeaseDiscountPercent(
      basisOfRent.subvention_base_percent,
      basisOfRent.subvention_graduated_percent);
  };

  const getTotalSubventionPercent = () => {
    return calculateRentAdjustmentSubventionPercent(
      basisOfRent.subvention_type,
      basisOfRent.subvention_base_percent,
      basisOfRent.subvention_graduated_percent,
      basisOfRent.management_subventions,
      basisOfRent.temporary_subventions);
  };

  const indexValue = getBasisOfRentIndexValue(basisOfRent, indexOptions);
  const areaText = getAreaText(basisOfRent.area);
  const amountPerAreaText = getAmountPerAreaText(basisOfRent.amount_per_area);
  const plansInspectedText = getPlansInspectedText();
  const lockedText = getLockedText();
  const currentAmountPerArea = calculateBasisOfRentAmountPerArea(basisOfRent, indexValue);
  const currentAmountPerAreaText = getAmountPerAreaText(currentAmountPerArea);
  const basicAnnualRent = calculateBasisOfRentBasicAnnualRent(basisOfRent);
  const initialYearRent = calculateBasisOfRentInitialYearRent(basisOfRent, indexValue);
  const discountedInitialYearRent = calculateBasisOfRentDiscountedInitialYearRent(basisOfRent, indexValue);
  const managementSubventions = basisOfRent.management_subventions;
  const temporarySubventions = basisOfRent.temporary_subventions;
  const rentPerMonth = discountedInitialYearRent != null ? discountedInitialYearRent/12 : null;
  const rentPer2Months = discountedInitialYearRent != null ? discountedInitialYearRent/6 : null;
  const rentPerMonthTotal = totalDiscountedInitialYearRent/12;
  const rentPer2MonthsTotal = totalDiscountedInitialYearRent/6;
  const reLeaseDiscountPercent = getReLeaseDiscountPercent();
  const reLeaseDiscountAmount = calculateBasisOfRentSubventionAmount(initialYearRent, reLeaseDiscountPercent);
  const totalSubventionPercent = getTotalSubventionPercent();
  const totalSubventionAmount = calculateBasisOfRentSubventionAmount(initialYearRent, totalSubventionPercent);

  return(
    <BoxItem className='no-border-on-first-child no-border-on-last-child'>
      {(onUnarchive || onRemove) &&
        <ActionButtonWrapper>
          {onUnarchive &&
            <Authorization allow={isFieldAllowedToEdit(leaseAttributes, LeaseBasisOfRentsFieldPaths.ARCHIVED_AT)}>
              <UnarchiveButton onClick={onUnarchive}/>
            </Authorization>
          }
          {onRemove && !basisOfRent.locked_at &&
            <Authorization allow={isFieldAllowedToEdit(leaseAttributes, LeaseBasisOfRentsFieldPaths.BASIS_OF_RENTS)}>
              <RemoveButton onClick={onRemove} title="Poista vuokralaskuri" />
            </Authorization>
          }
        </ActionButtonWrapper>
      }
      <BoxContentWrapper>
        <Row>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INTENDED_USE)}>
              <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.INTENDED_USE)}>
                {LeaseBasisOfRentsFieldTitles.INTENDED_USE}
              </FormTextTitle>
              <FormText>{getLabelOfOption(intendedUseOptions, basisOfRent.intended_use) || '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA)}>
              <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.AREA)}>
                {LeaseBasisOfRentsFieldTitles.AREA}
              </FormTextTitle>
              <FormText>{areaText}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PLANS_INSPECTED_AT)}>
              <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.PLANS_INSPECTED_AT)}>
                {LeaseBasisOfRentsFieldTitles.PLANS_INSPECTED_AT}
              </FormTextTitle>
              <FormText>{plansInspectedText}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.LOCKED_AT)}>
              <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.LOCKED_AT)}>
                {LeaseBasisOfRentsFieldTitles.LOCKED_AT}
              </FormTextTitle>
              <FormText>{lockedText}</FormText>
            </Authorization>
          </Column>
        </Row>
        <Row>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)}>
              <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)}>
                {LeaseBasisOfRentsFieldTitles.AMOUNT_PER_AREA}
              </FormTextTitle>
              <FormText>{amountPerAreaText}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX)}>
              <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.INDEX)}>
                {LeaseBasisOfRentsFieldTitles.INDEX}
              </FormTextTitle>
              <FormText>{getLabelOfOption(indexOptions, basisOfRent.index) || '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX)}>
              <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.UNIT_PRICE)}>
                {LeaseBasisOfRentsFieldTitles.UNIT_PRICE}
              </FormTextTitle>
              <FormText>{currentAmountPerAreaText}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE)}>
              <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE)}>
                {LeaseBasisOfRentsFieldTitles.PROFIT_MARGIN_PERCENTAGE}
              </FormTextTitle>
              <FormText>{!isEmptyValue(basisOfRent.profit_margin_percentage) ? `${formatNumber(basisOfRent.profit_margin_percentage)} %` : '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)
            }>
              <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.BASE_YEAR_RENT)}>
                {LeaseBasisOfRentsFieldTitles.BASE_YEAR_RENT}
              </FormTextTitle>
              <FormText>{!isEmptyValue(basicAnnualRent) ? `${formatNumber(basicAnnualRent)} €/v` : '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) &&
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX) &&
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE)
            }>
              <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.INITIAL_YEAR_RENT)}>
                {LeaseBasisOfRentsFieldTitles.INITIAL_YEAR_RENT}
              </FormTextTitle>
              <FormText>{!isEmptyValue(initialYearRent) ? `${formatNumber(initialYearRent)} €/v` : '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE)}>
              <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE)}>
                {LeaseBasisOfRentsFieldTitles.DISCOUNT_PERCENTAGE}
              </FormTextTitle>
              <FormText>{!isEmptyValue(basisOfRent.discount_percentage) ? `${formatNumber(basisOfRent.discount_percentage)} %` : '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) &&
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX) &&
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE) &&
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE)
            }>
              <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.DISCOUNTED_INITIAL_YEAR_RENT)}>
                {LeaseBasisOfRentsFieldTitles.DISCOUNTED_INITIAL_YEAR_RENT}
              </FormTextTitle>
              <FormText>{!isEmptyValue(discountedInitialYearRent) ? `${formatNumber(discountedInitialYearRent)} €/v` : '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) &&
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX) &&
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE) &&
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE)
            }>
              <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.DISCOUNTED_INITIAL_YEAR_RENT_PER_MONTH)}>
                {LeaseBasisOfRentsFieldTitles.DISCOUNTED_INITIAL_YEAR_RENT_PER_MONTH}
              </FormTextTitle>
              <FormText>{!isEmptyValue(rentPerMonth) ? `${formatNumber(rentPerMonth)} €` : '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) &&
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX) &&
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE) &&
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE)
            }>
              <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.DISCOUNTED_INITIAL_YEAR_RENT_PER_2_MONTHS)}>
                {LeaseBasisOfRentsFieldTitles.DISCOUNTED_INITIAL_YEAR_RENT_PER_2_MONTHS}
              </FormTextTitle>
              <FormText>{!isEmptyValue(rentPer2Months) ? `${formatNumber(rentPer2Months)} €` : '-'}</FormText>
            </Authorization>
          </Column>
          {showTotal &&
            <Fragment>
              <Column small={6} medium={4} large={2}>
                <Authorization allow={
                  isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
                  isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) &&
                  isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX) &&
                  isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE) &&
                  isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE)
                }>
                  <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.DISCOUNTED_INITIAL_YEAR_RENT_PER_MONTH_TOTAL)}>
                    {LeaseBasisOfRentsFieldTitles.DISCOUNTED_INITIAL_YEAR_RENT_PER_MONTH_TOTAL}
                  </FormTextTitle>
                  <FormText>{!isEmptyValue(rentPerMonthTotal) ? `${formatNumber(rentPerMonthTotal)} €` : '-'}</FormText>
                </Authorization>
              </Column>
              <Column small={6} medium={4} large={2}>
                <Authorization allow={
                  isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
                  isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) &&
                  isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX) &&
                  isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE) &&
                  isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE)
                }>
                  <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.DISCOUNTED_INITIAL_YEAR_RENT_PER_2_MONTHS_TOTAL)}>
                    {LeaseBasisOfRentsFieldTitles.DISCOUNTED_INITIAL_YEAR_RENT_PER_2_MONTHS_TOTAL}
                  </FormTextTitle>
                  <FormText>{!isEmptyValue(rentPer2MonthsTotal) ? `${formatNumber(rentPer2MonthsTotal)} €` : '-'}</FormText>
                </Authorization>
              </Column>
            </Fragment>
          }
        </Row>

        {basisOfRent.subvention_type &&
          <WhiteBox>
            <Row>
              <Column small={6} medium={4} large={2}>
                <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.SUBVENTION_TYPE)}>
                  <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.SUBVENTION_TYPE)}>
                    {LeaseBasisOfRentsFieldTitles.SUBVENTION_TYPE}
                  </FormTextTitle>
                  <FormText>{getLabelOfOption(subventionTypeOptions, basisOfRent.subvention_type) || '-'}</FormText>
                </Authorization>
              </Column>
            </Row>
            {basisOfRent.subvention_type === SubventionTypes.X_DISCOUNT &&
              <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentManagementSubventionsFieldPaths.MANAGEMENT_SUBVENTIONS)}>
                <SubTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(BasisOfRentManagementSubventionsFieldPaths.MANAGEMENT_SUBVENTIONS)}>{BasisOfRentManagementSubventionsFieldTitles.MANAGEMENT_SUBVENTIONS}</SubTitle>
                {!managementSubventions || !managementSubventions.length &&
                  <FormText>Ei hallintamuotoja</FormText>
                }
                {managementSubventions && managementSubventions.length &&
                  <Fragment>
                    <Row>
                      <Column small={4} large={2}>
                        <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentManagementSubventionsFieldPaths.MANAGEMENT)}>
                          <FormTextTitle uiDataKey={getUiDataLeaseKey(BasisOfRentManagementSubventionsFieldPaths.MANAGEMENT)}>
                            {BasisOfRentManagementSubventionsFieldTitles.MANAGEMENT}
                          </FormTextTitle>
                        </Authorization>
                      </Column>
                      <Column small={4} large={2}>
                        <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_PERCENT)}>
                          <FormTextTitle uiDataKey={getUiDataLeaseKey(BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_PERCENT)}>
                            {BasisOfRentManagementSubventionsFieldTitles.SUBVENTION_PERCENT}
                          </FormTextTitle>
                        </Authorization>
                      </Column>
                      <Column small={4} large={2}>
                        <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_PERCENT)}>
                          <FormTextTitle uiDataKey={getUiDataLeaseKey(BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_AMOUNT)}>
                            {BasisOfRentManagementSubventionsFieldTitles.SUBVENTION_AMOUNT}
                          </FormTextTitle>
                        </Authorization>
                      </Column>
                    </Row>

                    {managementSubventions.map((subvention) => {
                      const subventionAmount = calculateBasisOfRentSubventionAmount(initialYearRent, subvention.subvention_percent);

                      return(
                        <Row key={subvention.id}>
                          <Column small={4} large={2}>
                            <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentManagementSubventionsFieldPaths.MANAGEMENT)}>
                              <FormText>{getLabelOfOption(managementTypeOptions, subvention.management) || '-'}</FormText>
                            </Authorization>
                          </Column>
                          <Column small={4} large={2}>
                            <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_PERCENT)}>
                              <FormText>{!isEmptyValue(subvention.subvention_percent) ? `${formatNumber(subvention.subvention_percent)} %` : '-'}</FormText>
                            </Authorization>
                          </Column>
                          <Column small={4} large={2}>
                            <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_PERCENT)}>
                              <FormText>{formatNumber(subventionAmount)} €</FormText>
                            </Authorization>
                          </Column>
                        </Row>
                      );
                    })}
                  </Fragment>
                }
              </Authorization>
            }
            {basisOfRent.subvention_type === SubventionTypes.RE_LEASE_DISCOUNT &&
              <Row>
                <Column small={4} large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.SUBVENTION_BASE_PERCENT)}>
                    <FormTextTitle  enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.SUBVENTION_BASE_PERCENT)}>
                      {LeaseBasisOfRentsFieldTitles.SUBVENTION_BASE_PERCENT}
                    </FormTextTitle>
                    <FormText>{!isEmptyValue(basisOfRent.subvention_base_percent) ? `${formatNumber(basisOfRent.subvention_base_percent)} %` : '-'}</FormText>
                  </Authorization>
                </Column>
                <Column small={4} large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.SUBVENTION_GRADUATED_PERCENT)}>
                    <FormTextTitle  enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.SUBVENTION_GRADUATED_PERCENT)}>
                      {LeaseBasisOfRentsFieldTitles.SUBVENTION_GRADUATED_PERCENT}
                    </FormTextTitle>
                    <FormText>{!isEmptyValue(basisOfRent.subvention_graduated_percent) ? `${formatNumber(basisOfRent.subvention_graduated_percent)} %` : '-'}</FormText>
                  </Authorization>
                </Column>
                <Column small={4} large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.SUBVENTION_BASE_PERCENT) ||
                    isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.SUBVENTION_BASE_PERCENT)}>
                    <FormTextTitle  enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.SUBVENTION_RE_LEASE_DISCOUNT_PRECENT)}>
                      {LeaseBasisOfRentsFieldTitles.SUBVENTION_RE_LEASE_DISCOUNT_PRECENT}
                    </FormTextTitle>
                    <FormText>{formatNumber(reLeaseDiscountPercent)} %</FormText>
                  </Authorization>
                </Column>
                <Column small={4} large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.SUBVENTION_BASE_PERCENT) ||
                    isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.SUBVENTION_BASE_PERCENT)}>
                    <FormTextTitle  enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.SUBVENTION_RE_LEASE_DISCOUNT_AMOUNT)}>
                      {LeaseBasisOfRentsFieldTitles.SUBVENTION_RE_LEASE_DISCOUNT_AMOUNT}
                    </FormTextTitle>
                    <FormText>{formatNumber(reLeaseDiscountAmount)} €</FormText>
                  </Authorization>
                </Column>
              </Row>
            }

            <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentTemporarySubventionsFieldPaths.TEMPORARY_SUBVENTIONS)}>
              <SubTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(BasisOfRentTemporarySubventionsFieldPaths.TEMPORARY_SUBVENTIONS)}>
                {BasisOfRentTemporarySubventionsFieldTitles.TEMPORARY_SUBVENTIONS}
              </SubTitle>
              {!temporarySubventions || !temporarySubventions.length &&
                <FormText>Ei tilapäisalennuksia</FormText>
              }
              {temporarySubventions && temporarySubventions.length &&
                <Fragment>
                  <Row>
                    <Column small={4} large={2}>
                      <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentTemporarySubventionsFieldPaths.DESCRIPTION)}>
                        <FormTextTitle uiDataKey={getUiDataLeaseKey(BasisOfRentTemporarySubventionsFieldPaths.DESCRIPTION)}>
                          {BasisOfRentTemporarySubventionsFieldTitles.DESCRIPTION}
                        </FormTextTitle>
                      </Authorization>
                    </Column>
                    <Column small={4} large={2}>
                      <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentTemporarySubventionsFieldPaths.SUBVENTION_PERCENT)}>
                        <FormTextTitle uiDataKey={getUiDataLeaseKey(BasisOfRentTemporarySubventionsFieldPaths.SUBVENTION_PERCENT)}>
                          {BasisOfRentTemporarySubventionsFieldTitles.SUBVENTION_PERCENT}
                        </FormTextTitle>
                      </Authorization>
                    </Column>
                    <Column small={4} large={2}>
                      <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentTemporarySubventionsFieldPaths.SUBVENTION_PERCENT)}>
                        <FormTextTitle uiDataKey={getUiDataLeaseKey(BasisOfRentTemporarySubventionsFieldPaths.SUBVENTION_AMOUNT)}>
                          {BasisOfRentTemporarySubventionsFieldTitles.SUBVENTION_AMOUNT}
                        </FormTextTitle>
                      </Authorization>
                    </Column>
                  </Row>

                  {temporarySubventions.map((subvention) => {
                    const subventionAmount = calculateBasisOfRentSubventionAmount(initialYearRent, subvention.subvention_percent);
                    
                    return(
                      <Row key={subvention.id}>
                        <Column small={4} large={2}>
                          <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentTemporarySubventionsFieldPaths.DESCRIPTION)}>
                            <FormText>{subvention.description}</FormText>
                          </Authorization>
                        </Column>
                        <Column small={4} large={2}>
                          <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentTemporarySubventionsFieldPaths.DESCRIPTION)}>
                            <FormText>{!isEmptyValue(subvention.subvention_percent) ? `${formatNumber(subvention.subvention_percent)} %` : '-'}</FormText>
                          </Authorization>
                        </Column>
                        <Column small={4} large={2}>
                          <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentTemporarySubventionsFieldPaths.DESCRIPTION)}>
                            <FormText>{formatNumber(subventionAmount)} €</FormText>
                          </Authorization>
                        </Column>
                      </Row>
                    );
                  })}
                </Fragment>
              }
            </Authorization>

            <Row>
              <Column small={12} large={6}>
                <Divider />
              </Column>
            </Row>
            <Row>
              <Column small={4} large={2}>
                <FormText className='semibold'>Yhteensä</FormText>
              </Column>
              <Column small={4} large={2}>
                <FormText className='semibold'>{formatNumber(totalSubventionPercent)} %</FormText>
              </Column>
              <Column small={4} large={2}>
                <FormText className='semibold'>{formatNumber(totalSubventionAmount)} €</FormText>
              </Column>
            </Row>
          </WhiteBox>
        }
      </BoxContentWrapper>
    </BoxItem>
  );
};

export default connect(
  (state) => {
    return {
      leaseAttributes: getLeaseAttributes(state),
    };
  }
)(BasisOfRent);
