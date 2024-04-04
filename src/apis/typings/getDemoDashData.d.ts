/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getDemoDashData
// ====================================================

export interface getDemoDashData_inbounds {
  __typename: 'BoundItem';
  date: number | null;
  total: number | null;
}

export interface getDemoDashData_outbounds {
  __typename: 'BoundItem';
  date: number | null;
  total: number | null;
}

export interface getDemoDashData_domesticIp {
  __typename: 'BoundItem';
  date: number | null;
  total: number | null;
}

export interface getDemoDashData_overseasIp {
  __typename: 'BoundItem';
  date: number | null;
  total: number | null;
}

export interface getDemoDashData_totalOutFlow {
  __typename: 'TotalOutFlowItem';
  country: string | null;
  number: number | null;
}

export interface getDemoDashData {
  inbounds: (getDemoDashData_inbounds | null)[] | null;
  outbounds: (getDemoDashData_outbounds | null)[] | null;
  domesticIp: (getDemoDashData_domesticIp | null)[] | null;
  overseasIp: (getDemoDashData_overseasIp | null)[] | null;
  totalOutFlow: (getDemoDashData_totalOutFlow | null)[] | null;
}

export interface getDemoDashDataVariables {
  endTime: number;
}
