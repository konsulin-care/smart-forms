import React, { useEffect, useState } from 'react';
import { Button, Divider, Stack, Typography } from '@mui/material';
import QFormBody from './QFormBody';
import { QuestionnaireResponse, QuestionnaireResponseItem, ValueSet } from 'fhir/r5';
import QFormBodyTabbed from './QFormBodyTabbed';
import { containsTabs, getIndexOfFirstTab } from '../../functions/TabFunctions';
import { cleanQrItem, evaluateCalculatedExpressions } from '../../functions/QrItemFunctions';
import { QuestionnaireProvider } from '../../classes/QuestionnaireProvider';
import { CalculatedExpression } from '../../interfaces/Interfaces';
import { EnableWhenContext } from '../../custom-contexts/EnableWhenContext';
import DebugBar from './DebugComponents/DebugBar';
import DisplayDebugQResponse from './DebugComponents/DisplayDebugQResponse';
import { saveQuestionnaireResponse } from '../../functions/SaveQrFunctions';
import QRSavedSnackbar from './QRSavedSnackbar';
import { FhirClientContext } from '../../custom-contexts/FhirClientContext';
import { Publish, Save, Visibility } from '@mui/icons-material';
import { QuestionnaireResponseProvider } from '../../classes/QuestionnaireResponseProvider';

interface Props {
  questionnaireProvider: QuestionnaireProvider;
  questionnaireResponseProvider: QuestionnaireResponseProvider;
  setPreviewMode: () => unknown;
}

export const CalcExpressionContext = React.createContext<Record<string, CalculatedExpression>>({});
export const ContainedValueSetContext = React.createContext<Record<string, ValueSet>>({});

export const EnableWhenChecksContext = React.createContext<boolean>(true); // only for testing

