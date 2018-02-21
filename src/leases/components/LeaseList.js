// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import flowRight from 'lodash/flowRight';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import {getRouteById} from '../../root/routes';
import {createLease, fetchAttributes, fetchLeases} from '../actions';
import {getAttributes, getIsFetching, getLeasesList} from '../selectors';
import {leaseTypeOptions} from '../constants';
import * as contentHelpers from '../helpers';
import {getSearchQuery} from '../../util/helpers';
import Button from '../../components/button/Button';
import CreateLease from '../components/leaseSections/CreateLease';
import EditableMap from '../../components/map/EditableMap';
import Loader from '../../components/loader/Loader';
import Modal from '../../components/modal/Modal';
import Search from './search/Search';
import Table from '../../components/table/Table';
import TableControllers from '../../components/table/TableControllers';

import mapGreenIcon from '../../../assets/icons/map-green.svg';
import mapIcon from '../../../assets/icons/map.svg';
import tableGreenIcon from '../../../assets/icons/table-green.svg';
import tableIcon from '../../../assets/icons/table.svg';

type Props = {
  attributes: Object,
  createLease: Function,
  fetchAttributes: Function,
  fetchLeases: Function,
  isFetching: boolean,
  leases: Object,
  router: Object,
}

type State = {
  documentType: Array<string>,
  isCreateLeaseIdentifierModalOpen: boolean,
  visualizationType: string,
}

class LeaseList extends Component {
  props: Props

  state: State = {
    documentType: [],
    isCreateLeaseIdentifierModalOpen: false,
    newLeaseStatus: '',
    newLeaseTitle: '',
    visualizationType: 'table',
  }

  search: any

  static contextTypes = {
    router: PropTypes.object,
  };

  componentWillMount() {
    const {fetchAttributes, fetchLeases} = this.props;
    const {router: {location: {query}}} = this.props;

    fetchAttributes();
    fetchLeases(getSearchQuery(query));
  }

  componentDidMount = () => {
    const {router: {location: {query}}} = this.props;
    this.search.initialize(query);
  }

  showModal = (modalName: string) => {
    const modalVisibilityKey = `is${modalName}ModalOpen`;
    this.setState({
      [modalVisibilityKey]: true,
    });
  }

  hideModal = (modalName: string) => {
    const modalVisibilityKey = `is${modalName}ModalOpen`;
    this.setState({
      [modalVisibilityKey]: false,
    });
  }

  handleSearchChange = (query) => {
    const {fetchLeases} = this.props;
    const {router} = this.context;
    const search = getSearchQuery(query);
    fetchLeases(search);

    return router.push({
      pathname: getRouteById('leases'),
      query,
    });
  }

  handleRowClick = (id) => {
    const {router} = this.context;
    const {router: {location: {query}}} = this.props;

    return router.push({
      pathname: `${getRouteById('leases')}/${id}`,
      query,
    });
  };

  openCreateLeaseModal = () => {
    this.showModal('CreateLeaseIdentifier');
  }

  render() {
    const {documentType,
      isCreateLeaseIdentifierModalOpen,
      visualizationType} = this.state;
    const {attributes,
      createLease,
      leases: content, isFetching} = this.props;
    const leases = contentHelpers.getContentLeases(content, attributes);
    //TODO: Filter leases by document type on front-end for demo purposes. Move to backend and end points are working
    const filteredLeases = contentHelpers.getLeasesFilteredByDocumentType(leases, documentType);

    return (
      <div className='lease-list'>
        <Modal
          isOpen={isCreateLeaseIdentifierModalOpen}
          onClose={() => this.hideModal('CreateLeaseIdentifier')}
          title={'Luo vuokratunnus'}
        >
          <CreateLease
            attributes={attributes}
            onSubmit={(lease) => createLease(lease)}
          />
        </Modal>
        <Row>
          <Column small={10}>
            <Search
              ref={(input) => { this.search = input; }}
              attributes={attributes}
              onSearch={(query) => this.handleSearchChange(query)}
            />
          </Column>
          <Column small={2} style={{paddingLeft: 0}}>
            <Button
              className='no-margin full-width'
              onClick={() => this.showModal('CreateLeaseIdentifier')}
              text='Luo uusi vuokratunnus'
            />
          </Column>
        </Row>
        <Row>
          <Column>
            <TableControllers
              buttonSelectorOptions={leaseTypeOptions}
              buttonSelectorValue={documentType}
              onButtonSelectorChange={(value) => {this.setState({documentType: value});}}
              iconSelectorOptions={[
                {value: 'table', label: 'Taulukko', icon: tableIcon, iconSelected: tableGreenIcon},
                {value: 'map', label: 'Kartta', icon: mapIcon, iconSelected: mapGreenIcon}]
              }
              iconSelectorValue={visualizationType}
              onIconSelectorChange={
                (value) => this.setState({visualizationType: value})
              }
              title={`Löytyi ${filteredLeases.length} kpl`}
            />
          </Column>
        </Row>
        {isFetching && <Row><Column><div className='loader__wrapper'><Loader isLoading={isFetching} /></div></Column></Row>}
        {!isFetching &&
          <div>
            {visualizationType === 'table' && (
              <Row>
                <Column>
                  <Table
                    amount={filteredLeases.length}
                    data={filteredLeases}
                    dataKeys={[
                      {key: 'identifier', label: 'Vuokratunnus'},
                      {key: 'real_property_unit', label: 'Vuokrakohde'},
                      {key: 'tenant', label: 'Vuokralainen'},
                      {key: 'person', label: 'Vuokranantaja'},
                      {key: 'address', label: 'Osoite'},
                      {key: 'status', label: 'Tyyppi'},
                      {key: 'start_date', label: 'Alkupvm'},
                      {key: 'end_date', label: 'Loppupvm'},
                    ]}
                    onRowClick={this.handleRowClick}
                  />
                </Column>
              </Row>
            )}
            {visualizationType === 'map' && (
              <Row>
                <Column>
                  <EditableMap />
                </Column>
              </Row>
            )}
          </div>
        }
      </div>
    );
  }
}

export default flowRight(
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
        isFetching: getIsFetching(state),
        leases: getLeasesList(state),
      };
    },
    {
      createLease,
      fetchLeases,
      fetchAttributes,
    },
  ),
)(LeaseList);
