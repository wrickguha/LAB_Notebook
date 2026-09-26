import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  FlaskConical,
  MoreHorizontal,
  Share2,
} from 'lucide-react';

import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';

import '../../styles/lab-notebook.css';

export default function LabNotebookEditor() {
  const { projectId } = useParams();
  const navigate = useNavigate();

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
            <span>Saved</span>
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
                Laboratory Notebook
              </h1>

              <p>
                Project #{projectId}
                <span className="title-separator">•</span>
                Research documentation
              </p>
            </div>

            <div className="notebook-project-badge">
              <FlaskConical size={15} />
              Active Project
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
                #{projectId}
              </div>

            </div>

            <div className="notebook-editor-content">
              <SimpleEditor />
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}