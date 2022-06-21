
// @flow
import {all, fork, put, takeLatest, call} from 'redux-saga/effects';

import {displayUIMessage} from '$src/util/helpers';
import {
  receivePlotApplicationsList,
  receiveMethods,
  receiveAttributes,
  receiveSinglePlotApplication,
  hideEditMode,
  receiveIsSaveClicked,
  attributesNotFound,
  applicationsNotFound,
  fetchApplicationRelatedForm,
  receiveApplicationRelatedForm,
  applicationRelatedAttachmentsNotFound,
  fetchApplicationRelatedAttachments,
  receiveApplicationRelatedAttachments,
  receivePlotApplicationSaved,
  receivePlotApplicationSaveFailed,
  fetchSinglePlotApplication,
  receiveFileOperationFinished,
  fetchPendingUploads,
  pendingUploadsNotFound,
  receivePendingUploads, receiveAttachmentAttributes, receiveAttachmentMethods, attachmentAttributesNotFound
} from './actions';
import {receiveError} from '$src/api/actions';

import {
  fetchPlotApplications,
  fetchSinglePlotApplication as fetchSinglePlotApplicationRequest,
  fetchAttributes,
  fetchSinglePlotApplicationAttachments,
  createPlotApplicationRequest,
  editPlotApplicationRequest,
  uploadFileRequest,
  deleteUploadRequest, fetchPendingUploadsRequest, fetchAttachmentAttributesRequest
} from './requests';
import {fetchFormRequest} from "../plotSearch/requests";
import {fetchFormAttributes} from "../plotSearch/actions";
import {push} from "react-router-redux";
import {getRouteById, Routes} from "../root/routes";
import type {DeleteUploadAction, UploadFileAction} from "./types";

// import mockAttributes from './attributes-mock-data.json';

function* fetchPlotApplicationsSaga({payload: query}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchPlotApplications, query);
    switch (statusCode) {
      case 200:
        yield put(receivePlotApplicationsList({
          count: bodyAsJson.count,
          results: bodyAsJson.results,
        }));
        break;
      default:
        yield put(applicationsNotFound());
    }

  } catch (e) {
    console.error(e);
    yield put(applicationsNotFound());
  }
}

function* fetchSinglePlotApplicationSaga({payload: id}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchSinglePlotApplicationRequest, id);
    switch (statusCode) {
      case 200:
        yield put(receiveSinglePlotApplication(bodyAsJson));
        yield put(fetchApplicationRelatedForm(bodyAsJson.form));
        yield put(fetchApplicationRelatedAttachments(id));
        yield put(fetchFormAttributes(bodyAsJson.form));
        break;
    }
  } catch (e) {
    console.error(e);
  }
}

function* fetchAttributesSaga(): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchAttributes);

    switch(statusCode) {
      case 200:
        const attributes = {
          ...bodyAsJson.fields,
        };
        const methods = bodyAsJson.methods;

        yield put(receiveAttributes(attributes));
        yield put(receiveMethods(methods));
        break;
      default:
        yield put(attributesNotFound());
    }
  } catch (error) {
    console.error('Failed to fetch attributes with error "%s"', error);
    yield put(attributesNotFound());
    yield put(receiveError(error));
  }
}

function* createPlotApplicationSaga({payload: plotApplication}): Generator<any, any, any> {
  try {
    return;
    const {response: {status: statusCode}, bodyAsJson} = yield call(createPlotApplicationRequest, plotApplication);

    switch (statusCode) {
      case 200:
      case 201:
        yield put(receivePlotApplicationSaved(bodyAsJson.id));
        yield put(push(`${getRouteById(Routes.PLOT_APPLICATIONS)}/${bodyAsJson.id}`));
        yield put(hideEditMode());
        yield put(fetchSinglePlotApplication(bodyAsJson.id));
        displayUIMessage({title: '', body: 'Hakemus luotu'});
        break;
      default:
        yield put(receivePlotApplicationSaveFailed());
        displayUIMessage({title: '', body: 'Hakemuksen tallennus epäonnistui'}, { type: 'error' });
    }
  } catch(e) {
    yield put(receivePlotApplicationSaveFailed());
    console.log(e);
    displayUIMessage({title: '', body: 'Hakemuksen tallennus epäonnistui'}, { type: 'error' });
  }
}

function* editPlotApplicationSaga({payload: plotApplication}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(editPlotApplicationRequest, plotApplication);

    switch (statusCode) {
      case 200:
      case 201:
        yield put(receivePlotApplicationSaved(bodyAsJson.id));
        yield put(push(`${getRouteById(Routes.PLOT_APPLICATIONS)}/${bodyAsJson.id}`));
        displayUIMessage({title: '', body: 'Hakemus tallennettu'});
        break;
      default:
        yield put(receivePlotApplicationSaveFailed());
        displayUIMessage({title: '', body: 'Hakemuksen tallennus epäonnistui'}, { type: 'error' });
    }
  } catch {
    yield put(receivePlotApplicationSaveFailed());
    displayUIMessage({title: '', body: 'Hakemuksen tallennus epäonnistui'}, { type: 'error' });
  }
  displayUIMessage({title: '', body: 'Tonttihaku tallennettu'});
}

