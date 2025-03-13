
import { SummaryRequest, SummaryResponse, VideoDetails, ProcessingStatus } from '@/types';

// Base URL for OpenRouter API
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
// Fixed API key for OpenRouter (replace with your actual API key)
const API_KEY = 'your-openrouter-api-key-here';
// Specify the free model to use
const FREE_MODEL = 'openai/gpt-3.5-turbo';

// Process to extract video ID from YouTube URL
export const extractVideoId = (url: string): string | null => {
  const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[1]) ? match[1] : null;
};

// Function to fetch video details from YouTube
export const fetchVideoDetails = async (videoId: string): Promise<VideoDetails> => {
  try {
    // In a real implementation, you would use YouTube Data API
    // For now, we'll simulate this with a quick fetch to just get the oEmbed data
    const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch video details');
    }
    
    const data = await response.json();
    
    return {
      id: videoId,
      title: data.title,
      thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
      channelTitle: data.author_name || 'Unknown Channel',
    };
  } catch (error) {
    console.error('Error fetching video details:', error);
    
    // Fallback with basic details
    return {
      id: videoId,
      title: 'Video Title Unavailable',
      thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
      channelTitle: 'Unknown Channel',
    };
  }
};

// Function to get transcript from YouTube video
// Note: In a real implementation, you would use YouTube's captions API or a specialized service
const fetchTranscript = async (videoId: string): Promise<string> => {
  try {
    // This is a placeholder. In a real app, you would use a service to get the transcript
    // Simulating a delay to mimic API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return "This is a simulated transcript. In a real application, you would use a YouTube transcript API service to fetch the actual transcript for video ID: " + videoId;
  } catch (error) {
    console.error('Error fetching transcript:', error);
    throw new Error('Failed to fetch video transcript');
  }
};

