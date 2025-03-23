
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight, Folder, File, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileStructureItem } from '../../types';
import { Input } from '@/components/ui/input';

interface ProjectStructureTreeProps {
  fileStructure: FileStructureItem[];
}

const ProjectStructureTree: React.FC<ProjectStructureTreeProps> = ({ fileStructure }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const toggleItem = (path: string) => {
    if (expandedItems.includes(path)) {
      setExpandedItems(expandedItems.filter(item => item !== path));
    } else {
      setExpandedItems([...expandedItems, path]);
    }
  };
  
  const renderFileStructureItem = (item: FileStructureItem, level = 0, parentPath = '') => {
    const currentPath = parentPath ? `${parentPath}/${item.name}` : item.name;
    const isExpanded = expandedItems.includes(currentPath);
    const isVisible = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!isVisible && !item.children?.some(child => 
      child.name.toLowerCase().includes(searchQuery.toLowerCase())
    )) {
      return null;
    }
    
    return (
      <div key={currentPath} style={{ marginLeft: level * 16 }}>
        <div 
          className="flex items-center py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-1 cursor-pointer"
          onClick={() => item.type === 'directory' && toggleItem(currentPath)}
        >
          {item.type === 'directory' ? (
            <>
              {isExpanded ? 
                <ChevronDown className="h-4 w-4 mr-1 text-gray-400" /> : 
                <ChevronRight className="h-4 w-4 mr-1 text-gray-400" />
              }
              <Folder className="h-4 w-4 mr-2 text-blue-500" />
            </>
          ) : (
            <>
              <span className="w-4 mr-1"></span>
              <File className="h-4 w-4 mr-2 text-gray-500" />
            </>
          )}
          <span className="text-sm">{item.name}</span>
          {item.isImportant && (
            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
              Key
            </span>
          )}
        </div>
        
        {item.type === 'directory' && isExpanded && item.children && (
          <div>
            {item.children.map(child => renderFileStructureItem(child, level + 1, currentPath))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center">
          <Folder className="h-5 w-5 mr-2 text-blue-500" />
          Project Structure
        </CardTitle>
        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input 
            type="text"
            placeholder="Search files..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="max-h-96 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {fileStructure.map(item => renderFileStructureItem(item))}
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default ProjectStructureTree;
