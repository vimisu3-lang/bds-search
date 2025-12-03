import React, { useState, useMemo, useEffect } from 'react';
import { BookOpen, AlertCircle } from 'lucide-react';
import SearchBar from './components/SearchBar';
import QuestionCard from './components/QuestionCard';
import { rawCSVData } from './data';
import { parseCSV, normalizeText } from './utils';
import { QnA } from './types';

const App: React.FC = () => {
  const [data, setData] = useState<QnA[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Parse data on mount
  useEffect(() => {
    const parsed = parseCSV(rawCSVData);
    setData(parsed);
    setLoading(false);
  }, []);

  // Filter logic
  const filteredData = useMemo(() => {
    if (!query) return data;
    
    const normalizedQuery = normalizeText(query);
    return data.filter((item) => {
      const q = normalizeText(item.question);
      const a = normalizeText(item.answer);
      return q.includes(normalizedQuery) || a.includes(normalizedQuery);
    });
  }, [query, data]);

  // Display only top results if query is empty to avoid rendering thousands of items immediately
  // But for this use case, showing all (or paginating) is better. 
  // Let's limit initial display if no query for performance, or show all if filtered.
  const displayData = query ? filteredData : filteredData.slice(0, 50);

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-blue-600 p-2 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              Tra Cứu Bất Động Sản
            </h1>
          </div>
          
          <SearchBar 
            value={query} 
            onChange={setQuery} 
            onClear={() => setQuery('')} 
          />
          
          <div className="text-center mt-3 text-sm text-gray-500">
             {loading ? 'Đang tải dữ liệu...' : `Tìm thấy ${filteredData.length} kết quả`}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {displayData.length > 0 ? (
              displayData.map((item) => (
                <QuestionCard 
                  key={item.id} 
                  item={item} 
                  searchQuery={query}
                />
              ))
            ) : (
              <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                <div className="flex justify-center mb-4">
                  <AlertCircle className="w-12 h-12 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Không tìm thấy kết quả</h3>
                <p className="text-gray-500">Thử tìm kiếm với từ khóa khác.</p>
              </div>
            )}
            
            {!query && data.length > 50 && (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">Hiển thị 50 câu hỏi mới nhất. Hãy nhập từ khóa để tìm kiếm chi tiết.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto py-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Tra Cứu Luật Bất Động Sản.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;