// @flow
import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import Divider from '$components/content/Divider';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import GreenBox from '$components/content/GreenBox';
import SubTitle from '$components/content/SubTitle';
import WhiteBox from '$components/content/WhiteBox';
import {getContentCompensations} from '$src/landUseContract/helpers';
import {formatNumber} from '$util/helpers';
import {getCurrentLandUseContract} from '$src/landUseContract/selectors';

import type {LandUseContract} from '$src/landUseContract/types';

type Props = {
  currentLandUseContract: LandUseContract,
}

const Compensations = ({currentLandUseContract}: Props) => {
  const getTotal = (compensations: Object) => {
    const cash = Number(get(compensations, 'cash_compensation'));
    const land = Number(get(compensations, 'land_compensation'));
    const other = Number(get(compensations, 'other_compensation'));
    const increase = Number(get(compensations, 'first_installment_increase'));
    return cash + land + other + increase;
  };

  const compensations = getContentCompensations(currentLandUseContract);
  const total = getTotal(compensations);

  return (
    <Fragment>
      <GreenBox>
        <Row>
          <Column small={12} large={6}>
            <SubTitle>Maankäyttökorvaus</SubTitle>
            <WhiteBox>
              <Row>
                <Column small={6} medium={3} large={4}>
                  <FormTextTitle title='Maankäyttökorvaus' />
                </Column>
                <Column small={6} medium={3} large={4}>
                  <FormTextTitle title='Korvauksen määrä' />
                </Column>
              </Row>
              <Row>
                <Column small={6} medium={3} large={4}>
                  <FormText>Rahakorvaus</FormText>
                </Column>
                <Column small={6} medium={3} large={4}>
                  <FormText>{compensations.cash_compensation ? `${formatNumber(compensations.cash_compensation)} €` : '-'}</FormText>
                </Column>
              </Row>
              <Row>
                <Column small={6} medium={3} large={4}>
                  <FormText>Maakorvaus</FormText>
                </Column>
                <Column small={6} medium={3} large={4}>
                  <FormText>{compensations.land_compensation ? `${formatNumber(compensations.land_compensation)} €` : '-'}</FormText>
                </Column>
              </Row>
              <Row>
                <Column small={6} medium={3} large={4}>
                  <FormText>Muu</FormText>
                </Column>
                <Column small={6} medium={3} large={4}>
                  <FormText>{compensations.other_compensation ? `${formatNumber(compensations.other_compensation)} €` : '-'}</FormText>
                </Column>
              </Row>
              <Row>
                <Column small={6} medium={3} large={4}>
                  <FormText className='no-margin'>1. maksuerän korotus</FormText>
                </Column>
                <Column small={6} medium={3} large={4}>
                  <FormText className='no-margin'>{compensations.first_installment_increase ? `${formatNumber(compensations.first_installment_increase)} €` : '-'}</FormText>
                </Column>
              </Row>
              <Divider />
              <Row>
                <Column small={6} medium={3} large={4}>
                  <FormText className='semibold'>Yhteensä</FormText>
                </Column>
                <Column small={6} medium={3} large={4}>
                  <FormText>{`${formatNumber(total)} €`}</FormText>
                </Column>
              </Row>
            </WhiteBox>
          </Column>
        </Row>
      </GreenBox>
      <GreenBox className={'with-top-margin'}>
        <Row>
          <Column small={12} large={6}>
            <SubTitle>Korvauksetta luovutettavat yleiset alueet</SubTitle>
            <WhiteBox>
              <Row>
                <Column small={6} medium={3} large={4}>
                  <FormTextTitle title='Kaavayksikön käyttötarkoitus' />
                </Column>
                <Column small={6} medium={3} large={4}>
                  <FormTextTitle title='Hankinta-arvo €' />
                </Column>
                <Column small={6} medium={3} large={4}>
                  <FormTextTitle title='m²' />
                </Column>
              </Row>
              <Row>
                <Column small={6} medium={3} large={4}>
                  <FormText>Katu (9901)</FormText>
                </Column>
                <Column small={6} medium={3} large={4}>
                  <FormText>{compensations.street_acquisition_value ? `${formatNumber(compensations.street_acquisition_value)} €` : '-'}</FormText>
                </Column>
                <Column small={6} medium={3} large={4}>
                  <FormText>{compensations.street_area ? `${formatNumber(compensations.street_area)} m²` : '-'}</FormText>
                </Column>
              </Row>
              <Row>
                <Column small={6} medium={3} large={4}>
                  <FormText>Puisto (9903)</FormText>
                </Column>
                <Column small={6} medium={3} large={4}>
                  <FormText>{compensations.park_acquisition_value ? `${formatNumber(compensations.park_acquisition_value)} €` : '-'}</FormText>
                </Column>
                <Column small={6} medium={3} large={4}>
                  <FormText>{compensations.park_area ? `${formatNumber(compensations.park_area)} m²` : '-'}</FormText>
                </Column>
              </Row>
              <Row>
                <Column small={6} medium={3} large={4}>
                  <FormText>Muut</FormText>
                </Column>
                <Column small={6} medium={3} large={4}>
                  <FormText>{compensations.other_acquisition_value ? `${formatNumber(compensations.other_acquisition_value)} €` : '-'}</FormText>
                </Column>
                <Column small={6} medium={3} large={4}>
                  <FormText>{compensations.other_area ? `${formatNumber(compensations.other_area)} m²` : '-'}</FormText>
                </Column>
              </Row>
            </WhiteBox>
          </Column>
        </Row>
      </GreenBox>
      <GreenBox className={'with-top-margin'}>
        <Row>
          <Column small={12} large={6}>
            <SubTitle>Maankäyttökorvaus laskelma</SubTitle>
          </Column>
        </Row>
      </GreenBox>
      <GreenBox className={'with-top-margin'}>
        <Row>
          <Column small={12}>
            <SubTitle>Laskelmassa käytetyt yksikköhinnat</SubTitle>
          </Column>
          <WhiteBox small={12}>
            <Row>
              <Column small={6} medium={3} large={4}>
                <FormTextTitle title='Kaavayksikön käyttötarkoitus' />
              </Column>
              <Column small={6} medium={3} large={4}>
                <FormTextTitle title='Hallintamuoto' />
              </Column>
              <Column small={6} medium={3} large={4}>
                <FormTextTitle title='Suojeltu' />
              </Column>
              <Column small={6} medium={3} large={4}>
                <FormTextTitle title='k-m²' />
              </Column>
              <Column small={6} medium={3} large={4}>
                <FormTextTitle title='Yksikköhinta €' />
              </Column>
              <Column small={6} medium={3} large={4}>
                <FormTextTitle title='Alennus %' />
              </Column>
              <Column small={6} medium={3} large={4}>
                <FormTextTitle title='Käytetty hinta' />
              </Column>
            </Row>
            {
              compensations.unit_prices_used_in_calculation && compensations.unit_prices_used_in_calculation.map((calculation, index) => <Row key={index}>
                <Column small={6} medium={3} large={4}>
                  <FormText>{calculation.usage ? calculation.usage : '-'}</FormText>
                </Column>
                <Column small={6} medium={3} large={4}>
                  <FormText>{calculation.management ? calculation.management : '-'}</FormText>
                </Column>
                <Column small={6} medium={3} large={4}>
                  <FormText>{calculation.protected ? calculation.protected : '-'}</FormText>
                </Column>
                <Column small={6} medium={3} large={4}>
                  <FormText>{calculation.area ? `${formatNumber(calculation.area)} m²` : '-'}</FormText>
                </Column>
                <Column small={6} medium={3} large={4}>
                  <FormText>{calculation.unit_value ? `${formatNumber(calculation.unit_value)} €` : '-'}</FormText>
                </Column>
                <Column small={6} medium={3} large={4}>
                  <FormText>{calculation.discount ? `${formatNumber(calculation.discount)} €` : '-'}</FormText>
                </Column>
                <Column small={6} medium={3} large={4}>
                  <FormText>{calculation.used_price ? `${formatNumber(calculation.used_price)} €` : '-'}</FormText>
                </Column>
              </Row>)}
          </WhiteBox>
        </Row>
      </GreenBox>
    </Fragment>
  );
};

export default connect(
  (state) => {
    return {
      currentLandUseContract: getCurrentLandUseContract(state),
    };
  }
)(Compensations);
