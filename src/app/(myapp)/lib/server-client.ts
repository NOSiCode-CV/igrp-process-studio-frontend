import { createProcessStudioClient } from '@igrp/framework-process-studio-client';
import { serverSession } from '@/lib/auth';

// Environment configuration for server-side
const getServerConfig = async () => {
  const session = await serverSession();

  if (!session?.accessToken) {
    throw new Error('Authentication required. Please log in to access this feature.');
  }

  const config = {
    baseUrl: process.env.API_GATEWAY ?? '',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${session.accessToken}`,
    },
  };

  return config;
};

// Helper function to create client with custom config
export const createServerClient = async () => {
  const baseConfig = await getServerConfig();
  return createProcessStudioClient({
    ...baseConfig,
  });
};
