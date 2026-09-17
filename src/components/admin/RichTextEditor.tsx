import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { Bold, Italic, Underline as UnderlineIcon, Strikethrough, List, ListOrdered, Link as LinkIcon, Heading2, ChevronDown } from 'lucide-react';
import { Button } from '../ui/new/button';
import { useState } from 'react';
import { Popover } from '../ui/new/popover';
import { Command, CommandGroup, CommandItem } from '../ui/command';
import { Card } from '../ui/new/card';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const VariableSelector = ({ editor }: { editor: any }) => {
  const [open, setOpen] = useState(false);

  const options = [
    { label: 'Student Name', value: '{{student_name}}' },
    { label: 'Student Email', value: '{{student_email}}' },
    { label: 'Admin Name (You)', value: '{{admin_name}}' },
    { label: 'Admin Signature', value: '<br><br><p>Best regards,</p><p><strong>{{admin_name}}</strong></p><p>NIAEFEUP</p>' },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen} placement="bottom-start">
      <Popover.Trigger asChild>
        <Button variant="outline" size="sm" className="justify-between w-40 text-xs h-8 shrink-0">
          Insert Variable...
          <ChevronDown size={14} />
        </Button>
      </Popover.Trigger>
      <Popover.Content className="w-48 p-0 z-50">
        <Command>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.label}
                onSelect={() => {
                  editor.chain().focus().insertContent(option.value).run();
                  setOpen(false);
                }}
              >
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </Popover.Content>
    </Popover>
  );
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div className="border-b border-border p-2 flex gap-1 bg-gray-50/50 rounded-t-[calc(1.5rem-1px)] items-center overflow-x-auto whitespace-nowrap">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'bg-gray-200' : ''}
      >
        <Bold size={16} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'bg-gray-200' : ''}
      >
        <Italic size={16} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive('underline') ? 'bg-gray-200' : ''}
      >
        <UnderlineIcon size={16} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'bg-gray-200' : ''}
      >
        <Strikethrough size={16} />
      </Button>
      <div className="w-[1px] bg-gray-300 mx-1 h-8 shrink-0" />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}
      >
        <Heading2 size={16} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}
      >
        <List size={16} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'bg-gray-200' : ''}
      >
        <ListOrdered size={16} />
      </Button>
      <div className="w-[1px] bg-gray-300 mx-1 h-8 shrink-0" />
      <Button
        variant="ghost"
        size="sm"
        onClick={setLink}
        className={editor.isActive('link') ? 'bg-gray-200' : ''}
      >
        <LinkIcon size={16} />
      </Button>
      <div className="w-[1px] bg-gray-300 mx-1 h-8 shrink-0" />
      <VariableSelector editor={editor} />
    </div>
  );
};

export const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none p-4 min-h-[300px]',
      },
    },
  });

  return (
    <Card className="flex flex-col h-full min-h-0 p-0 overflow-hidden shadow-none rounded-3xl">
      <div className="shrink-0">
        <MenuBar editor={editor} />
      </div>
      <Card.Content className="overflow-y-auto flex-1 min-h-0 p-0">
        <EditorContent editor={editor} />
      </Card.Content>
    </Card>
  );
};
