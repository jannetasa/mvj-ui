// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {withRouter} from 'react-router';
import {translate} from 'react-i18next';
import i18n from '../../root/i18n';
import flowRight from 'lodash/flowRight';

import DropDown from '../dropdown/DropDown';
import {changeUser} from '../../role/actions';
import {getUser, getUserList} from '../../role/selectors';
import {Languages} from '../../constants';
import {getActiveLanguage} from '../../helpers';

type Props = {
  changeUser: Function,
  currentUser: Object,
  i18n: Object,
  location: Object,
  router: Object,
  t: Function,
  userList: Array<any>,
}

class TopNavigation extends Component {
  props: Props;

  getLocationForNewLanguage = (prevPath, langKey) => {
    const {pathname, search, hash} = prevPath;
    const pathArr = pathname.split('/');
    pathArr.splice(1, 1, langKey);
    return `${pathArr.join('/')}${search}${hash}`;
  };

  handleLanguageMenuItemClick = (item) => {
    const {router, location} = this.props;
    if (item.id !== i18n.language) {
      const newLocation = this.getLocationForNewLanguage(location, item.id);
      i18n.changeLanguage(item.id);
      router.push(newLocation);
    }
  };

  handleUserMenuItemClick = (user) => {
    const {changeUser} = this.props;
    return changeUser(user);
  };

  render() {
    const {currentUser, userList, t} = this.props;

    return (
      <section className="top-navigation">
        <div className="title">
          <Link to="/">{t('appName')}</Link>
        </div>

        <DropDown className="user-switcher"
                  placeholder={t('roles:subtitle')}
                  active={currentUser}
                  icon={<i className="mi mi-account-circle"/>}
                  iconPlacement="right"
                  displayCaret={false}
                  items={userList}
                  onItemClick={this.handleUserMenuItemClick}/>

        <DropDown className="language-switcher"
                  active={getActiveLanguage()}
                  items={Languages}
                  onItemClick={this.handleLanguageMenuItemClick}/>

      </section>
    );
  }
}

export default flowRight(
  connect((state) => {
    return {
      currentUser: getUser(state),
      userList: getUserList(state),
    };
  }, {changeUser}),
  withRouter,
  translate(['common', 'roles'])
)(TopNavigation);
