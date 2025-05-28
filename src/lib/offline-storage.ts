import { TestResponse, SessionResults } from "@shared/schema";

interface OfflineSession {
  id: string;
  name: string;
  testPoint: string;
  station: string;
  gender: string;
  seedNumber: string;
  wordCount: number;
  startTime: string;
  endTime?: string;
  shuffledWords: string[];
  responses: TestResponse[];
  results?: SessionResults;
  currentWordIndex: number;
  selectedWord?: string;
  repeatRequests: boolean[];
  sessionConfirmed?: boolean;
}

class OfflineStorage {
  private readonly storageKey = 'rhymeTestApp';

  saveSession(session: OfflineSession): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(session));
    } catch (error) {
      console.warn('Failed to save session to localStorage:', error);
    }
  }

  loadSession(): OfflineSession | null {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.warn('Failed to load session from localStorage:', error);
      return null;
    }
  }

  clearSession(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.warn('Failed to clear session from localStorage:', error);
    }
  }

  exportToExcel(session: OfflineSession): void {
    const headers = ['Word Index', 'Spoken Word', 'Selected Word', 'Correct', 'Repeat Requested', 'Comments', 'Additional Comments', 'Timestamp'];
    const rows = session.responses.map(response => [
      response.wordIndex + 1,
      response.spokenWord,
      response.selectedWord,
      response.isCorrect ? 'Yes' : 'No',
      response.repeatRequested ? 'Yes' : 'No',
      response.comments || '',
      response.additionalComments || '',
      new Date(response.timestamp).toLocaleString()
    ]);

    // Add summary information
    const summaryRows = [
      [''],
      ['Summary'],
      ['Session Name', session.name],
      ['Start Time', new Date(session.startTime).toLocaleString()],
      ['End Time', session.endTime ? new Date(session.endTime).toLocaleString() : 'In Progress'],
      ['Total Words', session.responses.length.toString()],
      ['Correct Answers', session.results?.correctAnswers?.toString() || '0'],
      ['Accuracy', session.results?.accuracy ? `${session.results.accuracy}%` : '0%']
    ];

    const allData = [headers, ...rows, ...summaryRows];
    const csvContent = allData.map(row => row.join(',')).join('\n');
    
    this.downloadFile(csvContent, `rhyme-test-${session.name}-${Date.now()}.csv`, 'text/csv');
  }

  private downloadFile(content: string, filename: string, contentType: string): void {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const offlineStorage = new OfflineStorage();
export type { OfflineSession };
