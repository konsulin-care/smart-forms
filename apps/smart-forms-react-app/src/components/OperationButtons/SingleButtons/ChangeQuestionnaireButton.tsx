import React from 'react';
import { Box, ListItemButton, Tooltip, Typography } from '@mui/material';
import { ChangeCircle } from '@mui/icons-material';
import ListItemText from '@mui/material/ListItemText';
import { PageType, QuestionnaireSource } from '../../../interfaces/Enums';
import { PageSwitcherContext } from '../../../custom-contexts/PageSwitcherContext';
import ChangeQuestionnaireDialog from '../../Dialogs/ChangeQuestionnaireDialog';
import { OperationChip } from '../../ChipBar/ChipBar.styles';
import { QuestionnaireResponse } from 'fhir/r5';
import { LaunchContext } from '../../../custom-contexts/LaunchContext';
import { QuestionnaireProviderContext } from '../../../App';
import { SideBarIconButton } from '../../SideBar/SideBarBottom.styles';
import { SideBarContext } from '../../../custom-contexts/SideBarContext';

interface Props {
  isChip?: boolean;
  qrHasChanges?: boolean;
  removeQrHasChanges?: () => unknown;
  questionnaireResponse?: QuestionnaireResponse;
}

function ChangeQuestionnaireButton(props: Props) {
  const { isChip, qrHasChanges, removeQrHasChanges, questionnaireResponse } = props;
  const pageSwitcher = React.useContext(PageSwitcherContext);
  const questionnaireProvider = React.useContext(QuestionnaireProviderContext);
  const fhirClient = React.useContext(LaunchContext).fhirClient;
  const sideBar = React.useContext(SideBarContext);

  const [dialogOpen, setDialogOpen] = React.useState(false);

  function handleClick() {
    if (qrHasChanges && fhirClient && questionnaireProvider.source === QuestionnaireSource.Remote) {
      setDialogOpen(true);
    } else {
      pageSwitcher.goToPage(PageType.Picker);
    }
  }

  const buttonTitle = 'Change Questionnaire';

  const renderButton = (
    <ListItemButton onClick={handleClick}>
      <ChangeCircle sx={{ mr: 2 }} />
      <ListItemText
        primary={
          <Typography fontSize={12} variant="h6">
            {buttonTitle}
          </Typography>
        }
      />
    </ListItemButton>
  );

  const renderChip = (
    <OperationChip
      icon={<ChangeCircle fontSize="small" />}
      label={buttonTitle}
      clickable
      onClick={handleClick}
    />
  );

  const renderIconButton = (
    <Box>
      <Tooltip title={buttonTitle} placement="right">
        <span>
          <SideBarIconButton onClick={handleClick}>
            <ChangeCircle fontSize="small" />
          </SideBarIconButton>
        </span>
      </Tooltip>
    </Box>
  );

  return (
    <>
      {isChip ? renderChip : sideBar.isExpanded ? renderButton : renderIconButton}
      {qrHasChanges && removeQrHasChanges && questionnaireResponse ? (
        <ChangeQuestionnaireDialog
          dialogOpen={dialogOpen}
          closeDialog={() => setDialogOpen(false)}
          removeQrHasChanges={removeQrHasChanges}
          questionnaireResponse={questionnaireResponse}
        />
      ) : null}
    </>
  );
}

export default ChangeQuestionnaireButton;
