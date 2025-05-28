import { useState } from "react";
import { Play, Volume2, Headphones } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateShuffledWords } from "@/lib/word-matrix";

interface SessionSetupProps {
  onStartSession: (sessionData: { name: string; testPoint: string; station: string; gender: string; wordCount: number; shuffledWords: string[]; seedNumber: string; userType: 'speaker' | 'listener' }) => void;
}

export default function SessionSetup({ onStartSession }: SessionSetupProps) {
  const [sessionName, setSessionName] = useState("");
  const [testPoint, setTestPoint] = useState("");
  const [station, setStation] = useState("");
  const [gender, setGender] = useState("");
  const [wordCount, setWordCount] = useState("50");
  const [userType, setUserType] = useState<'speaker' | 'listener'>('speaker');
  const [seedNumber, setSeedNumber] = useState("");

  const generateSeedNumber = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const handleStart = () => {
    const name = sessionName || `Session ${new Date().toLocaleDateString()}`;
    const count = wordCount === "all" ? 300 : parseInt(wordCount);
    let finalSeedNumber = seedNumber;
    
    if (userType === 'speaker' && !seedNumber) {
      finalSeedNumber = generateSeedNumber();
    }
    
    const shuffledWords = generateShuffledWords(wordCount);
    
    onStartSession({
      name,
      testPoint,
      station,
      gender,
      wordCount: count,
      shuffledWords,
      seedNumber: finalSeedNumber,
      userType
    });
  };

  return (
    <div className="mb-8">
      <Card className="bg-white rounded-xl shadow-sm">
        <CardContent className="p-8">
          <h2 className="text-xl font-semibold mb-6 text-ios-dark">Start New Session</h2>
          
          {/* User Type Selection */}
          <div className="mb-8">
            <Label className="text-sm font-medium text-ios-gray mb-4 block">I am the:</Label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setUserType('speaker')}
                className={`p-6 border-2 rounded-xl transition-all ${
                  userType === 'speaker'
                    ? 'border-ios-blue bg-ios-blue bg-opacity-10 text-ios-blue'
                    : 'border-gray-200 hover:border-ios-blue hover:bg-ios-blue hover:bg-opacity-5 text-ios-dark'
                }`}
              >
                <Volume2 size={32} className="mx-auto mb-3" />
                <div className="font-semibold text-lg">Speaker</div>
                <div className="text-sm opacity-70">I will read the words</div>
              </button>
              <button
                onClick={() => setUserType('listener')}
                className={`p-6 border-2 rounded-xl transition-all ${
                  userType === 'listener'
                    ? 'border-ios-blue bg-ios-blue bg-opacity-10 text-ios-blue'
                    : 'border-gray-200 hover:border-ios-blue hover:bg-ios-blue hover:bg-opacity-5 text-ios-dark'
                }`}
              >
                <Headphones size={32} className="mx-auto mb-3" />
                <div className="font-semibold text-lg">Listener</div>
                <div className="text-sm opacity-70">I will select what I hear</div>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="space-y-2">
              <Label htmlFor="sessionName" className="text-sm font-medium text-ios-gray">
                Name
              </Label>
              <Input
                id="sessionName"
                type="text"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                placeholder="Enter participant name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ios-blue focus:border-transparent outline-none"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="testPoint" className="text-sm font-medium text-ios-gray">
                Test Point
              </Label>
              <Input
                id="testPoint"
                type="text"
                value={testPoint}
                onChange={(e) => setTestPoint(e.target.value)}
                placeholder="Enter test point"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ios-blue focus:border-transparent outline-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="station" className="text-sm font-medium text-ios-gray">
                Station
              </Label>
              <Select value={station} onValueChange={setStation}>
                <SelectTrigger className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ios-blue focus:border-transparent">
                  <SelectValue placeholder="Select station" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aircraft">Aircraft</SelectItem>
                  <SelectItem value="ground">Ground</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender" className="text-sm font-medium text-ios-gray">
                Gender
              </Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ios-blue focus:border-transparent">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {userType === 'speaker' && (
              <div className="space-y-2">
                <Label htmlFor="wordCount" className="text-sm font-medium text-ios-gray">
                  Number of Words
                </Label>
                <Select value={wordCount} onValueChange={setWordCount}>
                  <SelectTrigger className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ios-blue focus:border-transparent">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="25">25 words</SelectItem>
                    <SelectItem value="50">50 words</SelectItem>
                    <SelectItem value="100">100 words</SelectItem>
                    <SelectItem value="all">All words (300)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="seedNumber" className="text-sm font-medium text-ios-gray">
                {userType === 'speaker' ? 'Session Code (Auto-generated)' : 'Session Code (Required)'}
              </Label>
              <Input
                id="seedNumber"
                type="text"
                value={seedNumber}
                onChange={(e) => setSeedNumber(e.target.value)}
                placeholder={userType === 'speaker' ? 'Will be generated automatically' : 'Enter code from speaker'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ios-blue focus:border-transparent outline-none"
                disabled={userType === 'speaker'}
              />
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button
              onClick={handleStart}
              disabled={userType === 'listener' && !seedNumber}
              className="bg-ios-blue text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play size={16} />
              <span>Start Session</span>
            </Button>
          </div>
          
          {userType === 'listener' && !seedNumber && (
            <p className="text-center text-sm text-ios-red mt-4">
              Please enter the session code provided by the speaker
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
