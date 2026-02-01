'use client';

import { useState } from 'react';
import { useAssignmentStore } from '@/lib/stores/assignmentStore';
import { Assignment, AssignmentSubmission } from '@/lib/types';
import { Button, Input, Textarea, Card, Badge } from '@/components/ui';
import { strings } from '@/lib/strings.ru';

interface AssignmentReviewProps {
  assignment: Assignment;
  users: { id: string; name: string; avatar?: string }[];
}

export function AssignmentReview({ assignment, users }: AssignmentReviewProps) {
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const [grade, setGrade] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const { getSubmissionsByAssignment, gradeSubmission } = useAssignmentStore();

  const submissions = getSubmissionsByAssignment(assignment.id);
  const selectedSubmission = submissions.find(s => s.id === selectedSubmissionId);

  const handleSelectSubmission = (id: string) => {
    setSelectedSubmissionId(id);
    const submission = submissions.find(s => s.id === id);
    if (submission) {
      setGrade(submission.score?.toString() || '');
      setFeedback(submission.feedback || '');
    }
  };

  const handleGrade = () => {
    if (!selectedSubmissionId) return;
    
    const score = parseFloat(grade);
    if (isNaN(score)) return;

    gradeSubmission(selectedSubmissionId, score, feedback);
  };

  const getUser = (userId: string) => users.find(u => u.id === userId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
      {/* Submissions List */}
      <Card className="col-span-1 overflow-hidden flex flex-col">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="font-semibold text-gray-700">{strings.students} ({submissions.length})</h3>
        </div>
        <div className="overflow-y-auto flex-1 p-2 space-y-2">
          {submissions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Нет решений</p>
          ) : (
            submissions.map(submission => {
              const user = getUser(submission.userId);
              return (
                <div
                  key={submission.id}
                  onClick={() => handleSelectSubmission(submission.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                    selectedSubmissionId === submission.id
                      ? 'bg-blue-50 border-blue-200'
                      : 'hover:bg-gray-50 border-transparent'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-gray-900">{user?.name || 'Unknown User'}</span>
                    <Badge variant={
                      submission.status === 'reviewed' ? 'success' :
                      submission.status === 'needs_revision' ? 'warning' : 'primary'
                    }>
                      {submission.status === 'reviewed' ? strings.reviewed :
                       submission.status === 'needs_revision' ? strings.needsRevision : strings.submitted}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(submission.submittedAt).toLocaleDateString()}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Review Area */}
      <Card className="col-span-1 md:col-span-2 flex flex-col">
        {selectedSubmission ? (
          <div className="flex flex-col h-full">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{strings.assignmentSubmission}</h2>
                <div className="text-sm text-gray-500">
                  {new Date(selectedSubmission.submittedAt).toLocaleString()}
                </div>
              </div>

              {/* Submission Content */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                {selectedSubmission.content && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">{strings.yourAnswer}</h4>
                    <p className="whitespace-pre-wrap text-gray-800">{selectedSubmission.content}</p>
                  </div>
                )}
                
                {selectedSubmission.linkUrl && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Ссылка</h4>
                    <a href={selectedSubmission.linkUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {selectedSubmission.linkUrl}
                    </a>
                  </div>
                )}

                {selectedSubmission.fileUrl && (
                  <div>
                     <h4 className="text-sm font-semibold text-gray-700 mb-2">Файл</h4>
                     <a href={selectedSubmission.fileUrl} download className="text-blue-600 hover:underline flex items-center">
                       📎 Скачать файл
                     </a>
                  </div>
                )}
              </div>
            </div>

            {/* Grading Form */}
            <div className="p-6 bg-white flex-1 overflow-y-auto">
              <h3 className="font-semibold text-lg mb-4">Оценка и отзыв</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {strings.score} (max {assignment.maxScore})
                  </label>
                  <Input
                    type="number"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    placeholder="0"
                    max={assignment.maxScore}
                    className="w-32"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {strings.feedback}
                  </label>
                  <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Напишите комментарий..."
                    rows={4}
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <Button onClick={handleGrade} disabled={!grade}>
                    Сохранить оценку
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <span className="text-4xl mb-4">📝</span>
            <p>Выберите работу для проверки</p>
          </div>
        )}
      </Card>
    </div>
  );
}
