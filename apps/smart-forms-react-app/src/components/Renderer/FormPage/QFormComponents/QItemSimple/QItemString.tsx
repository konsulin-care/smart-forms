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

import React, { memo, useCallback, useState } from 'react';
import { Grid, InputAdornment } from '@mui/material';

import type {
  PropsWithIsRepeatedAttribute,
  PropsWithIsTabledAttribute,
  PropsWithQrItemChangeHandler
} from '../../../../../interfaces/Interfaces';
import type { QuestionnaireItem, QuestionnaireResponseItem } from 'fhir/r5';
import { createEmptyQrItem } from '../../../../../functions/QrItemFunctions';
import QItemDisplayInstructions from './QItemDisplayInstructions';
import QItemLabel from '../QItemParts/QItemLabel';
import { StandardTextField } from '../../../../StyledComponents/Textfield.styles';
import { FullWidthFormComponentBox } from '../../../../StyledComponents/Boxes.styles';
import { debounce } from 'lodash';
import useRenderingExtensions from '../../../../../custom-hooks/useRenderingExtensions';

interface Props
  extends PropsWithQrItemChangeHandler<QuestionnaireResponseItem>,
    PropsWithIsRepeatedAttribute,
    PropsWithIsTabledAttribute {
  qItem: QuestionnaireItem;
  qrItem: QuestionnaireResponseItem;
}

function QItemString(props: Props) {
  const { qItem, qrItem, isRepeated, isTabled, onQrItemChange } = props;

  // Init input value
  let valueString = '';
  if (qrItem && qrItem.answer && qrItem.answer.length && qrItem.answer[0].valueString) {
    valueString = qrItem.answer[0].valueString;
  }
  const [input, setInput] = useState<string>(valueString);

  // Get additional rendering extensions
  const { displayUnit, displayPrompt, displayInstructions, readOnly } =
    useRenderingExtensions(qItem);

  // Define error if present
  let hasError = false;
  if (qItem.maxLength && valueString) {
    hasError = valueString.length > qItem.maxLength;
  }

  // Event handlers
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newInput = event.target.value;
    setInput(newInput);
    updateQrItemWithDebounce(newInput);
  }

  const updateQrItemWithDebounce = useCallback(
    debounce((input: string) => {
      if (input !== '') {
        onQrItemChange({ ...createEmptyQrItem(qItem), answer: [{ valueString: input.trim() }] });
      } else {
        onQrItemChange(createEmptyQrItem(qItem));
      }
    }, 200),
    [onQrItemChange, qItem]
  );

  const stringInput = (
    <StandardTextField
      fullWidth
      isTabled={isTabled}
      error={hasError}
      id={qItem.linkId}
      value={input}
      onChange={handleChange}
      label={displayPrompt}
      disabled={readOnly}
      InputProps={{ endAdornment: <InputAdornment position={'end'}>{displayUnit}</InputAdornment> }}
      helperText={hasError && qItem.maxLength ? `${qItem.maxLength} character limit exceeded` : ''}
      data-test="q-item-string-field"
    />
  );

  const renderQItemString = isRepeated ? (
    <>{stringInput}</>
  ) : (
    <FullWidthFormComponentBox data-test="q-item-string-box">
      <Grid container columnSpacing={6}>
        <Grid item xs={5}>
          <QItemLabel qItem={qItem} />
        </Grid>
        <Grid item xs={7}>
          {stringInput}
          <QItemDisplayInstructions displayInstructions={displayInstructions} />
        </Grid>
      </Grid>
    </FullWidthFormComponentBox>
  );

  return <>{renderQItemString}</>;
}

export default memo(QItemString);
