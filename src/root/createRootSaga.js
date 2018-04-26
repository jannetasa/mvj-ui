// @flow

import {fork} from 'redux-saga/effects';
import authSaga from '../auth/saga';
import commentSaga from '../comments/saga';
import contactSaga from '../contacts/saga';
import invoiceSaga from '../invoices/saga';
import leaseSaga from '../leases/saga';
import noticePeriodSaga from '../noticePeriod/saga';
import rentBasisSaga from '../rentbasis/saga';
import userSaga from '../users/saga';

export default () =>
  // $FlowFixMe
  function* rootSaga() {
    yield [
      fork(authSaga),
      fork(commentSaga),
      fork(contactSaga),
      fork(invoiceSaga),
      fork(leaseSaga),
      fork(noticePeriodSaga),
      fork(rentBasisSaga),
      fork(userSaga),
    ];
  };
