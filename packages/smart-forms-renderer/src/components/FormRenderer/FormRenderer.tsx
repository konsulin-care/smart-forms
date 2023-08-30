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

import React from 'react';
import { Container, Fade } from '@mui/material';
import FormTopLevelItem from '../FormRenderer/FormTopLevelItem';
import type { QuestionnaireResponse, QuestionnaireResponseItem } from 'fhir/r4';
import useQuestionnaireStore from '../../stores/useQuestionnaireStore';
import useQuestionnaireResponseStore from '../../stores/useQuestionnaireResponseStore';

function FormRenderer() {
  const sourceQuestionnaire = useQuestionnaireStore((state) => state.sourceQuestionnaire);
  const updateExpressions = useQuestionnaireStore((state) => state.updateExpressions);
  const updatableResponse = useQuestionnaireResponseStore((state) => state.updatableResponse);
  const updateResponse = useQuestionnaireResponseStore((state) => state.updateResponse);

  function handleTopLevelQRItemChange(newTopLevelQItem: QuestionnaireResponseItem, index: number) {
    if (!updatableResponse.item || updatableResponse.item.length === 0) {
      return;
    }

    const updatedItems = [...updatableResponse.item]; // Copy the original array of items
    updatedItems[index] = newTopLevelQItem; // Modify the item at the specified index

    const updatedResponse: QuestionnaireResponse = {
      ...updatableResponse,
      item: updatedItems
    };

    updateExpressions(updatedResponse);
    updateResponse(updatedResponse);
  }

  const topLevelQItems = sourceQuestionnaire.item;
  const topLevelQRItems = updatableResponse.item;

  if (!topLevelQItems) {
    return <>Questionnaire does not have any items</>;
  }

  return (
    <Fade in={true} timeout={500}>
      <Container maxWidth="xl">
        {topLevelQItems.map((qItem, index) => {
          const qrItem = topLevelQRItems
            ? topLevelQRItems[index]
            : {
                linkId: qItem.linkId,
                text: qItem.text
              };

          return (
            <FormTopLevelItem
              key={qItem.linkId}
              topLevelQItem={qItem}
              topLevelQRItem={qrItem}
              onQrItemChange={(newTopLevelQRItem) =>
                handleTopLevelQRItemChange(newTopLevelQRItem, index)
              }
            />
          );
        })}
      </Container>
    </Fade>
  );
}

export default FormRenderer;