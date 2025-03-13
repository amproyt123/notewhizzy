
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import AnimatedTransition from './AnimatedTransition';
import { extractVideoId, generateSummary } from '@/utils/openRouterService';
import { ProcessingStatus, SummaryRequest, SummaryResponse } from '@/types';
import { CheckCircle, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface VideoFormProps {
  className?: string;
  onResult: (result: SummaryResponse) => void;
}

const VideoForm: React.FC<VideoFormProps> = ({ className, onResult }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [detailLevel, setDetailLevel] = useState<'concise' | 'detailed' | 'comprehensive'>('detailed');
  const [status, setStatus] = useState<ProcessingStatus>(ProcessingStatus.IDLE);
  const [progress, setProgress] = useState(0);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Handle URL input change
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(e.target.value);
    setError(null);
    
    // Extract video ID and set thumbnail if valid
    const videoId = extractVideoId(e.target.value);
    if (videoId) {
      setThumbnailUrl(`https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`);
    } else {
      setThumbnailUrl(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate URL
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      setError('Please enter a valid YouTube video URL');
      toast({
        variant: "destructive",
        title: "Invalid YouTube URL",
        description: "Please enter a valid YouTube video URL",
      });
      return;
    }
    
    // Set initial progress
    setProgress(0);
    setStatus(ProcessingStatus.VALIDATING);
    
    // Start progress simulation
    startProgressSimulation();
    
    try {
      // Process the video
      const request: SummaryRequest = {
        videoUrl,
        detailLevel
      };
      
      const result = await generateSummary(request, apiKey, (newStatus) => {
        setStatus(newStatus);
        
        // Update progress based on status
        if (newStatus === ProcessingStatus.VALIDATING) setProgress(10);
        if (newStatus === ProcessingStatus.EXTRACTING) setProgress(20);
        if (newStatus === ProcessingStatus.ANALYZING) setProgress(40);
        if (newStatus === ProcessingStatus.SUMMARIZING) setProgress(60);
        if (newStatus === ProcessingStatus.FORMATTING) setProgress(80);
        if (newStatus === ProcessingStatus.COMPLETED) setProgress(100);
      });
      
      // Clean up progress timer
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
      
      // Set final progress and pass result to parent
      setProgress(100);
      setStatus(ProcessingStatus.COMPLETED);
      onResult(result);
      
      // Reset form after successful processing
      setVideoUrl('');
      setThumbnailUrl(null);
      
      toast({
        title: "Summary Generated",
        description: "Your video has been successfully processed",
      });
    } catch (error) {
      // Handle errors
      console.error('Error processing video:', error);
      setStatus(ProcessingStatus.ERROR);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      
      toast({
        variant: "destructive",
        title: "Processing Failed",
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
      
      // Clean up progress timer
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
    }
  };
  
  // Simulate progress for better UX
  const startProgressSimulation = () => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
    }
    
    progressTimerRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          if (progressTimerRef.current) {
            clearInterval(progressTimerRef.current);
            progressTimerRef.current = null;
          }
          return prev;
        }
        
        // Slowly increase progress, with diminishing returns
        const increment = Math.max(0.5, 5 * (1 - prev / 100));
        return Math.min(95, prev + increment);
      });
    }, 300);
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, []);
  
  const isProcessing = status !== ProcessingStatus.IDLE && status !== ProcessingStatus.COMPLETED && status !== ProcessingStatus.ERROR;
  
  // Status messages for the progress indicator
  const statusMessages = {
    [ProcessingStatus.IDLE]: 'Ready to process',
    [ProcessingStatus.VALIDATING]: 'Validating video URL...',
    [ProcessingStatus.EXTRACTING]: 'Extracting video information...',
    [ProcessingStatus.ANALYZING]: 'Analyzing video content...',
    [ProcessingStatus.SUMMARIZING]: 'Generating summary and notes...',
    [ProcessingStatus.FORMATTING]: 'Formatting your results...',
    [ProcessingStatus.COMPLETED]: 'Processing complete!',
    [ProcessingStatus.ERROR]: 'An error occurred'
  };

  return (
    <div className={cn('w-full max-w-md mx-auto', className)}>
      <div className="glass-panel rounded-2xl p-6 transition-all duration-300">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="video-url" className="text-sm font-medium">
              YouTube Video URL
            </Label>
            <div className="relative">
              <Input
                id="video-url"
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={videoUrl}
                onChange={handleUrlChange}
                className={cn(
                  "pr-10 transition-all duration-300 focus:ring-2 focus:ring-primary/70",
                  error ? "border-red-300 focus:ring-red-400" : ""
                )}
                disabled={isProcessing}
                required
              />
            </div>
            {error && (
              <AnimatedTransition 
                show={true} 
                animationType="slide-up" 
                className="text-sm text-red-500 mt-1 flex items-center"
              >
                <AlertTriangle className="w-4 h-4 mr-1" />
                {error}
              </AnimatedTransition>
            )}
          </div>
          
          {thumbnailUrl && (
            <AnimatedTransition 
              show={true} 
              animationType="fade" 
              className="rounded-lg overflow-hidden shadow-sm"
            >
              <img 
                src={thumbnailUrl} 
                alt="Video thumbnail" 
                className="w-full h-auto object-cover rounded-lg" 
              />
            </AnimatedTransition>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="detail-level" className="text-sm font-medium">
              Detail Level
            </Label>
            <RadioGroup 
              value={detailLevel} 
              onValueChange={(value) => setDetailLevel(value as any)} 
              className="flex flex-col space-y-2"
              disabled={isProcessing}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="concise" id="concise" />
                <Label htmlFor="concise" className="cursor-pointer">Concise</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="detailed" id="detailed" />
                <Label htmlFor="detailed" className="cursor-pointer">Detailed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="comprehensive" id="comprehensive" />
                <Label htmlFor="comprehensive" className="cursor-pointer">Comprehensive</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="api-key" className="text-sm font-medium">
              OpenRouter API Key (Optional)
            </Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Enter your OpenRouter API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="transition-all duration-300 focus:ring-2 focus:ring-primary/70"
              disabled={isProcessing}
            />
            <p className="text-xs text-gray-500">
              Leave empty to use demo mode (simulated results)
            </p>
          </div>
          
          {isProcessing && (
            <div className="space-y-2 mt-4">
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-center text-gray-600">
                {statusMessages[status]} ({Math.round(progress)}%)
              </p>
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full transition-all duration-300"
            disabled={isProcessing || !videoUrl}
          >
            {isProcessing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : status === ProcessingStatus.COMPLETED ? (
              <CheckCircle className="mr-2 h-4 w-4" />
            ) : null}
            {isProcessing 
              ? 'Processing...' 
              : status === ProcessingStatus.COMPLETED 
                ? 'Done!' 
                : 'Generate Notes'
            }
          </Button>
        </form>
      </div>
    </div>
  );
};

export default VideoForm;
