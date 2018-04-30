// @flow

import {takeLatest} from 'redux-saga';
import {call, fork, put} from 'redux-saga/effects';
import {SubmissionError} from 'redux-form';

import {displayUIMessage} from '$util/helpers';
import {
  notFound,
  fetchCommentsByLease,
  receiveAttributes,
  receiveCommentsByLease,
} from './actions';
import {
  createComment,
  editComment,
  fetchAttributes,
  fetchComments,
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
    console.error('Failed to fetch  comment identifiers with error "%s"', error);
    yield put(receiveError(error));
  }
}

function* fetchCommentsByLeaseSaga({payload: leaseId}): Generator<> {
  try {
    let {response: {status: statusCode}, bodyAsJson: body} = yield call(fetchComments, `?lease=${leaseId}`);
    let comments = body.results;
    while(statusCode === 200 && body.next) {
      const {response: {status}, bodyAsJson} = yield call(fetchComments, `?${body.next.split('?').pop()}`);
      statusCode = status;
      body = bodyAsJson;
      comments = [...comments, ...body.results];
    }

    switch (statusCode) {
      case 200:
        yield put(receiveCommentsByLease({leaseId: leaseId, comments: comments}));
        break;
      case 404:
      case 500:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch comments by lease with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* createCommentSaga({payload: comment}): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(createComment,  comment);

    switch (statusCode) {
      case 201:
        yield put(fetchCommentsByLease(bodyAsJson.lease));
        displayUIMessage({title: 'Kommentti luotu', body: 'Kommentti on luotu onnistuneesti'});
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
    console.error('Failed to create comment with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* editCommentSaga({payload: comment}): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(editComment, comment);

    switch (statusCode) {
      case 200:
        yield put(fetchCommentsByLease(bodyAsJson.lease));
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
    console.error('Failed to edit comment with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

export default function*(): Generator<> {
  yield [
    fork(function*(): Generator<> {
      yield takeLatest('mvj/comments/FETCH_ATTRIBUTES', fetchAttributesSaga);
      yield takeLatest('mvj/comments/FETCH_BY_LEASE', fetchCommentsByLeaseSaga);
      yield takeLatest('mvj/comments/CREATE', createCommentSaga);
      yield takeLatest('mvj/comments/EDIT', editCommentSaga);

    }),
  ];
}
