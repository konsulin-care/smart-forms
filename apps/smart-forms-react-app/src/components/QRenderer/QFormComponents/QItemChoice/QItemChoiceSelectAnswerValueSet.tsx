import React, { SyntheticEvent } from 'react';
import { Autocomplete, FormControl, Grid, TextField, Typography } from '@mui/material';

import {
  PropsWithQrItemChangeHandler,
  PropsWithRepeatsAttribute
} from '../../../../interfaces/Interfaces';
import { Coding, QuestionnaireItem, QuestionnaireResponseItem } from 'fhir/r5';
import { createQrItem } from '../../../../functions/QrItemFunctions';
import useValueSetOptions from '../../../../custom-hooks/useValueSetOptions';
import { QItemTypography } from '../../../StyledComponents/Item.styles';
import QItemDisplayInstructions from '../QItemSimple/QItemDisplayInstructions';

interface Props
  extends PropsWithQrItemChangeHandler<QuestionnaireResponseItem>,
    PropsWithRepeatsAttribute {
  qItem: QuestionnaireItem;
  qrItem: QuestionnaireResponseItem;
}

function QItemChoiceSelectAnswerValueSet(props: Props) {
  const { qItem, qrItem, repeats, onQrItemChange } = props;

  const qrChoiceSelect = qrItem ? qrItem : createQrItem(qItem);

  let valueCoding: Coding | undefined;
  if (qrChoiceSelect['answer']) {
    valueCoding = qrChoiceSelect['answer'][0].valueCoding;
  }

  const { options, serverError } = useValueSetOptions(qItem);

  function handleChange(event: SyntheticEvent<Element, Event>, newValue: Coding | null) {
    if (newValue) {
      onQrItemChange({
        ...qrChoiceSelect,
        answer: [{ valueCoding: newValue }]
      });
      return;
    }
    onQrItemChange(createQrItem(qItem));
  }

  const choiceSelectAnswerValueSet =
    options.length > 0 ? (
      <Autocomplete
        id={qItem.id}
        autoHighlight
        options={options}
        getOptionLabel={(option) => `${option.display}`}
        value={valueCoding ?? null}
        onChange={handleChange}
        renderInput={(params) => <TextField {...params} sx={{ ...(repeats && { mb: 0 }) }} />}
      />
    ) : serverError ? (
      <Typography variant="subtitle2">
        There was an error fetching options from the terminology server.
      </Typography>
    ) : (
      <Typography variant="subtitle2">
        Unable to fetch options, contained resources not found in questionnaire.
      </Typography>
    );

  const renderQItemChoiceSelectAnswerValueSet = repeats ? (
    <>{choiceSelectAnswerValueSet}</>
  ) : (
    <FormControl>
      <Grid container columnSpacing={6}>
        <Grid item xs={5}>
          <QItemTypography>{qItem.text}</QItemTypography>
        </Grid>
        <Grid item xs={7}>
          {choiceSelectAnswerValueSet}
          <QItemDisplayInstructions qItem={qItem} />
        </Grid>
      </Grid>
    </FormControl>
  );
  return <>{renderQItemChoiceSelectAnswerValueSet}</>;
}

export default QItemChoiceSelectAnswerValueSet;