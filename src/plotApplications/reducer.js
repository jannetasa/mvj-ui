// @flow
import merge from 'lodash/merge';

import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';
import type {Attributes, Reducer, Methods} from '$src/types';
import {FormNames} from '$src/enums';

import type {
  ReceivePlotApplicationsListAction,
  PlotApplicationsList,
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  ReceiveSinglePlotApplicationAction,
  PlotApplication,
  ReceiveIsSaveClickedAction,
  ReceiveCollapseStatesAction,
  ReceiveFormValidFlagsAction,
  ReceiveApplicationRelatedFormAction
} from '$src/plotApplications/types';
import type {ReceiveApplicationRelatedAttachmentsAction} from "./types";


const isFetchingReducer: Reducer<boolean> = handleActions({
  ['mvj/plotApplications/FETCH_ALL']: () => true,
  ['mvj/plotApplications/RECEIVE_ALL']: () => false,
  ['mvj/plotApplications/FETCH_SINGLE']: () => true,
  ['mvj/plotApplications/RECEIVE_SINGLE']: () => false,
  ['mvj/plotApplications/EDIT']: () => true,
  ['mvj/plotApplications/APPLICATIONS_NOT_FOUND']: () => false,
}, false);

const isEditModeReducer: Reducer<boolean> = handleActions({
  'mvj/plotApplications/HIDE_EDIT': () => false,
  'mvj/plotApplications/SHOW_EDIT': () => true,
}, false);

const plotApplicationsListReducer: Reducer<PlotApplicationsList> = handleActions({
  ['mvj/plotApplications/RECEIVE_ALL']: (state: PlotApplicationsList, {payload: list}: ReceivePlotApplicationsListAction) => list,
}, {});

const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/plotApplications/RECEIVE_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveAttributesAction) => {
    return attributes;
  },
}, null);

const methodsReducer: Reducer<Methods> = handleActions({
  ['mvj/plotApplications/RECEIVE_METHODS']: (state: Methods, {payload: methods}: ReceiveMethodsAction) => {
    return methods;
  },
}, null);

const isFetchingAttributesReducer: Reducer<boolean> = handleActions({
  ['mvj/plotApplications/FETCH_ATTRIBUTES']: () => true,
  ['mvj/plotApplications/RECEIVE_ATTRIBUTES']: () => false,
  ['mvj/plotApplications/ATTRIBUTES_NOT_FOUND']: () => false,
  ['mvj/plotApplications/RECEIVE_METHODS']: () => false,
}, false);

const currentplotApplicationReducer: Reducer<PlotApplication> = handleActions({
  ['mvj/plotApplications/RECEIVE_SINGLE']: (state: PlotApplication, {payload: plotApplications}: ReceiveSinglePlotApplicationAction) => plotApplications,
}, {});

const isSaveClickedReducer: Reducer<boolean> = handleActions({
  ['mvj/plotApplications/RECEIVE_SAVE_CLICKED']: (state: boolean, {payload: isClicked}: ReceiveIsSaveClickedAction) => {
    return isClicked;
  },
}, false);


const collapseStatesReducer: Reducer<Object> = handleActions({
  ['mvj/plotApplications/RECEIVE_COLLAPSE_STATES']: (state: Object, {payload: states}: ReceiveCollapseStatesAction) => {
    return merge(state, states);
  },
}, {});

const isFormValidByIdReducer: Reducer<Object> = handleActions({
  ['mvj/plotApplications/RECEIVE_FORM_VALID_FLAGS']: (state: Object, {payload: valid}: ReceiveFormValidFlagsAction) => {
    return {
      ...state,
      ...valid,
    };
  },
  ['mvj/plotApplications/CLEAR_FORM_VALID_FLAGS']: () => {
    return {
      [FormNames.PLOT_APPLICATION]: true,
    };
  },
}, {
  [FormNames.PLOT_APPLICATION]: true,
});

const formReducer: Reducer<Object> = handleActions({
  ['mvj/plotApplications/FETCH_FORM']: () => null,
  ['mvj/plotApplications/RECEIVE_FORM']: (state: Object, { payload: form }: ReceiveApplicationRelatedFormAction) => {
    return form;
  }
}, null);

const isFetchingFormReducer: Reducer<boolean> = handleActions({
  ['mvj/plotApplications/FETCH_FORM']: () => true,
  ['mvj/plotApplications/RECEIVE_FORM']: () => false,
  ['mvj/plotApplications/FORM_NOT_FOUND']: () => false,
}, false);

const attachmentReducer: Reducer<Object> = handleActions({
  ['mvj/plotApplications/FETCH_ATTACHMENTS']: () => null,
  ['mvj/plotApplications/RECEIVE_ATTACHMENTS']: (state: Object, { payload: attachments }: ReceiveApplicationRelatedAttachmentsAction) => {
    return attachments;
  },
}, null);

const isFetchingAttachmentsReducer: Reducer<boolean> = handleActions({
  ['mvj/plotApplications/FETCH_ATTACHMENTS']: () => true,
  ['mvj/plotApplications/RECEIVE_ATTACHMENTS']: () => false,
  ['mvj/plotApplications/ATTACHMENTS_NOT_FOUND']: () => false,
}, false);

export default combineReducers<Object, any>({
  isFetching: isFetchingReducer,
  list: plotApplicationsListReducer,
  attributes: attributesReducer,
  methods: methodsReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
  current: currentplotApplicationReducer,
  isEditMode: isEditModeReducer,
  isSaveClicked: isSaveClickedReducer,
  collapseStates: collapseStatesReducer,
  isFormValidById: isFormValidByIdReducer,
  form: formReducer,
  isFetchingForm: isFetchingFormReducer,
  attachments: attachmentReducer,
  isFetchingAttachments: isFetchingAttachmentsReducer
});
