import React, { useState } from 'react';
import { ChevronDown, Copy, Check } from 'lucide-react';
import { QnA } from '../types';
import { normalizeText } from '../utils';

interface QuestionCardProps {
  item: QnA;
  searchQuery: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ item, searchQuery }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${item.question}\nTrả lời: ${item.answer}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Function to highlight search terms
  const highlightText = (text: string, query: string) => {
    if (!query) return text;

    const normalizedQuery = normalizeText(query);
    
    // Better strategy for this context: highlight if the exact continuous query string exists (case insensitive)
    const index = normalizeText(text).indexOf(normalizedQuery);
    if (index === -1) return text;

    // This is a simplified visual highlighter. 
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const match = text.match(regex);
    
    if (!match) return text;

    return text.split(regex).map((part, i) => 
      regex.test(part) ? <span key={i} className="bg-yellow-200 text-gray-900 font-medium">{part}</span> : part
    );
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md ${isOpen ? 'ring-2 ring-blue-500/10' : ''}`}
    >
      <div 
        className="p-5 cursor-pointer flex justify-between items-start gap-4"
        onClick={toggleOpen}
      >
        <div className="flex-1">
          <h3 className="text-gray-900 font-medium text-lg leading-snug">
            {highlightText(item.question, searchQuery)}
          </h3>
        </div>
        <div className="flex items-center gap-2 pt-1">
           <button 
             onClick={handleCopy}
             className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
             title="Sao chép nội dung"
           >
             {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
           </button>
           <div className={`p-1 rounded-full transition-transform duration-200 ${isOpen ? 'rotate-180 bg-gray-100' : ''}`}>
             <ChevronDown className="w-5 h-5 text-gray-400" />
           </div>
        </div>
      </div>

      {isOpen && (
        <div className="px-5 pb-5 pt-0 animate-fadeIn">
          <div className="h-px w-full bg-gray-100 mb-4"></div>
          <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider block mb-2">Trả lời</span>
            <p className="text-gray-800 leading-relaxed text-base">
              {item.answer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;