function* fetchApplicationRelatedFormSaga({ payload: id }): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchFormRequest, id);

    switch (statusCode) {
      case 200:
        yield put(receiveApplicationRelatedForm(bodyAsJson));
        break;
      default:
        yield put(applicationRelatedFormNotFound());
        displayUIMessage({title: '', body: 'Hakemukseen liittyvää lomaketta ei löytynyt!'}, { type: 'error' });
    }
  } catch {
    yield put(applicationRelatedFormNotFound());
    displayUIMessage({title: '', body: 'Hakemukseen liittyvää lomaketta ei löytynyt!'}, { type: 'error' });
  }
}

function* fetchApplicationRelatedAttachmentsSaga({ payload: id }): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchSinglePlotApplicationAttachments, id);

    switch (statusCode) {
      case 200:
        yield put(receiveApplicationRelatedAttachments(bodyAsJson));
        break;
      default:
        yield put(applicationRelatedAttachmentsNotFound());
        displayUIMessage({title: '', body: 'Hakemuksen liitteitä ei löytynyt!'}, { type: 'error' });
    }
  } catch (e) {
    yield put(applicationRelatedAttachmentsNotFound());
    displayUIMessage({title: '', body: 'Hakemuksen liitteitä ei löytynyt!'}, { type: 'error' });
  }
}


function* fetchPendingUploadsSaga(): Generator<any, any, any> {
  try {
    const { response, bodyAsJson } = yield call(fetchPendingUploadsRequest);

    switch (response.status) {
      case 200:
        yield put(receivePendingUploads(bodyAsJson.results));
        break;
      default:
        yield put(pendingUploadsNotFound());
        break;
    }
  } catch (e) {
    console.error(e);
    yield put(pendingUploadsNotFound());
    throw e;
  }
}

function* deleteUploadSaga({ payload }: DeleteUploadAction): Generator<any, any, any> {
  try {
    yield call(deleteUploadRequest, payload);

    yield put(receiveFileOperationFinished());
    yield put(fetchPendingUploads());
  } catch (e) {
    console.error(e);
    yield put(pendingUploadsNotFound());
    throw e;
  }
}

function* uploadFileSaga({ payload }: UploadFileAction): Generator<any, any, any> {
  try {
    yield call(uploadFileRequest, payload);

    yield put(receiveFileOperationFinished());
    yield put(fetchPendingUploads());
  } catch (e) {
    console.log(e);
    yield put(pendingUploadsNotFound());
    throw e;
  }
}

function* fetchAttachmentAttributesSaga(): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchAttachmentAttributesRequest);

    switch(statusCode) {
      case 200:
        const attributes = {
          ...bodyAsJson.fields,
        };
        const methods = bodyAsJson.methods;

        yield put(receiveAttachmentAttributes(attributes));
        yield put(receiveAttachmentMethods(methods));
        break;
      default:
        yield put(attachmentAttributesNotFound());
    }
  } catch (error) {
    console.error('Failed to fetch attributes with error "%s"', error);
    yield put(attachmentAttributesNotFound());
    yield put(receiveError(error));
  }
}

export default function*(): Generator<any, any, any> {
  yield all([
    fork(function*(): Generator<any, any, any> {
      yield takeLatest('mvj/plotApplications/FETCH_ALL', fetchPlotApplicationsSaga);
      yield takeLatest('mvj/plotApplications/FETCH_SINGLE', fetchSinglePlotApplicationSaga);
      yield takeLatest('mvj/plotApplications/FETCH_ATTRIBUTES', fetchAttributesSaga);
      yield takeLatest('mvj/plotApplications/CREATE', createPlotApplicationSaga);
      yield takeLatest('mvj/plotApplications/EDIT', editPlotApplicationSaga);
      yield takeLatest('mvj/plotApplications/FETCH_FORM', fetchApplicationRelatedFormSaga);
      yield takeLatest('mvj/plotApplications/FETCH_ATTACHMENTS', fetchApplicationRelatedAttachmentsSaga);
      yield takeLatest('mvj/plotApplications/FETCH_ATTACHMENT_ATTRIBUTES', fetchAttachmentAttributesSaga);
      yield takeLatest('mvj/plotApplications/UPLOAD_FILE', uploadFileSaga);
      yield takeLatest('mvj/plotApplications/FETCH_PENDING_UPLOADS', fetchPendingUploadsSaga);
      yield takeLatest('mvj/plotApplications/DELETE_UPLOAD', deleteUploadSaga);
    }),
  ]);
}
