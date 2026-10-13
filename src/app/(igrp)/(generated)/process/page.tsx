'use client';
/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { use, useState, useEffect, useRef } from 'react';
import { cn, useIGRPMenuNavigation, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import { IGRPOptionsProps } from '@igrp/igrp-framework-react-design-system';
import {
  IGRPDataTableFacetedFilterFn,
  IGRPDataTableDateRangeFilterFn,
} from '@igrp/igrp-framework-react-design-system';
import {
  IGRPDataTableHeaderSortToggle,
  IGRPDataTableHeaderSortDropdown,
  IGRPDataTableHeaderRowsSelect,
} from '@igrp/igrp-framework-react-design-system';
import { IgrpLoading } from '@/app/(myapp)/components/igrp-loading';
import New from '@/app/(igrp)/(generated)/process/components/new';
import Project from '@/components/project';
import {
  IGRPPageHeader,
  IGRPButton,
  IGRPStatsCard,
  IGRPInputSearch,
  IGRPSeparator,
  IGRPInputText,
  IGRPCombobox,
  IGRPDataTable,
  IGRPDataTableCellBadge,
  IGRPDataTableRowAction,
  IGRPDataTableButtonLink,
  IGRPDataTableButtonAlert,
} from '@igrp/igrp-framework-react-design-system';
import {
  useProcessDefinitionsList,
  useDeleteProcessDefinition,
  useProcessDefinitionStates,
} from '@/app/(myapp)/hooks/process';
import { IGRPLoadingSpinner } from '@igrp/igrp-framework-react-design-system';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { getStatusProcessDefinition } from '@/app/(myapp)/functions/domains';

export default function PageProcessComponent() {
  type Table1 = {
    projectName: string;
    title: string;
    processKey: string;
    version: string;
    statusDesc: string;
    deploymentDate: string;
    lastModifiedByNameTbl: string;
    lastModifiedDateTbl: string;
    processDefinitionId: string;
    description: string;
    status: string;
  };

  const [statstatsCard2Value, setStatstatsCard2Value] = useState<string | number>(0);
  const [statstatsCard3Value, setStatstatsCard3Value] = useState<string | number>(0);
  const [statstatsCard1Value, setStatstatsCard1Value] = useState<string | number>(0);
  const [contentTabletable1, setContentTabletable1] = useState<Table1[]>([]);

  const [openProject, setOpenProject] = useState<boolean>(false);

  const [openProcess, setOpenProcess] = useState<boolean>(false);

  const [editingProcess, setEditingProcess] = useState<any>(undefined);

  const [hasNewProcess, setHasNewProcess] = useState<boolean>(false);

  const [filterProcessKey, setFilterProcessKey] = useState<string | undefined>(``);

  const [filterProcessName, setFilterProcessName] = useState<string | undefined>(``);

  const [filterProjectName, setFilterProjectName] = useState<string | undefined>(``);

  const [filterState, setFilterState] = useState<string | undefined>(``);

  const [showFilter, setShowFilter] = useState<boolean>(false);

  const [filterStateOptions, setFilterStateOptions] = useState<IGRPOptionsProps[]>([]);

  const [filterProjectOptions, setFilterProjectOptions] = useState<IGRPOptionsProps[]>([]);

  const { igrpToast } = useIGRPToast();

  function clearFilters(): void | undefined {
    setFilterProcessKey('');
    setFilterProcessName('');
    setFilterProjectName('');
    setFilterState('');
  }

  const queryClient = useQueryClient();
  const { processDefinitions, projectOptions, totalElements, isLoading } =
    useProcessDefinitionsList({
      processKey: filterProcessKey,
      processName: filterProcessName,
      projectName: filterProjectName,
      state: filterState,
    });
  const { data: processStateOptions } = useProcessDefinitionStates();
  const { mutate: deleteProcess } = useDeleteProcessDefinition();

  useEffect(() => {
    if (isLoading || !processDefinitions) return;
    setContentTabletable1(processDefinitions || []);
    setStatstatsCard2Value(totalElements || 0);
    setStatstatsCard1Value(0);
    setStatstatsCard3Value(0);
    setFilterProjectOptions(projectOptions || []);
    setFilterStateOptions(processStateOptions || getStatusProcessDefinition());
  }, [isLoading, processDefinitions, projectOptions, totalElements, processStateOptions]);

  return (
    <div className={cn('page', 'space-y-6')}>
      <div className={cn('section', ' space-y-6 space-x-')}>
        <IGRPPageHeader
          id={`pageHeader1`}
          title={`Dashboard de processos`}
          description={`Crie e publique os seus processos BPMN`}
          iconBackButton={`Search`}
          variant={`h3`}
        >
          <div className="flex items-center gap-2">
            <IGRPButton
              id={`button2`}
              variant={`outline`}
              size={`default`}
              showIcon={true}
              iconName={`Plus`}
              onClick={() => {
                setOpenProject(!openProject);
              }}
            >
              Novo Projeto
            </IGRPButton>

            <IGRPButton
              id={`button1`}
              variant={`default`}
              size={`default`}
              showIcon={true}
              iconName={`Plus`}
              onClick={() => {
                setOpenProcess(!openProcess);
                setEditingProcess(undefined);
                setHasNewProcess(false);
              }}
            >
              Novo Processo
            </IGRPButton>
          </div>
        </IGRPPageHeader>

        <div className={cn('grid', 'grid-cols-1 ', 'md:grid-cols-2 ', 'lg:grid-cols-3 ', ' gap-4')}>
          <IGRPStatsCard
            id={`statsCard2`}
            cardBorderPosition={`top`}
            cardBorder={`rounded-xl`}
            cardVariant={`info`}
            iconBackground={`square`}
            title={`Total de Processos`}
            titleSize={`sm`}
            valueSize={`2xl`}
            showIcon={true}
            iconName={`Workflow`}
            iconSize={`md`}
            iconVariant={`info`}
            iconPlacement={`end`}
            itemPlacement={`start`}
            showIconBackground={true}
            className={cn('col-span-1')}
            onClick={() => {}}
            value={statstatsCard2Value}
          ></IGRPStatsCard>

          <IGRPStatsCard
            id={`statsCard3`}
            cardBorderPosition={`top`}
            cardBorder={`rounded-xl`}
            cardVariant={`primary`}
            iconBackground={`square`}
            title={`Total Publicados`}
            titleSize={`sm`}
            valueSize={`2xl`}
            showIcon={true}
            iconName={`ArrowBigUp`}
            iconSize={`md`}
            iconVariant={`primary`}
            iconPlacement={`end`}
            itemPlacement={`start`}
            showIconBackground={true}
            className={cn('col-span-1')}
            onClick={() => {}}
            value={statstatsCard3Value}
          ></IGRPStatsCard>

          <IGRPStatsCard
            id={`statsCard1`}
            cardBorderPosition={`top`}
            cardBorder={`rounded-xl`}
            cardVariant={`success`}
            iconBackground={`square`}
            title={`Total Rascunhos`}
            titleSize={`sm`}
            valueSize={`2xl`}
            showIcon={true}
            iconName={`Network`}
            iconSize={`md`}
            iconVariant={`success`}
            iconPlacement={`end`}
            itemPlacement={`start`}
            showIconBackground={true}
            className={cn('col-span-1')}
            onClick={() => {}}
            value={statstatsCard1Value}
          ></IGRPStatsCard>
        </div>
        <div className={cn('p-3 space-y-3 border rounded-md')}>
          <div className={cn('flex flex-row flex-wrap items-center justify-between gap-2')}>
            <div className={cn(' flex-1 min-w-[240px]')}>
              <IGRPInputSearch
                id={`inputSearch189`}
                label={undefined}
                showStartIcon={true}
                startIcon={`Search`}
                submitIcon={`ArrowRight`}
                required={false}
                submitButtonLabel={`Pesquisar`}
                placeholder={`Pesquisar processo...`}
                showSubmitButton={true}
                className={cn('py-1')}
                onSearch={(e) => setFilterProcessName(typeof e === 'string' ? e : (e ?? ''))}
                setValueChange={(value) => setFilterProcessName(value)}
                value={filterProcessName}
              ></IGRPInputSearch>
            </div>
            <div className={cn('flex', 'flex flex-row flex-wrap items-stretch justify-end gap-2')}>
              <IGRPButton
                id={`buttonToggleFilter1`}
                variant={`outline`}
                size={`default`}
                showIcon={true}
                iconName={`SlidersHorizontal`}
                onClick={() => setShowFilter(!showFilter)}
              >
                Filtros
              </IGRPButton>
            </div>
          </div>
          {showFilter && (
            <IGRPSeparator
              id={`separatorFilters1`}
              orientation={`horizontal`}
              className={cn('my-3')}
            ></IGRPSeparator>
          )}
          {showFilter && (
            <div
              className={cn('grid', 'grid-cols-1 ', 'md:grid-cols-2 ', 'lg:grid-cols-3 ', ' gap-4')}
            >
              <IGRPInputText
                id={`inputFilterProcessKey`}
                label={`Chave do processo`}
                placeholder={`Ex.: meu-processo`}
                className={cn('col-span-1')}
                onChange={(e) =>
                  setFilterProcessKey(typeof e === 'string' ? e : (e?.target?.value ?? ''))
                }
                value={filterProcessKey}
              ></IGRPInputText>

              <IGRPCombobox
                id={`comboboxFilterProject`}
                label={`Projeto`}
                variant={`single`}
                showSearch={true}
                placeholder={`Seleccione projeto...`}
                selectLabel={`Sem projetos`}
                className={cn('col-span-1')}
                onChange={(value) => setFilterProjectName((value as string) || '')}
                value={filterProjectName}
                options={filterProjectOptions}
              ></IGRPCombobox>

              <IGRPCombobox
                id={`comboboxFilterState`}
                label={`Estado`}
                variant={`single`}
                showSearch={true}
                placeholder={`Seleccione estado...`}
                selectLabel={`Sem opções`}
                className={cn('col-span-1')}
                onChange={(value) => setFilterState((value as string) || '')}
                value={filterState}
                options={filterStateOptions}
              ></IGRPCombobox>
            </div>
          )}
          {showFilter && (
            <div
              className={cn(
                'flex',
                'flex flex-row flex-wrap items-stretch justify-end gap-2',
                ' mb-3',
              )}
            >
              <IGRPButton
                id={`buttonClearFilters1`}
                variant={`outline`}
                size={`default`}
                showIcon={true}
                iconName={`X`}
                onClick={clearFilters}
              >
                Limpar Filtros
              </IGRPButton>
            </div>
          )}
        </div>
        {!isLoading && (
          <IGRPDataTable<Table1, Table1>
            id={`table1`}
            showPagination={true}
            columns={[
              {
                header: ({ column }) => (
                  <IGRPDataTableHeaderSortToggle column={column} title={`Projeto`} />
                ),
                accessorKey: 'projectName',

                cell: ({ row }) => {
                  return row.getValue('projectName');
                },
                filterFn: IGRPDataTableFacetedFilterFn,
              },
              {
                header: ({ column }) => (
                  <IGRPDataTableHeaderSortToggle column={column} title={`Nome do processo`} />
                ),
                accessorKey: 'title',

                cell: ({ row }) => {
                  return row.getValue('title');
                },
                filterFn: IGRPDataTableFacetedFilterFn,
              },
              {
                header: 'Chave do processo',
                accessorKey: 'processKey',

                cell: ({ row }) => {
                  return row.getValue('processKey');
                },
                filterFn: IGRPDataTableFacetedFilterFn,
              },
              {
                header: 'Versão',
                accessorKey: 'version',

                cell: ({ row }) => {
                  const rowData = row.original;

                  return (
                    <IGRPDataTableCellBadge
                      label={row.original.version}
                      variant={`soft`}
                      badgeClassName={``}
                    ></IGRPDataTableCellBadge>
                  );
                },
                filterFn: IGRPDataTableFacetedFilterFn,
              },
              {
                header: 'Estado',
                accessorKey: 'statusDesc',

                cell: ({ row }) => {
                  const rowData = row.original;

                  return (
                    <IGRPDataTableCellBadge
                      label={row.original.statusDesc}
                      variant={`soft`}
                      badgeClassName={``}
                    ></IGRPDataTableCellBadge>
                  );
                },
                filterFn: IGRPDataTableFacetedFilterFn,
              },
              {
                header: 'Publicado em',
                accessorKey: 'deploymentDate',

                cell: ({ row }) => {
                  return row.getValue('deploymentDate');
                },
                filterFn: IGRPDataTableFacetedFilterFn,
              },
              {
                header: ({ column }) => (
                  <IGRPDataTableHeaderSortToggle column={column} title={`Modificado por`} />
                ),
                accessorKey: 'lastModifiedByNameTbl',

                cell: ({ row }) => {
                  return row.getValue('lastModifiedByNameTbl');
                },
                filterFn: IGRPDataTableFacetedFilterFn,
              },
              {
                header: 'Última modificação',
                accessorKey: 'lastModifiedDateTbl',

                cell: ({ row }) => {
                  return row.getValue('lastModifiedDateTbl');
                },
                filterFn: IGRPDataTableFacetedFilterFn,
              },
              {
                id: 'tableActionListCell1',
                enableHiding: false,
                cell: ({ row }) => {
                  const rowData = row.original;

                  return (
                    <IGRPDataTableRowAction>
                      <IGRPDataTableButtonLink
                        labelTrigger={`Editor de Processo`}
                        href={`/process/${row.original.processDefinitionId}/editor`}
                        variant={`ghost`}
                        icon={`Workflow`}
                        action={() => {}}
                      ></IGRPDataTableButtonLink>
                      <IGRPDataTableButtonLink
                        labelTrigger={`Editar Processo`}
                        variant={`ghost`}
                        icon={`SquarePen`}
                        action={() => {
                          setOpenProcess(!openProcess);
                          setEditingProcess(rowData);
                        }}
                      ></IGRPDataTableButtonLink>
                      <IGRPDataTableButtonAlert
                        modalTitle={`Eliminar Definição de Processo`}
                        labelTrigger={`Eliminar`}
                        variant={`ghost`}
                        icon={`Trash`}
                        variantCancel={`outline`}
                        variantConfirm={`destructive`}
                        labelCancel={`Cancelar`}
                        labelConfirm={`Confirmar`}
                        showCancel={true}
                        showConfirm={true}
                        onClickConfirm={() => {
                          deleteProcess(rowData.processDefinitionId);
                        }}
                      >
                        Deseja eliminar esta definição de processo?
                      </IGRPDataTableButtonAlert>
                    </IGRPDataTableRowAction>
                  );
                },
                filterFn: IGRPDataTableFacetedFilterFn,
              },
            ]}
            clientFilters={[]}
            data={contentTabletable1}
          />
        )}
      </div>
      <IgrpLoading loading={isLoading}></IgrpLoading>
      <New
        open={openProcess}
        initialData={editingProcess}
        setOpen={setOpenProcess}
        setNewProcess={setHasNewProcess}
        invalidateQueries={() => {
          queryClient.invalidateQueries({ queryKey: ['process'] });
          queryClient.invalidateQueries({ queryKey: ['project'] });
        }}
      ></New>
      <Project
        open={openProject}
        setOpen={setOpenProject}
        invalidateQueries={() => {
          queryClient.invalidateQueries({ queryKey: ['process'] });
          queryClient.invalidateQueries({ queryKey: ['project'] });
        }}
      ></Project>
    </div>
  );
}
