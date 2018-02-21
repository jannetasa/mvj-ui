// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';

import {fetchRentCriterias} from '../actions';
import {getIsFetching, getRentCriteriasList} from '../selectors';
import {formatDateObj, getLabelOfOption, getSearchQuery} from '../../util/helpers';
import {purposeOptions} from '../constants';
import {getRouteById} from '../../root/routes';
import Button from '../../components/button/Button';
import EditableMap from '../../components/map/EditableMap';
import Loader from '../../components/loader/Loader';
import Search from './search/Search';
import Table from '../../components/table/Table';
import TableControllers from '../../components/table/TableControllers';

import mapGreenIcon from '../../../assets/icons/map-green.svg';
import mapIcon from '../../../assets/icons/map.svg';
import tableGreenIcon from '../../../assets/icons/table-green.svg';
import tableIcon from '../../../assets/icons/table.svg';

type Props = {
  fetchRentCriterias: Function,
  isFetching: boolean,
  rentcriterias: Array<Object>,
  router: Object,
}

type State = {
  visualizationType: string,
}

class RentCriteriaList extends Component {
  props: Props

  state: State = {
    visualizationType: 'table',
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  search: any

  componentWillMount() {
    const {fetchRentCriterias} = this.props;
    const {router: {location: {query}}} = this.props;

    fetchRentCriterias(getSearchQuery(query));
  }

  componentDidMount = () => {
    const {router: {location: {query}}} = this.props;
    this.search.initialize(query);
  }

  handleSearchChange = (query) => {
    const {fetchRentCriterias} = this.props;
    const {router} = this.context;
    const search = getSearchQuery(query);
    fetchRentCriterias(search);
    console.log(query);

    return router.push({
      pathname: getRouteById('rentcriterias'),
      query,
    });
  }

  render() {
    const {isFetching, rentcriterias} = this.props;
    const {visualizationType} = this.state;

    return (
      <div className='rent-criteria-list'>
        <Row>
          <Column>
            <div className="rent-criteria-list__search-wrapper">
              <div className="search-container">
                <Search
                  ref={(input) => { this.search = input; }}
                  onSearch={(query) => this.handleSearchChange(query)}
                />
              </div>
              <div className="button-container">
                <Button
                  className='no-margin'
                  onClick={() => alert('TODO: Luo uusi vuokrausperuste')}
                  text='Luo uusi vuokrausperuste'
                />
              </div>
            </div>
          </Column>
        </Row>
        <Row>
          <Column>
            <TableControllers
              iconSelectorOptions={[
                {value: 'table', label: 'Taulukko', icon: tableIcon, iconSelected: tableGreenIcon},
                {value: 'map', label: 'Kartta', icon: mapIcon, iconSelected: mapGreenIcon}]
              }
              iconSelectorValue={visualizationType}
              onIconSelectorChange={
                (value) => this.setState({visualizationType: value})
              }
              title={`Viimeksi muokattuja`}
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
                    amount={rentcriterias.length}
                    data={rentcriterias}
                    dataKeys={[
                      {key: 'real_estate_ID', label: 'Kiinteistötunnus'},
                      {key: 'purpose', label: 'Pääkäyttötarkoitus', renderer: (val) => val ? getLabelOfOption(purposeOptions, val) : '-'},
                      {key: 'end_date', label: 'Loppupvm', renderer: (val) => formatDateObj(val, 'DD.MM.YYYY')},
                      {key: 'start_date', label: 'Alkupvm', renderer: (val) => formatDateObj(val, 'DD.MM.YYYY')},
                    ]}
                    onRowClick={(item) => console.log(item)}
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
        isFetching: getIsFetching(state),
        rentcriterias: getRentCriteriasList(state),
      };
    },
    {
      fetchRentCriterias,
    },
  ),
)(RentCriteriaList);
