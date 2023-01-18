import React, { useEffect, useState } from 'react';
import { Box, Card, Divider } from '@mui/material';
import { QItemType } from '../../../interfaces/Enums';
import QItemSwitcher from './QItemSwitcher';
import { getQrItemsIndex, mapQItemsIndex } from '../../../functions/IndexFunctions';
import QItemRepeatGroup from './QItemRepeatGroup';
import QItemRepeat from './QItemRepeat';
import { QuestionnaireItem, QuestionnaireResponseItem } from 'fhir/r5';
import { createQrGroup, updateLinkedItem } from '../../../functions/QrItemFunctions';
import {
  PropsWithQrItemChangeHandler,
  PropsWithRepeatsAttribute
} from '../../../interfaces/Interfaces';
import { isHidden, isRepeatItemAndNotCheckbox } from '../../../functions/QItemFunctions';
import { QGroupHeadingTypography } from '../../StyledComponents/Typographys.styles';
import { isSpecificItemControl } from '../../../functions/ItemControlFunctions';
import QItemGroupTable from './QItemGroupTable';
import QItemLabel from './QItemParts/QItemLabel';

interface Props
  extends PropsWithQrItemChangeHandler<QuestionnaireResponseItem>,
    PropsWithRepeatsAttribute {
  qItem: QuestionnaireItem;
  qrItem: QuestionnaireResponseItem;
  groupCardElevation: number;
}

function QItemGroup(props: Props) {
  const { qItem, qrItem, repeats, groupCardElevation, onQrItemChange } = props;

  if (isHidden(qItem)) return null;

  const qItemsIndexMap = mapQItemsIndex(qItem);

  const qItems = qItem.item;
  const groupFromProps = qrItem && qrItem.item ? qrItem : createQrGroup(qItem);
  const qrItems = groupFromProps.item;

  const [group, setGroup] = useState(groupFromProps);

  useEffect(() => {
    setGroup(groupFromProps);
  }, [qrItem]);

  function handleQrItemChange(newQrItem: QuestionnaireResponseItem) {
    const qrGroup: QuestionnaireResponseItem = { ...group };
    updateLinkedItem(newQrItem, qrGroup, qItemsIndexMap);
    setGroup(qrGroup);
    onQrItemChange(qrGroup);
  }

  if (qItems && qrItems) {
    const qrItemsByIndex = getQrItemsIndex(qItems, qrItems);

    return (
      <Card elevation={groupCardElevation} sx={{ py: 3, px: 3.5, mb: repeats ? 0 : 3.5 }}>
        {repeats ? null : (
          <>
            <QGroupHeadingTypography variant="h6">
              <QItemLabel qItem={qItem} />
            </QGroupHeadingTypography>
            <Divider sx={{ mt: 1, mb: 1.5 }} light />
          </>
        )}
        {qItems.map((qItem: QuestionnaireItem, i) => {
          const qrItem = qrItemsByIndex[i];
          if (isRepeatItemAndNotCheckbox(qItem)) {
            if (qItem.repeats) {
              if (qItem.type === QItemType.Group) {
                if (isSpecificItemControl(qItem, 'gtable')) {
                  return (
                    <Box key={qItem.linkId} sx={{ my: 2 }}>
                      <QItemGroupTable
                        qItem={qItem}
                        qrItem={qrItem}
                        repeats={true}
                        onQrItemChange={handleQrItemChange}
                      />
                    </Box>
                  );
                } else {
                  return (
                    <Box key={qItem.linkId} sx={{ my: 2 }}>
                      <QItemRepeatGroup
                        qItem={qItem}
                        qrItem={qrItem}
                        repeats={true}
                        groupCardElevation={groupCardElevation + 1}
                        onQrItemChange={handleQrItemChange}
                      />
                    </Box>
                  );
                }
              } else {
                return (
                  <QItemRepeat
                    key={i}
                    qItem={qItem}
                    qrItem={qrItem}
                    onQrItemChange={handleQrItemChange}
                  />
                );
              }
            }
          }

          // if qItem is not a repeating question
          if (qItem.type === QItemType.Group) {
            return (
              <Box key={qItem.linkId} sx={{ my: 2 }}>
                <QItemGroup
                  qItem={qItem}
                  qrItem={qrItem}
                  repeats={false}
                  groupCardElevation={groupCardElevation + 1}
                  onQrItemChange={handleQrItemChange}></QItemGroup>
              </Box>
            );
          } else {
            return (
              <QItemSwitcher
                key={qItem.linkId}
                qItem={qItem}
                qrItem={qrItem}
                repeats={false}
                onQrItemChange={handleQrItemChange}></QItemSwitcher>
            );
          }
        })}
      </Card>
    );
  } else {
    return <div>Unable to load group</div>;
  }
}

export default QItemGroup;
