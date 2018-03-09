// @flow

import {takeLatest} from 'redux-saga';
import {fork, put} from 'redux-saga/effects';
import {displayUIMessage} from '$util/helpers';

import {
  receiveAbnormalDebt,
  receiveInvoicingStatus,
  receiveBill,
  receiveEditedBill,
} from './actions';

function* startInvoicingSaga(): Generator<> {
  yield put(receiveInvoicingStatus(true));
  displayUIMessage({title: 'Laskutus käynnistetty', body: 'Laskutus on käynnistetty onnistuneesti'});
}

function* stopInvoicingSaga(): Generator<> {
  yield put(receiveInvoicingStatus(false));
  displayUIMessage({title: 'Laskutus keskeytetty', body: 'Laskutus on keskeytetty onnistuneesti'});
}

function* createAbnormalDebtSaga({payload: bill}): Generator<> {
  yield put(receiveAbnormalDebt(bill));
  displayUIMessage({title: 'Poikkeava perintä tallennettu', body: 'Poikkeava perintä on tallennettu onnistuneesti'});
}

function* createBillSaga({payload: bill}): Generator<> {
  yield put(receiveBill(bill));
  displayUIMessage({title: 'Lasku tallennettu', body: 'Lasku on tallennettu onnistuneesti'});
}

function* editBillSaga({payload: bill}): Generator<> {
  console.log(bill);
  yield put(receiveEditedBill(bill));
  displayUIMessage({title: 'Laskutus tallennettu', body: 'Laskutus on tallennettu onnistuneesti'});
}

export default function*(): Generator<> {
  yield [
    fork(function*(): Generator<> {
      yield takeLatest('mvj/billing/START_INVOICING', startInvoicingSaga);
      yield takeLatest('mvj/billing/STOP_INVOICING', stopInvoicingSaga);
      yield takeLatest('mvj/billing/CREATE_ABNORMAL_DEBT', createAbnormalDebtSaga);
      yield takeLatest('mvj/billing/CREATE_BILL', createBillSaga);
      yield takeLatest('mvj/billing/EDIT_BILL', editBillSaga);
    }),
  ];
}
