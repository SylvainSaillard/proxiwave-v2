// T059 — Page Documents globale

import { getDocuments } from '@/actions/documents';
import { getProjects } from '@/actions/projects';
import DocumentsViewClient from '@/components/dashboard/DocumentsViewClient';

export default async function DocumentsPage() {
  const [documents, projects] = await Promise.all([
    getDocuments(),
    getProjects(),
  ]);

  return <DocumentsViewClient documents={documents} projects={projects} />;
}
