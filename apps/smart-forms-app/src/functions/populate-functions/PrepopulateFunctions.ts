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

import type {
  Bundle,
  Parameters,
  ParametersParameter,
  Patient,
  Questionnaire,
  QuestionnaireResponse
} from 'fhir/r4';
import type Client from 'fhirclient/lib/Client';
import populate, { isPopulateInputParameters } from 'sdc-populate';
import {
  constructVariablesContextParameters,
  getXFhirQueryVariables
} from './VariablePopulateFunctions';
import {
  constructPrePopQueryContextParameters,
  getPrePopQuery
} from './PrePopQueryPopulateFunctions';
import { headers } from '../LoadServerResourceFunctions';

/**
 * Pre-populate questionnaire from CMS patient data to form a populated questionnaireReponse
 *
 * @author Sean Fong
 */
export async function populateQuestionnaire(
  client: Client,
  questionnaire: Questionnaire,
  patient: Patient,
  populateForm: {
    (questionnaireResponse: QuestionnaireResponse, hasError: boolean): void;
  },
  exitSpinner: { (): void }
) {
  const prePopQuery = getPrePopQuery(questionnaire);
  const variables = getXFhirQueryVariables(questionnaire);

  if (!(prePopQuery || variables)) {
    exitSpinner();
    return;
  }

  // Define population input parameters from PrePopQuery and x-fhir-query variables
  const inputParameters: Parameters = definePopulationParameters(questionnaire, patient);

  if (prePopQuery) {
    const prePopQueryContext = await constructPrePopQueryContextParameters(
      client,
      patient,
      prePopQuery
    );
    inputParameters.parameter?.push(prePopQueryContext);
  }

  if (variables) {
    const variablesContext = await constructVariablesContextParameters(client, patient, variables);
    inputParameters.parameter?.push(variablesContext);
  }

  // Perform population if parameters satisfies input parameters
  if (isPopulateInputParameters(inputParameters)) {
    const outputParameters = await populate(inputParameters);
    const questionnaireResponse = outputParameters.parameter[0].resource;

    // An error occurred when populating form
    if (outputParameters.parameter[1]) {
      populateForm(questionnaireResponse, true);
    } else {
      populateForm(questionnaireResponse, false);
    }
  } else {
    exitSpinner();
  }
}

/**
 * Perform batch query request to CMS FHIR API server to obtain patient data bundle
 *
 * @author Sean Fong
 */
export function getBatchResponse(client: Client, bundle: Bundle): Promise<Bundle> {
  return client.request({
    url: '',
    method: 'POST',
    body: JSON.stringify(bundle),
    headers: headers
  });
}

/**
 * Define population input parameters without any batch response contexts
 *
 * @author Sean Fong
 */
function definePopulationParameters(questionnaire: Questionnaire, patient: Patient): Parameters {
  return {
    resourceType: 'Parameters',
    parameter: [
      {
        name: 'questionnaire',
        resource: questionnaire
      },
      {
        name: 'subject',
        valueReference: {
          type: 'Patient',
          reference: 'Patient/' + patient.id
        }
      },
      {
        name: 'context',
        part: [
          {
            name: 'name',
            valueString: 'LaunchPatient'
          },
          {
            name: 'content',
            resource: patient
          }
        ]
      }
    ]
  };
}

export function constructContextParameters(name: string, resource: Bundle): ParametersParameter {
  return {
    name: 'context',
    part: [
      {
        name: 'name',
        valueString: name
      },
      {
        name: 'content',
        resource: resource
      }
    ]
  };
}