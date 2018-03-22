// @flow

import {takeLatest} from 'redux-saga';
import {call, fork, put} from 'redux-saga/effects';
import {push} from 'react-router-redux';
import {SubmissionError} from 'redux-form';
import {displayUIMessage} from '$util/helpers';
import mockData from './mock-data.json';

import {
  receiveCommentAttributes,
  receiveComments,
  receiveCreatedComment,
  receiveEditedComment,
  receiveAttributes,
  receiveLeases,
  receiveSingleLease,
  receiveLessors,
  notFound,
} from './actions';

import {getRouteById} from '../root/routes';

import {
  createComment,
  editComment,
  fetchComments,
  fetchCommentAttributes,
  fetchAttributes,
  fetchLeases,
  fetchSingleLease,
  createLease,
  patchLease,
  fetchLessors,
} from './requests';

import {receiveError} from '../api/actions';

function* fetchAttributesSaga(): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchAttributes);
    const attributes = bodyAsJson.fields;

    switch (statusCode) {
      case 200:
        yield put(receiveAttributes(attributes));
        break;
      case 404:
      case 500:
        break;
    }
  } catch (error) {
    console.error('Failed to fetch identifiers with error "%s"', error);
    yield put(receiveError(error));
  }
}

function* fetchLessorsSaga(): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchLessors);
    const lessors = bodyAsJson.results;

    switch (statusCode) {
      case 200:
        yield put(receiveLessors(lessors));
        break;
      case 404:
      case 500:
        break;
    }
  } catch (error) {
    console.error('Failed to fetch lessors with error "%s"', error);
    yield put(receiveError(error));
  }
}

function* fetchLeasesSaga({payload: search}): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchLeases, search);
    switch (statusCode) {
      case 200:
        yield put(receiveLeases(bodyAsJson));
        break;
      case 404:
      case 500:
        yield put(notFound());
        break;
    }

    // yield put(receiveLeases(mockData.leases));
  } catch (error) {
    console.error('Failed to fetch leases with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* fetchSingleLeaseSaga({payload: id}): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchSingleLease, id);

    switch (statusCode) {
      case 200:
        // TODO: These comments are only for testing. Use real comments when end-points are ready
        bodyAsJson.comments = mockData.leases[0].comments;
        yield put(receiveSingleLease(bodyAsJson));
        break;
      case 404:
        yield put(notFound());
        yield put(receiveError(new SubmissionError({...bodyAsJson})));
        // yield put(receiveError(new Error(`404: ${bodyAsJson.detail}`)));
        break;
      case 500:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch leases with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* createLeaseSaga({payload: lease}): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(createLease, lease);

    switch (statusCode) {
      case 201:
        yield put(push(`${getRouteById('leases')}/${bodyAsJson.id}`));
        displayUIMessage({title: 'Vuorkatunnus luotu', body: 'Vuokrautunnus on tallennettu onnistuneesti'});
        break;
      case 400:
        yield put(notFound());
        yield put(receiveError(new SubmissionError({...bodyAsJson})));
        break;
      case 500:
        yield put(notFound());
        yield put(receiveError(new Error(bodyAsJson)));
        break;
    }
  } catch (error) {
    console.error('Failed to create lease with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* patchLeaseSaga({payload: lease}): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(patchLease, lease);

    switch (statusCode) {
      case 200:
        yield put(receiveSingleLease(bodyAsJson));
        displayUIMessage({title: 'Vuokraus tallennettu', body: 'Vuokraus on tallennettu onnistuneesti'});
        break;
      case 400:
        yield put(notFound());
        yield put(receiveError(new SubmissionError({...bodyAsJson})));
        break;
      case 500:
        yield put(notFound());
        yield put(receiveError(new Error(bodyAsJson)));
        break;
    }
  } catch (error) {
    console.error('Failed to edit lease with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* fetchCommentsSaga({payload: id}): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield yield call(fetchComments, id);
    const comments = bodyAsJson.results;

    switch (statusCode) {
      case 200:
        yield put(receiveComments(comments));
        break;
      case 404:
      case 500:
        break;
    }
  } catch (error) {
    console.error('Failed to fetch comments with error "%s"', error);
    yield put(receiveError(error));
  }
}

function* fetchCommentAttributesSaga(): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchCommentAttributes);
    const attributes = bodyAsJson.fields;

    switch (statusCode) {
      case 200:
        yield put(receiveCommentAttributes(attributes));
        break;
      case 404:
      case 500:
        break;
    }
  } catch (error) {
    console.error('Failed to fetch identifiers with error "%s"', error);
    yield put(receiveError(error));
  }
}

// let newId = 100;
// function* createCommentSaga({payload: comment}): Generator<> {
//   comment.id = newId++;
//   yield put(receiveComment(comment)),
//   displayUIMessage({title: 'Kommentti tallennettu', body: 'Kommentti on tallennettu onnistuneesti'});
// }

function* createCommentSaga({payload: comment}): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(createComment, comment);

    switch (statusCode) {
      case 201:
        yield put(receiveCreatedComment(bodyAsJson));
        displayUIMessage({title: 'Kommentti tallennettu', body: 'Kommentti on tallennettu onnistuneesti'});
        break;
      case 400:
        yield put(notFound());
        yield put(receiveError(new SubmissionError({...bodyAsJson})));
        break;
      case 500:
        yield put(notFound());
        yield put(receiveError(new Error(bodyAsJson)));
        break;
    }
  } catch (error) {
    console.error('Failed to create lease with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* editCommentSaga({payload: comment}): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(editComment, comment);

    switch (statusCode) {
      case 200:
        yield put(receiveEditedComment(bodyAsJson));
        displayUIMessage({title: 'Kommentti tallennettu', body: 'Kommentti on tallennettu onnistuneesti'});
        break;
      case 400:
        yield put(notFound());
        yield put(receiveError(new SubmissionError({...bodyAsJson})));
        break;
      case 500:
        yield put(notFound());
        yield put(receiveError(new Error(bodyAsJson)));
        break;
    }
  } catch (error) {
    console.error('Failed to edit lease with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

export default function*(): Generator<> {
  yield [
    fork(function*(): Generator<> {
      yield takeLatest('mvj/leases/FETCH_ATTRIBUTES', fetchAttributesSaga);
      yield takeLatest('mvj/leases/FETCH_LESSORS', fetchLessorsSaga);
      yield takeLatest('mvj/leases/FETCH_ALL', fetchLeasesSaga);
      yield takeLatest('mvj/leases/FETCH_SINGLE', fetchSingleLeaseSaga);
      yield takeLatest('mvj/leases/CREATE', createLeaseSaga);
      yield takeLatest('mvj/leases/PATCH', patchLeaseSaga);
      yield takeLatest('mvj/leases/FETCH_COMMENTS', fetchCommentsSaga);
      yield takeLatest('mvj/leases/FETCH_COMMENT_ATTRIBUTES', fetchCommentAttributesSaga);
      yield takeLatest('mvj/leases/CREATE_COMMENT', createCommentSaga);
      yield takeLatest('mvj/leases/EDIT_COMMENT', editCommentSaga);
    }),
  ];
}
