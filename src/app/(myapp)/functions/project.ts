'use server'
import { Project, ProjectFilter } from '@igrp/framework-process-studio-types';
import { createServerClient } from '../lib/server-client';

export const getProject = async (filter?: ProjectFilter) => {
  const client = await createServerClient();
  return await client.projects.getAll({
    pageNumber: filter?.pageNumber ?? '0',
    pageSize: filter?.pageSize ?? '100',
    appCode: filter?.appCode,
  });
};

export const getProjectByCode = async (code: string) => {
  const client = await createServerClient();
  return await client.projects.getById(code);
};

export const createOrUpdateProject = async (project: Project) => {
  if (project.projectId) {
    return updateProject(project);
  } else {
    return createProject(project);
  }
};

export const createProject = async (project: Project) => {
  const client = await createServerClient();
  return await client.projects.create({
    ...project,
    appCode: project.appCode || process.env.IGRP_APP_CODE || undefined,
  });
};

export const updateProject = async (project: Project) => {
  const client = await createServerClient();
  return await client.projects.update({
    ...project,
    appCode: project.appCode || process.env.IGRP_APP_CODE || undefined,
  });
};

export const enableProject = async (projectId: string) => {
  const client = await createServerClient();
  return await client.projects.enable(projectId);
};

export const disableProject = async (projectId: string) => {
  const client = await createServerClient();
  return await client.projects.disable(projectId);
};

/** Soft-delete: API replaced DELETE with PATCH .../disable. */
export const deleteProject = async (projectId: string) => {
  const client = await createServerClient();
  return await client.projects.delete(projectId);
};
