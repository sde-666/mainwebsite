import React, { createContext, useContext, useState } from 'react';

interface AiAssistantContextType {
  isOpen: boolean;
  openAssistant: (initialSubject?: string, initialQuestion?: string) => void;
  closeAssistant: () => void;
  initialSubject?: string;
  initialQuestion?: string;
}

const AiAssistantContext = createContext<AiAssistantContextType | undefined>(undefined);

export function AiAssistantProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialSubject, setInitialSubject] = useState<string | undefined>('M3-R5 Python');
  const [initialQuestion, setInitialQuestion] = useState<string | undefined>('');

  const openAssistant = (subject?: string, question?: string) => {
    if (subject) setInitialSubject(subject);
    if (question) setInitialQuestion(question);
    setIsOpen(true);
  };

  const closeAssistant = () => {
    setIsOpen(false);
  };

  return (
    <AiAssistantContext.Provider
      value={{
        isOpen,
        openAssistant,
        closeAssistant,
        initialSubject,
        initialQuestion
      }}
    >
      {children}
    </AiAssistantContext.Provider>
  );
}

export function useAiAssistant() {
  const context = useContext(AiAssistantContext);
  if (!context) {
    throw new Error('useAiAssistant must be used within an AiAssistantProvider');
  }
  return context;
}
