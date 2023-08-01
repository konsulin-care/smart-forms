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

import { Box, LinearProgress } from '@mui/material';
import {
  getResponseToolBarColors,
  StyledRoot
} from '../../QuestionnairePage/TableComponents/QuestionnaireListToolbar.styles.ts';
import { useContext } from 'react';
import { SelectedQuestionnaireContext } from '../../../../contexts/SelectedQuestionnaireContext.tsx';
import ResponseListToolbarButtons from './ResponseListToolbarButtons.tsx';
import type { QuestionnaireResponse } from 'fhir/r4';
import ResponseListToolbarLeftSection from './ResponseListToolbarLeftSection.tsx';

interface ResponseListToolbarProps {
  selectedResponse: QuestionnaireResponse | null;
  searchInput: string;
  isFetching: boolean;
  onClearSelection: () => void;
  onSearch: (searchInput: string) => void;
}

function ResponseListToolbar(props: ResponseListToolbarProps) {
  const { selectedResponse, searchInput, isFetching, onClearSelection, onSearch } = props;

  const { selectedQuestionnaire, existingResponses } = useContext(SelectedQuestionnaireContext);

  const toolBarColors = getResponseToolBarColors(
    selectedResponse,
    selectedQuestionnaire,
    existingResponses
  );

  return (
    <>
      <StyledRoot data-test="responses-list-toolbar" sx={{ ...toolBarColors }}>
        <ResponseListToolbarLeftSection
          selectedResponse={selectedResponse}
          selectedQuestionnaire={selectedQuestionnaire}
          existingResponses={existingResponses}
          searchInput={searchInput}
          onSearch={onSearch}
        />

        <ResponseListToolbarButtons
          selectedResponse={selectedResponse}
          onClearSelection={onClearSelection}
        />
      </StyledRoot>
      {isFetching ? <LinearProgress /> : <Box pt={0.5} sx={{ ...toolBarColors }} />}
    </>
  );
}

export default ResponseListToolbar;
