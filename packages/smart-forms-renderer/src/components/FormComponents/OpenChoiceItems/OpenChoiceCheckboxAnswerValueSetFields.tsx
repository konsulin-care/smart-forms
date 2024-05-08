/*
 * Copyright 2024 Commonwealth Scientific and Industrial Research
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

import React from 'react';
import { ChoiceItemOrientation } from '../../../interfaces/choice.enum';
import CheckboxSingleWithOpenLabel from '../ItemParts/CheckboxSingleWithOpenLabel';
import type {
  QuestionnaireItem,
  QuestionnaireItemAnswerOption,
  QuestionnaireResponseItemAnswer
} from 'fhir/r4';
import { getChoiceOrientation } from '../../../utils/choice';
import { StyledFormGroup } from '../Item.styles';
import CheckboxOptionList from '../ChoiceItems/CheckboxOptionList';
import { StyledAlert } from '../../Alert.styles';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Typography from '@mui/material/Typography';
import type { TerminologyError } from '../../../hooks/useValueSetCodings';

interface OpenChoiceCheckboxFieldsProps {
  qItem: QuestionnaireItem;
  options: QuestionnaireItemAnswerOption[];
  answers: QuestionnaireResponseItemAnswer[];
  openLabelText: string | null;
  openLabelValue: string;
  openLabelChecked: boolean;
  readOnly: boolean;
  terminologyError: TerminologyError;
  onOptionChange: (changedOptionValue: string) => void;
  onOpenLabelCheckedChange: (checked: boolean) => void;
  onOpenLabelInputChange: (input: string) => void;
}

function OpenChoiceCheckboxAnswerValueSetFields(props: OpenChoiceCheckboxFieldsProps) {
  const {
    qItem,
    options,
    answers,
    openLabelText,
    openLabelValue,
    openLabelChecked,
    readOnly,
    terminologyError,
    onOptionChange,
    onOpenLabelCheckedChange,
    onOpenLabelInputChange
  } = props;

  const orientation = getChoiceOrientation(qItem) ?? ChoiceItemOrientation.Vertical;

  if (options.length > 0) {
    return (
      <StyledFormGroup row={orientation === ChoiceItemOrientation.Horizontal}>
        <CheckboxOptionList
          options={options}
          answers={answers}
          readOnly={readOnly}
          onCheckedChange={onOptionChange}
        />

        {openLabelText !== null ? (
          <CheckboxSingleWithOpenLabel
            value={openLabelValue}
            label={openLabelText}
            isChecked={openLabelChecked}
            onCheckedChange={onOpenLabelCheckedChange}
            onInputChange={onOpenLabelInputChange}
          />
        ) : null}
      </StyledFormGroup>
    );
  }

  if (terminologyError.error) {
    return (
      <StyledAlert color="error">
        <ErrorOutlineIcon color="error" sx={{ pr: 0.75 }} />
        <Typography variant="subtitle2">
          There was an error fetching options from the terminology server for{' '}
          {terminologyError.answerValueSet}
        </Typography>
      </StyledAlert>
    );
  }

  return (
    <StyledAlert color="error">
      <ErrorOutlineIcon color="error" sx={{ pr: 0.75 }} />
      <Typography variant="subtitle2">
        Unable to fetch options from the questionnaire or launch context
      </Typography>
    </StyledAlert>
  );
}

export default OpenChoiceCheckboxAnswerValueSetFields;
