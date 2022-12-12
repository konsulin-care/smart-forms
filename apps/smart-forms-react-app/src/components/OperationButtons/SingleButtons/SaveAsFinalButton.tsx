import React from 'react';
import { ListItemButton, Typography } from '@mui/material';
import { Save } from '@mui/icons-material';
import ListItemText from '@mui/material/ListItemText';
import { Patient, Practitioner, QuestionnaireResponse } from 'fhir/r5';
import Client from 'fhirclient/lib/Client';
import { OperationChip } from '../../ChipBar/ChipBar.styles';
import ConfirmSaveAsFinalDialog from '../../Dialogs/ConfirmSaveAsFinalDialog';
import { QuestionnaireResponseProviderContext } from '../../../App';

interface Props {
  isChip?: boolean;
  qrHasChanges?: boolean;
  removeQrHasChanges: () => unknown;
  questionnaireResponse: QuestionnaireResponse;
  fhirClient: Client;
  patient: Patient;
  user: Practitioner;
}

function SaveAsFinalButton(props: Props) {
  const {
    isChip,
    qrHasChanges,
    removeQrHasChanges,
    questionnaireResponse,
    fhirClient,
    patient,
    user
  } = props;
  const questionnaireResponseProvider = React.useContext(QuestionnaireResponseProviderContext);
  const questionnaireResponseIsSaved: boolean =
    !!questionnaireResponseProvider.questionnaireResponse.authored &&
    !!questionnaireResponseProvider.questionnaireResponse.author;

  const [dialogOpen, setDialogOpen] = React.useState(false);

  function handleClick() {
    setDialogOpen(true);
  }

  const renderButtonOrChip = !isChip ? (
    <ListItemButton
      disabled={
        (qrHasChanges === false ||
          (typeof qrHasChanges !== 'boolean' && qrHasChanges !== undefined)) &&
        !questionnaireResponseIsSaved
      }
      onClick={handleClick}>
      <Save sx={{ mr: 2 }} />
      <ListItemText
        primary={
          <Typography fontSize={12} variant="h6">
            Save as Final
          </Typography>
        }
      />
    </ListItemButton>
  ) : (
    <OperationChip
      icon={<Save fontSize="small" />}
      label="Save as Final"
      clickable
      disabled={
        (qrHasChanges === false ||
          (typeof qrHasChanges !== 'boolean' && qrHasChanges !== undefined)) &&
        !questionnaireResponseIsSaved
      }
      onClick={handleClick}
    />
  );
  return (
    <>
      {renderButtonOrChip}
      <ConfirmSaveAsFinalDialog
        dialogOpen={dialogOpen}
        closeDialog={() => setDialogOpen(false)}
        removeQrHasChanges={removeQrHasChanges}
        questionnaireResponse={questionnaireResponse}
        fhirClient={fhirClient}
        patient={patient}
        user={user}
      />
    </>
  );
}

export default SaveAsFinalButton;