import React from 'react';
import { Paper, TableBody, TableCell, TableRow, Typography } from '@mui/material';

interface Props {
  status: 'loading' | 'error' | 'success';
  searchInput: string;
  error?: unknown;
}
function QuestionnaireListFeedback(props: Props) {
  const { status, searchInput, error } = props;

  const feedbackType: FeedbackProps['feedbackType'] = status === 'error' ? 'error' : 'empty';

  return (
    <TableBody>
      <TableRow>
        <TableCell align="center" colSpan={6} sx={{ py: 5 }}>
          <Paper
            sx={{
              textAlign: 'center'
            }}>
            <RenderFeedback feedbackType={feedbackType} searchInput={searchInput} error={error} />
          </Paper>
        </TableCell>
      </TableRow>
    </TableBody>
  );
}

interface FeedbackProps {
  feedbackType: 'error' | 'empty';
  searchInput: string;
  error?: unknown;
}

function RenderFeedback(props: FeedbackProps) {
  const { feedbackType, searchInput, error } = props;

  if (feedbackType === 'error') {
    console.error(error);
  }

  switch (feedbackType) {
    case 'error':
      return (
        <>
          <Typography variant="h6" paragraph>
            Oops, an error occurred
          </Typography>

          <Typography variant="body2">
            Try again later, or try searching for something else?
          </Typography>
        </>
      );
    case 'empty':
      return (
        <>
          <Typography variant="h6" paragraph>
            No questionnaires found
          </Typography>

          <Typography variant="body2">
            No results found for &nbsp;
            <strong>&quot;{searchInput}&quot;</strong>.
            <br /> Try searching for something else.
          </Typography>
        </>
      );
  }
}
export default QuestionnaireListFeedback;
