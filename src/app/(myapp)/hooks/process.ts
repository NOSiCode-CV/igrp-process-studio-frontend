import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import { getProject } from '../functions/project';
import { useProject } from './project';
import { useMemo } from 'react';
import {
  deleteProcessDefinition,
  getProcessDefinitionById,
  getProcessDefinitions,
  getProcessDefinitionStates,
  getVariables,
  saveDiagramProcessDefinition,
} from '../functions/process-definition';
import { getStatusProcessDefinition } from '../functions/domains';
import {
  PaginatedResponse,
  ProcessDefinition,
  ProcessDefinitionFilter,
  Project,
  VariableDefinition,
} from '@igrp/framework-process-studio-types';
import {
  convertToMapOptions,
  decorateProcessDefinitionRow,
  filterProcessDefinitionsBySubstring,
} from '@igrp/framework-process-studio-client';

export const useProcessDefinition = () => {
  const queryResult = useQuery<PaginatedResponse<Project>>({
    queryKey: ['process'],
    queryFn: () => getProject(),
  });

  const processDefinitions = useMemo(() => {
    if (!queryResult.data) return null;

    // Calculate total of processDefinitions and processes
    const allProcessDefinitions = queryResult.data?.content.flatMap((project) =>
      project.processDefinitions.map((processDefinition) => ({
        ...processDefinition,
        version: processDefinition.version != null ? String(processDefinition.version) : 'N/D',
        projectName: project.name,
      })),
    );
    //i want to create  a map value and label with the status process definition
    const statusProcessDefinition = queryResult.data?.content.map((project) => {
      return {
        value: project.name,
        label: project.name,
      };
    });

    const totalProcessDefinitions = allProcessDefinitions?.length || 0;

    const totalRascunho =
      allProcessDefinitions?.filter((processDefinition) => processDefinition.status === 'DRAFT')
        .length || 0;

    const totalPublished =
      allProcessDefinitions?.filter((processDefinition) => processDefinition.status === 'PUBLISHED')
        .length || 0;

    return {
      processDefinitions: allProcessDefinitions,
      statusProcessDefinition,
      totalProcessDefinitions,
      totalRascunho,
      totalPublished,
    };
  }, [queryResult.data]);

  return {
    ...queryResult,
    ...processDefinitions,
  };
};

/**
 * Server-side filtered list of process definitions.
 *
 * Calls `GET /api/v1/projects/process-definitions` with the supplied filter.
 * Empty-string filter fields are normalized to `undefined` so they are dropped
 * from the query string by `buildQueryString` (the backend rejects sentinel values).
 *
 * Returns the same shape as the paginated DTO with rows decorated for the table:
 *  - `version` coerced to string (with `N/D` fallback)
 *  - `deploymentDate` formatted to `dd/MM/yyyy HH:mm`
 *  - `lastModifiedByNameTbl` / `lastModifiedDateTbl` flattened from the audit DTO
 *  - `projectName` resolved from the project list (the Light DTO only carries `projectId`,
 *    so we hydrate the display name client-side until the backend ships it)
 */
export const useProcessDefinitionsList = (filter?: ProcessDefinitionFilter) => {
  // Backend does EXACT match on free-text params (processKey/processName/projectName),
  // so partial input returns nothing. Workaround: send only the exact-friendly
  // params server-side (state, appCode, paging) and apply substring filtering
  // client-side over the page.
  //
  // Trade-off: client filtering only sees the current page. We bump `pageSize`
  // up so the client filter is useful for moderate datasets. Replace with a
  // proper LIKE in the backend once available.
  const serverFilter: ProcessDefinitionFilter = {
    appCode: filter?.appCode || undefined,
    projectCode: filter?.projectCode || undefined,
    state: filter?.state || undefined,
    pageNumber: filter?.pageNumber ?? '0',
    pageSize: filter?.pageSize ?? '100',
  };

  const clientText = {
    processKey: (filter?.processKey ?? '').toString().trim().toLowerCase(),
    processName: (filter?.processName ?? '').toString().trim().toLowerCase(),
    projectName: (filter?.projectName ?? '').toString().trim().toLowerCase(),
  };

  const queryResult = useQuery<PaginatedResponse<ProcessDefinition>>({
    queryKey: ['process', 'list', serverFilter],
    queryFn: () => getProcessDefinitions(serverFilter),
  });

  // Sidecar fetch for the projectId -> name map. The Light DTO from the list
  // endpoint omits projectName so the table column would otherwise be empty.
  const projectsQuery = useQuery<PaginatedResponse<Project>>({
    queryKey: ['project'],
    queryFn: () => getProject(),
    staleTime: 60_000,
  });

  const projectNameById = useMemo(() => {
    const map = new Map<string, string>();
    projectsQuery.data?.content.forEach((p) => {
      if (p.projectId) map.set(p.projectId, p.name);
    });
    return map;
  }, [projectsQuery.data]);

  // Options for the Project filter combobox. Value === name because the API
  // filter parameter is `projectName` (string match).
  const projectOptions = useMemo(() => {
    return (projectsQuery.data?.content ?? [])
      .filter((p) => p?.name)
      .map((p) => ({ value: p.name, label: p.name }));
  }, [projectsQuery.data]);

  const processDefinitions = useMemo(() => {
    if (!queryResult.data) return undefined;
    const decorated = queryResult.data.content.map((pd) => ({
      ...decorateProcessDefinitionRow(pd),
      projectName:
        (pd as { projectName?: string }).projectName ??
        projectNameById.get(pd?.projectId ?? '') ??
        '',
    }));
    return filterProcessDefinitionsBySubstring(decorated, {
      processKey: clientText.processKey,
      processName: clientText.processName,
      projectName: clientText.projectName,
    });
  }, [
    queryResult.data,
    projectNameById,
    clientText.processKey,
    clientText.processName,
    clientText.projectName,
  ]);

  return {
    ...queryResult,
    processDefinitions,
    projectOptions,
    totalElements: processDefinitions?.length ?? queryResult.data?.totalElements ?? 0,
    totalPages: queryResult.data?.totalPages ?? 0,
  };
};

