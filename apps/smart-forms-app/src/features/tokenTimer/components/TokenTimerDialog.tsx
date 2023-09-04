/*
 * Copyright 2023 Commonwealth Scientific and Industrial Research
 * Organisation (CSIRO) ABN 41 687 119 230.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import cloneDeep from 'lodash.clonedeep';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  removeHiddenAnswersFromResponse,
  useQuestionnaireResponseStore,
  useQuestionnaireStore
} from '@aehrc/smart-forms-renderer';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import { saveQuestionnaireResponse } from '../../../api/saveQr.ts';
import useSmartClient from '../../../hooks/useSmartClient.ts';

export interface TokenTimerDialogProps {
  open: boolean;
  closeDialog: () => unknown;
}

function TokenTimerDialog(props: TokenTimerDialogProps) {
  const { open, closeDialog } = props;

  const { smartClient, patient, user, launchQuestionnaire } = useSmartClient();

  const sourceQuestionnaire = useQuestionnaireStore((state) => state.sourceQuestionnaire);
  const updatableResponse = useQuestionnaireResponseStore((state) => state.updatableResponse);
  const setUpdatableResponseAsSaved = useQuestionnaireResponseStore(
    (state) => state.setUpdatableResponseAsSaved
  );

  const [isSaving, setIsSaving] = useState(false);

  const navigate = useNavigate();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const launchQuestionnaireExists = !!launchQuestionnaire;

  // Event Handlers
  function handleClose() {
    closeDialog();
  }

  function handleSave() {
    closeSnackbar();
    if (!(smartClient && patient && user)) {
      return;
    }

    setIsSaving(true);
    const responseToSave = removeHiddenAnswersFromResponse(
      sourceQuestionnaire,
      cloneDeep(updatableResponse)
    );

    responseToSave.status = 'in-progress';
    saveQuestionnaireResponse(smartClient, patient, user, sourceQuestionnaire, responseToSave)
      .then((savedResponse) => {
        setUpdatableResponseAsSaved(savedResponse);
        enqueueSnackbar('Response saved as draft', {
          variant: 'success',
          action: (
            <Tooltip title="View Responses">
              <IconButton
                color="inherit"
                onClick={() => {
                  navigate(
                    launchQuestionnaireExists ? '/dashboard/existing' : '/dashboard/responses'
                  );
                  closeSnackbar();
                }}>
                <ReadMoreIcon />
              </IconButton>
            </Tooltip>
          )
        });

        // Wait until renderer.hasChanges is set to false before navigating away
        setTimeout(() => {
          setIsSaving(false);
          handleClose();
        }, 500);
      })
      .catch((error) => {
        console.error(error);
        enqueueSnackbar('An error occurred while saving. Try again later.', {
          variant: 'error'
        });
      });
  }

  return (
    <Dialog open={open}>
      <DialogTitle variant="h5">Session expiring soon</DialogTitle>
      <DialogContent>
        <DialogContentText variant="body1">
          {
            'You have 15 minutes left in your session. Do you want to save your progress so far as a draft? You would be unable to save your progress after the session expires.'
          }
        </DialogContentText>
        <DialogContentText variant="body1">
          You would be unable to save your progress after the session expires.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <LoadingButton loading={isSaving} onClick={handleSave}>
          Save as Draft
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default TokenTimerDialog;