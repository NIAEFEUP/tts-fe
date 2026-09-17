import { useState } from 'react';
import { Button } from '../ui/new/button';
import { Input } from '../ui/new/input';
import { Table } from '../ui/new/table';
import { Card } from '../ui/new/card';
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
        <div className="flex-1 flex flex-col gap-4 max-h-[calc(100vh-4rem)] sticky top-8">
          <div className="flex items-center justify-between shrink-0">
            <h2 className="text-2xl font-bold">{activeTemplate?.id ? 'Edit Template' : 'New Template'}</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={() => setIsEditing(false)}>Save Template</Button>
            </div>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <label className="font-semibold text-sm">Template Name</label>
            <Input
              value={activeTemplate?.name || ''}
              onChange={(e: any) => setActiveTemplate(prev => prev ? { ...prev, name: e.target.value } : null)}
            />
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <label className="font-semibold text-sm">Subject</label>
            <Input
              value={activeTemplate?.subject || ''}
              onChange={(e: any) => setActiveTemplate(prev => prev ? { ...prev, subject: e.target.value } : null)}
            />
          </div>

          <div className="flex flex-col gap-2 flex-1 min-h-0">
            <label className="font-semibold text-sm flex justify-between shrink-0">
              Body (HTML/Rich Text)
            </label>
            <RichTextEditor
              value={activeTemplate?.bodyHtml || ''}
              onChange={(val) => setActiveTemplate(prev => prev ? { ...prev, bodyHtml: val } : null)}
            />
          </div>
        </div>

        {/* Live Preview Side */}
        <div className="flex-1 flex flex-col gap-4 sticky top-8 max-h-[calc(100vh-4rem)]">
          <div className="flex items-center h-10">
            <h3 className="text-xl font-bold">Live Preview</h3>
          </div>
          <Card className="flex-1 overflow-auto">
             <TemplateWrapper
                previewText={activeTemplate?.subject || 'Preview'}
                bodyHtml={activeTemplate?.bodyHtml}
                isPreview={true}
             />
          </Card>
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

      <Table.Container>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>Name</Table.Head>
              <Table.Head>Subject</Table.Head>
              <Table.Head>Actions</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {templates.map(t => (
              <Table.Row key={t.id}>
                <Table.Cell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-gray-400" />
                    {t.name}
                  </div>
                </Table.Cell>
                <Table.Cell>{t.subject}</Table.Cell>
                <Table.Cell>
                  <Button variant="outline" size="sm" onClick={() => {
                    setActiveTemplate(t);
                    setIsEditing(true);
                  }}>
                    Edit
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
            {templates.length === 0 && (
              <Table.Row>
                <Table.Cell colSpan={3} className="text-center text-gray-500 py-8">
                  No templates found. Create one to get started.
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </Table.Container>
    </div>
  );
};
