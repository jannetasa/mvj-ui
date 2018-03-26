// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import classNames from 'classnames';

import {formatDate, getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import Collapse from '$components/collapse/Collapse';
import GreenBox from '$components/content/GreenBox';
import GreenBoxItem from '$components/content/GreenBoxItem';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  decision: Object,
}

const DecisionItem = ({attributes, decision}: Props) => {
  const conditionTypeOptions = getAttributeFieldOptions(attributes,
    'decisions.child.children.conditions.child.children.type');

  return (
    <div>
      <GreenBox>
        <Row>
          <Column small={12} medium={6}>
            <label>Selite</label>
            <p className='no-margin'>{decision.description || '–'}</p>
          </Column>
          <Column small={12} medium={6}>
            <label>Diaarinumero</label>
            <p className='no-margin'>{decision.reference_number || '–'}</p>
          </Column>
        </Row>
      </GreenBox>

      <Collapse
        className='collapse__secondary'
        defaultOpen={true}
        header={
          <Row>
            <Column small={12}><span className='collapse__header-title'>Ehdot</span></Column>
          </Row>
        }
      >
        {decision.conditions && decision.conditions.length
          ? (
            <div>
              {decision.conditions.map((condition) =>
                <GreenBoxItem key={condition.id}>
                  <Row>
                    <Column small={6} medium={4}>
                      <label>Ehtotyyppi</label>
                      <p>{getLabelOfOption(conditionTypeOptions, condition.type) || '–'}</p>
                    </Column>
                    <Column small={6} medium={4}>
                      <label>Valvonta päivämäärä</label>
                      {condition.supervision_date
                        ? (
                          <p className={
                              classNames({'alert': condition.supervision_date && !condition.supervised_date})
                            }>
                            <i/>{formatDate(condition.supervision_date)}
                          </p>
                        ) : <p>–</p>
                      }
                    </Column>
                    <Column small={12} medium={4}>
                      <label>Valvottu päivämäärä</label>
                      {condition.supervised_date
                        ? (
                          <p className={
                              classNames({'success': condition.supervised_date})
                            }>
                            <i/>{formatDate(condition.supervised_date)}
                          </p>
                        ) : <p>–</p>
                      }
                    </Column>
                  </Row>
                  <Row>
                    <Column medium={12}>
                      <label>Selite</label>
                      <p className='no-margin'>{condition.description || '–'}</p>
                    </Column>
                  </Row>
                </GreenBoxItem>
              )}
            </div>
          ) : (
            <p className='no-margin'>Ei ehtoja</p>
          )
        }
      </Collapse>
    </div>
  );
};

export default DecisionItem;
