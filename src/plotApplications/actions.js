// @flow
import {createAction} from 'redux-actions';
import type {Attributes, Methods} from '../types';

import type {
  FetchPlotApplicationsListAction,
  ReceivePlotApplicationsListAction,
  PlotApplicationsList,
  ReceiveMethodsAction,
  AttributesNotFoundAction,
  ReceiveAttributesAction,
  FetchAttributesAction,
  PlotApplication,
  FetchSinglePlotApplicationAction,
  ReceiveSinglePlotApplicationAction,
  HideEditModeAction,
  ShowEditModeAction,
  ReceiveIsSaveClickedAction,
  ReceiveCollapseStatesAction,
  ReceiveFormValidFlagsAction,
  ClearFormValidFlagsAction,
  EditPlotApplicationAction,
  ApplicationsNotFoundAction,
  ApplicationRelatedFormNotFoundAction,
  FetchApplicationRelatedFormAction,
  ReceiveApplicationRelatedFormAction,
  FetchApplicationRelatedAttachmentsAction,
  ReceiveApplicationRelatedAttachmentsAction,
  ApplicationRelatedAttachmentsNotFoundAction,
  CreatePlotApplicationAction,
  ReceivePlotApplicationSavedAction,
  ReceivePlotApplicationSaveFailedAction,
  UploadFileAction,
  FetchAttachmentAttributesAction,
  ReceiveAttachmentAttributesAction,
  ReceiveAttachmentMethodsAction,
  AttachmentAttributesNotFoundAction,
} from './types';

export const fetchPlotApplicationsList = (search: string): FetchPlotApplicationsListAction =>
  createAction('mvj/plotApplications/FETCH_ALL')(search);

export const receivePlotApplicationsList = (list: PlotApplicationsList): ReceivePlotApplicationsListAction =>
  createAction('mvj/plotApplications/RECEIVE_ALL')(list);

export const fetchSinglePlotApplication = (id: number): FetchSinglePlotApplicationAction =>
  createAction('mvj/plotApplications/FETCH_SINGLE')(id);

export const receiveSinglePlotApplication = (plotApplication: PlotApplication): ReceiveSinglePlotApplicationAction =>
  createAction('mvj/plotApplications/RECEIVE_SINGLE')(plotApplication);

export const fetchAttributes = (): FetchAttributesAction =>
  createAction('mvj/plotApplications/FETCH_ATTRIBUTES')();

export const receiveMethods = (methods: Methods): ReceiveMethodsAction =>
  createAction('mvj/plotApplications/RECEIVE_METHODS')(methods);

export const applicationsNotFound = (): ApplicationsNotFoundAction =>
  createAction('mvj/plotApplications/APPLICATIONS_NOT_FOUND')();

export const attributesNotFound = (): AttributesNotFoundAction =>
  createAction('mvj/plotApplications/ATTRIBUTES_NOT_FOUND')();

export const receiveAttributes = (attributes: Attributes): ReceiveAttributesAction =>
  createAction('mvj/plotApplications/RECEIVE_ATTRIBUTES')(attributes);

export const hideEditMode = (): HideEditModeAction =>
  createAction('mvj/plotApplications/HIDE_EDIT')();

export const showEditMode = (): ShowEditModeAction =>
  createAction('mvj/plotApplications/SHOW_EDIT')();

export const receiveIsSaveClicked = (isClicked: boolean): ReceiveIsSaveClickedAction =>
  createAction('mvj/plotApplications/RECEIVE_SAVE_CLICKED')(isClicked);

export const receiveCollapseStates = (status: Object): ReceiveCollapseStatesAction =>
  createAction('mvj/plotApplications/RECEIVE_COLLAPSE_STATES')(status);

export const receiveFormValidFlags = (valid: Object): ReceiveFormValidFlagsAction =>
  createAction('mvj/plotApplications/RECEIVE_FORM_VALID_FLAGS')(valid);

export const clearFormValidFlags = (): ClearFormValidFlagsAction =>
  createAction('mvj/plotApplications/CLEAR_FORM_VALID_FLAGS')();