function QForm(props: Props) {
  const { questionnaireProvider, questionnaireResponseProvider, setPreviewMode } = props;
  const enableWhenContext = React.useContext(EnableWhenContext);
  const fhirClient = React.useContext(FhirClientContext).fhirClient;

  const [questionnaireResponse, setQuestionnaireResponse] = useState<QuestionnaireResponse>(
    questionnaireResponseProvider.questionnaireResponse
  );
  const [calculatedExpressions, setCalculatedExpressions] = useState<
    Record<string, CalculatedExpression>
  >(questionnaireProvider.calculatedExpressions);
  const [containedValueSets] = useState<Record<string, ValueSet>>(
    questionnaireProvider.containedValueSets
  );
  const [qrHasChanges, setQrHasChanges] = useState(false);

  // states only for testing
  const [enableWhenStatus, setEnableWhenStatus] = React.useState(true);
  const [hideQResponse, setHideQResponse] = React.useState(true);

  const questionnaire = questionnaireProvider.questionnaire;
  if (!questionnaire.item || !questionnaireResponse.item) return null;

  const qForm = questionnaire.item[0];
  const qrForm = questionnaireResponse.item[0];

  useEffect(() => {
    enableWhenContext.setItems(questionnaireProvider.enableWhenItems, qrForm);
  }, []);

  // update QR state if QR is updated from the server
  // introduces two-way binding
  useEffect(() => {
    const updatedQResponse = questionnaireResponseProvider.questionnaireResponse;
    if (!updatedQResponse.item) return;

    const qrFormClean = cleanQrItem(updatedQResponse.item[0]);
    if (qrFormClean) {
      setQuestionnaireResponse({ ...updatedQResponse, item: [qrFormClean] });
    }
  }, [questionnaireResponseProvider.questionnaireResponse]);

  function onQrFormChange(newQrForm: QuestionnaireResponseItem) {
    const newQuestionnaireResponse = { ...questionnaireResponse, item: [newQrForm] };
    const updatedCalculatedExpressions = evaluateCalculatedExpressions(
      questionnaire,
      questionnaireResponse,
      questionnaireProvider.variables,
      calculatedExpressions
    );

    if (updatedCalculatedExpressions) {
      setCalculatedExpressions(updatedCalculatedExpressions);
    }
    setQuestionnaireResponse(newQuestionnaireResponse);
    questionnaireResponseProvider.setQuestionnaireResponse(newQuestionnaireResponse);
    setQrHasChanges(true);
  }

  // only for testing
  function clearQResponse() {
    const clearQrForm: QuestionnaireResponseItem = {
      linkId: '715',
      text: 'MBS 715 Cleared',
      item: []
    };
    setQuestionnaireResponse({ ...questionnaireResponse, item: [clearQrForm] });
  }

  if (qForm.item && qrForm.item) {
    return (
      <CalcExpressionContext.Provider value={calculatedExpressions}>
        <ContainedValueSetContext.Provider value={containedValueSets}>
          <EnableWhenChecksContext.Provider value={enableWhenStatus}>
            <Stack spacing={2.5} sx={{ my: 2 }}>
              <Divider />

              {containsTabs(qForm.item) ? (
                <QFormBodyTabbed
                  qForm={qForm}
                  qrForm={qrForm}
                  indexOfFirstTab={getIndexOfFirstTab(qForm.item)}
                  onQrItemChange={(newQrForm) => onQrFormChange(newQrForm)}
                />
              ) : (
                <QFormBody
                  qForm={qForm}
                  qrForm={qrForm}
                  onQrItemChange={(newQrForm) => {
                    onQrFormChange(newQrForm);
                  }}></QFormBody>
              )}

              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  onClick={() => {
                    setPreviewMode();
                  }}
                  sx={{ borderRadius: 20 }}>
                  <Visibility sx={{ mr: 1 }} />
                  Show Preview
                </Button>

                {fhirClient ? (
                  <>
                    <Button
                      variant="contained"
                      disabled={!qrHasChanges}
                      onClick={() => {
                        questionnaireResponseProvider.setQuestionnaireResponse(
                          questionnaireResponse
                        );
                        saveQuestionnaireResponse(fhirClient, questionnaireResponse)
                          .then(() => {
                            setQrHasChanges(false);
                          })
                          .catch((error) => console.log(error));
                      }}
                      sx={{ borderRadius: 20 }}>
                      <Save sx={{ mr: 1 }} />
                      Save
                    </Button>

                    <Button
                      variant="contained"
                      disabled={!qrHasChanges}
                      onClick={() => {
                        questionnaireResponse.status = 'completed';
                        questionnaireResponseProvider.setQuestionnaireResponse(
                          questionnaireResponse
                        );
                        saveQuestionnaireResponse(fhirClient, questionnaireResponse)
                          .then(() => {
                            setQrHasChanges(false);
                          })
                          .catch((error) => console.log(error));
                      }}
                      sx={{ borderRadius: 20 }}>
                      <Publish sx={{ mr: 1 }} />
                      Submit
                    </Button>
                  </>
                ) : (
                  <div>
                    <Typography fontSize={8}>
                      Save functionality not available as application is not connected to CMS
                    </Typography>
                  </div>
                )}
              </Stack>

              {hideQResponse ? null : (
                <DisplayDebugQResponse
                  questionnaire={questionnaire}
                  questionnaireResponse={questionnaireResponse}
                  clearQResponse={() => clearQResponse()}
                  batchResponse={questionnaireResponseProvider.batchResponse}
                />
              )}
            </Stack>
            <QRSavedSnackbar isDisplayed={!qrHasChanges} />
            <DebugBar
              hideQResponse={hideQResponse}
              toggleHideQResponse={(checked) => setHideQResponse(checked)}
              enableWhenStatus={enableWhenStatus}
              toggleEnableWhenStatus={(checked) => setEnableWhenStatus(checked)}
            />
          </EnableWhenChecksContext.Provider>
        </ContainedValueSetContext.Provider>
      </CalcExpressionContext.Provider>
    );
  } else {
    return <div>Questionnaire is invalid.</div>;
  }
}

export default QForm;