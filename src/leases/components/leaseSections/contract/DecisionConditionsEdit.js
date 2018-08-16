// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import FormField from '$components/form/FormField';
import RemoveButton from '$components/form/RemoveButton';
import {getAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  collapseState: boolean,
  errors: ?Object,
  fields: any,
  isSaveClicked: boolean,
  onCollapseToggle: Function,
}

const DecisionConditionsEdit = ({
  attributes,
  collapseState,
  errors,
  fields,
  fields: {name},
  isSaveClicked,
  onCollapseToggle,
}: Props) => {
  const handleCollapseToggle = (val: boolean) => onCollapseToggle(val);
  const handleAdd = () => fields.push({});

  const decisionConditionsErrors = get(errors, name);
  return(
    <Collapse
      className='collapse__secondary'
      defaultOpen={collapseState !== undefined ? collapseState : true}
      hasErrors={isSaveClicked && !isEmpty(decisionConditionsErrors)}
      headerTitle={<h4 className='collapse__header-title'>Ehdot</h4>}
      onToggle={handleCollapseToggle}
    >
      {fields && !!fields.length &&
        <BoxItemContainer>

          {fields.map((condition, index) => {
            const handleRemove = () => fields.remove(index);

            return (
              <BoxItem key={index}>
                <RemoveButton
                  className='position-topright'
                  onClick={handleRemove}
                  title="Poista ehto"
                />
                <Row>
                  <Column small={6} medium={4} large={2}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'decisions.child.children.conditions.child.children.type')}
                      name={`${condition}.type`}
                      overrideValues={{
                        label: 'Käyttötarkoitusehto',
                      }}
                    />
                  </Column>
                  <Column small={6} medium={4} large={2}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'decisions.child.children.conditions.child.children.supervision_date')}
                      name={`${condition}.supervision_date`}
                      overrideValues={{
                        label: 'Valvontapvm',
                      }}
                    />
                  </Column>
                  <Column small={12} medium={4} large={2}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'decisions.child.children.conditions.child.children.supervised_date')}
                      name={`${condition}.supervised_date`}
                      overrideValues={{
                        label: 'Valvottu pvm',
                      }}
                    />
                  </Column>
                  <Column small={12} medium={12} large={6}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'decisions.child.children.conditions.child.children.description')}
                      name={`${condition}.description`}
                      overrideValues={{
                        label: 'Huomautus',
                      }}
                    />
                  </Column>
                </Row>
              </BoxItem>
            );
          })}
        </BoxItemContainer>
      }
      <Row>
        <Column>
          <AddButtonSecondary
            label='Lisää ehto'
            onClick={handleAdd}
            title='Lisää ehto'
          />
        </Column>
      </Row>
    </Collapse>
  );
};

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
    };
  }
)(DecisionConditionsEdit);
