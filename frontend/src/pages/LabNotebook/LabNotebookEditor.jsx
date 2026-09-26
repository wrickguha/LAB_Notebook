import React from 'react';
import { useParams } from 'react-router-dom';
import { SimpleEditor } from '../../components/tiptap-templates/simple/simple-editor';

export default function LabNotebookEditor() {

    const { projectId } = useParams();

    return (
        <div className="min-h-screen bg-slate-50">

            {/* Header */}
            <div className="border-b bg-white px-6 py-4">
                <h1 className="text-lg font-bold text-slate-900">
                    Lab Notebook
                </h1>

                <p className="text-sm text-slate-500">
                    Project ID: {projectId}
                </p>
            </div>

            {/* Tiptap */}
            <div className="p-6">
                <SimpleEditor />
            </div>

        </div>
    );
}