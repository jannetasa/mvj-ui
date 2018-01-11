// @flow
import React, {Component} from 'react';
import {Row, Column} from 'react-foundation';

import PropertyUnitPlotItem from './PropertyUnitPlotItem';
import PropertyUnitPlanPlotItem from './PropertyUnitPlanPlotItem';

type Props = {
  area: Object,
}

class PropertyUnitPlot extends Component {
  props: Props

  render() {
    const {area} = this.props;
    return (
      <div>
        <h2 className="subsection-title">Kiinteistöt ja määräalat</h2>
        <Row>
          <Column medium={6}>
            <div className="subsection-item">
              <Row>
                <Column small={12}><span className='title'>Kiinteistöt / määräalat sopimushetkellä</span></Column>
              </Row>
              {area.plots_in_contract && area.plots_in_contract.length > 0 ? (
                area.plots_in_contract.map((item, index) =>
                  <PropertyUnitPlotItem item={item} key={index}/>)
              ) : (
                <p className="text-no-margin">Ei kiinteistöjä / määräaloja sopimushetkellä</p>
              )}
            </div>
          </Column>
          <Column medium={6}>
            <div className="subsection-item">
              <Row>
                <Column small={12}><span className='title'>Kiinteistöt / määräalat nykyhetkellä</span></Column>
              </Row>
              {area.plots_at_present && area.plots_at_present.length > 0 ? (
                area.plots_at_present.map((item, index) =>
                  <PropertyUnitPlotItem item={item} key={index}/>)
              ) : (
                <p className="text-no-margin">Ei kiinteistöjä / määräaloja nykyhetkellä</p>
              )}
            </div>
          </Column>
        </Row>
        <h2 className="subsection-title">Kaavayksiköt</h2>
        <Row>
          <Column medium={6}>
            <div className="subsection-item">
              <Row>
                <Column small={12}><span className='title'>Kaavayksiköt sopimushetkellä</span></Column>
              </Row>
              {area.plan_plots_in_contract && area.plan_plots_in_contract.length > 0 ? (
                area.plan_plots_in_contract.map((item, index) =>
                  <PropertyUnitPlanPlotItem item={item} key={index}/>)
              ) : (
                <p className="text-no-margin">Ei kaavayksiköitä sopimushetkellä</p>
              )}
            </div>
          </Column>
          <Column medium={6}>
            <div className="subsection-item">
              <Row>
                <Column small={12}><span className='title'>Kaavayksiköt nykyhetkellä</span></Column>
              </Row>
              {area.plan_plots_at_present && area.plan_plots_at_present.length > 0 ? (
                area.plan_plots_at_present.map((item, index) =>
                <PropertyUnitPlanPlotItem item={item} key={index}/>)
              ) : (
                <p className="text-no-margin">Ei kaavayksiköitä nykyhetkellä</p>
              )}
            </div>
          </Column>
        </Row>
      </div>
    );
  }
}

export default PropertyUnitPlot;
