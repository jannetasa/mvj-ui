// @flow
import get from 'lodash/get';
import type {Attributes, Selector, Methods} from '../types';
import type {RootState} from '$src/root/types';
import isEmpty from 'lodash/isEmpty';

import type {
  PlotApplicationsList,
  PlotApplication,
} from './types';

export const getAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.plotApplications.attributes;

export const getIsFetching: Selector<boolean, void> = (state: RootState): boolean =>
  state.plotApplications.isFetching;

export const getIsFetchingAttributes: Selector<boolean, void> = (state: RootState): boolean =>
  state.plotApplications.isFetchingAttributes;

export const getPlotApplicationsList: Selector<PlotApplicationsList, void> = (state: RootState): PlotApplicationsList =>
  state.plotApplications.list;

export const getPlotApplicationsMethods: Selector<Methods, void> = (state: RootState): Methods =>
  state.plotApplications.methods;

export const getCurrentPlotApplication: Selector<PlotApplication, void> = (state: RootState): PlotApplication =>
  state.plotApplications.current;

export const getIsEditMode: Selector<boolean, void> = (state: RootState): boolean =>
  state.plotApplications.isEditMode;

export const getIsSaveClicked: Selector<boolean, void> = (state: RootState): boolean =>
  state.plotApplications.isSaveClicked;

export const getCollapseStateByKey: Selector<?Object, string> = (state: RootState, key: string): ?Object => {
  return get(state.plotApplications.collapseStates, key);
};

export const getIsFormValidById: Selector<boolean, string> = (state: RootState, id: string): boolean =>
  state.plotApplications.isFormValidById[id];

export const getIsFormValidFlags: Selector<Object, void> = (state: RootState): Object =>
  state.plotApplications.isFormValidById;

export const getErrorsByFormName: Selector<?Object, string> = (state: RootState, formName: string): ?Object => {
  const form = state.form[formName];
  if(!isEmpty(form)) {
    return form.syncErrors;
  }
  return null;
};

export const getIsFetchingApplicationRelatedForm: Selector<boolean, void> = (state: RootState): boolean => state.plotApplications.isFetchingForm;

export const getApplicationRelatedForm: Selector<boolean, void> = (state: RootState): boolean => state.plotApplications.form;

export const getIsFetchingApplicationRelatedAttachments: Selector<boolean, void> = (state: RootState): boolean => state.plotApplications.isFetchingAttachments;

export const getApplicationRelatedAttachments: Selector<boolean, void> = (state: RootState): boolean => state.plotApplications.attachments;

export const getFieldTypeMapping: Selector<Object, void> = (state: RootState): Object =>
  state.plotApplications.fieldTypeMapping;

export const getPendingUploads: Selector<Array<Object>, void> = (state: RootState): Array<Object> =>
  state.plotApplications.pendingUploads;

export const getIsFetchingPendingUploads: Selector<boolean, void> = (state: RootState): boolean =>
  state.plotApplications.isFetchingPendingUploads;

export const getIsPerformingFileOperation: Selector<boolean, void> = (state: RootState): boolean =>
  state.plotApplications.isPerformingFileOperation;

export const getIsFetchingAttachmentAttributes: Selector<boolean, void> = (state: RootState): boolean =>
  state.plotApplications.isFetchingAttachmentAttributes;

export const getAttachmentAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.plotApplications.attachmentAttributes;

export const getAttachmentMethods: Selector<Methods, void> = (state: RootState): Methods =>
  state.plotApplications.attachmentMethods;

export const getIsSaving: Selector<boolean, void> = (state: RootState): boolean =>
  state.plotApplications.isSaving;
