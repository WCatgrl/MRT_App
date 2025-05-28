import { useState } from "react";
import { Check, RotateCcw, RefreshCw, Edit } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OfflineSession } from "@/lib/offline-storage";
import { findRhymeGroup } from "@/lib/word-matrix";

interface ListenerAllWordsProps {
  session: OfflineSession;
  onSubmitAll: (responses: Array<{ wordIndex: number; selectedWord: string; repeatRequested: boolean; comments: string; additionalComments: string }>) => void;
  onChangeSessionCode: () => void;
}

export default function ListenerAllWords({ session, onSubmitAll, onChangeSessionCode }: ListenerAllWordsProps) {
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [repeatRequests, setRepeatRequests] = useState<Record<number, boolean>>({});
  const [comments, setComments] = useState<Record<number, string>>({});
  const [additionalComments, setAdditionalComments] = useState<Record<number, string>>({});
  const [sessionConfirmed, setSessionConfirmed] = useState(false);

  const commentOptions = [
    "Static",
    "Dropped Out", 
    "Started strong then faded",
    "Cut off",
    "Choppy",
    "Transmission stepped on"
  ];

  const handleWordSelect = (wordIndex: number, selectedWord: string) => {
    setResponses(prev => ({
      ...prev,
      [wordIndex]: selectedWord
    }));
  };

  const toggleRepeatRequest = (wordIndex: number) => {
    setRepeatRequests(prev => ({
      ...prev,
      [wordIndex]: !prev[wordIndex]
    }));
  };

  const handleCommentSelect = (wordIndex: number, comment: string) => {
    setComments(prev => ({
      ...prev,
      [wordIndex]: comment
    }));
  };

  const handleAdditionalCommentChange = (wordIndex: number, comment: string) => {
    setAdditionalComments(prev => ({
      ...prev,
      [wordIndex]: comment
    }));
  };

  const clearResponse = (wordIndex: number) => {
    setResponses(prev => {
      const newResponses = { ...prev };
      delete newResponses[wordIndex];
      return newResponses;
    });
    setRepeatRequests(prev => {
      const newRequests = { ...prev };
      delete newRequests[wordIndex];
      return newRequests;
    });
    setComments(prev => {
      const newComments = { ...prev };
      delete newComments[wordIndex];
      return newComments;
    });
    setAdditionalComments(prev => {
      const newAdditional = { ...prev };
      delete newAdditional[wordIndex];
      return newAdditional;
    });
  };

  const handleSubmit = () => {
    const finalResponses = session.shuffledWords.map((word, index) => ({
      wordIndex: index,
      selectedWord: responses[index] || '',
      repeatRequested: repeatRequests[index] || false,
      comments: comments[index] || '',
      additionalComments: additionalComments[index] || ''
    })).filter(response => response.selectedWord !== '');

    onSubmitAll(finalResponses);
  };

  const completedResponses = Object.keys(responses).length;
  const totalWords = session.shuffledWords.length;

  if (!sessionConfirmed) {
    return (
      <div className="space-y-6">
        {/* Session Confirmation */}
        <Card className="bg-ios-blue bg-opacity-10 border-ios-blue rounded-xl shadow-sm">
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-ios-blue mb-4">Confirm Session Code</h2>
              <div className="text-3xl font-bold text-ios-blue mb-4">{session.seedNumber}</div>
              <p className="text-ios-gray mb-6">
                Please confirm this is the correct session code before starting the test
              </p>
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={() => setSessionConfirmed(true)}
                  className="bg-ios-green text-white px-8 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center space-x-2"
                >
                  <Check size={16} />
                  <span>Confirmed</span>
                </Button>
                <Button
                  onClick={onChangeSessionCode}
                  className="bg-ios-orange text-white px-8 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center space-x-2"
                >
                  <Edit size={16} />
                  <span>Change Session Code</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Session Info Header */}
      <Card className="bg-ios-green bg-opacity-10 border-ios-green rounded-xl shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-ios-green font-semibold">Session Code:</div>
              <div className="text-xl font-bold text-ios-green">{session.seedNumber}</div>
            </div>
            <Button
              onClick={onChangeSessionCode}
              className="bg-ios-orange text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center space-x-2"
            >
              <Edit size={16} />
              <span>Change Code</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Progress Header */}
      <Card className="bg-white rounded-xl shadow-sm">
        <CardContent className="p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-ios-dark mb-2">Select All Words You Heard</h2>
            <p className="text-ios-gray mb-4">
              Complete all {totalWords} words - you can request repeats for words you're unsure about
            </p>
            <div className="flex items-center justify-center space-x-4">
              <div className="text-sm text-ios-gray">
                Progress: {completedResponses} of {totalWords} words
              </div>
              <div className="w-32 bg-ios-gray-light rounded-full h-2">
                <div 
                  className="bg-ios-blue h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(completedResponses / totalWords) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* All Words Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {session.shuffledWords.map((spokenWord, wordIndex) => {
          const rhymeGroup = findRhymeGroup(spokenWord);
          const selectedWord = responses[wordIndex];
          const isRepeatRequested = repeatRequests[wordIndex];

          return (
            <Card 
              key={wordIndex} 
              className={`rounded-xl shadow-sm transition-all ${
                selectedWord 
                  ? 'border-ios-green bg-ios-green bg-opacity-5' 
                  : 'border-gray-200 bg-white'
              }`}
            >
              <CardContent className="p-4">
                <div className="text-center mb-4">
                  <div className="text-lg font-semibold text-ios-dark mb-1">
                    Word {wordIndex + 1}
                  </div>
                  {selectedWord && (
                    <div className="text-sm text-ios-green font-medium">
                      Selected: {selectedWord}
                    </div>
                  )}
                </div>

                {/* Word Selection Grid */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {rhymeGroup.map(word => (
                    <button
                      key={word}
                      onClick={() => handleWordSelect(wordIndex, word)}
                      className={`p-3 border-2 rounded-lg transition-all text-sm font-medium ${
                        selectedWord === word
                          ? 'border-ios-blue bg-ios-blue bg-opacity-10 text-ios-blue'
                          : 'border-gray-200 hover:border-ios-blue hover:bg-ios-blue hover:bg-opacity-5 text-ios-dark'
                      }`}
                    >
                      {word}
                    </button>
                  ))}
                </div>

                {/* Comments Section */}
                <div className="space-y-3 mb-4">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-ios-gray">Comments</Label>
                    <Select 
                      value={comments[wordIndex] || ""} 
                      onValueChange={(value) => handleCommentSelect(wordIndex, value)}
                    >
                      <SelectTrigger className="w-full text-xs border border-gray-200 rounded-md">
                        <SelectValue placeholder="Select comment" />
                      </SelectTrigger>
                      <SelectContent>
                        {commentOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-ios-gray">Additional Comments</Label>
                    <Input
                      value={additionalComments[wordIndex] || ""}
                      onChange={(e) => handleAdditionalCommentChange(wordIndex, e.target.value)}
                      placeholder="Type additional comments..."
                      className="w-full text-xs border border-gray-200 rounded-md"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Button
                    onClick={() => toggleRepeatRequest(wordIndex)}
                    className={`flex-1 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-1 text-xs ${
                      isRepeatRequested
                        ? 'bg-ios-orange text-white hover:bg-orange-600'
                        : 'bg-ios-gray-light text-ios-gray hover:bg-gray-300'
                    }`}
                  >
                    <RefreshCw size={12} />
                    <span>{isRepeatRequested ? 'Repeat' : 'Mark for Repeat'}</span>
                  </Button>
                  <Button
                    onClick={() => clearResponse(wordIndex)}
                    className="px-3 py-2 bg-ios-gray-light text-ios-gray rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    <RotateCcw size={12} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Submit Button */}
      <Card className="bg-white rounded-xl shadow-sm sticky bottom-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-ios-gray">
              {completedResponses} of {totalWords} words completed
              {Object.keys(repeatRequests).filter(k => repeatRequests[parseInt(k)]).length > 0 && (
                <span className="ml-2 text-ios-orange">
                  ({Object.keys(repeatRequests).filter(k => repeatRequests[parseInt(k)]).length} marked for repeat)
                </span>
              )}
            </div>
            <Button
              onClick={handleSubmit}
              disabled={completedResponses === 0}
              className="bg-ios-blue text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check size={16} />
              <span>Submit All Responses</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}