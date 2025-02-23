// @flow
import {expect} from 'chai';

import {
  attributesNotFound,
  fetchAttributes,
  receiveAttributes,
  fetchPlotSearchList,
  receivePlotSearchList,
  fetchSinglePlotSearch,
  receiveSinglePlotSearch,
  editPlotSearch,
  createPlotSearch,
  notFound,
  hideEditMode,
  showEditMode,
  receiveCollapseStates,
  receiveIsSaveClicked,
  receiveFormValidFlags,
  clearFormValidFlags,
  receiveMethods,
  deletePlotSearch,
  fetchSinglePlotSearchAfterEdit,
  planUnitNotFound,
  fetchPlanUnit,
  receiveSinglePlanUnit,
  fetchPlanUnitAttributes,
  planUnitAttributesNotFound,
  receivePlanUnitAttributes,
  fetchPlotSearchSubtypes,
  PlotSearchSubtypeNotFound,
  receivePlotSearchSubtype,
  nullPlanUnits,
  receiveForm,
  formNotFound,
  receiveTemplateForms,
  fetchForm,
  removePlanUnitDecisions,
  addPlanUnitDecisions,
  resetPlanUnitDecisions,
} from './actions';

import mockData from './mock-data.json';

import plotSearchReducer from './reducer';

import type {PlotSearchState} from './types';

const mockForm = mockData[0].form;

const baseState: PlotSearchState = {
  attributes: null,
  collapseStates: {},
  current: {},
  isEditMode: false,
  isFetching: false,
  isFetchingAttributes: false,
  isFormValidById: {
    'plot-search-basic-information-form': true,
    'plot-search-application-form': true,
  },
  isSaveClicked: false,
  list: {},
  methods: null,
  planUnitAttributes: null,
  planUnit: {},
  pendingPlanUnitFetches: [],
  pendingPlanUnitAttributeFetches: [],
  subTypes: null,
  isFetchingFormAttributes: false,
  isFetchingForm: false,
  isFetchingTemplateForms: false,
  formAttributes: null,
  form: null,
  templateForms: [],
  decisionCandidates: {}
};


