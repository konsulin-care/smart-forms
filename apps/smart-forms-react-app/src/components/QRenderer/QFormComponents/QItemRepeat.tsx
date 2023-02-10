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

import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, Collapse, Grid, IconButton, Stack } from '@mui/material';
import { PropsWithQrItemChangeHandler } from '../../../interfaces/Interfaces';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import QItemSwitcher from './QItemSwitcher';
import {
  QuestionnaireItem,
  QuestionnaireResponseItem,
  QuestionnaireResponseItemAnswer
} from 'fhir/r5';
import { createEmptyQrItem } from '../../../functions/QrItemFunctions';
import { isHidden } from '../../../functions/QItemFunctions';
import QItemDisplayInstructions from './QItemSimple/QItemDisplayInstructions';
import { RepeatDeleteTooltip, RepeatItemContainerStack } from './QItemRepeat.styles';
import QItemLabel from './QItemParts/QItemLabel';
import { EnableWhenContext } from '../../../custom-contexts/EnableWhenContext';
import { EnableWhenChecksContext } from '../Form';
import { TransitionGroup } from 'react-transition-group';
import { FullWidthFormComponentBox } from '../../StyledComponents/Boxes.styles';

interface Props extends PropsWithQrItemChangeHandler<QuestionnaireResponseItem> {
  qItem: QuestionnaireItem;
  qrItem: QuestionnaireResponseItem;
}

function QItemRepeat(props: Props) {
  const { qItem, qrItem, onQrItemChange } = props;

  const enableWhenContext = useContext(EnableWhenContext);
  const enableWhenChecksContext = useContext(EnableWhenChecksContext);

  const emptyQrItem = createEmptyQrItem(qItem);
  const qrRepeat = qrItem ? qrItem : emptyQrItem;
  const qrRepeatAnswers: (QuestionnaireResponseItemAnswer | undefined)[] = qrRepeat['answer']
    ? qrRepeat.answer
    : [undefined];

  const initialRepeatAnswers = [...qrRepeatAnswers];
  if (initialRepeatAnswers[initialRepeatAnswers.length - 1] !== undefined) {
    initialRepeatAnswers.push(undefined);
  }

  const [repeatAnswers, setRepeatAnswers] = useState(initialRepeatAnswers);

  useEffect(() => {
    if (repeatAnswers.length === 0) {
      setRepeatAnswers([undefined]);
    }
  }, [qrItem]);

  if (isHidden(qItem, enableWhenContext, enableWhenChecksContext)) return null;

  function handleAnswersChange(newQrItem: QuestionnaireResponseItem, index: number) {
    const answersTemp = [...repeatAnswers];
    answersTemp[index] = newQrItem.answer ? newQrItem.answer[0] : undefined;
    updateAnswers(answersTemp);
  }

  function deleteAnswer(index: number) {
    const answersTemp = [...repeatAnswers];
    if (answersTemp.length === 1) {
      answersTemp[0] = undefined;
    } else {
      answersTemp.splice(index, 1);
    }
    updateAnswers(answersTemp);
  }

  function updateAnswers(updatedAnswers: (QuestionnaireResponseItemAnswer | undefined)[]) {
    setRepeatAnswers(updatedAnswers);
    const answersWithValues = updatedAnswers.flatMap((answer) => (answer ? [answer] : []));
    onQrItemChange({ ...qrRepeat, answer: answersWithValues });
  }

  return (
    <FullWidthFormComponentBox data-test="q-item-repeat-box">
      <Grid container columnSpacing={6}>
        <Grid item xs={5}>
          <QItemLabel qItem={qItem} />
        </Grid>
        <Grid item xs={7}>
          <TransitionGroup>
            {repeatAnswers.map((answer, index) => {
              const singleQrItem = answer
                ? { ...emptyQrItem, answer: [answer] }
                : { ...emptyQrItem };

              return (
                <Collapse key={index}>
                  <RepeatItemContainerStack direction="row">
                    <Box sx={{ flexGrow: 1 }}>
                      <QItemSwitcher
                        qItem={qItem}
                        qrItem={singleQrItem}
                        isRepeated={qItem.repeats ?? false}
                        isTabled={false}
                        onQrItemChange={(newQrItem) =>
                          handleAnswersChange(newQrItem, index)
                        }></QItemSwitcher>
                    </Box>
                    <RepeatDeleteTooltip className="repeat-item-delete" title="Delete item">
                      <span>
                        <IconButton
                          size="small"
                          color="error"
                          disabled={!answer}
                          onClick={() => deleteAnswer(index)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </RepeatDeleteTooltip>
                  </RepeatItemContainerStack>
                </Collapse>
              );
            })}
          </TransitionGroup>
          <QItemDisplayInstructions qItem={qItem} />
        </Grid>
      </Grid>

      <Stack direction="row" justifyContent="end" sx={{ mt: 1 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          disabled={!repeatAnswers[repeatAnswers.length - 1]}
          onClick={() => setRepeatAnswers([...repeatAnswers, undefined])}
          data-test="button-add-repeat-item">
          Add Item
        </Button>
      </Stack>
    </FullWidthFormComponentBox>
  );
}

export default QItemRepeat;
