import React, { useState, useRef } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Heading1, Heading2, Heading3, Link, Image, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing...",
  rows = 6
}) => {
  const [activeButtons, setActiveButtons] = useState<string[]>([]);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    updateActiveButtons();
    updateContent();
  };

  const saveCursorPosition = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && editorRef.current?.contains(selection.focusNode)) {
      const range = selection.getRangeAt(0);
      return {
        startContainer: range.startContainer,
        startOffset: range.startOffset,
        endContainer: range.endContainer,
        endOffset: range.endOffset
      };
    }
    return null;
  };

  const restoreCursorPosition = (savedPosition: any) => {
    if (savedPosition && editorRef.current) {
      try {
        const selection = window.getSelection();
        const range = document.createRange();
        
        // Check if the saved nodes are still in the DOM
        if (editorRef.current.contains(savedPosition.startContainer) && 
            editorRef.current.contains(savedPosition.endContainer)) {
          range.setStart(savedPosition.startContainer, savedPosition.startOffset);
          range.setEnd(savedPosition.endContainer, savedPosition.endOffset);
          
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      } catch (e) {
        // If restoration fails, place cursor at the end
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(editorRef.current);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  };

  const updateContent = () => {
    if (editorRef.current) {
      const cursorPosition = saveCursorPosition();
      const htmlContent = editorRef.current.innerHTML;
      
      // Only update if content actually changed
      if (htmlContent !== value) {
        onChange(htmlContent);
        
        // Restore cursor position after a short delay
        setTimeout(() => {
          restoreCursorPosition(cursorPosition);
        }, 0);
      }
    }
  };

  const updateActiveButtons = () => {
    const active: string[] = [];
    
    if (document.queryCommandState('bold')) active.push('bold');
    if (document.queryCommandState('italic')) active.push('italic');
    if (document.queryCommandState('underline')) active.push('underline');
    if (document.queryCommandState('justifyLeft')) active.push('alignLeft');
    if (document.queryCommandState('justifyCenter')) active.push('alignCenter');
    if (document.queryCommandState('justifyRight')) active.push('alignRight');
    if (document.queryCommandState('insertUnorderedList')) active.push('unorderedList');
    if (document.queryCommandState('insertOrderedList')) active.push('orderedList');
    
    setActiveButtons(active);
  };

  const insertHeading = (level: number) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();
      
      if (selectedText) {
        const heading = document.createElement(`h${level}`);
        heading.textContent = selectedText;
        heading.className = getHeadingClass(level);
        
        range.deleteContents();
        range.insertNode(heading);
        
        // Move cursor after the heading
        const afterRange = document.createRange();
        afterRange.setStartAfter(heading);
        afterRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(afterRange);
        
        updateContent();
      }
    }
  };

  const getHeadingClass = (level: number): string => {
    switch (level) {
      case 1: return 'text-2xl font-bold mb-4 text-gray-900';
      case 2: return 'text-xl font-semibold mb-3 text-gray-800';
      case 3: return 'text-lg font-medium mb-2 text-gray-700';
      default: return '';
    }
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      handleCommand('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      handleCommand('insertImage', url);
    }
  };

  const toolbarButtons = [
    { icon: Bold, command: 'bold', title: 'Bold' },
    { icon: Italic, command: 'italic', title: 'Italic' },
    { icon: Underline, command: 'underline', title: 'Underline' },
    { icon: AlignLeft, command: 'justifyLeft', title: 'Align Left' },
    { icon: AlignCenter, command: 'justifyCenter', title: 'Align Center' },
    { icon: AlignRight, command: 'justifyRight', title: 'Align Right' },
    { icon: List, command: 'insertUnorderedList', title: 'Bullet List' },
    { icon: ListOrdered, command: 'insertOrderedList', title: 'Numbered List' },
  ];

  return (
    <div className="rich-text-editor border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-200">
        {toolbarButtons.map(({ icon: Icon, command, title }) => (
          <button
            key={command}
            type="button"
            onClick={() => handleCommand(command)}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              activeButtons.includes(command) ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
            }`}
            title={title}
          >
            <Icon size={16} />
          </button>
        ))}
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        <button
          type="button"
          onClick={() => insertHeading(1)}
          className="p-2 rounded hover:bg-gray-200 text-gray-600 transition-colors"
          title="Heading 1"
        >
          <Heading1 size={16} />
        </button>
        <button
          type="button"
          onClick={() => insertHeading(2)}
          className="p-2 rounded hover:bg-gray-200 text-gray-600 transition-colors"
          title="Heading 2"
        >
          <Heading2 size={16} />
        </button>
        <button
          type="button"
          onClick={() => insertHeading(3)}
          className="p-2 rounded hover:bg-gray-200 text-gray-600 transition-colors"
          title="Heading 3"
        >
          <Heading3 size={16} />
        </button>
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        <button
          type="button"
          onClick={insertLink}
          className="p-2 rounded hover:bg-gray-200 text-gray-600 transition-colors"
          title="Insert Link"
        >
          <Link size={16} />
        </button>
        <button
          type="button"
          onClick={insertImage}
          className="p-2 rounded hover:bg-gray-200 text-gray-600 transition-colors"
          title="Insert Image"
        >
          <Image size={16} />
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={updateContent}
        onKeyUp={updateActiveButtons}
        onClick={updateActiveButtons}
        onPaste={() => {
          // Allow paste but clean up after
          setTimeout(updateContent, 0);
        }}
        dangerouslySetInnerHTML={{ __html: value }}
        className={`p-4 overflow-y-auto focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset`}
        style={{ minHeight: `${rows * 1.5}rem`, maxHeight: '16rem' }}
        data-placeholder={placeholder}
      />
      
      {/* Placeholder when empty */}
      {!value && (
        <div className="absolute inset-x-4 top-16 text-gray-400 pointer-events-none">
          {placeholder}
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{
        __html: `
        .rich-text-editor [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9CA3AF;
        }
        
        .rich-text-editor [contenteditable] h1 {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 1rem;
          color: #111827;
        }
        
        .rich-text-editor [contenteditable] h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: #1F2937;
        }
        
        .rich-text-editor [contenteditable] h3 {
          font-size: 1.125rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
          color: #374151;
        }
        
        .rich-text-editor [contenteditable] ul, .rich-text-editor [contenteditable] ol {
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        
        .rich-text-editor [contenteditable] li {
          margin: 0.25rem 0;
        }
        
        .rich-text-editor [contenteditable] a {
          color: #3B82F6;
          text-decoration: underline;
        }
        
        .rich-text-editor [contenteditable] img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 0.5rem 0;
        }
        `
      }} />
    </div>
  );
};