export interface CalculatedExpression {
  expression: string;
  from: 'item' | 'item._text';
  value?: number | string | object;
}
