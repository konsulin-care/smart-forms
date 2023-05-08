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

import { useContext, useEffect, useRef } from 'react';
import { Box, Card, Container, Fade, Typography } from '@mui/material';
import { QuestionnaireProviderContext, QuestionnaireResponseProviderContext } from '../../App';
import ViewerInvalid from '../Renderer/FormPage/ViewerInvalid';
import { PrintComponentRefContext } from './ViewerLayout';
import { EnableWhenContext } from '../../custom-contexts/EnableWhenContext';
import { removeHiddenAnswers } from '../../functions/SaveQrFunctions';
import parse from 'html-react-parser';
import { qrToHTML } from '../../functions/PreviewFunctions';
import { Helmet } from 'react-helmet';

function ResponsePreview() {
  const questionnaireProvider = useContext(QuestionnaireProviderContext);
  const questionnaireResponseProvider = useContext(QuestionnaireResponseProviderContext);
  const enableWhenContext = useContext(EnableWhenContext);

  const { setComponentRef } = useContext(PrintComponentRefContext);
  const componentRef = useRef(null);

  useEffect(
    () => {
      setComponentRef(componentRef);
    },
    // init componentRef on first render, leave dependency array empty
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const questionnaire = questionnaireProvider.questionnaire;
  const response = questionnaireResponseProvider.response;

  if (!questionnaire.item || !response.item) return <ViewerInvalid />;

  const responseCleaned = removeHiddenAnswers(questionnaire, response, enableWhenContext);
  const parsedHTML = parse(qrToHTML(questionnaire, responseCleaned));

  return (
    <>
      <Helmet>
        <title>{questionnaire.title ? questionnaire.title : 'Response Preview'}</title>
      </Helmet>
      <Fade in={true} timeout={500}>
        <Container>
          <Box mb={3}>
            <Typography variant="h3">Response Preview</Typography>
          </Box>
          <Card sx={{ mb: 2 }}>
            <Box ref={componentRef} sx={{ p: 4 }} data-test="response-preview-box">
              <>{parsedHTML}</>
            </Box>
          </Card>
        </Container>
      </Fade>
    </>
  );
}

export default ResponsePreview;
