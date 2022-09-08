import React, { useEffect, useState } from 'react';
import { Container, FormControl, Grid, TextField, Typography } from '@mui/material';
import { QuestionnaireItem } from '../../questionnaire/QuestionnaireModel';
import { QuestionnaireResponseItem } from '../../questionnaireResponse/QuestionnaireResponseModel';
import { PropsWithQrItemChangeHandler } from '../FormModel';
import { QuestionnaireResponseService } from '../../questionnaireResponse/QuestionnaireResponseService';

interface Props extends PropsWithQrItemChangeHandler<QuestionnaireResponseItem> {
  qItem: QuestionnaireItem;
  qrItem: QuestionnaireResponseItem;
}

function QItemDate(props: Props) {
  const { qItem, qrItem, onQrItemChange } = props;

  let qrDate = qrItem ? qrItem : QuestionnaireResponseService.createQrItem(qItem);
  const answerValue = qrDate['answer'] ? qrDate['answer'][0].valueDate : '';
  const [value, setValue] = useState(answerValue);

  useEffect(() => {
    setValue(answerValue);
  }, [answerValue]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
    qrDate = { ...qrDate, answer: [{ valueDate: e.target.value }] };
    onQrItemChange(qrDate);
  }

  return (
    <FormControl fullWidth sx={{ m: 1, p: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={5}>
          <Typography>{qItem.text}</Typography>
        </Grid>
        <Grid item xs={7}>
          <Container>
            <TextField id={qItem.linkId} type="date" value={value} onChange={handleChange} />
          </Container>
        </Grid>
      </Grid>
    </FormControl>
  );
}

export default QItemDate;
