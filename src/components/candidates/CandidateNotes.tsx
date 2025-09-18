import React, { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { db } from '../../lib/database';
import { Send, Atom as At } from 'lucide-react';

interface CandidateNotesProps {
  candidateId: string;
}

export const CandidateNotes: React.FC<CandidateNotesProps> = ({ candidateId }) => {
  const [note, setNote] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => db.users.toArray()
  });

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const position = e.target.selectionStart || 0;
    
    setNote(value);
    setCursorPosition(position);
    
    // Check for @mention
    const textBeforeCursor = value.slice(0, position);
    const mentionMatch = textBeforeCursor.match(/@([a-zA-Z]*)$/);
    
    if (mentionMatch) {
      setMentionQuery(mentionMatch[1]);
      setShowMentions(true);
    } else {
      setShowMentions(false);
    }
  };

  const insertMention = (user: { id: string; name: string }) => {
    const textBeforeCursor = note.slice(0, cursorPosition);
    const textAfterCursor = note.slice(cursorPosition);
    
    // Replace the @query with @username
    const beforeMention = textBeforeCursor.replace(/@[a-zA-Z]*$/, '');
    const newText = beforeMention + `@${user.name} ` + textAfterCursor;
    
    setNote(newText);
    setShowMentions(false);
    
    // Focus back to textarea
    setTimeout(() => {
      textareaRef.current?.focus();
      const newPosition = beforeMention.length + user.name.length + 2;
      textareaRef.current?.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const handleSubmit = () => {
    if (note.trim()) {
      // In a real app, this would save the note
      console.log('Saving note:', note);
      setNote('');
    }
  };

  const filteredUsers = users?.filter(user =>
    user.name.toLowerCase().includes(mentionQuery.toLowerCase())
  ) || [];

  const renderNoteWithMentions = (text: string) => {
    return text.split(/(@[a-zA-Z0-9\s]+)/g).map((part, index) => {
      if (part.startsWith('@')) {
        return (
          <span key={index} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-1 rounded">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-4">
      {/* Previous notes would be displayed here */}
      <div className="space-y-3">
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {renderNoteWithMentions('Initial application received - looks promising! @John Smith please review.')}
          </p>
          <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
        </div>
      </div>

      {/* New note input */}
      <div className="relative">
        <div className="flex items-start space-x-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={note}
              onChange={handleTextChange}
              placeholder="Add a note... Use @ to mention team members"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
            
            {showMentions && filteredUsers.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-10 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg mt-1">
                {filteredUsers.slice(0, 5).map((user) => (
                  <button
                    key={user.id}
                    onClick={() => insertMention(user)}
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center space-x-2"
                  >
                    <At className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{user.name}</span>
                    <span className="text-xs text-gray-500">{user.email}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={!note.trim()}
            className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};