/**
 * Process-definition states from `GET /parameterization/process-definition-state`.
 * Falls back to the local enum if the parameterization endpoint is unavailable.
 */
export const useProcessDefinitionStates = () => {
  return useQuery({
    queryKey: ['process', 'states'],
    queryFn: async () => {
      try {
        return await getProcessDefinitionStates();
      } catch {
        return getStatusProcessDefinition();
      }
    },
    staleTime: 5 * 60_000,
    placeholderData: getStatusProcessDefinition(),
  });
};

/**
 * Hook for the process-definitions table view.
 *
 * Wraps {@link useProcessDefinition} and applies presentation-layer transformations:
 * - Formats `deploymentDate` (ISO date-time) to `dd/MM/yyyy HH:mm` for display
 * - Adds flattened `lastModifiedByNameTbl` / `lastModifiedDateTbl` for the audit columns
 *
 * Keeps the upstream hook unchanged for other consumers that need the raw shape.
 */
export const useProcessDefinitionsTable = () => {
  const base = useProcessDefinition();

  const processDefinitions = useMemo(() => {
    if (!base.processDefinitions) return base.processDefinitions;
    return base.processDefinitions.map((pd) => ({
      ...decorateProcessDefinitionRow(pd),
      // Preserve the projectName injected by the upstream hook from the parent project.
      projectName: (pd as { projectName?: string }).projectName ?? '',
    }));
  }, [base.processDefinitions]);

  return { ...base, processDefinitions };
};

/**
 * Delete a process definition with automatic cache invalidation and toast.
 *
 * Wraps the server action and owns the cross-cutting concerns the page used to
 * inline (`invalidateQueries`, toast). Consumers just call `mutate(id)`.
 */
export const useDeleteProcessDefinition = () => {
  const queryClient = useQueryClient();
  const { igrpToast } = useIGRPToast();
  return useMutation<unknown, Error, string>({
    mutationFn: (processDefinitionId: string) => deleteProcessDefinition(processDefinitionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['process'] });
      queryClient.invalidateQueries({ queryKey: ['project'] });
      igrpToast({
        title: 'Sucesso',
        description: 'Process definition has deleted sucessfully',
        type: 'success',
      });
    },
    onError: (error: Error) => {
      console.error('Error delete process definition:', error);
      igrpToast({
        title: 'Erro',
        description: error.message,
        type: 'error',
      });
    },
  });
};

export const useDetailProcessDefinition = (processDefinitionId: string) => {
  return useQuery<ProcessDefinition>({
    queryKey: ['processDefinition', processDefinitionId],
    queryFn: () => getProcessDefinitionById(processDefinitionId),
    enabled: !!processDefinitionId,
  });
};

export function useProjectConfiguration() {
  try {
    const process = useProject();

    const processOptions = convertToMapOptions(process.data?.content || [], 'name', 'projectId');

    const isLoading = process.isLoading;
    const isError = process.isError;

    return {
      isLoading,
      isError,
      processOptions,
    };
  } catch (error: unknown) {
    console.error(error);
    return {
      isLoading: false,
      isError: true,
      processOptions: [],
    };
  }
}

export const useGetVariables = (processDefinitionId: string) => {
  return useQuery<VariableDefinition[]>({
    queryKey: ['variables'],
    queryFn: () => getVariables(processDefinitionId),
    enabled: !!processDefinitionId,
  });
};

export const useSaveDiagramProcessDefinition = (processDefinitionId?: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { content: string; processKey: string }>({
    mutationFn: async ({ content, processKey }) => {
      await saveDiagramProcessDefinition(processKey, { content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processDefinition', processDefinitionId] });
    },
  });
};
