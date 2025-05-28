import { ChevronLeft, ChevronRight, Copy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OfflineSession } from "@/lib/offline-storage";
import { findRhymeGroup } from "@/lib/word-matrix";
import { useToast } from "@/hooks/use-toast";

interface SpeakerViewProps {
  session: OfflineSession;
  onNavigate: (direction: 'next' | 'previous') => void;
}

export default function SpeakerView({ session, onNavigate }: SpeakerViewProps) {
  const { toast } = useToast();
  const currentWord = session.shuffledWords[session.currentWordIndex];
  const rhymeGroup = findRhymeGroup(currentWord);
  const progress = ((session.currentWordIndex + 1) / session.shuffledWords.length) * 100;

  const copySessionCode = () => {
    navigator.clipboard.writeText(session.seedNumber);
    toast({
      title: "Session code copied!",
      description: "Share this code with the listener",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Session Code Card */}
      <div className="lg:col-span-3 mb-4">
        <Card className="bg-ios-blue bg-opacity-10 border-ios-blue rounded-xl shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-ios-blue font-semibold">Session Code:</div>
                <div className="text-2xl font-bold text-ios-blue">{session.seedNumber}</div>
              </div>
              <Button
                onClick={copySessionCode}
                className="bg-ios-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center space-x-2"
              >
                <Copy size={16} />
                <span>Copy</span>
              </Button>
            </div>
            <div className="text-sm text-ios-blue opacity-80 mt-2">
              Share this code with the listener to sync the session
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Word Display */}
      <div className="lg:col-span-2">
        <Card className="bg-white rounded-xl shadow-sm mb-6">
          <CardContent className="p-8">
            <div className="text-center">
              <h3 className="text-lg font-medium text-ios-gray mb-4">
                Number {session.currentWordIndex + 1} mark the word
              </h3>
              <div className="text-6xl font-bold text-ios-blue mb-6">{currentWord}</div>
              <h3 className="text-lg font-medium text-ios-gray mb-8">now</h3>
              
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={() => onNavigate('previous')}
                  disabled={session.currentWordIndex === 0}
                  className="bg-ios-gray text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} className="mr-2" />
                  Previous
                </Button>
                <Button
                  onClick={() => onNavigate('next')}
                  disabled={session.currentWordIndex >= session.shuffledWords.length - 1}
                  className="bg-ios-blue text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rhyme Group Display */}
        <Card className="bg-white rounded-xl shadow-sm mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-ios-dark">Word List</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {rhymeGroup.map((word, index) => (
                <div
                  key={index}
                  className={`p-3 text-center rounded-lg font-medium ${
                    word === currentWord
                      ? 'bg-ios-blue text-white'
                      : 'bg-ios-gray-light text-ios-dark'
                  }`}
                >
                  {word}
                </div>
              ))}
            </div>
            <p className="text-sm text-ios-gray mt-4 text-center">
              These words help with pronunciation - they all rhyme together
            </p>
          </CardContent>
        </Card>
        
        {/* Progress Bar */}
        <Card className="bg-white rounded-xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-ios-gray">Session Progress</span>
              <span className="text-sm text-ios-gray">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-ios-gray-light rounded-full h-2">
              <div 
                className="bg-ios-blue h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Word List Sidebar */}
      <Card className="bg-white rounded-xl shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-ios-dark">Word Sequence</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {session.shuffledWords.map((word, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                  index === session.currentWordIndex
                    ? 'bg-ios-gray-light'
                    : 'hover:bg-ios-gray-light'
                }`}
              >
                <span className={`font-medium ${
                  index === session.currentWordIndex ? 'text-ios-dark' : 'text-ios-gray'
                }`}>
                  {word}
                </span>
                <span className={`text-xs px-2 py-1 rounded ${
                  index === session.currentWordIndex
                    ? 'text-ios-gray bg-white'
                    : 'text-ios-gray'
                }`}>
                  {index + 1}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
