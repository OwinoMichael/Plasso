import React from 'react';
import { FileCode } from 'lucide-react';

interface EditorProps {
  selectedFile: string;
}

const Editor: React.FC<EditorProps> = ({ selectedFile }) => {
  return (
    <div className="flex-1 flex flex-col">
      <div className="h-10 border-b border-border flex items-center px-2 bg-muted/30">
        <div className="px-3 py-1 rounded-t text-sm flex items-center gap-2 bg-background">
          <FileCode className="w-3 h-3" />
          {selectedFile}
        </div>
      </div>

      <div className="flex-1 p-4 font-mono text-sm overflow-auto bg-background">
        <div className="space-y-1">
          <div><span className="text-primary">import</span> <span className="text-chart-2">React</span> <span className="text-primary">from</span> <span className="text-chart-1">'react'</span>;</div>
          <div><span className="text-primary">import</span> {'{ useState }'} <span className="text-primary">from</span> <span className="text-chart-1">'react'</span>;</div>
          <div className="h-4"></div>
          <div><span className="text-primary">const</span> <span className="text-chart-2">App</span> = () {'=> {'}</div>
          <div className="pl-4"><span className="text-primary">const</span> [count, setCount] = <span className="text-chart-2">useState</span>(<span className="text-chart-1">0</span>);</div>
          <div className="h-4"></div>
          <div className="pl-4"><span className="text-primary">return</span> (</div>
          <div className="pl-8">{'<'}<span className="text-chart-2">div</span> <span className="text-primary">className</span>=<span className="text-chart-1">"container"</span>{'>'}</div>
          <div className="pl-12">{'<'}<span className="text-chart-2">h1</span>{'>'}Counter: {'{count}'}<span>{'</'}</span><span className="text-chart-2">h1</span>{'>'}</div>
          <div className="pl-12 relative">
            {'<'}<span className="text-chart-2">button</span> <span className="text-primary">onClick</span>={'{() => setCount(count + 1)}'}{'>'}
            <div className="absolute -left-2 w-0.5 h-5 bg-chart-2" title="Alice's cursor"></div>
          </div>
          <div className="pl-16">Increment</div>
          <div className="pl-12">{'</'}<span className="text-chart-2">button</span>{'>'}</div>
          <div className="pl-8">{'</'}<span className="text-chart-2">div</span>{'>'}</div>
          <div className="pl-4">);</div>
          <div>{'}'};</div>
          <div className="h-4"></div>
          <div><span className="text-primary">export default</span> App;</div>
        </div>
      </div>
    </div>
  );
};

export default Editor;