'use server';
import {
  PaginatedResponse,
  ProcessDefinition,
  ProcessDefinitionFilter,
  VariableDefinition,
} from '@igrp/framework-process-studio-types';
import {
  formatDeploymentDate,
} from '@igrp/framework-process-studio-client';
import { createServerClient } from '../lib/server-client';
import { convertCamundaToActiviti } from './utils';

/**
 * Server-side filtered list, already decorated for table consumption.
 *
 * `deploymentDate` is returned formatted as `dd/MM/yyyy HH:mm` (and the audit
 * `*Tbl` aliases are flattened) so any consumer — including JSON-bound table
 * cells that just do `row.getValue('deploymentDate')` — displays the friendly
 * value without an extra client-side decoration step.
 */
export const getProcessDefinitions = async (
  filter?: ProcessDefinitionFilter,
): Promise<PaginatedResponse<ProcessDefinition>> => {
  const client = await createServerClient();
  return await client.processDefinitions.list(filter);
};

export const getProcessDefinitionById = async (
  processDefinitionId: string,
): Promise<ProcessDefinition> => {
  const client = await createServerClient();
  const pd = await client.processDefinitions.getById(processDefinitionId);
  // Format the deployment date for any consumer that reads it directly
  // (e.g. the editor page header). All other fields stay untouched.
  return {
    ...pd,
    deploymentDate: formatDeploymentDate(pd?.deploymentDate),
  };
};

export const createOrUpdateProcessDefinition = async (
  processDefinition: ProcessDefinition,
): Promise<ProcessDefinition> => {
  const client = await createServerClient();
  return await client.processDefinitions.createOrUpdate(processDefinition);
};

export const deleteProcessDefinition = async (processDefinitionId: string) => {
  const client = await createServerClient();
  return await client.processDefinitions.delete(processDefinitionId);
};

export const saveDiagramProcessDefinition = async (
  processDefinitionId: string,
  processDefinition: { content: string },
) => {
  const client = await createServerClient();
  const data = {
    ...processDefinition,
    content: convertCamundaToActiviti(processDefinition.content),
  };
  return await client.processDefinitions.saveDiagram(processDefinitionId, data);
};

export const deployProcessDefinition = async (
  processDefinitionId: string,
  processDefinition: { content: string },
) => {
  const client = await createServerClient();
  const data = {
    ...processDefinition,
    content: convertCamundaToActiviti(processDefinition.content),
  };
  return await client.processDefinitions.deploy(processDefinitionId, data);
};

export const createOrUpdateVariable = async (
  processDefinitionId: string,
  variable: VariableDefinition[],
) => {
  const client = await createServerClient();
  return await client.processDefinitions.createOrUpdateVariable(processDefinitionId, variable);
};

export const getVariables = async (processDefinitionId: string) => {
  const client = await createServerClient();
  return await client.processDefinitions.getVariables(processDefinitionId);
};

