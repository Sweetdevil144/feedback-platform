'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { formAPI } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  ArrowLeft,
  FileText,
  Users,
  Calendar,
  Download,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface FormResponse {
  _id: string;
  answers: Array<{
    questionIndex: number;
    answer: string;
  }>;
  submittedAt: string;
}

interface Form {
  _id: string;
  title: string;
  publicId: string;
  questions: Array<{
    questionText: string;
    type: 'text' | 'multiple-choice';
    options?: string[];
  }>;
  responses: FormResponse[];
  createdAt: string;
}

const FormResponsesPage: React.FC = () => {
  const params = useParams();
  const formId = params.formId as string;
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFormResponses();
  }, [formId]);

  const fetchFormResponses = async () => {
    try {
      const response = await formAPI.getFormResponses(formId);
      setForm(response.form);
    } catch (error) {
      toast.error('Failed to fetch form responses');
    } finally {
      setLoading(false);
    }
  };

  const exportResponses = async () => {
    try {
      const blob = await formAPI.exportFormResponses(formId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${form?.title}_responses.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Responses exported successfully!');
    } catch (error) {
      toast.error('Failed to export responses');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="text-center">
          <CardContent className="pt-6">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Form Not Found</h2>
            <p className="text-gray-600">The form you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
            
            <Button
              variant="gradient"
              onClick={exportResponses}
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </Button>
          </div>
          
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-6 h-6" />
                <span>{form.title}</span>
              </CardTitle>
              <CardDescription className="text-blue-100">
                {form.questions?.length || 0} questions • {form.responses?.length || 0} responses
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Responses */}
        {!form.responses || form.responses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center py-12"
          >
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No responses yet</h3>
            <p className="text-gray-600">Share your form to start collecting responses</p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {form.responses.map((response, responseIndex) => (
              <motion.div
                key={`${response._id}-${responseIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: responseIndex * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        <span>Response #{responseIndex + 1}</span>
                      </CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(response.submittedAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {response.answers.map((answer, answerIndex) => {
                        const question = form.questions[answer.questionIndex];
                        return (
                          <div key={answerIndex} className="border-l-4 border-blue-500 pl-4">
                            <h4 className="font-medium text-gray-900 mb-2">
                              {question?.questionText || `Question ${answer.questionIndex + 1}`}
                            </h4>
                            <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                              {answer.answer}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormResponsesPage; 