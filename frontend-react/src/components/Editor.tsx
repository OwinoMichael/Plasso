import React, { useRef, useState } from "react";
import EditorMonaco from "@monaco-editor/react";
import type { OpenFile } from "@/types/editor";
import { FileCode } from "lucide-react";



interface EditorProps {
  openFiles: OpenFile[];
  setOpenFiles: React.Dispatch<React.SetStateAction<OpenFile[]>>;
  activeFileId: string | null;
  setActiveFileId: (id: string | null) => void;
  onEdit: (fileId: string, content: string) => void; // ← new
  onCursorChange: (fileId: string, line: number, column: number) => void;
}

const Editor: React.FC<EditorProps> = ({
  openFiles,
  setOpenFiles,
  activeFileId,
  setActiveFileId,
  onEdit,
  onCursorChange
}) => {

  /* ===============================
     Editor Settings State
  =============================== */

  const [theme, setTheme] = useState("vs-dark");

  const editorRef = useRef<any>(null);

  const handleEditorMount = (editor: any) => {
  editorRef.current = editor;

  editor.onDidChangeCursorPosition((e: any) => {
    if (!activeFileId) return;
    onCursorChange(activeFileId, e.position.lineNumber, e.position.column);
  });
};

  const [editorOptions, setEditorOptions] = useState({
    fontSize: 14,
    wordWrap: "off" as "off" | "on",
    minimap: { enabled: false }
  });

  const updateOption = (key: string, value: any) => {
    setEditorOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleMinimap = () => {
    setEditorOptions(prev => ({
      ...prev,
      minimap: { enabled: !prev.minimap.enabled }
    }));
  };

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEditorChange = (value?: string) => {
    if (!activeFileId) return;

    // 1. Update local state immediately (fast UI)
    setOpenFiles(files =>
      files.map(file =>
        file.id === activeFileId
          ? { ...file, content: value ?? '', isDirty: true }
          : file
      )
    );

    // 2. Debounce the WS send — fires 300ms after user stops typing
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      onEdit(activeFileId, value ?? '');
    }, 300);
  };

  const closeTab = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    setOpenFiles(prev => {
      const newFiles = prev.filter(f => f.id !== fileId);

      // if closing active tab → switch intelligently
      if (fileId === activeFileId) {
        if (newFiles.length > 0) {
          setActiveFileId(newFiles[newFiles.length - 1].id);
        } else {
          setActiveFileId(null);
        }
      }

      return newFiles;
    });
  };

  /* ===============================
     Active File
  =============================== */

  const activeFile = openFiles.find(f => f.id === activeFileId);

  /* ===============================
     Render
  =============================== */

  return (
    <div className="flex-1 flex flex-col overflow-hidden">

      {/* ===================================================
          TOP BAR (Tabs LEFT + Settings RIGHT)
      =================================================== */}
      <div className="h-10 border-b bg-muted/30 flex items-center justify-between px-2">

        {/* ---------- LEFT: Tabs ---------- */}
        <div className="flex items-center overflow-x-auto gap-1">
          {openFiles.map(file => (
            <div
              key={file.id}
              onClick={() => setActiveFileId(file.id)}
              className={`
                flex items-center gap-2 px-3 py-1 text-sm
                rounded-t cursor-pointer whitespace-nowrap group
                ${file.id === activeFileId
                  ? "bg-background border border-b-0"
                  : "opacity-70 hover:opacity-100"}
              `}
            >
              <span className="flex items-center gap-1">

                {/* Dirty indicator */}
                {file.isDirty && (
                  <span className="text-yellow-400 text-xs">●</span>
                )}

                {file.name}
              </span>

              {/* Close Button */}
              <button
                onClick={(e) => closeTab(file.id, e)}
                className="opacity-0 group-hover:opacity-100 hover:bg-accent rounded px-1"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* ---------- RIGHT: Editor Settings ---------- */}
        <div className="flex items-center gap-2 text-xs">

          {/* Theme */}
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="bg-background border rounded px-2 py-1"
          >
            <option value="vs-dark">Dark</option>
            <option value="light">Light</option>
            <option value="hc-black">High Contrast</option>
          </select>

          {/* Font Size */}
          <select
            value={editorOptions.fontSize}
            onChange={(e) =>
              updateOption("fontSize", Number(e.target.value))
            }
            className="bg-background border rounded px-2 py-1"
          >
            {[12, 14, 16, 18, 20].map(size => (
              <option key={size} value={size}>
                {size}px
              </option>
            ))}
          </select>

          {/* Word Wrap */}
          <button
            onClick={() =>
              updateOption(
                "wordWrap",
                editorOptions.wordWrap === "on" ? "off" : "on"
              )
            }
            className="px-2 py-1 border rounded hover:bg-accent"
          >
            Wrap
          </button>

          {/* Minimap */}
          <button
            onClick={toggleMinimap}
            className="px-2 py-1 border rounded hover:bg-accent"
          >
            Map
          </button>

        </div>
      </div>

      {/* ===================================================
          MONACO EDITOR AREA
      =================================================== */}
      <div className="flex-1 overflow-hidden">

        {activeFile ? (
          <EditorMonaco
            height="100%"
            theme={theme}
            language={activeFile.language}
            value={activeFile.content}
            onChange={handleEditorChange}
            onMount={handleEditorMount} 
            options={{
              ...editorOptions,
              automaticLayout: true,
              scrollBeyondLastLine: false
            }}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Select a file to start editing
          </div>
        )}

      </div>
    </div>
  );
};

export default Editor;