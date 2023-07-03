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

import { memo } from 'react';
import {
  Box,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Iconify from '../../../../../components/Iconify/Iconify.tsx';
import useQuestionnaireStore from '../../../../../stores/useQuestionnaireStore.ts';

interface FormBodySingleTabProps {
  selected: boolean;
  tabLabel: string;
  listIndex: number;
  markedAsComplete: boolean;
}

const FormBodySingleTab = memo(function FormBodySingleTab(props: FormBodySingleTabProps) {
  const { selected, tabLabel, listIndex, markedAsComplete } = props;

  const switchTab = useQuestionnaireStore((state) => state.switchTab);

  function handleTabClick() {
    switchTab(listIndex);
    window.scrollTo(0, 0);
  }

  return (
    <ListItemButton selected={selected} sx={{ my: 0.5, py: 0.6 }} onClick={handleTabClick}>
      <ListItemIcon sx={{ minWidth: 36 }}>
        {markedAsComplete ? (
          <Tooltip title="Completed">
            <CheckCircleIcon fontSize="small" color="secondary" />
          </Tooltip>
        ) : (
          <Tooltip title="In progress">
            <Box display="flex">
              <Iconify icon={'carbon:in-progress'} />
            </Box>
          </Tooltip>
        )}
      </ListItemIcon>
      <ListItemText primary={<Typography variant="subtitle2">{tabLabel}</Typography>} />
    </ListItemButton>
  );
});

export default FormBodySingleTab;
