// @flow

import {createAction} from 'redux-actions';

import type {
  Areas,
  FetchAttributesAction,
  FetchInvoicesAction,
  FetchAreasAction,
  Attributes,
  ReceiveAttributesAction,
  ReceiveInvoicesAction,
  ReceiveAreasAction,
  Lease,
  Invoices,
  LeaseId,
  LeaseNotFoundAction,
  LeasesList,
  CreateLeaseAction,
  EditLeaseAction,
  FetchLeasesAction,
  FetchSingleLeaseAction,
  ReceiveLeasesAction,
  ReceiveSingleLeaseAction,
  HideEditModeAction,
  ShowEditModeAction,
  Comment,
  CreateCommentAction,
  EditCommentAction,
  ArchiveCommentAction,
  UnarchiveCommentAction,
  ReceiveCommentAction,
  ReceiveEditedCommentAction,
} from './types';

export const fetchAttributes = (): FetchAttributesAction =>
  createAction('mvj/leases/FETCH_ATTRIBUTES')();

export const receiveAttributes = (identifiers: Attributes): ReceiveAttributesAction =>
  createAction('mvj/leases/RECEIVE_ATTRIBUTES')(identifiers);

export const fetchInvoices = (lease: LeaseId): FetchInvoicesAction =>
  createAction('mvj/leases/FETCH_INVOICES')(lease);

export const receiveInvoices = (invoices: Invoices): ReceiveInvoicesAction =>
  createAction('mvj/leases/RECEIVE_INVOICES')(invoices);

export const fetchAreas = (): FetchAreasAction =>
  createAction('mvj/leases/FETCH_AREAS')();

export const receiveAreas = (areas: Areas): ReceiveAreasAction =>
  createAction('mvj/leases/RECEIVE_AREAS')(areas);

export const fetchLeases = (search: string): FetchLeasesAction =>
  createAction('mvj/leases/FETCH_ALL')(search);

export const receiveLeases = (leases: LeasesList): ReceiveLeasesAction =>
  createAction('mvj/leases/RECEIVE_ALL')(leases);

export const fetchSingleLease = (id: LeaseId): FetchSingleLeaseAction =>
  createAction('mvj/leases/FETCH_SINGLE')(id);

export const receiveSingleLease = (lease: Lease): ReceiveSingleLeaseAction =>
  createAction('mvj/leases/RECEIVE_SINGLE')(lease);

export const createLease = (lease: Lease): CreateLeaseAction =>
  createAction('mvj/leases/CREATE')(lease);

export const editLease = (lease: Lease): EditLeaseAction =>
  createAction('mvj/leases/EDIT')(lease);

export const notFound = (): LeaseNotFoundAction =>
  createAction('mvj/leases/NOT_FOUND')();

export const hideEditMode = (): HideEditModeAction =>
  createAction('mvj/leases/HIDE_EDIT')();

export const showEditMode = (): ShowEditModeAction =>
  createAction('mvj/leases/SHOW_EDIT')();

export const createComment = (comment: Comment): CreateCommentAction =>
  createAction('mvj/leases/CREATE_COMMENT')(comment);

export const editComment = (comment: Comment): EditCommentAction =>
  createAction('mvj/leases/EDIT_COMMENT')(comment);

export const archiveComment = (comment: Comment): ArchiveCommentAction =>
  createAction('mvj/leases/ARCHIVE_COMMENT')(comment);

export const unarchiveComment = (comment: Comment): UnarchiveCommentAction =>
  createAction('mvj/leases/UNARCHIVE_COMMENT')(comment);

export const receiveComment = (comment: Comment): ReceiveCommentAction =>
  createAction('mvj/leases/RECEIVE_COMMENT')(comment);

export const receiveEditedComment = (comment: Comment): ReceiveEditedCommentAction =>
  createAction('mvj/leases/RECEIVE_EDITED_COMMENT')(comment);
