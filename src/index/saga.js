// @flow
import {all, call, fork, put, takeLatest} from 'redux-saga/effects';

import {receiveError} from '$src/api/actions';
import {
  attributesNotFound,
  receiveAttributes,
  receiveMethods,
  notFound,
  receiveIndexList,
} from './actions';
import {
  fetchAttributes,
  fetchIndexList,
} from './requests';

function* fetchAttributesSaga(): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchAttributes);

    switch (statusCode) {
      case 200:
        const attributes = bodyAsJson.fields;
        const methods = bodyAsJson.methods;

        yield put(receiveAttributes(attributes));
        yield put(receiveMethods(methods));
        break;
      default:
        yield put(attributesNotFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch index attributes with error "%s"', error);
    yield put(attributesNotFound());
    yield put(receiveError(error));
  }
}

function* fetchIndexListSaga({payload: query}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchIndexList, query);

    switch (statusCode) {
      case 200:
        yield put(receiveIndexList(bodyAsJson.results));
        break;
      default:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch index list with error "%s"', error);
    yield put(notFound());
  }
}

export default function*(): Generator<any, any, any> {
  yield all([
    fork(function*(): Generator<any, any, any> {
      yield takeLatest('mvj/index/FETCH_ATTRIBUTES', fetchAttributesSaga);
      yield takeLatest('mvj/index/FETCH_ALL', fetchIndexListSaga);
    }),
  ]);
}
