import { useState, useEffect } from "react";
import { Volume2, Headphones } from "lucide-react";
import SessionSetup from "@/components/session-setup";
import SpeakerView from "@/components/speaker-view";
import ListenerAllWords from "@/components/listener-all-words";
import ResultsView from "@/components/results-view";
import { offlineStorage, type OfflineSession } from "@/lib/offline-storage";
import { TestResponse, SessionResults } from "@shared/schema";

type ViewMode = 'setup' | 'speaker' | 'listener' | 'results';
type UserMode = 'speaker' | 'listener';

export default function RhymeTest() {
  const [currentView, setCurrentView] = useState<ViewMode>('setup');
  const [userMode, setUserMode] = useState<UserMode>('speaker');
  const [session, setSession] = useState<OfflineSession | null>(null);
  const [isOffline] = useState(true);

  // Load saved session on mount
  useEffect(() => {
    // Clear any old session to start fresh
    offlineStorage.clearSession();

    // Register service worker for offline functionality
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .catch(error => console.log('SW registration failed'));
    }
  }, []);

  // Save session whenever it changes
  useEffect(() => {
    if (session) {
      offlineStorage.saveSession(session);
    }
  }, [session]);

  const [userInfo, setUserInfo] = useState<{name: string; testPoint: string; station: string; gender: string} | null>(null);

  const handleStartSession = (sessionData: { name: string; testPoint: string; station: string; gender: string; wordCount: number; shuffledWords: string[]; seedNumber: string; userType: 'speaker' | 'listener' }) => {
    // Store user info for potential session code changes
    setUserInfo({
      name: sessionData.name,
      testPoint: sessionData.testPoint,
      station: sessionData.station,
      gender: sessionData.gender
    });

    const newSession: OfflineSession = {
      id: Date.now().toString(),
      name: sessionData.name,
      testPoint: sessionData.testPoint,
      station: sessionData.station,
      gender: sessionData.gender,
      seedNumber: sessionData.seedNumber,
      wordCount: sessionData.wordCount,
      startTime: new Date().toISOString(),
      shuffledWords: sessionData.shuffledWords,
      responses: [],
      currentWordIndex: 0,
      repeatRequests: new Array(sessionData.shuffledWords.length).fill(false),
      sessionConfirmed: false
    };
    
    setSession(newSession);
    setUserMode(sessionData.userType);
    setCurrentView(sessionData.userType);
  };

  const handleWordNavigation = (direction: 'next' | 'previous') => {
    if (!session) return;

    const newIndex = direction === 'next' 
      ? Math.min(session.currentWordIndex + 1, session.shuffledWords.length - 1)
      : Math.max(session.currentWordIndex - 1, 0);

    setSession({ ...session, currentWordIndex: newIndex });
  };

  const handleSubmitAllResponses = (allResponses: Array<{ wordIndex: number; selectedWord: string; repeatRequested: boolean; comments: string; additionalComments: string }>) => {
    if (!session) return;

    const testResponses: TestResponse[] = allResponses.map(resp => {
      const spokenWord = session.shuffledWords[resp.wordIndex];
      return {
        wordIndex: resp.wordIndex,
        spokenWord,
        selectedWord: resp.selectedWord,
        isCorrect: resp.selectedWord === spokenWord,
        timestamp: new Date().toISOString(),
        repeatRequested: resp.repeatRequested,
        comments: resp.comments,
        additionalComments: resp.additionalComments
      };
    });

    const endTime = new Date().toISOString();
    const totalWords = testResponses.length;
    const correctAnswers = testResponses.filter(r => r.isCorrect).length;
    const incorrectAnswers = totalWords - correctAnswers;
    const accuracy = totalWords > 0 ? Math.round((correctAnswers / totalWords) * 100) : 0;
    const duration = new Date(endTime).getTime() - new Date(session.startTime).getTime();

    const results: SessionResults = {
      totalWords,
      correctAnswers,
      incorrectAnswers,
      accuracy,
      duration
    };

    const completedSession: OfflineSession = {
      ...session,
      responses: testResponses,
      endTime,
      results
    };

    setSession(completedSession);
    setCurrentView('results');
  };

  const handleNewSession = () => {
    offlineStorage.clearSession();
    setSession(null);
    setUserInfo(null);
    setCurrentView('setup');
  };

  const handleChangeSessionCode = () => {
    setSession(null);
    setCurrentView('setup');
  };

  const switchUserMode = (mode: UserMode) => {
    setUserMode(mode);
    if (session && currentView !== 'setup' && currentView !== 'results') {
      setCurrentView(mode);
    }
  };

  return (
    <div className="min-h-screen bg-ios-gray-light">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Volume2 className="text-ios-blue text-2xl" size={28} />
            <h1 className="text-2xl font-semibold text-ios-dark">Modified Rhyme Test</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Current Role Display */}
            {session && (
              <div className="flex items-center space-x-2 px-3 py-2 bg-ios-blue bg-opacity-10 rounded-lg">
                {userMode === 'speaker' ? <Volume2 size={16} className="text-ios-blue" /> : <Headphones size={16} className="text-ios-blue" />}
                <span className="text-sm text-ios-blue font-medium capitalize">
                  {userMode} Mode
                </span>
              </div>
            )}
            
            {/* Offline Status */}
            <div className="flex items-center space-x-2 px-3 py-2 bg-ios-green bg-opacity-10 rounded-lg">
              <div className="w-2 h-2 bg-ios-green rounded-full"></div>
              <span className="text-sm text-ios-green font-medium">
                {isOffline ? 'Offline Ready' : 'Online'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {currentView === 'setup' && (
          <SessionSetup onStartSession={handleStartSession} />
        )}
        
        {currentView === 'speaker' && session && (
          <SpeakerView
            session={session}
            onNavigate={handleWordNavigation}
          />
        )}
        
        {currentView === 'listener' && session && (
          <ListenerAllWords
            session={session}
            onSubmitAll={handleSubmitAllResponses}
            onChangeSessionCode={handleChangeSessionCode}
          />
        )}
        
        {currentView === 'results' && session && (
          <ResultsView
            session={session}
            onNewSession={handleNewSession}
          />
        )}
      </main>



      {/* Offline Indicator */}
      <div className="fixed bottom-6 left-6 z-40">
        <div className="bg-white rounded-lg shadow-lg p-3 border border-gray-200 flex items-center space-x-2">
          <div className="w-2 h-2 bg-ios-green rounded-full animate-pulse"></div>
          <span className="text-xs text-ios-gray">Data saved locally</span>
        </div>
      </div>
    </div>
  );
}
