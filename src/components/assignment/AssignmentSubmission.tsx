'use client';

import { useState } from 'react';
import { Button, Textarea, Input, Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import { Assignment, AssignmentSubmission as SubmissionType } from '@/lib/types';
import { useAssignmentStore } from '@/lib/stores/assignmentStore';

interface AssignmentSubmissionProps {
  assignment: Assignment;
  existingSubmission?: SubmissionType;
  userId: string;
  onSubmissionComplete?: () => void;
}

export function AssignmentSubmission({ 
  assignment, 
  existingSubmission, 
  userId, 
  onSubmissionComplete 
}: AssignmentSubmissionProps) {
  const [submissionData, setSubmissionData] = useState({
    content: existingSubmission?.content || '',
    linkUrl: existingSubmission?.linkUrl || '',
    fileUrl: existingSubmission?.fileUrl || '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { submitAssignment } = useAssignmentStore();
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const submission = {
        assignmentId: assignment.id,
        userId,
        content: submissionData.content || undefined,
        linkUrl: submissionData.linkUrl || undefined,
        fileUrl: submissionData.fileUrl || undefined,
        status: 'submitted' as const,
      };
      
      submitAssignment(submission);
      onSubmissionComplete?.();
    } catch (error) {
      console.error('Error submitting assignment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // В реальном приложении здесь была бы загрузка на сервер
      const fakeUrl = URL.createObjectURL(file);
      setSubmissionData(prev => ({ ...prev, fileUrl: fakeUrl }));
    }
  };
  
  const getStatusBadge = (status: SubmissionType['status']) => {
    const statusConfig = {
      submitted: { variant: 'primary' as const, label: 'Отправлено' },
      reviewed: { variant: 'success' as const, label: 'Проверено' },
      needs_revision: { variant: 'warning' as const, label: 'Требует доработки' },
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };
  
  const isReadOnly = existingSubmission?.status === 'reviewed';
  const canSubmit = !isReadOnly && (
    (assignment.submissionType === 'text' && submissionData.content.trim()) ||
    (assignment.submissionType === 'link' && submissionData.linkUrl.trim()) ||
    (assignment.submissionType === 'file' && submissionData.fileUrl)
  );
  
  return (
    <div className="space-y-6">
      {/* Информация о задании */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>{assignment.title}</CardTitle>
              <p className="text-neutral-600 mt-2">{assignment.description}</p>
            </div>
            {existingSubmission && getStatusBadge(existingSubmission.status)}
          </div>
        </CardHeader>
        
        {assignment.instructions && (
          <CardContent>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Инструкции:</h4>
              <p className="text-blue-800 whitespace-pre-wrap">{assignment.instructions}</p>
            </div>
          </CardContent>
        )}
      </Card>
      
      {/* Критерии оценивания */}
      {assignment.rubric && assignment.rubric.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Критерии оценивания</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assignment.rubric.map((criterion) => (
                <div key={criterion.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div>
                    <h5 className="font-medium">{criterion.criteria}</h5>
                    <p className="text-sm text-neutral-600">{criterion.description}</p>
                  </div>
                  <span className="text-sm font-medium text-blue-600">
                    {criterion.maxPoints} баллов
                  </span>
                </div>
              ))}
              <div className="border-t pt-3 flex justify-between items-center">
                <span className="font-medium">Максимальный балл:</span>
                <span className="text-lg font-bold text-blue-600">
                  {assignment.maxScore} баллов
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Форма сдачи */}
      <Card>
        <CardHeader>
          <CardTitle>
            {existingSubmission ? 'Ваша работа' : 'Сдача задания'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {assignment.submissionType === 'text' && (
            <Textarea
              label="Ваш ответ"
              value={submissionData.content}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSubmissionData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Введите ваш ответ здесь..."
              rows={6}
              disabled={isReadOnly}
            />
          )}
          
          {assignment.submissionType === 'link' && (
            <Input
              label="Ссылка на работу"
              type="url"
              value={submissionData.linkUrl}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubmissionData(prev => ({ ...prev, linkUrl: e.target.value }))}
              placeholder="https://..."
              disabled={isReadOnly}
            />
          )}
          
          {assignment.submissionType === 'file' && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Загрузить файл
              </label>
              {!isReadOnly ? (
                <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.txt,.zip,.rar"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <span className="text-4xl mb-2">📎</span>
                    <span className="text-neutral-600">
                      Нажмите для выбора файла или перетащите сюда
                    </span>
                    <span className="text-sm text-neutral-500 mt-1">
                      PDF, DOC, TXT, ZIP (макс. 10MB)
                    </span>
                  </label>
                </div>
              ) : (
                submissionData.fileUrl && (
                  <div className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
                    <span className="text-2xl">📎</span>
                    <div>
                      <p className="font-medium">Загруженный файл</p>
                      <a
                        href={submissionData.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Скачать файл
                      </a>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
          
          {/* Информация о сроках */}
          {assignment.dueDate && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <span className="text-amber-600">⏰</span>
                <span className="text-sm">
                  Срок сдачи: {new Date(assignment.dueDate).toLocaleString('ru-RU')}
                </span>
              </div>
            </div>
          )}
          
          {/* Кнопка отправки */}
          {!isReadOnly && (
            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit || isSubmitting}
                loading={isSubmitting}
                leftIcon={<span>📤</span>}
              >
                {existingSubmission ? 'Обновить работу' : 'Сдать задание'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Обратная связь от преподавателя */}
      {existingSubmission?.feedback && (
        <Card>
          <CardHeader>
            <CardTitle>Обратная связь</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {existingSubmission.score !== undefined && (
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <span className="font-medium">Ваша оценка:</span>
                  <span className="text-xl font-bold text-green-600">
                    {existingSubmission.score} / {assignment.maxScore}
                  </span>
                </div>
              )}
              
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                <h5 className="font-medium mb-2">Комментарий преподавателя:</h5>
                <p className="text-neutral-700 whitespace-pre-wrap">
                  {existingSubmission.feedback}
                </p>
              </div>
              
              {existingSubmission.reviewedAt && (
                <p className="text-sm text-neutral-500">
                  Проверено: {new Date(existingSubmission.reviewedAt).toLocaleString('ru-RU')}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}