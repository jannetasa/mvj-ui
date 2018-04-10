// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import isNumber from 'lodash/isNumber';

import {fetchAttributes, fetchRentBasisList, initializeRentCriteria} from '../actions';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {getAttributes, getIsFetching, getRentBasisList} from '../selectors';
import {formatDateObj, getAttributeFieldOptions, getLabelOfOption, getSearchQuery} from '$util/helpers';
import {getRouteById} from '$src/root/routes';
import Button from '$components/button/Button';
import Loader from '$components/loader/Loader';
import PageContainer from '$components/content/PageContainer';
import Pagination from '$components/table/Pagination';
import Search from './search/Search';
import SearchWrapper from '$components/search/SearchWrapper';
import Table from '$components/table/Table';
import TableControllers from '$components/table/TableControllers';

import type {Attributes, RentBasisList} from '../types';

const PAGE_SIZE = 25;

type Props = {
  attributes: Attributes,
  fetchAttributes: Function,
  fetchRentBasisList: Function,
  initializeRentCriteria: Function,
  isFetching: boolean,
  receiveTopNavigationSettings: Function,
  rentBasisListData: RentBasisList,
  router: Object,
}

type State = {
  activePage: number,
}

class RentBasisListPage extends Component {
  props: Props

  state: State = {
    activePage: 1,
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  search: any

  componentWillMount() {
    const {fetchAttributes, fetchRentBasisList, receiveTopNavigationSettings} = this.props;
    const {router: {location: {query}}} = this.props;

    receiveTopNavigationSettings({
      linkUrl: getRouteById('rentbasis'),
      pageTitle: 'Vuokrausperusteet',
      showSearch: false,
    });

    const page = Number(query.page);

    if(!page || !isNumber(page) || query.page <= 1) {
      this.setState({activePage: 1});
      query.limit = PAGE_SIZE;
    } else {
      this.setState({activePage: page});
      query.limit = PAGE_SIZE;
      query.offset = (page - 1) * PAGE_SIZE;
    }

    fetchRentBasisList(getSearchQuery(query));
    fetchAttributes();
  }

  componentDidMount = () => {
    const {router: {location: {query}}} = this.props;
    this.search.initialize(query);
  }

  handleSearchChange = (query) => {
    const {fetchRentBasisList} = this.props;
    const {activePage} = this.state;
    const {router} = this.context;

    query.limit = PAGE_SIZE;

    if(activePage > 1) {
      query.page = activePage;
      query.offset = (activePage - 1) * PAGE_SIZE;
    } else {
      query.page = undefined;
      query.offset = undefined;
    }

    fetchRentBasisList(getSearchQuery(query));

    query.offset = undefined;
    query.limit = undefined;

    return router.push({
      pathname: getRouteById('rentbasis'),
      query,
    });
  }

  handleCreateButtonClick = () => {
    const {initializeRentCriteria} = this.props;
    const {router} = this.context;

    initializeRentCriteria({
      decisions: [''],
      prices: [{}],
      real_estate_ids: [''],
    });

    return router.push({
      pathname: getRouteById('newrentbasis'),
    });
  }

  handleRowClick = (id) => {
    const {router} = this.context;
    const {router: {location: {query}}} = this.props;

    return router.push({
      pathname: `${getRouteById('rentbasis')}/${id}`,
      query,
    });
  };

  handlePageClick = (page: number) => {
    const {router} = this.context;
    const {fetchRentBasisList, router: {location: {query}}} = this.props;

    query.limit = PAGE_SIZE;
    if(page > 1) {
      query.page = page;
      query.offset = (page - 1) * PAGE_SIZE;
    } else {
      query.page = undefined;
      query.offset = undefined;
    }
    fetchRentBasisList(getSearchQuery(query));

    this.setState({activePage: page});

    query.offset = undefined;
    query.limit = undefined;

    return router.push({
      pathname: getRouteById('rentbasis'),
      query,
    });
  }

  getRentBasisCount = (rentBasisList: RentBasisList) => {
    return get(rentBasisList, 'count', 0);
  }

  getRentBasisList = (rentBasisList: RentBasisList) => {
    const items = get(rentBasisList, 'results', []);
    return items.map((item) => {
      return {
        id: item.id,
        property_identifier: get(item, 'property_identifiers[0].identifier'),
        management: get(item, 'management'),
        financing: get(item, 'financing'),
        start_date: get(item, 'start_date'),
        end_date: get(item, 'end_date'),
      };
    });
  }

  getRentBasisMaxPage = (rentBasisList: RentBasisList) => {
    const count = this.getRentBasisCount(rentBasisList);
    if(!count) {
      return 0;
    }
    else {
      return Math.ceil(count/PAGE_SIZE);
    }
  }

  render() {
    const {attributes, isFetching, rentBasisListData} = this.props;
    const {activePage} = this.state;

    const rentBasisList = this.getRentBasisList(rentBasisListData);
    const maxPage = this.getRentBasisMaxPage(rentBasisListData);

    const managementOptions = getAttributeFieldOptions(attributes, 'management');
    const financingOptions = getAttributeFieldOptions(attributes, 'financing');

    return (
      <PageContainer>
        <SearchWrapper
          buttonComponent={
            <Button
              className='no-margin'
              label='Luo vuokrausperuste'
              onClick={() => this.handleCreateButtonClick()}
              title='Luo vuokrausperuste'
            />
          }
          searchComponent={
            <Search
              ref={(input) => { this.search = input; }}
              onSearch={(query) => this.handleSearchChange(query)}
            />
          }
        />

        {isFetching && <Row><Column><div className='loader__wrapper'><Loader isLoading={isFetching} /></div></Column></Row>}
        {!isFetching &&
          <div>
            <TableControllers
              title={`Viimeksi muokattuja`}
            />
            <Table
              data={rentBasisList}
              dataKeys={[
                {key: 'property_identifier', label: 'Kiinteistötunnus'},
                {key: 'management', label: 'Hallintamuoto', renderer: (val) => val ? getLabelOfOption(managementOptions, val) : '-'},
                {key: 'financing', label: 'Rahoitusmuoto', renderer: (val) => val ? getLabelOfOption(financingOptions, val) : '-'},
                {key: 'end_date', label: 'Loppupvm', renderer: (val) => formatDateObj(val, 'DD.MM.YYYY')},
                {key: 'start_date', label: 'Alkupvm', renderer: (val) => formatDateObj(val, 'DD.MM.YYYY')},
              ]}
              onRowClick={this.handleRowClick}
            />
            <Pagination
              activePage={activePage}
              maxPage={maxPage}
              onPageClick={(page) => this.handlePageClick(page)}
            />
          </div>
        }
      </PageContainer>
    );
  }
}

export default flowRight(
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
        isFetching: getIsFetching(state),
        rentBasisListData: getRentBasisList(state),
      };
    },
    {
      fetchAttributes,
      fetchRentBasisList,
      initializeRentCriteria,
      receiveTopNavigationSettings,
    },
  ),
)(RentBasisListPage);