export const createPlotApplication = (plotApplication: PlotApplication): CreatePlotApplicationAction =>
  createAction('mvj/plotApplications/CREATE')(plotApplication);

export const editPlotApplication = (plotApplication: PlotApplication): EditPlotApplicationAction =>
  createAction('mvj/plotApplications/EDIT')(plotApplication);

export const receivePlotApplicationSaved = (id: Number): ReceivePlotApplicationSavedAction =>
  createAction('mvj/plotApplications/RECEIVE_SAVED')(id);

export const receivePlotApplicationSaveFailed = (): ReceivePlotApplicationSaveFailedAction =>
  createAction('mvj/plotApplications/RECEIVE_SAVE_FAILED')();

export const fetchApplicationRelatedForm = (payload: Object): FetchApplicationRelatedFormAction =>
  createAction('mvj/plotApplications/FETCH_FORM')(payload);

export const receiveApplicationRelatedForm = (payload: Object): ReceiveApplicationRelatedFormAction =>
  createAction('mvj/plotApplications/RECEIVE_FORM')(payload);

export const applicationRelatedFormNotFound = (payload: Object): ApplicationRelatedFormNotFoundAction =>
  createAction('mvj/plotApplications/FORM_NOT_FOUND')(payload);

export const fetchApplicationRelatedAttachments = (payload: Object): FetchApplicationRelatedAttachmentsAction =>
  createAction('mvj/plotApplications/FETCH_ATTACHMENTS')(payload);

export const receiveApplicationRelatedAttachments = (payload: Object): ReceiveApplicationRelatedAttachmentsAction =>
  createAction('mvj/plotApplications/RECEIVE_ATTACHMENTS')(payload);

export const applicationRelatedAttachmentsNotFound = (payload: Object): ApplicationRelatedAttachmentsNotFoundAction =>
  createAction('mvj/plotApplications/ATTACHMENTS_NOT_FOUND')(payload);

export const initializeFormEntriesForApplication = (payload: Object): InitializeFormEntriesForApplicationAction =>
  createAction('mvj/plotApplications/INITIALIZE_FORM_ENTRIES')(payload);

export const fetchPendingUploads = (): FetchPendingUploadsAction =>
  createAction('mvj/plotApplications/FETCH_PENDING_UPLOADS')();

export const receivePendingUploads = (payload: Object): ReceivePendingUploadsAction =>
  createAction('mvj/plotApplications/RECEIVE_PENDING_UPLOADS')(payload);

export const pendingUploadsNotFound = (): PendingUploadsNotFoundAction =>
  createAction('mvj/plotApplications/PENDING_UPLOADS_NOT_FOUND')();

export const deleteUploadedAttachment = (payload: number): DeleteUploadAction =>
  createAction('mvj/plotApplications/DELETE_UPLOAD')(payload);

export const uploadAttachment = (payload: Object): UploadFileAction =>
  createAction('mvj/plotApplications/UPLOAD_FILE')(payload);

export const receiveFileOperationFinished = (): ReceiveFileOperationFinishedAction =>
  createAction('mvj/plotApplications/RECEIVE_FILE_OPERATION_FINISHED')();

export const fetchAttachmentAttributes = (): FetchAttachmentAttributesAction =>
  createAction('mvj/plotApplications/FETCH_ATTACHMENT_ATTRIBUTES')();

export const receiveAttachmentAttributes = (payload: Object): ReceiveAttachmentAttributesAction =>
  createAction('mvj/plotApplications/RECEIVE_ATTACHMENT_ATTRIBUTES')(payload);

export const receiveAttachmentMethods = (payload: Object): ReceiveAttachmentMethodsAction =>
  createAction('mvj/plotApplications/RECEIVE_ATTACHMENT_METHODS')(payload);

export const attachmentAttributesNotFound = (): AttachmentAttributesNotFoundAction =>
  createAction('mvj/plotApplications/ATTACHMENT_ATTRIBUTES_NOT_FOUND')();
