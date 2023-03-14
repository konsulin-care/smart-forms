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

import { Box, styled } from '@mui/material';

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 72;

export const StyledRoot = styled(Box)({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden'
});

export const Main = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 12,
  paddingBottom: theme.spacing(4),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 16,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}));
