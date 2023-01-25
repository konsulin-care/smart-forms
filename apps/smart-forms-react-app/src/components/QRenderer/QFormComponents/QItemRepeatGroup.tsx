import React, { useEffect, useState } from 'react';
import { Box, Button, Card, IconButton, Stack } from '@mui/material';

import {
  PropsWithQrRepeatGroupChangeHandler,
  PropsWithRepeatsAttribute
} from '../../../interfaces/Interfaces';
import { Add, Delete } from '@mui/icons-material';
import QItemGroup from './QItemGroup';

import { QuestionnaireItem, QuestionnaireResponseItem } from 'fhir/r5';
import { createQrItem } from '../../../functions/QrItemFunctions';
import { isHidden } from '../../../functions/QItemFunctions';
import { RepeatDeleteTooltip, RepeatGroupContainerStack } from './QItemRepeat.styles';
import QItemLabel from './QItemParts/QItemLabel';
import { QGroupHeadingTypography } from '../../StyledComponents/Typographys.styles';
import { EnableWhenContext } from '../../../custom-contexts/EnableWhenContext';
import { EnableWhenChecksContext } from '../Form';

interface Props extends PropsWithQrRepeatGroupChangeHandler, PropsWithRepeatsAttribute {
  qItem: QuestionnaireItem;
  qrItems: QuestionnaireResponseItem[];
  groupCardElevation: number;
}

function QItemRepeatGroup(props: Props) {
  const { qItem, qrItems, groupCardElevation, onQrRepeatGroupChange } = props;

  const enableWhenContext = React.useContext(EnableWhenContext);
  const enableWhenChecksContext = React.useContext(EnableWhenChecksContext);

  const cleanQrItem = createQrItem(qItem);
  const qrRepeatGroups: (QuestionnaireResponseItem | undefined)[] =
    qrItems.length > 0 ? qrItems : [undefined];

  const [repeatGroups, setRepeatGroups] = useState(qrRepeatGroups);

  useEffect(() => {
    setRepeatGroups(qrRepeatGroups);
  }, [qrItems]);

  if (isHidden(qItem, enableWhenContext, enableWhenChecksContext)) return null;

  function handleAnswerItemsChange(newQrGroup: QuestionnaireResponseItem, index: number) {
    const newQrGroupItems = newQrGroup.item;
    const repeatGroupsTemp = [...repeatGroups];

    if (newQrGroupItems) {
      repeatGroupsTemp[index] = {
        linkId: newQrGroup.linkId,
        text: newQrGroup.text,
        item: newQrGroupItems
      };
    }
    updateAnswerItems(repeatGroupsTemp);
  }

  function deleteAnswerItem(index: number) {
    const repeatGroupsTemp = [...repeatGroups];
    if (repeatGroupsTemp.length === 1) {
      repeatGroupsTemp[0] = undefined;
    } else {
      repeatGroupsTemp.splice(index, 1);
    }
    updateAnswerItems(repeatGroupsTemp);
  }

  function updateAnswerItems(updatedRepeatGroups: (QuestionnaireResponseItem | undefined)[]) {
    setRepeatGroups([...updatedRepeatGroups]);

    const groupsWithValues: QuestionnaireResponseItem[] = updatedRepeatGroups.flatMap(
      (singleGroup) => (singleGroup ? [singleGroup] : [])
    );
    onQrRepeatGroupChange({ linkId: qItem.linkId, qrItems: groupsWithValues });
  }

  return (
    <Card elevation={groupCardElevation} sx={{ py: 3, px: 3.5, mb: 3.5 }}>
      <QGroupHeadingTypography variant="h6" sx={{ mb: 4 }}>
        <QItemLabel qItem={qItem} />
      </QGroupHeadingTypography>
      {repeatGroups.map((singleGroup, index) => {
        const singleQrGroup: QuestionnaireResponseItem = singleGroup
          ? { ...cleanQrItem, item: singleGroup.item }
          : { ...cleanQrItem };

        return (
          <RepeatGroupContainerStack key={index} direction="row" justifyContent="end">
            <Box sx={{ flexGrow: 1 }}>
              <QItemGroup
                qItem={qItem}
                qrItem={singleQrGroup}
                repeats={true}
                groupCardElevation={groupCardElevation + 1}
                onQrItemChange={(newQrGroup) =>
                  handleAnswerItemsChange(newQrGroup, index)
                }></QItemGroup>
            </Box>

            <RepeatDeleteTooltip className="repeat-group-delete" title="Delete item">
              <span>
                <IconButton
                  size="small"
                  color="error"
                  disabled={!singleGroup}
                  onClick={() => deleteAnswerItem(index)}>
                  <Delete />
                </IconButton>
              </span>
            </RepeatDeleteTooltip>
          </RepeatGroupContainerStack>
        );
      })}

      <Stack direction="row" justifyContent="end" sx={{ mt: 1 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          disabled={!repeatGroups[repeatGroups.length - 1]}
          onClick={() => setRepeatGroups([...repeatGroups, undefined])}>
          Add Item
        </Button>
      </Stack>
    </Card>
  );
}

export default QItemRepeatGroup;