// Function to generate summary using OpenRouter API
export const generateSummary = async (
  request: SummaryRequest,
  onStatusUpdate?: (status: ProcessingStatus) => void
): Promise<SummaryResponse> => {
  try {
    // Update status to validating
    onStatusUpdate?.(ProcessingStatus.VALIDATING);
    
    // Extract video ID
    const videoId = extractVideoId(request.videoUrl);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }
    
    // Update status to extracting
    onStatusUpdate?.(ProcessingStatus.EXTRACTING);
    
    // Fetch video details
    const videoDetails = await fetchVideoDetails(videoId);
    
    // Fetch transcript
    onStatusUpdate?.(ProcessingStatus.ANALYZING);
    const transcript = await fetchTranscript(videoId);
    
    // Update status to summarizing
    onStatusUpdate?.(ProcessingStatus.SUMMARIZING);
    
    // Prepare prompt for AI
    const detailLevelMap = {
      'concise': 'a brief overview with main points',
      'detailed': 'a comprehensive summary with key insights and structured notes',
      'comprehensive': 'in-depth notes with detailed explanations of all concepts'
    };
    
    const prompt = `
You are an expert educational content summarizer. I need you to analyze this YouTube video transcript and create ${detailLevelMap[request.detailLevel]}.

VIDEO TITLE: ${videoDetails.title}
CHANNEL: ${videoDetails.channelTitle}

TRANSCRIPT:
${transcript}

Please provide:
1. A concise summary (2-3 paragraphs)
2. 5-7 key points or takeaways
3. Structured, detailed notes in a clean format that a student could use for studying

Format the notes section with clear headings, bullet points, and organize the content in a logical, easy-to-follow structure.
    `;
    
    // For development purposes, we'll simulate the OpenRouter API response if in demo mode
    if (API_KEY === 'your-openrouter-api-key-here') {
      // Simulate AI response with mock data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onStatusUpdate?.(ProcessingStatus.FORMATTING);
      
      const mockResponse: SummaryResponse = {
        videoDetails,
        summary: `This video explores the fundamentals of machine learning, covering supervised and unsupervised learning approaches, common algorithms, and practical applications.

The presenter explains how machine learning systems learn from data patterns rather than explicit programming, highlighting the importance of quality training data and feature selection. Several real-world examples demonstrate how these techniques are applied in industries ranging from healthcare to finance.`,
        keyPoints: [
          "Machine learning systems learn from data patterns without explicit programming",
          "Quality of training data directly impacts model performance",
          "Feature selection is critical for model accuracy and efficiency",
          "Supervised learning requires labeled data while unsupervised learning works with unlabeled data",
          "Common algorithms include linear regression, decision trees, and neural networks",
          "Real-world applications span healthcare, finance, and recommendation systems"
        ],
        notes: `# Machine Learning Fundamentals

## Core Concepts
- **Definition**: Machine learning enables computers to learn from data without explicit programming
- **Learning Types**:
  - Supervised Learning: Uses labeled data
  - Unsupervised Learning: Finds patterns in unlabeled data
  - Reinforcement Learning: Learning through reward-based feedback

## Key Algorithms
- **Regression Algorithms**
  - Linear Regression: Predicts continuous values
  - Logistic Regression: Used for binary classification
- **Classification Algorithms**
  - Decision Trees: Tree-like model of decisions
  - Random Forests: Ensemble of decision trees
  - Support Vector Machines: Finds optimal hyperplane
- **Clustering Algorithms**
  - K-means: Groups similar data points
  - Hierarchical Clustering: Creates tree of clusters

## Model Training Process
1. Data Collection and Preparation
2. Feature Selection and Engineering
3. Model Selection
4. Training and Validation
5. Testing and Evaluation
6. Deployment and Monitoring

## Best Practices
- Use cross-validation to avoid overfitting
- Balance datasets for classification problems
- Normalize data when using distance-based algorithms
- Regularly update models with new data

## Industry Applications
- **Healthcare**: Disease prediction, medical imaging analysis
- **Finance**: Fraud detection, risk assessment
- **Retail**: Recommendation systems, demand forecasting
- **Transportation**: Route optimization, autonomous vehicles`,
        timestamp: Date.now()
      };
      
      onStatusUpdate?.(ProcessingStatus.COMPLETED);
      return mockResponse;
    }
    
    // Make the actual API call to OpenRouter
    const openRouterResponse = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'YouTube Video Summarizer'
      },
      body: JSON.stringify({
        model: FREE_MODEL, // Using the free model specified
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 4000
      })
    });
    
    if (!openRouterResponse.ok) {
      const errorData = await openRouterResponse.json();
      throw new Error(`OpenRouter API error: ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const aiResponse = await openRouterResponse.json();
    const aiText = aiResponse.choices[0].message.content;
    
    // Parse the AI response
    // This is a simplified parsing logic - you might need more robust parsing based on the actual responses
    const summaryMatch = aiText.match(/(?:summary|overview):(.*?)(?:\n\n|\n#)/is);
    const summary = summaryMatch ? summaryMatch[1].trim() : 'Summary not available';
    
    // Extract key points
    const keyPointsSection = aiText.match(/(?:key points|takeaways|main points):(.*?)(?:\n\n|\n#)/is);
    let keyPoints: string[] = [];
    
    if (keyPointsSection) {
      keyPoints = keyPointsSection[1]
        .split(/\n\s*[-•*]\s*/)
        .filter(point => point.trim().length > 0)
        .map(point => point.trim());
    }
    
    // Extract notes section
    const notesMatch = aiText.match(/(?:notes|detailed notes):(.*)/is);
    const notes = notesMatch ? notesMatch[1].trim() : aiText; // fallback to the whole response
    
    onStatusUpdate?.(ProcessingStatus.FORMATTING);
    
    // Create and return the summary response
    const summaryResponse: SummaryResponse = {
      videoDetails,
      summary,
      keyPoints,
      notes,
      timestamp: Date.now()
    };
    
    onStatusUpdate?.(ProcessingStatus.COMPLETED);
    return summaryResponse;
  } catch (error) {
    console.error('Error generating summary:', error);
    onStatusUpdate?.(ProcessingStatus.ERROR);
    throw error;
  }
};
