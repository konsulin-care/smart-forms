import {
  QuestionnaireItem,
  QuestionnaireItemEnableWhen,
  QuestionnaireResponseItem,
  QuestionnaireResponseItemAnswer
} from 'fhir/r5';

export interface PatientData {
  name: string;
  gender: string;
  dateOfBirth: string;
}

export interface UserData {
  name: string;
}

export interface CalculatedExpression {
  expression: string;
  value?: number;
}

export type EnableWhenItems = Record<string, EnableWhenItemProperties>;

export interface EnableWhenItemProperties {
  linked: EnableWhenLinkedItem[];
  enableBehavior?: QuestionnaireItem['enableBehavior'];
}

export interface EnableWhenLinkedItem {
  enableWhen: QuestionnaireItemEnableWhen;
  answer?: QuestionnaireResponseItemAnswer[];
}

export type EnableWhenContextType = {
  items: Record<string, EnableWhenItemProperties>;
  linkMap: Record<string, string[]>;
  setItems: (
    enableWhenItems: EnableWhenItems,
    questionnaireResponseForm: QuestionnaireResponseItem
  ) => unknown;
  updateItem: (linkId: string, newAnswer: QuestionnaireResponseItemAnswer[]) => unknown;
  checkItemIsEnabled: (linkId: string) => boolean;
};