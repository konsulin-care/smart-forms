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

import { memo } from 'react';
import { Grid } from '@mui/material';
import { QItemChoiceOrientation } from '../../../../types/choice.enum.ts';
import type { QuestionnaireItem, QuestionnaireResponseItem } from 'fhir/r4';
import QItemChoiceCheckboxSingle from '../QItemParts/QItemCheckboxSingle.tsx';
import { createEmptyQrItem } from '../../../../utils/qrItem.ts';
import { QFormGroup } from '../Item.styles.tsx';
import { updateQrCheckboxAnswers } from '../../../../utils/choice.ts';
import QItemLabel from '../QItemParts/QItemLabel.tsx';
import { FullWidthFormComponentBox } from '../../../../../../components/Box/Box.styles.tsx';
import useRenderingExtensions from '../../../../hooks/useRenderingExtensions.ts';
import type {
  PropsWithIsRepeatedAttribute,
  PropsWithQrItemChangeHandler
} from '../../../../types/renderProps.interface.ts';
import DisplayInstructions from '../DisplayItem/DisplayInstructions.tsx';

interface QItemChoiceCheckboxProps
  extends PropsWithQrItemChangeHandler<QuestionnaireResponseItem>,
    PropsWithIsRepeatedAttribute {
  qItem: QuestionnaireItem;
  qrItem: QuestionnaireResponseItem;
  orientation: QItemChoiceOrientation;
}

function QItemChoiceCheckboxAnswerOption(props: QItemChoiceCheckboxProps) {
  const { qItem, qrItem, isRepeated, onQrItemChange, orientation } = props;

  // Init input value
  const qrChoiceCheckbox = qrItem ?? createEmptyQrItem(qItem);
  const answers = qrChoiceCheckbox.answer ? qrChoiceCheckbox.answer : [];

  // Get additional rendering extensions
  const { displayInstructions, readOnly } = useRenderingExtensions(qItem);

  // Event handlers
  function handleCheckedChange(changedValue: string) {
    const answerOptions = qItem.answerOption;
    if (!answerOptions) return null;

    const updatedQrChoiceCheckbox = updateQrCheckboxAnswers(
      changedValue,
      answers,
      answerOptions,
      qrChoiceCheckbox,
      isRepeated
    );

    if (updatedQrChoiceCheckbox) {
      onQrItemChange(updatedQrChoiceCheckbox);
    }
  }

  const choiceCheckbox = (
    <QFormGroup row={orientation === QItemChoiceOrientation.Horizontal}>
      {qItem.answerOption?.map((option) => {
        if (option['valueCoding']) {
          return (
            <QItemChoiceCheckboxSingle
              key={option.valueCoding.code ?? ''}
              value={option.valueCoding.code ?? ''}
              label={option.valueCoding.display ?? `${option.valueCoding.code}`}
              readOnly={readOnly}
              isChecked={answers.some(
                (answer) => JSON.stringify(answer) === JSON.stringify(option)
              )}
              onCheckedChange={handleCheckedChange}
            />
          );
        } else if (option['valueString']) {
          return (
            <QItemChoiceCheckboxSingle
              key={option.valueString}
              value={option.valueString}
              label={option.valueString}
              readOnly={readOnly}
              isChecked={answers.some((answer) => answer.valueString === option.valueString)}
              onCheckedChange={handleCheckedChange}
            />
          );
        } else if (option['valueInteger']) {
          return (
            <QItemChoiceCheckboxSingle
              key={option.valueInteger}
              value={option.valueInteger.toString()}
              label={option.valueInteger.toString()}
              readOnly={readOnly}
              isChecked={answers.some((answer) => answer.valueInteger === option.valueInteger)}
              onCheckedChange={handleCheckedChange}
            />
          );
        } else {
          return null;
        }
      })}
    </QFormGroup>
  );

  return (
    <FullWidthFormComponentBox data-test="q-item-choice-checkbox-answer-option-box">
      <Grid container columnSpacing={6}>
        <Grid item xs={5}>
          <QItemLabel qItem={qItem} />
        </Grid>
        <Grid item xs={7}>
          {choiceCheckbox}
          <DisplayInstructions displayInstructions={displayInstructions} />
        </Grid>
      </Grid>
    </FullWidthFormComponentBox>
  );
}

export default memo(QItemChoiceCheckboxAnswerOption);
