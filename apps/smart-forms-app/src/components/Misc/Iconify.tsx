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

import { forwardRef } from 'react';
import { Icon } from '@iconify/react';
import type { SxProps, Theme } from '@mui/material';
import { Box } from '@mui/material';

interface Props {
  icon: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
}

const Iconify = forwardRef((props: Props, ref) => {
  const { icon, width = 20, height = 20, sx } = props;
  return <Box ref={ref} component={Icon} icon={icon} sx={{ width, height, ...sx }} />;
});

Iconify.displayName = 'Iconify';

export default Iconify;