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

import { Typography } from '@mui/material';
import GenericEmptyFeedback from './GenericEmptyFeedback.tsx';
import ResponseEmptyFeedback from './ResponseEmptyFeedback.tsx';

interface DashboardFeedbackMessageProps {
  itemType: string;
  feedbackType: 'error' | 'empty' | 'loading';
  searchInput: string;
}

function DashboardFeedbackMessage(props: DashboardFeedbackMessageProps) {
  const { itemType, feedbackType, searchInput } = props;

  if (feedbackType === 'error') {
    return (
      <>
        <Typography variant="h6">Oops, an error occurred</Typography>
        <Typography>Try again later, or try searching for something else.</Typography>
      </>
    );
  }

  if (feedbackType === 'loading') {
    return <Typography variant="subtitle1">Loading {itemType}...</Typography>;
  }

  // Feedback type = empty
  if (itemType === 'responses') {
    return <ResponseEmptyFeedback searchInput={searchInput} />;
  }

  return <GenericEmptyFeedback searchInput={searchInput} />;
}

export default DashboardFeedbackMessage;