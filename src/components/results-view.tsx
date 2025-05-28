import { FileSpreadsheet, File, Plus, Check, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OfflineSession, offlineStorage } from "@/lib/offline-storage";

interface ResultsViewProps {
  session: OfflineSession;
  onNewSession: () => void;
}

export default function ResultsView({ session, onNewSession }: ResultsViewProps) {
  const results = session.results;
  
  if (!results) {
    return <div>No results available</div>;
  }

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const handleExportToExcel = () => {
    offlineStorage.exportToExcel(session);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Summary Cards */}
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white rounded-xl shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-ios-blue mb-2">{results.totalWords}</div>
            <div className="text-sm text-ios-gray">Total Words</div>
          </CardContent>
        </Card>
        <Card className="bg-white rounded-xl shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-ios-green mb-2">{results.correctAnswers}</div>
            <div className="text-sm text-ios-gray">Correct</div>
          </CardContent>
        </Card>
        <Card className="bg-white rounded-xl shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-ios-red mb-2">{results.incorrectAnswers}</div>
            <div className="text-sm text-ios-gray">Incorrect</div>
          </CardContent>
        </Card>
        <Card className="bg-white rounded-xl shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-ios-blue mb-2">{results.accuracy}%</div>
            <div className="text-sm text-ios-gray">Accuracy</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Detailed Results */}
      <div className="lg:col-span-2">
        <Card className="bg-white rounded-xl shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-ios-dark">Detailed Results</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {session.responses.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-ios-gray font-medium w-8">{index + 1}.</span>
                    <span className="font-medium text-ios-dark">{result.spokenWord}</span>
                    <span className="text-ios-gray">→</span>
                    <span className="text-ios-dark">{result.selectedWord}</span>
                  </div>
                  {result.isCorrect ? (
                    <Check className="text-ios-green" size={20} />
                  ) : (
                    <X className="text-ios-red" size={20} />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Export Options */}
      <Card className="bg-white rounded-xl shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-ios-dark">Export Results</h3>
          <div className="space-y-4">
            <Button
              onClick={handleExportToExcel}
              className="w-full bg-ios-green text-white p-4 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
            >
              <FileSpreadsheet size={20} />
              <span>Export to Excel</span>
            </Button>
            
            <Button
              onClick={onNewSession}
              className="w-full bg-ios-orange text-white p-4 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus size={20} />
              <span>New Session</span>
            </Button>
          </div>
          
          {/* Session Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ios-gray">Session:</span>
                <span className="text-ios-dark">{session.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ios-gray">Date:</span>
                <span className="text-ios-dark">
                  {new Date(session.startTime).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ios-gray">Duration:</span>
                <span className="text-ios-dark">{formatDuration(results.duration)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
