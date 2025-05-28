import { Check, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OfflineSession } from "@/lib/offline-storage";
import { findRhymeGroup } from "@/lib/word-matrix";

interface ListenerViewProps {
  session: OfflineSession;
  onWordSelect: (word: string) => void;
  onConfirm: () => void;
  onClear: () => void;
}

export default function ListenerView({ session, onWordSelect, onConfirm, onClear }: ListenerViewProps) {
  const currentWord = session.shuffledWords[session.currentWordIndex];
  const rhymeGroup = findRhymeGroup(currentWord);

  return (
    <div>
      <Card className="bg-white rounded-xl shadow-sm">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-ios-dark mb-2">Select the word you heard</h3>
            <p className="text-ios-gray">Choose from the options below</p>
          </div>
          
          {/* Word Selection Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {rhymeGroup.map(word => (
              <button
                key={word}
                onClick={() => onWordSelect(word)}
                className={`p-6 border-2 rounded-xl transition-all text-lg font-medium ${
                  session.selectedWord === word
                    ? 'border-ios-blue bg-ios-blue bg-opacity-10 text-ios-blue'
                    : 'border-gray-200 hover:border-ios-blue hover:bg-ios-blue hover:bg-opacity-5 text-ios-dark'
                }`}
              >
                {word}
              </button>
            ))}
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button
              onClick={onClear}
              className="bg-ios-gray text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors flex items-center space-x-2"
            >
              <RotateCcw size={16} />
              <span>Clear</span>
            </Button>
            <Button
              onClick={onConfirm}
              disabled={!session.selectedWord}
              className="bg-ios-green text-white px-8 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check size={16} />
              <span>Confirm</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Response Status */}
      {session.responses.length > 0 && (
        <Card className="mt-6 bg-white rounded-xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-ios-green rounded-full"></div>
                <span className="font-medium text-ios-dark">
                  {session.responses.length} Response{session.responses.length !== 1 ? 's' : ''} Recorded
                </span>
              </div>
              <span className="text-sm text-ios-gray">
                Word {session.currentWordIndex + 1} of {session.shuffledWords.length}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
