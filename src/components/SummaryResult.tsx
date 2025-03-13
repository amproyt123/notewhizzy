
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { SummaryResponse } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AnimatedTransition from './AnimatedTransition';
import { Copy, Download, ExternalLink, FileText, List, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface SummaryResultProps {
  className?: string;
  result: SummaryResponse;
  onReset: () => void;
}

const SummaryResult: React.FC<SummaryResultProps> = ({ className, result, onReset }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const { toast } = useToast();
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };
  
  const handleCopy = (text: string, contentType: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${contentType} has been copied to your clipboard`,
    });
  };
  
  const handleDownload = () => {
    // Create markdown content
    const markdownContent = `
# ${result.videoDetails.title}
*Channel: ${result.videoDetails.channelTitle}*
*Generated: ${formatDate(result.timestamp)}*

## Summary
${result.summary}

## Key Points
${result.keyPoints.map(point => `- ${point}`).join('\n')}

## Notes
${result.notes}
    `.trim();
    
    // Create download link
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes-${result.videoDetails.id}.md`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Notes Downloaded",
      description: "Your notes have been downloaded as a markdown file",
    });
  };
  
  return (
    <AnimatedTransition 
      show={true} 
      animationType="scale" 
      className={cn('w-full max-w-4xl mx-auto', className)}
    >
      <Card className="overflow-hidden border-gray-100 shadow-lg transition-all duration-300 hover:shadow-xl">
        <CardHeader className="bg-gradient-to-r from-primary/20 to-primary/5 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-xl font-semibold truncate">
                {result.videoDetails.title}
              </CardTitle>
              <CardDescription>
                {result.videoDetails.channelTitle} • Generated on {formatDate(result.timestamp)}
              </CardDescription>
            </div>
            <div className="flex-shrink-0">
              <img 
                src={result.videoDetails.thumbnailUrl} 
                alt={result.videoDetails.title}
                className="w-24 h-auto rounded-md shadow-sm"
              />
            </div>
          </div>
        </CardHeader>
        
        <Tabs 
          defaultValue="summary" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="px-4 sm:px-6 border-b">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary" className="py-3">
                <FileText className="w-4 h-4 mr-2" />
                Summary
              </TabsTrigger>
              <TabsTrigger value="key-points" className="py-3">
                <List className="w-4 h-4 mr-2" />
                Key Points
              </TabsTrigger>
              <TabsTrigger value="notes" className="py-3">
                <FileText className="w-4 h-4 mr-2" />
                Detailed Notes
              </TabsTrigger>
            </TabsList>
          </div>
          
          <CardContent className="p-4 sm:p-6">
            <TabsContent value="summary" className="mt-0">
              <div className="prose max-w-none dark:prose-invert">
                <h3 className="text-lg font-medium mb-3">Summary</h3>
                <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">
                  {result.summary}
                </p>
                <div className="mt-4 flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleCopy(result.summary, 'Summary')}
                  >
                    <Copy className="w-4 h-4 mr-2" /> Copy Summary
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="key-points" className="mt-0">
              <div className="prose max-w-none dark:prose-invert">
                <h3 className="text-lg font-medium mb-3">Key Points</h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  {result.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-sm mr-3 flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleCopy(result.keyPoints.map(point => `• ${point}`).join('\n'), 'Key Points')}
                  >
                    <Copy className="w-4 h-4 mr-2" /> Copy Key Points
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notes" className="mt-0">
              <div className="prose max-w-none dark:prose-invert">
                <h3 className="text-lg font-medium mb-3">Detailed Notes</h3>
                <div className="whitespace-pre-line text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md overflow-auto max-h-[500px] border border-gray-100 dark:border-gray-700">
                  {result.notes}
                </div>
                <div className="mt-4 flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleCopy(result.notes, 'Detailed Notes')}
                  >
                    <Copy className="w-4 h-4 mr-2" /> Copy Notes
                  </Button>
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
        
        <Separator />
        
        <CardFooter className="p-4 sm:p-6 flex flex-wrap gap-3 justify-between">
          <Button 
            variant="outline" 
            onClick={onReset}
          >
            Process Another Video
          </Button>
          
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="secondary" 
              onClick={handleDownload}
            >
              <Download className="w-4 h-4 mr-2" /> Download Notes
            </Button>
            
            <Button>
              <Save className="w-4 h-4 mr-2" /> Save to Library
            </Button>
          </div>
        </CardFooter>
      </Card>
    </AnimatedTransition>
  );
};

export default SummaryResult;
