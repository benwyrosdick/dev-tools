import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JsonTreeNodeProps {
  data: any;
  keyName?: string;
  level?: number;
}

const JsonTreeNode: React.FC<JsonTreeNodeProps> = ({ data, keyName, level = 0 }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const indent = level * 16;
  
  if (data === null) {
    return (
      <div style={{ paddingLeft: `${indent}px` }} className="font-mono text-sm">
        {keyName && <span className="text-muted-foreground">{keyName}: </span>}
        <span className="text-orange-600">null</span>
      </div>
    );
  }
  
  if (typeof data === 'boolean') {
    return (
      <div style={{ paddingLeft: `${indent}px` }} className="font-mono text-sm">
        {keyName && <span className="text-muted-foreground">{keyName}: </span>}
        <span className="text-blue-600">{data.toString()}</span>
      </div>
    );
  }
  
  if (typeof data === 'number') {
    return (
      <div style={{ paddingLeft: `${indent}px` }} className="font-mono text-sm">
        {keyName && <span className="text-muted-foreground">{keyName}: </span>}
        <span className="text-green-600">{data}</span>
      </div>
    );
  }
  
  if (typeof data === 'string') {
    return (
      <div style={{ paddingLeft: `${indent}px` }} className="font-mono text-sm">
        {keyName && <span className="text-muted-foreground">{keyName}: </span>}
        <span className="text-red-600">"{data}"</span>
      </div>
    );
  }
  
  if (Array.isArray(data)) {
    const isEmpty = data.length === 0;
    
    return (
      <div>
        <div 
          style={{ paddingLeft: `${indent}px` }} 
          className={cn(
            "font-mono text-sm flex items-center",
            !isEmpty && "cursor-pointer hover:bg-muted/50"
          )}
          onClick={() => !isEmpty && setIsCollapsed(!isCollapsed)}
        >
          {!isEmpty && (
            isCollapsed ? 
              <ChevronRight className="h-4 w-4 mr-1" /> : 
              <ChevronDown className="h-4 w-4 mr-1" />
          )}
          {keyName && <span className="text-muted-foreground">{keyName}: </span>}
          <span className="text-purple-600">[</span>
          {isEmpty && <span className="text-purple-600">]</span>}
          {!isEmpty && isCollapsed && (
            <span className="text-muted-foreground ml-1">... {data.length} items]</span>
          )}
        </div>
        
        {!isEmpty && !isCollapsed && (
          <>
            {data.map((item, index) => (
              <JsonTreeNode 
                key={index} 
                data={item} 
                keyName={index.toString()} 
                level={level + 1} 
              />
            ))}
            <div style={{ paddingLeft: `${indent}px` }} className="font-mono text-sm">
              <span className="text-purple-600">]</span>
            </div>
          </>
        )}
      </div>
    );
  }
  
  if (typeof data === 'object') {
    const keys = Object.keys(data);
    const isEmpty = keys.length === 0;
    
    return (
      <div>
        <div 
          style={{ paddingLeft: `${indent}px` }} 
          className={cn(
            "font-mono text-sm flex items-center",
            !isEmpty && "cursor-pointer hover:bg-muted/50"
          )}
          onClick={() => !isEmpty && setIsCollapsed(!isCollapsed)}
        >
          {!isEmpty && (
            isCollapsed ? 
              <ChevronRight className="h-4 w-4 mr-1" /> : 
              <ChevronDown className="h-4 w-4 mr-1" />
          )}
          {keyName && <span className="text-muted-foreground">{keyName}: </span>}
          <span className="text-purple-600">{"{"}</span>
          {isEmpty && <span className="text-purple-600">{"}"}</span>}
          {!isEmpty && isCollapsed && (
            <span className="text-muted-foreground ml-1">... {keys.length} keys{"}"}</span>
          )}
        </div>
        
        {!isEmpty && !isCollapsed && (
          <>
            {keys.map((key) => (
              <JsonTreeNode 
                key={key} 
                data={data[key]} 
                keyName={key} 
                level={level + 1} 
              />
            ))}
            <div style={{ paddingLeft: `${indent}px` }} className="font-mono text-sm">
              <span className="text-purple-600">{"}"}</span>
            </div>
          </>
        )}
      </div>
    );
  }
  
  return null;
};

interface JsonTreeViewerProps {
  data: any;
  className?: string;
}

const JsonTreeViewer: React.FC<JsonTreeViewerProps> = ({ data, className }) => {
  return (
    <div className={cn("p-4 bg-background border rounded-md overflow-auto", className)}>
      <JsonTreeNode data={data} />
    </div>
  );
};

export default JsonTreeViewer;