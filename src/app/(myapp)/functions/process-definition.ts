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
 * Turn a thrown client error into a human-readable message.
 *
 * The process-studio client throws `ApiClientError` whose `message` is generic
 * ("HTTP Error: 400 Bad Request") while the real reason (BPMN validation,
 * business rule, gateway message) lives in `details` — the backend response
 * body. This digs the useful text out of the common backend shapes, falling
 * back to the HTTP status and finally the provided default. Kept as a local
 * (non-exported) helper so this "use server" module only exports server actions.
 */
function extractApiError(error: unknown, fallback: string): string {
  const err = error as { status?: number; details?: unknown; message?: string };
  const d = err?.details;

  if (typeof d === 'string' && d.trim()) return d.trim();

  if (d && typeof d === 'object') {
    const o = d as Record<string, unknown>;
    if (typeof o.message === 'string' && o.message.trim()) return o.message.trim();
    if (Array.isArray(o.errors) && o.errors.length) {
      const joined = o.errors
        .map((e) => {
          if (typeof e === 'string') return e;
          const eo = (e ?? {}) as Record<string, unknown>;
          return (eo.message ?? eo.defaultMessage ?? eo.field ?? '') as string;
        })
        .filter(Boolean)
        .join('; ');
      if (joined) return joined;
    }
    if (typeof o.error === 'string' && o.error.trim()) return o.error.trim();
    if (typeof o.detail === 'string' && o.detail.trim()) return o.detail.trim();
  }

  if (typeof err?.status === 'number' && err.status > 0) {
    return `${fallback} (HTTP ${err.status})`;
  }
  return err?.message?.trim() || fallback;
}

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

export const restoreProcessDefinition = async (processDefinitionId: string) => {
  const client = await createServerClient();
  return await client.processDefinitions.restore(processDefinitionId);
};

export const getProcessDefinitionStates = async () => {
  const client = await createServerClient();
  return await client.processDefinitions.getStates();
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
  try {
    return await client.processDefinitions.saveDiagram(processDefinitionId, data);
  } catch (error) {
    console.error('[saveDiagramProcessDefinition] failed', {
      processDefinitionId,
      status: (error as { status?: number })?.status,
      details: (error as { details?: unknown })?.details,
    });
    throw new Error(extractApiError(error, 'Não foi possível guardar o diagrama do processo.'));
  }
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
  try {
    return await client.processDefinitions.deploy(processDefinitionId, data);
  } catch (error) {
    console.error('[deployProcessDefinition] failed', {
      processDefinitionId,
      status: (error as { status?: number })?.status,
      details: (error as { details?: unknown })?.details,
    });
    throw new Error(extractApiError(error, 'Não foi possível publicar o processo.'));
  }
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

