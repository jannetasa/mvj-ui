// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FieldArray, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import type {Element} from 'react';

import AddButton from '$components/form/AddButton';
import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import FormField from '$components/form/FormField';
import RemoveButton from '$components/form/RemoveButton';
import {receiveFormValidFlags} from '$src/landUseContract/actions';
import {FormNames} from '$src/landUseContract/enums';
import {getAttributes, getErrorsByFormName, getIsSaveClicked} from '$src/landUseContract/selectors';
import {referenceNumber} from '$components/form/validations';

import type {Attributes} from '$src/landUseContract/types';

type DecisionConditionsProps = {
  attributes: Attributes,
  errors: ?Object,
  fields: any,
  isSaveClicked: boolean,
}

const renderDecisionConditions = ({
  attributes,
  errors,
  fields,
  fields: {name},
  isSaveClicked,
}: DecisionConditionsProps): Element<*> => {
  const decisionConditionsErrors = get(errors, name);

  return(
    <Collapse
      className='collapse__secondary'
      defaultOpen={true}
      hasErrors={isSaveClicked && !isEmpty(decisionConditionsErrors)}
      headerTitle={
        <h4 className='collapse__header-title'>Ehdot</h4>
      }
    >
      <BoxItemContainer>
        {fields && !!fields.length && fields.map((condition, index) =>
          <BoxItem
            key={condition.id ? condition.id : `index_${index}`}
            className='no-border-on-first-child'
          >
            <BoxContentWrapper>
              <RemoveButton
                className='position-topright-no-padding'
                onClick={() => fields.remove(index)}
                title="Poista ehto"
              />
              <Row>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'decisions.child.children.conditions.child.children.type')}
                    name={`${condition}.type`}
                    overrideValues={{
                      label: 'Hallintamuoto',
                    }}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'decisions.child.children.conditions.child.children.area')}
                    name={`${condition}.area`}
                    unit='k-m²'
                    overrideValues={{
                      label: 'Ala',
                    }}
                  />
                </Column>
                <Column small={12} medium={4} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'decisions.child.children.conditions.child.children.deposit')}
                    name={`${condition}.deposit`}
                    unit='€'
                    overrideValues={{
                      label: 'Vakuus',
                    }}
                  />
                </Column>
                <Column small={12} medium={4} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'decisions.child.children.conditions.child.children.compensation')}
                    name={`${condition}.compensation`}
                    unit='€/k-m²'
                    overrideValues={{
                      label: 'Korvaus',
                    }}
                  />
                </Column>
                <Column small={12} medium={8} large={4}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'decisions.child.children.conditions.child.children.note')}
                    name={`${condition}.note`}
                    overrideValues={{
                      label: 'Huomautus',
                    }}
                  />
                </Column>
              </Row>
            </BoxContentWrapper>
          </BoxItem>
        )}
      </BoxItemContainer>
      <Row>
        <Column>
          <AddButtonSecondary
            label='Lisää ehto'
            onClick={() => fields.push({})}
            title='Lisää ehto'
          />
        </Column>
      </Row>
    </Collapse>
  );
};

type DecisionsProps = {
  attributes: Attributes,
  errors: ?Object,
  fields: any,
  isSaveClicked: boolean,
}

const renderDecisions = ({attributes, errors, fields, isSaveClicked}: DecisionsProps): Element<*> =>
  <div>
    {fields && !!fields.length && fields.map((decision, index) => {
      const decisionErrors = get(errors, decision);

      return (
        <Collapse
          key={decision.id ? decision.id : `index_${index}`}
          defaultOpen={true}
          hasErrors={isSaveClicked && !isEmpty(decisionErrors)}
          headerTitle={
            <h3 className='collapse__header-title'>Päätös {index + 1}</h3>
          }
        >
          <BoxContentWrapper>
            <RemoveButton
              className='position-topright'
              onClick={() => fields.remove(index)}
              title="Poista sopimus"
            />
            <Row>
              <Column small={6} medium={4} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'decisions.child.children.decision_maker')}
                  name={`${decision}.decision_maker`}
                  overrideValues={{
                    label: 'Päättäjä',
                  }}
                />
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'decisions.child.children.decision_date')}
                  name={`${decision}.decision_date`}
                  overrideValues={{
                    label: 'Päätöspvm',
                  }}
                />
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'decisions.child.children.section')}
                  name={`${decision}.section`}
                  unit='§'
                  overrideValues={{
                    label: 'Pykälä',
                  }}
                />
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'decisions.child.children.type')}
                  name={`${decision}.type`}
                  overrideValues={{
                    label: 'Päätöksen tyyppi',
                  }}
                />
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'decisions.child.children.reference_number')}
                  name={`${decision}.reference_number`}
                  validate={referenceNumber}
                  overrideValues={{
                    label: 'Diaarinumero',
                  }}
                />
              </Column>
            </Row>
          </BoxContentWrapper>

          <FieldArray
            attributes={attributes}
            component={renderDecisionConditions}
            errors={errors}
            isSaveClicked={isSaveClicked}
            name={`${decision}.conditions`}
          />
        </Collapse>
      );
    }

    )}
    <Row>
      <Column>
        <AddButton
          label='Lisää päätös'
          onClick={() => fields.push({})}
          title='Lisää päätös'
        />
      </Column>
    </Row>
  </div>;


type Props = {
  attributes: Attributes,
  errors: ?Object,
  receiveFormValidFlags: Function,
  isSaveClicked: boolean,
  valid: boolean,
}

class DecisionsEdit extends Component<Props> {
  componentDidUpdate(prevProps) {
    const {receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.DECISIONS]: this.props.valid,
      });
    }
  }

  render() {
    const {attributes, errors, isSaveClicked} = this.props;
    return (
      <form>
        <FieldArray
          attributes={attributes}
          component={renderDecisions}
          errors={errors}
          isSaveClicked={isSaveClicked}
          name="decisions"
        />
      </form>
    );
  }
}

const formName = FormNames.DECISIONS;

export default flowRight(
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
        errors: getErrorsByFormName(state, formName),
        isSaveClicked: getIsSaveClicked(state),
      };
    },
    {
      receiveFormValidFlags,
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(DecisionsEdit);
