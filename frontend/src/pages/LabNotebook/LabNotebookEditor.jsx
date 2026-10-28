import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  FileDown,
  FlaskConical,
  MoreHorizontal,
  Share2,
} from 'lucide-react';

import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';
import { useApp } from '@/context/AppContext';

import '../../styles/lab-notebook.css';

function ProjectTiptapEditor({ project, onSave, editorRef }) {
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
      <SimpleEditor ref={editorRef} content={content} onUpdate={handleUpdate} />
    </div>
  );
}

export default function LabNotebookEditor() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects, saveProjectContent } = useApp();
  const project = projects.find((item) => String(item.id) === projectId);
  const editorRef = useRef(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const handleDownloadPdf = async () => {
    const html = editorRef.current?.getHTML?.();
    if (!html) return;

    setPdfLoading(true);

    try {
      const html2pdf = (await import('html2pdf.js')).default;

      // Create a temporary container with the editor HTML + styling
      const container = document.createElement('div');
      container.innerHTML = html;

      // Apply print-friendly styles that match the editor appearance
      container.style.cssText = `
        font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
        font-size: 14px;
        line-height: 1.7;
        color: #0f172a;
        padding: 40px;
        max-width: 800px;
        word-wrap: break-word;
        overflow-wrap: break-word;
      `;

      // Style headings
      container.querySelectorAll('h1').forEach(el => {
        el.style.cssText = 'font-size: 28px; font-weight: 700; margin: 24px 0 12px; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;';
      });
      container.querySelectorAll('h2').forEach(el => {
        el.style.cssText = 'font-size: 22px; font-weight: 600; margin: 20px 0 10px; color: #1e293b;';
      });
      container.querySelectorAll('h3').forEach(el => {
        el.style.cssText = 'font-size: 18px; font-weight: 600; margin: 16px 0 8px; color: #334155;';
      });
      container.querySelectorAll('h4').forEach(el => {
        el.style.cssText = 'font-size: 16px; font-weight: 600; margin: 14px 0 6px; color: #475569;';
      });

      // Style paragraphs
      container.querySelectorAll('p').forEach(el => {
        el.style.cssText = 'margin: 8px 0; line-height: 1.7;';
      });

      // Style code blocks
      container.querySelectorAll('pre').forEach(el => {
        el.style.cssText = 'background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 12px 0; overflow-x: auto; font-size: 13px;';
      });
      container.querySelectorAll('code').forEach(el => {
        if (el.parentElement?.tagName !== 'PRE') {
          el.style.cssText = 'background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 13px; color: #0d9488;';
        } else {
          el.style.cssText = 'font-family: "Fira Code", "Consolas", monospace; font-size: 13px;';
        }
      });

      // Style blockquotes
      container.querySelectorAll('blockquote').forEach(el => {
        el.style.cssText = 'border-left: 3px solid #0d9488; margin: 12px 0; padding: 8px 16px; color: #475569; background: #f0fdfa; border-radius: 0 6px 6px 0;';
      });

      // Style lists
      container.querySelectorAll('ul, ol').forEach(el => {
        el.style.cssText = 'margin: 8px 0; padding-left: 24px;';
      });
      container.querySelectorAll('li').forEach(el => {
        el.style.cssText = 'margin: 4px 0;';
      });

      // Style images
      container.querySelectorAll('img').forEach(el => {
        el.style.cssText = 'max-width: 100%; height: auto; border-radius: 8px; margin: 12px 0;';
      });

      // Style horizontal rules
      container.querySelectorAll('hr').forEach(el => {
        el.style.cssText = 'border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;';
      });

      // Style task lists
      container.querySelectorAll('ul[data-type="taskList"]').forEach(el => {
        el.style.cssText = 'list-style: none; padding-left: 0;';
      });

      // Style highlights
      container.querySelectorAll('mark').forEach(el => {
        el.style.cssText = `background: ${el.dataset.color || '#fef08a'}; padding: 1px 4px; border-radius: 3px;`;
      });

      const projectName = project?.name || 'Research Notes';
      const filename = `${projectName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')}_Notes.pdf`;

      const opt = {
        margin: [15, 15, 15, 15],
        filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          logging: false,
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      };

      await html2pdf().set(opt).from(container).save();
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setPdfLoading(false);
    }
  };

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
            className="notebook-pdf-button"
            onClick={handleDownloadPdf}
            disabled={pdfLoading || !project}
            title="Download as PDF"
          >
            <FileDown size={16} />
            <span>{pdfLoading ? 'Generating…' : 'PDF'}</span>
          </button>

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
              <ProjectTiptapEditor project={project} onSave={saveProjectContent} editorRef={editorRef} />
            ) : (
              <div className="notebook-editor-content" role="status">Loading project document...</div>
            )}

          </div>

        </div>

      </main>

    </div>
  );
}