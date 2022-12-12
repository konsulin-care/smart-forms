import * as FHIR from 'fhirclient';
import { Coding, ValueSet, ValueSetExpansionContains } from 'fhir/r5';

export class AnswerValueSet {
  static cache: Record<string, Coding[]> = {};

  /**
   * Expands a given valueSet URL into a valueSet and returns it in a callback function.
   *
   * @author Sean Fong
   */
  static expand(
    fullUrl: string,
    setAnswerOptions: { (newOptions: ValueSet): void },
    displayError: { (error: Error): void }
  ) {
    const ontoserver =
      process.env.REACT_APP_ONTOSERVER_URL ?? 'https://r4.ontoserver.csiro.au/fhir/';

    const valueSetUrl = fullUrl.includes('ValueSet/$expand?url=')
      ? fullUrl.split('ValueSet/$expand?url=')[1]
      : fullUrl;

    FHIR.client({ serverUrl: ontoserver })
      .request({ url: 'ValueSet/$expand?url=' + valueSetUrl })
      .then((response) => {
        setAnswerOptions(response);
      })
      .catch((error) => {
        console.log(error);
        displayError(error);
      });
  }

  /**
   * Sets an array of valueCodings with the values from an array of valueSetExpansionContains
   *
   * @author Sean Fong
   */
  static getValueCodings(valueSetExpansionContains: ValueSetExpansionContains[]) {
    const valueCodings: Coding[] = [];
    valueSetExpansionContains.forEach((item) => {
      valueCodings.push({
        system: item.system,
        code: item.code,
        display: item.display
      });
    });
    return valueCodings;
  }
}