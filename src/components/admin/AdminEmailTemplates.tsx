import { useState } from 'react';
import { Button } from '../ui/new/button';
import { Plus, Mail } from 'lucide-react';
import { TemplateWrapper } from '../emails/TemplateWrapper';
import { RichTextEditor } from './RichTextEditor';

export const AdminEmailTemplates = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<{ id: string; name: string; subject: string; bodyHtml: string } | null>(null);

  // Mock data for now
  const [templates, setTemplates] = useState([
    {
      id: '1',
      name: 'Welcome Email',
      subject: 'Welcome to NIAEFEUP, {{student_name}}!',
      bodyHtml: '<p>Hi {{student_name}},</p><p>We are excited to have you onboard.</p><p>Best,<br/>{{admin_signature}}</p>',
    }
  ]);

  if (isEditing) {
    return (
      <div className="flex gap-8 h-full">
        {/* Editor Side */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{activeTemplate?.id ? 'Edit Template' : 'New Template'}</h2>
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-sm">Template Name</label>
            <input 
              className="border p-2 rounded-md" 
              value={activeTemplate?.name || ''} 
              onChange={(e) => setActiveTemplate(prev => prev ? { ...prev, name: e.target.value } : null)}
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-sm">Subject</label>
            <input 
              className="border p-2 rounded-md" 
              value={activeTemplate?.subject || ''} 
              onChange={(e) => setActiveTemplate(prev => prev ? { ...prev, subject: e.target.value } : null)}
            />
          </div>

          <div className="flex flex-col gap-2 flex-1">
            <label className="font-semibold text-sm flex justify-between">
              Body (HTML/Rich Text)
            </label>
            <RichTextEditor 
              value={activeTemplate?.bodyHtml || ''} 
              onChange={(val) => setActiveTemplate(prev => prev ? { ...prev, bodyHtml: val } : null)}
            />
          </div>
          
          <Button onClick={() => setIsEditing(false)} className="w-fit">Save Template</Button>
        </div>

        {/* Live Preview Side */}
        <div className="flex-1 border rounded-lg p-4 bg-gray-50 overflow-auto flex flex-col gap-4">
          <h3 className="font-bold text-gray-700">Live Preview</h3>
          <div className="bg-white border rounded shadow-sm scale-[0.8] origin-top h-[800px] overflow-hidden">
             <TemplateWrapper 
                previewText={activeTemplate?.subject || 'Preview'} 
                bodyHtml={activeTemplate?.bodyHtml} 
                isPreview={true}
             />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Email Templates</h1>
        <Button onClick={() => {
          setActiveTemplate({ id: '', name: '', subject: '', bodyHtml: '' });
          setIsEditing(true);
        }}>
          <Plus size={16} className="mr-2" />
          New Template
        </Button>
      </div>

      <div className="border rounded-lg bg-white overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-semibold text-gray-600">Name</th>
              <th className="p-4 font-semibold text-gray-600">Subject</th>
              <th className="p-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {templates.map(t => (
              <tr key={t.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-4 font-medium flex items-center gap-2">
                  <Mail size={16} className="text-gray-400" />
                  {t.name}
                </td>
                <td className="p-4 text-gray-600">{t.subject}</td>
                <td className="p-4">
                  <Button variant="outline" size="sm" onClick={() => {
                    setActiveTemplate(t);
                    setIsEditing(true);
                  }}>
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
            {templates.length === 0 && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-500">
                  No templates found. Create one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
