export const getDataTypes = async () => {
  return [
    {
      label: 'String',
      value: 'string',
    },
    {
      label: 'Number',
      value: 'number',
    },
    {
      label: 'Boolean',
      value: 'boolean',
    },
  ];
};

/**
 * Fallback for `GET /parameterization/process-definition-state`.
 * Labels match `ProcessDefinitionState` on the process-studio API.
 */
export const getStatusProcessDefinition = () => {
  return [
    { label: 'Rascunho', value: 'DRAFT' },
    { label: 'Validado internamente, mas ainda não publicado', value: 'VALIDATED' },
    { label: 'Publicado', value: 'PUBLISHED' },
    { label: 'Obsoleto', value: 'DEPRECATED' },
    { label: 'Arquivado', value: 'ARCHIVED' },
    { label: 'Temporariamente desativado.', value: 'DISABLED' },
    { label: 'Erro no parsing', value: 'ERROR' },
    { label: 'Eliminado', value: 'DELETED' },
  ];
};
