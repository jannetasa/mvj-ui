// @flow
import type {Action, Attributes, Methods} from '../types';

export type PlotSearchState = {
  attributes: Attributes,
  current: PlotSearch,
  isEditMode: boolean,
  isFetching: boolean,
  isFetchingAttributes: boolean,
  list: PlotSearchList,
  collapseStates: Object,
  isSaveClicked: boolean,
  isFormValidById: Object,
  methods: Object,
  planUnitAttributes: Attributes,
  planUnit: Object,
  isFetchingPlanUnit: boolean,
  isFetchingPlanUnitAttributes: boolean,
  subTypes: Object,
  applicationAttributes: Attributes,
  isFetchingApplicationAttributes: boolean,
};

export type PlotSearchId = number;
export type PlotSearch = Object;
export type PlanUnit = Object;
export type PlotSearchList = Object;

export type FetchSinglePlotSearchAfterEditPayload = {
  id: any,
  callbackFuntions?: Array<Object | Function>,
}

export type FetchAttributesAction = Action<'mvj/plotSearch/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/plotSearch/RECEIVE_ATTRIBUTES', Attributes>;
export type ReceiveMethodsAction = Action<'mvj/plotSearch/RECEIVE_METHODS', Methods>;
export type PlotSearchAttributesNotFoundAction = Action<'mvj/plotSearch/ATTRIBUTES_NOT_FOUND', void>;

export type CreatePlotSearchAction = Action<'mvj/plotSearch/CREATE', PlotSearch>;
export type EditPlotSearchAction = Action<'mvj/plotSearch/EDIT', PlotSearch>;
export type PlotSearchNotFoundAction = Action<'mvj/plotSearch/NOT_FOUND', void>;
export type FetchSinglePlotSearchAfterEditAction = Action<'mvj/plotSearch/FETCH_SINGLE_AFTER_EDIT', FetchSinglePlotSearchAfterEditPayload>;
export type DeletePlotSearchAction = Action<'mvj/plotSearch/DELETE', PlotSearchId>;

export type ReceiveIsSaveClickedAction = Action<'mvj/plotSearch/RECEIVE_SAVE_CLICKED', boolean>;
export type ReceiveFormValidFlagsAction = Action<'mvj/plotSearch/RECEIVE_FORM_VALID_FLAGS', Object>;
export type ClearFormValidFlagsAction = Action<'mvj/plotSearch/CLEAR_FORM_VALID_FLAGS', void>;

export type FetchPlotSearchListAction = Action<'mvj/plotSearch/FETCH_ALL', string>;
export type ReceivePlotSearchListAction = Action<'mvj/plotSearch/RECEIVE_ALL', PlotSearchList>;
export type FetchSinglePlotSearchAction = Action<'mvj/plotSearch/FETCH_SINGLE', PlotSearchId>;
export type ReceiveSinglePlotSearchAction = Action<'mvj/plotSearch/RECEIVE_SINGLE', PlotSearch>;

export type HideEditModeAction = Action<'mvj/plotSearch/HIDE_EDIT', void>;
export type ShowEditModeAction = Action<'mvj/plotSearch/SHOW_EDIT', void>;

export type ReceiveCollapseStatesAction = Action<'mvj/plotSearch/RECEIVE_COLLAPSE_STATES', Object>;

export type FetchPlanUnitAction = Action<'mvj/plotSearch/FETCH_PLAN_UNIT', Object>;
export type ReceiveSinglePlanUnitAction = Action<'mvj/plotSearch/RECEIVE_PLAN_UNIT', PlanUnit>;
export type FetchPlanUnitAttributesAction = Action<'mvj/plotSearch/FETCH_PLAN_UNIT_ATTRIBUTES', Object>;
export type PlanUnitAttributesNotFoundAction = Action<'mvj/plotSearch/PLAN_UNIT_ATTRIBUTES_NOT_FOUND', void>;
export type PlanUnitNotFoundAction = Action<'mvj/plotSearch/PLAN_UNIT_NOT_FOUND', void>;
export type ReceivePlanUnitAttributesAction = Action<'mvj/plotSearch/RECEIVE_PLAN_UNIT_ATTRIBUTES', Attributes>;

export type fetchPlotSearchSubtypesAction = Action<'mvj/plotSearch/FETCH_PLOT_SEARCH_SUB_TYPES', void>;
export type ReceivePlotSearchSubtypeAction = Action<'mvj/plotSearch/RECEIVE_PLOT_SEARCH_SUB_TYPES', Object>;
export type PlotSearchSubtypeNotFoundAction = Action<'mvj/plotSearch/PLOT_SEARCH_SUB_TYPES_NOT_FOUND', void>;

export type NullPlanUnits = Action<'mvj/plotSearch/NULL_PLAN_UNITS', void>;

export type FetchApplicationAttributesAction = Action<'mvj/plotSearch/FETCH_APPLICATION_ATTRIBUTES', void>;
export type ApplicationAttributesNotFoundAction = Action<'mvj/plotSearch/RECEIVE_APPLICATION_ATTRIBUTES', Attributes>;
export type ReceiveApplicationAttributesAction = Action<'mvj/plotSearch/APPLICATION_ATTRIBUTES_NOT_FOUND', void>;
