import React, { useState } from 'react';
import {
  Check,
  Code2,
  Copy,
  Download,
  FileCode,
  Folder,
  FolderOpen,
  Search,
  Terminal,
} from 'lucide-react';
import JSZip from 'jszip';
import { JAVA_PROJECT_FILES, JavaFileItem } from '../../data/javaProjectFiles';

export const CodeViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<JavaFileItem>(JAVA_PROJECT_FILES[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const filteredFiles = JAVA_PROJECT_FILES.filter(
    (f) =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setDownloading(true);
    try {
      const zip = new JSZip();

      // Add each project file into ZIP structure
      JAVA_PROJECT_FILES.forEach((file) => {
        zip.file(file.path, file.code);
      });

      // Generate the zip blob
      const content = await zip.generateAsync({ type: 'blob' });

      // Trigger browser download
      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'whatsapp-spring-boot-chat.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to create ZIP', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#111b21] text-[#e9edef] overflow-hidden">
      {/* Header Bar */}
      <div className="p-4 bg-[#202c33] border-b border-[#2a3942] flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#e9edef] flex items-center gap-2">
            <Code2 className="w-5 h-5 text-[#00a884]" />
            <span>Java 17 &amp; Spring Boot 3.3 Production Source Tree</span>
          </h2>
          <p className="text-xs text-[#8696a0] mt-0.5">
            Complete Maven project source code. Ready to run with <code className="text-[#00a884]">mvn clean spring-boot:run</code>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadZip}
            disabled={downloading}
            className="px-4 py-2 bg-[#00a884] hover:bg-[#02906f] text-[#111b21] text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-2 shadow"
            title="Download full Maven project archive"
          >
            {downloading ? (
              <div className="w-4 h-4 border-2 border-[#111b21] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Maven Project (.ZIP)</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        {/* Left File Navigation */}
        <div className="md:col-span-4 lg:col-span-3 bg-[#111b21] border-r border-[#2a3942] flex flex-col overflow-hidden">
          {/* Search box */}
          <div className="p-2.5 bg-[#182229] border-b border-[#2a3942]">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#8696a0] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#202c33] text-xs text-[#e9edef] pl-8 pr-3 py-1.5 rounded-lg border border-[#2a3942] focus:border-[#00a884] focus:outline-none placeholder-[#8696a0]"
              />
            </div>
          </div>

          {/* File list */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#2a3942]/30 p-1">
            {filteredFiles.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full p-2.5 rounded-lg text-left transition cursor-pointer flex items-start gap-2.5 ${
                    isSelected ? 'bg-[#00a884]/20 border border-[#00a884]/50' : 'hover:bg-[#202c33]'
                  }`}
                >
                  <FileCode
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      isSelected ? 'text-[#00a884]' : 'text-[#8696a0]'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs font-mono font-medium truncate ${
                        isSelected ? 'text-[#00a884]' : 'text-[#e9edef]'
                      }`}
                    >
                      {file.name}
                    </p>
                    <p className="text-[10px] text-[#8696a0] truncate font-mono mt-0.5">
                      {file.path}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Code Content Pane */}
        <div className="md:col-span-8 lg:col-span-9 bg-[#0b141a] flex flex-col overflow-hidden">
          {/* File Tab Header */}
          <div className="h-12 bg-[#182229] px-4 flex items-center justify-between border-b border-[#2a3942] shrink-0">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="text-xs font-mono text-[#00a884] font-semibold">
                {selectedFile.path}
              </span>
              <span className="text-[10px] bg-[#202c33] text-[#8696a0] px-2 py-0.5 rounded font-mono uppercase">
                {selectedFile.language}
              </span>
            </div>

            <button
              onClick={handleCopy}
              className="text-xs text-[#8696a0] hover:text-[#e9edef] flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#202c33] border border-[#2a3942] hover:bg-[#2a3942] transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#00a884]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>

          {/* Description banner */}
          <div className="px-4 py-2 bg-[#111b21] border-b border-[#2a3942] text-xs text-[#8696a0] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00a884]" />
            <span>{selectedFile.description}</span>
          </div>

          {/* Code Body */}
          <div className="flex-1 overflow-auto p-4 font-mono text-xs text-[#e9edef] leading-relaxed selection:bg-[#00a884]/30 selection:text-white">
            <pre className="whitespace-pre">
              {selectedFile.code.split('\n').map((line, idx) => (
                <div key={idx} className="table-row hover:bg-white/5">
                  <span className="table-cell pr-4 text-right select-none text-[#53606b] w-10 text-[11px]">
                    {idx + 1}
                  </span>
                  <span className="table-cell pl-2 text-[#e9edef]">{line}</span>
                </div>
              ))}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
