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

import type { Coding, ValueSet } from 'fhir/r5';
import * as FHIR from 'fhirclient';
import type { ValueSetPromise } from '../interfaces/Interfaces';

export function getValueSetPromise(url: string): Promise<ValueSet> {
  const ontoserver = process.env.REACT_APP_ONTOSERVER_URL ?? 'https://r4.ontoserver.csiro.au/fhir/';

  const valueSetUrl = url.includes('ValueSet/$expand?url=')
    ? url.split('ValueSet/$expand?url=')[1]
    : url;

  return FHIR.client({ serverUrl: ontoserver }).request({
    url: 'ValueSet/$expand?url=' + valueSetUrl
  });
}

export async function resolvePromises(
  valueSetPromises: Record<string, ValueSetPromise>
): Promise<Record<string, ValueSetPromise>> {
  const newValueSetPromises: Record<string, ValueSetPromise> = {};

  const valueSetPromiseKeys = Object.keys(valueSetPromises);
  const valueSetPromiseValues = Object.values(valueSetPromises);
  const promises = valueSetPromiseValues.map((valueSetPromise) => valueSetPromise.promise);

  const settledPromises = await Promise.allSettled(promises);

  for (const [i, settledPromise] of settledPromises.entries()) {
    // Only add valueSet if the promise was fulfilled
    if (settledPromise.status === 'fulfilled') {
      const valueSet = settledPromise.value;
      const key = valueSetPromiseKeys[i];
      const valueSetPromise = valueSetPromiseValues[i];

      if (key && valueSetPromise) {
        valueSetPromise.valueSet = valueSet;
        newValueSetPromises[key] = valueSetPromise;
      }
    }
  }
  return newValueSetPromises;
}

/**
 * Sets an array of codings with the values from a valueSet
 *
 * @author Sean Fong
 */
export function getValueSetCodings(valueSet: ValueSet): Coding[] {
  return valueSet.expansion?.contains?.map((coding) => coding) ?? [];
}