// $FlowFixMe
describe('PlotSearch', () => {

  // $FlowFixMe
  describe('Reducer', () => {

    // $FlowFixMe
    describe('plotSearchReducer', () => {

      // $FlowFixMe
      it('should update isFetchingAttributes flag to true', () => {
        const newState = {...baseState, isFetchingAttributes: true};

        const state = plotSearchReducer({}, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });

      it('should update attributes', () => {
        const dummyAttributes = {
          id: 1,
          label: 'Foo',
          name: 'Bar',
        };

        const newState = {...baseState, attributes: dummyAttributes, isFetchingAttributes: false};

        const state = plotSearchReducer({}, receiveAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching plotSearch list', () => {
        const newState = {...baseState};
        newState.isFetching = true;

        const state = plotSearchReducer({}, fetchPlotSearchList(''));
        expect(state).to.deep.equal(newState);
      });

      it('should update plotSearch list', () => {
        const dummyPlotSearchList = {
          id: 1,
          label: 'Foo',
          name: 'Bar',
        };

        const newState = {...baseState};
        newState.list = dummyPlotSearchList;

        const state = plotSearchReducer({}, receivePlotSearchList(dummyPlotSearchList));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching single plotSearch', () => {
        const newState = {...baseState};
        newState.isFetching = true;

        const state = plotSearchReducer({}, fetchSinglePlotSearch(1));
        expect(state).to.deep.equal(newState);
      });

      it('should update current plotSearch', () => {
        const dummyPlotSearch = {
          id: 1,
          label: 'Foo',
          name: 'Bar',
        };

        const newState = {...baseState};
        newState.current = dummyPlotSearch;

        const state = plotSearchReducer({}, receiveSinglePlotSearch(dummyPlotSearch));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true by createPlotSearch', () => {
        const newState = {...baseState};
        newState.isFetching = true;

        const state = plotSearchReducer({}, createPlotSearch({}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true by editPlotSearch', () => {
        const newState = {...baseState};
        newState.isFetching = true;

        const state = plotSearchReducer({}, editPlotSearch({}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by notFound', () => {
        const newState = {...baseState};
        newState.isFetching = false;

        const state = plotSearchReducer({}, notFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update isSaveClicked', () => {
        const newState = {...baseState};
        newState.isSaveClicked = true;

        const state = plotSearchReducer({}, receiveIsSaveClicked(true));
        expect(state).to.deep.equal(newState);
      });

      it('should update isEditMode flag to false by hideEditMode', () => {
        const newState = {...baseState};
        newState.isEditMode = false;

        const state = plotSearchReducer({}, hideEditMode());
        expect(state).to.deep.equal(newState);
      });

      it('should update isEditMode flag to true by showEditMode', () => {
        const newState = {...baseState};
        newState.isEditMode = true;

        const state = plotSearchReducer({}, showEditMode());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFormValidById', () => {
        const newState = {...baseState};
        const flags = {...newState.isFormValidById};
        flags['plotSearch-basic-information-form'] = false;
        newState.isFormValidById = flags;

        const state = plotSearchReducer({}, receiveFormValidFlags({['plotSearch-basic-information-form']: false}));
        expect(state).to.deep.equal(newState);
      });

      it('should clear isFormValidById', () => {
        const newState = {...baseState};

        let state = plotSearchReducer({}, receiveFormValidFlags({['plotSearch-basic-information-form']: false}));
        state = plotSearchReducer(state, clearFormValidFlags());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingAttributes flag to false by attributesNotFound', () => {
        const newState = {...baseState, isFetchingAttributes: false};

        let state = plotSearchReducer({}, fetchAttributes());
        state = plotSearchReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update pendingPlanUnitFetches array by planUnitNotFound', () => {
        const newState = {
          ...baseState,
          pendingPlanUnitFetches: []
        };

        const state = plotSearchReducer({
          pendingPlanUnitFetches: [1]
        }, planUnitNotFound(1));
        expect(state).to.deep.equal(newState);
      });

      it('should update pendingPlanUnitAttributeFetches array to false by planUnitAttributesNotFound', () => {
        const newState = {
          ...baseState,
          pendingPlanUnitAttributeFetches: []
        };

        const state = plotSearchReducer({
          pendingPlanUnitAttributeFetches: [1]
        }, planUnitAttributesNotFound(1));
        expect(state).to.deep.equal(newState);
      });

      it('should update pendingPlanUnitFetches array when fetching fetchPlanUnit', () => {
        const newState = {
          ...baseState,
          pendingPlanUnitFetches: [1]
        };

        const state = plotSearchReducer({}, fetchPlanUnit({ value: 1 }));
        expect(state).to.deep.equal(newState);
      });

      it('should update pendingPlanUnitFetchAttributes array when fetching fetchPlanUnitAttributes', () => {
        const newState = {
          ...baseState,
          pendingPlanUnitAttributeFetches: [1]
        };

        const state = plotSearchReducer({}, fetchPlanUnitAttributes({ value: 1 }));
        expect(state).to.deep.equal(newState);
      });

      it('fetchSinglePlotSearchAfterEdit function should not change isFetching flag', () => {
        const state = plotSearchReducer({}, fetchSinglePlotSearchAfterEdit({id: 1}));
        expect(state).to.deep.equal(baseState);
      });

      it('should update subTypes', () => {
        const dummyData = [{
          id: 16,
          name: 'Hinta- ja laatukilpailu',
          plot_search_type: 3,
        }];
        const newState = {...baseState, subTypes: dummyData};

        const state = plotSearchReducer({}, receivePlotSearchSubtype(dummyData));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by PlotSearchSubtypeNotFound', () => {
        const newState = {...baseState};
        newState.isFetching = false;

        const state = plotSearchReducer({}, PlotSearchSubtypeNotFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching fetchPlotSearchSubtypes', () => {
        const newState = {...baseState};
        newState.isFetching = true;

        const state = plotSearchReducer({}, fetchPlotSearchSubtypes());
        expect(state).to.deep.equal(newState);
      });

      it('should update methods', () => {
        const dummyMethods = {
          PATCH: true,
          DELETE: true,
          GET: true,
          HEAD: true,
          POST: true,
          OPTIONS: true,
          PUT: true,
        };
        const newState = {...baseState, methods: dummyMethods};

        const state = plotSearchReducer({}, receiveMethods(dummyMethods));
        expect(state).to.deep.equal(newState);
      });

      it('should update isSaving flag to true deleting plotsearch', () => {
        const dummyPlotSearch = 1;
        const newState = {...baseState, isFetching: true};

        const state = plotSearchReducer({}, deletePlotSearch(dummyPlotSearch));
        expect(state).to.deep.equal(newState);
      });

      it('should update template forms', () => {
        const newState = {
          ...baseState,
          templateForms: [{
            ...mockForm,
            is_template: true
          }]
        };

        const state = plotSearchReducer({}, receiveTemplateForms([
          {
            ...mockForm,
            is_template: true
          }
        ]));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingForm flag to true by fetchForm', () => {
        const newState = {
          ...baseState,
          isFetchingForm: true
        };

        const state = plotSearchReducer({}, fetchForm(1));
        expect(state).to.deep.equal(newState);
      });

      it('should update plotForm', () => {
        const newState = {
          ...baseState,
          form: mockForm
        };

        const state = plotSearchReducer({}, receiveForm(mockForm));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingForm flag to false by notFound', () => {
        const newState = {
          ...baseState,
          isFetchingForm: false
        };

        const state = plotSearchReducer({}, formNotFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update planUnitAttributes', () => {
        const dummyAttributes = {
          id: 1,
          label: 'Foo',
          name: 'Bar',
        };

        const newState = {
          ...baseState,
          planUnitAttributes: {
            [1]: dummyAttributes
          },
          pendingPlanUnitAttributeFetches: []
        };

        const state = plotSearchReducer({}, receivePlanUnitAttributes({[1]: dummyAttributes}));
        expect(state).to.deep.equal(newState);
      });

      it('should update PlanUnit', () => {
        const dummyPlotSearch = {
          id: 1,
          label: 'Foo',
          name: 'Bar',
        };

        const newState = {
          ...baseState,
          planUnit: {
            [1]: dummyPlotSearch
          },
          pendingPlanUnitFetches: []
        };

        const state = plotSearchReducer({}, receiveSinglePlanUnit({[1]: dummyPlotSearch}));
        expect(state).to.deep.equal(newState);
      });

      it('should null PlanUnits', () => {
        const newState = {...baseState, planUnit: null};

        const state = plotSearchReducer({}, nullPlanUnits());
        expect(state).to.deep.equal(newState);
      });

      it('should update collapseStates', () => {
        const newState = {...baseState, collapseStates: {foo: 'bar', foo2: 'bar2'}};

        let state = plotSearchReducer({}, receiveCollapseStates({foo: 'bar'}));
        state = plotSearchReducer(state, receiveCollapseStates({foo2: 'bar2'}));
        state.planUnit = {};
        expect(state).to.deep.equal(newState);
      });

      it('should add and annotate decision candidates from plan units', () => {
        const state = mockData[0].plot_search_targets.reduce(
          (state, nextTarget) => plotSearchReducer(state, addPlanUnitDecisions(nextTarget.plan_unit)),
          {});

        expect(Object.keys(state.decisionCandidates).length).to.equal(1);
        expect(state.decisionCandidates[1]).to.exist;
        expect(state.decisionCandidates[1].length).to.equal(2);
        expect(state.decisionCandidates[1][1].reference_number).to.equal("HEL 2021-000002");
        expect(state.decisionCandidates[1][1].relatedPlanUnitIdentifier).to.equal("91-1-1-1");
      });

      it('should remove decision candidates when plan units are no longer present in any targets', () => {
        let state = mockData[0].plot_search_targets.reduce(
          (state, nextTarget) => plotSearchReducer(state, addPlanUnitDecisions(nextTarget.plan_unit)),
          {});

        expect(state.decisionCandidates[1]).to.exist;
        expect(state.decisionCandidates[1].length).to.equal(2);

        state = plotSearchReducer(state, removePlanUnitDecisions(1));

        expect(state.decisionCandidates[1]).to.not.exist;
      });

      it('should not remove unrelated decision candidates', () => {
        let state = mockData[0].plot_search_targets.reduce(
          (state, nextTarget) => plotSearchReducer(state, addPlanUnitDecisions(nextTarget.plan_unit)),
          {});

        expect(state.decisionCandidates[1]).to.exist;
        expect(state.decisionCandidates[1].length).to.equal(2);

        state = plotSearchReducer(state, removePlanUnitDecisions(42));

        expect(state.decisionCandidates[1]).to.exist;
      });

      it('should reset decision candidates', () => {
        let state = mockData[0].plot_search_targets.reduce(
          (state, nextTarget) => plotSearchReducer(state, addPlanUnitDecisions(nextTarget.plan_unit)),
          {});

        state = plotSearchReducer(state, resetPlanUnitDecisions());

        expect(state.decisionCandidates).to.deep.equal({});
      });
    });
  });
});
