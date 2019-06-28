// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import Button from '$components/button/Button';
import EditButton from '$components/button/EditButton';
import ShowMore from '$components/showMore/ShowMore';
import TextAreaInput from '$components/inputs/TextAreaInput';
import {editComment, hideEditModeById, showEditModeById} from '$src/comments/actions';
import {ButtonColors} from '$components/enums';
import {getPayloadComment} from '$src/comments/helpers';
import {formatDate} from '$util/helpers';
import {getIsEditModeById} from '$src/comments/selectors';

type Props = {
  allowEdit: boolean,
  comment: Object,
  editComment: Function,
  hideEditModeById: Function,
  editMode: boolean,
  showEditModeById: Function,
  user: Object,
}

type State = {
  editedText: string,
}

class Comment extends PureComponent<Props, State> {
  state = {
    editedText: '',
  }

  handleTextFieldChange = (e: Object) => {
    this.setState({editedText: e.target.value});
  }

  handleCancelButtonClick = () => {
    const {comment: {id}, hideEditModeById} = this.props;

    hideEditModeById(id);
  }

  handleEditButtonClick = () => {
    const {comment: {id, text}, showEditModeById} = this.props;

    showEditModeById(id);
    this.setState({
      editedText: text,
    });
  }

  handleEdit = () => {
    const {comment, editComment} = this.props;
    const {editedText} = this.state;

    editComment(getPayloadComment({...comment, text: editedText}));
  }

  render() {
    const {editedText} = this.state;
    const {allowEdit, comment, editMode, user} = this.props;

    if(editMode) {
      return(
        <div className='comment-panel__comment'>
          <div className='comment-panel__comment_content-wrapper no-padding'>
            <Row>
              <Column>
                <TextAreaInput
                  onChange={this.handleTextFieldChange}
                  id={`comment_${comment.id}`}
                  placeholder='Kommentti'
                  rows={3}
                  value={editedText}
                />
              </Column>
            </Row>
            <Row>
              <Column>
                <div className='comment-panel__comment_button-wrapper'>
                  <Button
                    className={ButtonColors.SECONDARY}
                    onClick={this.handleCancelButtonClick}
                    text='Peruuta'
                  />
                  <Button
                    className={ButtonColors.SUCCESS}
                    disabled={!editedText}
                    onClick={this.handleEdit}
                    text='Tallenna'
                  />
                </div>
              </Column>
            </Row>
          </div>
        </div>
      );
    } else {
      return(
        <div className='comment-panel__comment'>
          {allowEdit &&
            <EditButton
              className='position-topright'
              onClick={this.handleEditButtonClick}
              title='Muokkaa kommenttia'
            />

          }
          <div className='comment-panel__comment_content-wrapper'>
            <p className='comment-panel__comment_info'>
              <span className='comment-panel__comment_info_date'>{formatDate(comment.modified_at, 'DD.MM.YYYY HH:mm')}</span>
              &nbsp;
              <span>{user.last_name} {user.first_name}</span>
            </p>
            <div className='comment-panel__comment_text'>
              <ShowMore text={comment.text} />
            </div>
          </div>
        </div>
      );
    }
  }
}

export default connect(
  (state, props) => {
    return {
      editMode: getIsEditModeById(state, props.comment.id),
    };
  },
  {
    editComment,
    hideEditModeById,
    showEditModeById,
  }
)(Comment);
