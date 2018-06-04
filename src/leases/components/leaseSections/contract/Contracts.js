// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {Column} from 'react-foundation';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import Collapse from '$components/collapse/Collapse';
import ContractItem from './ContractItem';
import {getContentContracts} from '$src/leases/helpers';
import {isContractActive} from '$src/leases/helpers';
import {formatDate, getAttributeFieldOptions, getDecisionsOptions, getLabelOfOption} from '$util/helpers';
import {getDecisionsByLease} from '$src/decision/selectors';
import {getAttributes, getCurrentLease} from '$src/leases/selectors';

import type {Attributes, Lease} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  currentLease: Lease,
  decisions: Array<Object>,
}

type State = {
  contracts: Array<Object>,
  decisionOptions: Array<Object>,
  typeOptions: Array<Object>,
}

class Contracts extends PureComponent<Props, State> {
  state = {
    contracts: [],
    decisionOptions: [],
    typeOptions: [],
  }

  componentDidMount() {
    const {attributes, currentLease, decisions} = this.props;
    if(!isEmpty(attributes)) {
      this.updateOptions();
    }

    if(!isEmpty(currentLease)) {
      this.updateContent();
    }

    if(!isEmpty(decisions)) {
      this.updateDecisionOptions();
    }
  }

  componentDidUpdate(prevProps) {
    if(prevProps.attributes !== this.props.attributes) {
      this.updateOptions();
    }

    if(prevProps.currentLease !== this.props.currentLease) {
      this.updateContent();
    }

    if(prevProps.decisions !== this.props.decisions) {
      this.updateDecisionOptions();
    }
  }

  updateContent = () => {
    const {currentLease} = this.props;
    this.setState({
      contracts: getContentContracts(currentLease),
    });
  }

  updateDecisionOptions = () => {
    const {decisions} = this.props;

    this.setState({
      decisionOptions: getDecisionsOptions(decisions),
    });
  }

  updateOptions = () => {
    const {attributes} = this.props;
    this.setState({
      typeOptions: getAttributeFieldOptions(attributes, 'contracts.child.children.type'),
    });
  }

  render() {
    const {contracts, decisionOptions, typeOptions} = this.state;

    return (
      <div>
        {(!contracts || !contracts.length) && <p>Ei sopimuksia</p>}
        {contracts && !!contracts.length && contracts.map((contract, index) =>
          <Collapse
            key={index}
            defaultOpen={false}
            header={
              <div>
                <Column>
                  <span className='collapse__header-subtitle'>
                    {formatDate(contract.signing_date) || '-'}
                  </span>
                </Column>
                <Column>
                  <span className='collapse__header-subtitle'>
                    {isContractActive(contract) ? 'Voimassa' : 'Ei voimassa'}
                  </span>
                </Column>
              </div>
            }
            headerTitle={
              <h3 className='collapse__header-title'>
                {getLabelOfOption(typeOptions, contract.type)} {get(contract, 'contract_number')}
              </h3>
            }
          >
            <ContractItem
              contract={contract}
              decisionOptions={decisionOptions}
              typeOptions={typeOptions}
            />
          </Collapse>
        )}
      </div>
    );
  }
}

export default connect(
  (state) => {
    const currentLease = getCurrentLease(state);
    return {
      attributes: getAttributes(state),
      currentLease: getCurrentLease(state),
      decisions: getDecisionsByLease(state, currentLease.id),
    };
  },
)(Contracts);
