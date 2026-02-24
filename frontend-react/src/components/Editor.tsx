import EditorMonaco from "@monaco-editor/react";
import { FileCode, X } from "lucide-react";

interface OpenFile {
  id: string;
  name: string;
  content: string;
  language: string;
}

interface EditorProps {
  openFiles: OpenFile[];
  activeFileId: string | null;
  setActiveFileId: (id: string) => void;
}

const Editor: React.FC<EditorProps> = ({
  openFiles,
  activeFileId,
  setActiveFileId
}) => {

  const activeFile = openFiles.find(f => f.id === activeFileId);

  return (
    <div className="flex-1 flex flex-col">

      {/* ---------- Tabs ---------- */}
      <div className="h-10 border-b flex items-center bg-muted/30 overflow-x-auto">

        {openFiles.map(file => (
          <div
            key={file.id}
            onClick={() => setActiveFileId(file.id)}
            className={`px-3 py-1 text-sm flex items-center gap-2 cursor-pointer
              ${file.id === activeFileId
                ? "bg-background border-t border-l border-r"
                : "opacity-70"
              }`}
          >
            <FileCode className="w-3 h-3" />
            {file.name}
          </div>
        ))}

      </div>

      {/* ---------- Monaco ---------- */}
      <div className="flex-1">
        {activeFile ? (
          <EditorMonaco
            height="100%"
            theme="vs-dark"
            language={activeFile.language}
            value={activeFile.content}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              automaticLayout: true,
              scrollBeyondLastLine: false
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Select a file to start editing
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;