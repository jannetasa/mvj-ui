// @flow
import React from 'react';
import Button from '../button/Button';

import Authorization from '$components/authorization/Authorization';
import CommentButton from './CommentButton';
import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import {ConfirmationModalTexts} from '$src/enums';
import {hasAnyPageDirtyForms} from '$util/forms';
import {ButtonColors} from '$components/enums';

type Props = {
  allowComments?: boolean,
  allowCopy?: boolean,
  allowDelete?: boolean,
  allowEdit?: boolean,
  commentAmount?: number,
  deleteModalTexts?: {
    buttonClassName: string,
    buttonText: string,
    label: string,
    title: string,
  },
  isCancelDisabled?: boolean,
  isCopyDisabled?: boolean,
  isEditDisabled?: boolean,
  isEditMode: boolean,
  isSaveDisabled: boolean,
  onCancel: Function,
  onComment?: Function,
  onCopy?: Function,
  onDelete?: Function,
  onEdit?: Function,
  onSave: Function,
  showCommentButton?: boolean,
  showCopyButton?: boolean,
}

const ControlButtons = ({
  allowComments = false,
  allowCopy = false,
  allowDelete = false,
  allowEdit = false,
  commentAmount = 0,
  deleteModalTexts,
  isCancelDisabled = false,
  isCopyDisabled = true,
  isEditDisabled = false,
  isEditMode,
  isSaveDisabled = true,
  onCancel,
  onComment,
  onCopy,
  onDelete,
  onEdit,
  onSave,
  showCommentButton = true,
  showCopyButton = false,
}: Props) => {
  const handleComment = () => {
    if(onComment) onComment();
  };

  return (
    <AppConsumer>
      {({dispatch}) => {
        const handleCancel = () => {
          const hasDirtyPages = hasAnyPageDirtyForms();

          if(hasDirtyPages) {
            dispatch({
              type: ActionTypes.SHOW_CONFIRMATION_MODAL,
              confirmationFunction: () => {
                if(onCancel) onCancel();
              },
              confirmationModalButtonClassName: ButtonColors.ALERT,
              confirmationModalButtonText: ConfirmationModalTexts.CANCEL_CHANGES.BUTTON,
              confirmationModalLabel: ConfirmationModalTexts.CANCEL_CHANGES.LABEL,
              confirmationModalTitle: ConfirmationModalTexts.CANCEL_CHANGES.TITLE,
            });
          } else {
            if(onCancel) onCancel();
          }
        };

        const handleCopy = () => {
          const hasDirtyPages = hasAnyPageDirtyForms();

          if(hasDirtyPages) {
            dispatch({
              type: ActionTypes.SHOW_CONFIRMATION_MODAL,
              confirmationFunction: () => {
                if(onCopy) onCopy();
              },
              confirmationModalButtonClassName: ButtonColors.ALERT,
              confirmationModalButtonText: ConfirmationModalTexts.CANCEL_CHANGES.BUTTON,
              confirmationModalLabel: ConfirmationModalTexts.CANCEL_CHANGES.LABEL,
              confirmationModalTitle: ConfirmationModalTexts.CANCEL_CHANGES.TITLE,
            });
          } else {
            if(onCopy) onCopy();
          }
        };

        const handleDelete = () => {
          dispatch({
            type: ActionTypes.SHOW_CONFIRMATION_MODAL,
            confirmationFunction: () => {
              if(onDelete) onDelete();
            },
            confirmationModalButtonClassName: deleteModalTexts ? deleteModalTexts.buttonClassName : '',
            confirmationModalButtonText: deleteModalTexts ? deleteModalTexts.buttonText : '',
            confirmationModalLabel: deleteModalTexts ? deleteModalTexts.label : '',
            confirmationModalTitle: deleteModalTexts ? deleteModalTexts.title : '',
          });
        };

        return(
          <div className='control-buttons'>
            {isEditMode &&
              <div className='control-buttons__left-button-wrapper'>
                <Button
                  className={ButtonColors.SECONDARY}
                  disabled={isCancelDisabled}
                  onClick={handleCancel}
                  text='Hylkää muutokset'
                />
                {showCopyButton &&
                  <Authorization allow={allowCopy}>
                    <Button
                      className={ButtonColors.NEUTRAL}
                      disabled={isCopyDisabled}
                      onClick={handleCopy}
                      text='Kopioi'
                    />
                  </Authorization>
                }
                {onDelete &&
                  <Authorization allow={allowDelete}>
                    <Button
                      className={ButtonColors.ALERT}
                      onClick={handleDelete}
                      text='Poista'
                    />
                  </Authorization>
                }
                <Button
                  className={ButtonColors.SUCCESS}
                  disabled={!allowEdit || isSaveDisabled}
                  onClick={onSave}
                  text='Tallenna'
                />
              </div>
            }
            {!isEditMode &&
              <div className='control-buttons__left-button-wrapper'>
                <Authorization allow={allowEdit}>
                  <Button
                    className={ButtonColors.SUCCESS}
                    disabled={isEditDisabled}
                    onClick={onEdit}
                    text='Muokkaa'
                  />
                </Authorization>
              </div>
            }

            {!!showCommentButton &&
              <Authorization allow={allowComments}>
                <CommentButton
                  commentAmount={commentAmount}
                  onClick={handleComment}
                />
              </Authorization>
            }
          </div>
        );
      }}
    </AppConsumer>
  );
};

export default ControlButtons;
