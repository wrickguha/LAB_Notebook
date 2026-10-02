import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  FlaskConical,
  MoreHorizontal,
  Share2,
} from 'lucide-react';

import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';
import { useApp } from '@/context/AppContext';

import '../../styles/lab-notebook.css';

function ProjectTiptapEditor({ project, onSave }) {
  const [content, setContent] = useState(project.content || '');
  const [saveStatus, setSaveStatus] = useState('Saved');
  const timerRef = useRef(null);
  const pendingRef = useRef(null);
  const saveRef = useRef(onSave);
  saveRef.current = onSave;

  useEffect(() => {
    setContent(project.content || '');
    setSaveStatus('Saved');
  }, [project.id]);

  useEffect(() => () => {
    clearTimeout(timerRef.current);
    if (pendingRef.current) {
      const pending = pendingRef.current;
      pendingRef.current = null;
      void saveRef.current(pending.id, pending.content).catch(() => {});
    }
  }, []);

  const handleUpdate = ({ contentJson }) => {
    setContent(contentJson);
    setSaveStatus('Unsaved');
    pendingRef.current = {
      id: project.id,
      content: JSON.stringify(contentJson),
    };
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      const pending = pendingRef.current;
      pendingRef.current = null;
      setSaveStatus('Saving');
      try {
        await saveRef.current(pending.id, pending.content);
        setSaveStatus('Saved');
      } catch {
        setSaveStatus('Save failed');
      }
    }, 700);
  };

  return (
    <div className="notebook-editor-content">
      <div className="save-status" role="status">{saveStatus}</div>
      <SimpleEditor content={content} onUpdate={handleUpdate} />
    </div>
  );
}

export default function LabNotebookEditor() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects, saveProjectContent } = useApp();
  const project = projects.find((item) => String(item.id) === projectId);

  return (
    <div className="lab-notebook-page">

      {/* ───────────────────────── TOP BAR ───────────────────────── */}
      <header className="lab-notebook-topbar">

        <div className="lab-notebook-topbar-left">

          <button
            type="button"
            className="notebook-back-button"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft size={18} />
            <span>Projects</span>
          </button>

          <div className="topbar-divider" />

          <div className="notebook-brand">
            <div className="notebook-brand-icon">
              <FlaskConical size={18} />
            </div>

            <span>InveniqLab</span>
          </div>

        </div>

        <div className="lab-notebook-topbar-right">

          <div className="save-status">
            <CheckCircle2 size={16} />
            <span>{project ? 'Project document' : 'Loading project'}</span>
          </div>

          <button
            type="button"
            className="notebook-share-button"
          >
            <Share2 size={16} />
            <span>Share</span>
          </button>

          <button
            type="button"
            className="notebook-more-button"
          >
            <MoreHorizontal size={19} />
          </button>

        </div>

      </header>


      {/* ───────────────────────── NOTEBOOK HEADER ───────────────────────── */}

      <section className="notebook-heading">

        <div className="notebook-heading-inner">

          <div className="notebook-label">
            <span className="notebook-label-dot" />
            RESEARCH NOTEBOOK
          </div>

          <div className="notebook-title-row">

            <div>
              <h1>
                {project?.name || 'Research Project'}
              </h1>

              <p>
                {project ? project.code : `Project #${projectId}`}
                <span className="title-separator">•</span>
                Research documentation
              </p>
            </div>

              <div className="notebook-project-badge">
              <FlaskConical size={15} />
                {project?.status || 'Research project'}
            </div>

          </div>

        </div>

      </section>


      {/* ───────────────────────── EDITOR AREA ───────────────────────── */}

      <main className="notebook-workspace">

        <div className="notebook-editor-wrapper">

          <div className="notebook-editor-card">

            <div className="notebook-editor-header">

              <div>
                <span className="editor-document-label">
                  EXPERIMENT NOTES
                </span>

                <span className="editor-document-description">
                  Document your observations, methodology and results
                </span>
              </div>

              <div className="editor-project-id">
                {project?.code || `#${projectId}`}
              </div>

            </div>

            {project ? (
              <ProjectTiptapEditor project={project} onSave={saveProjectContent} />
            ) : (
              <div className="notebook-editor-content" role="status">Loading project document...</div>
            )}

          </div>

        </div>

      </main>

    </div>
  );
}