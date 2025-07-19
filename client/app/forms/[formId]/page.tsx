'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { formAPI } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  CheckCircle, 
  FileText, 
  Send,
  ArrowLeft,
  CheckSquare,
  Type
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Form {
  id: string;
  title: string;
  questions: Array<{
    questionText: string;
    type: 'text' | 'multiple-choice';
    options?: string[];
  }>;
  responsesCount: number;
}

interface FormData {
  [key: string]: string;
}

const FormViewPage: React.FC = () => {
  const params = useParams();
  const formId = params.formId as string;
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchForm();
  }, [formId]);

  const fetchForm = async () => {
    try {
      const response = await formAPI.getFormById(formId);
      setForm(response.form);
    } catch (error) {
      toast.error('Form not found');
    } finally {
      setLoading(false);
    }
  };

  const ResponseForm = () => {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
      setSubmitting(true);
      try {
        const answers = Object.keys(data).map((key, index) => ({
          questionIndex: index,
          answer: data[key],
        }));

        await formAPI.submitResponse(formId, { answers });
        setSubmitted(true);
        toast.success('Response submitted successfully!');
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        toast.error(err.message || 'Failed to submit response');
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {form?.questions.map((question, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {question.type === 'multiple-choice' ? (
                    <CheckSquare className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Type className="w-5 h-5 text-green-600" />
                  )}
                  <span>Question {index + 1}</span>
                </CardTitle>
                <CardDescription>{question.questionText}</CardDescription>
              </CardHeader>
              <CardContent>
                {question.type === 'multiple-choice' ? (
                  <div className="space-y-3">
                    {question.options?.map((option, optionIndex) => (
                      <label key={optionIndex} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          value={option}
                          {...register(`answer_${index}`, { required: 'Please select an option' })}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <Input
                    {...register(`answer_${index}`, { required: 'Please provide an answer' })}
                    placeholder="Type your answer here..."
                    className="w-full"
                  />
                )}
                {errors[`answer_${index}`] && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors[`answer_${index}`]?.message as string}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-end"
        >
          <Button
            type="submit"
            variant="gradient"
            size="lg"
            disabled={submitting}
            className="flex items-center space-x-2"
          >
            {submitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Submit Response</span>
              </>
            )}
          </Button>
        </motion.div>
      </form>
    );
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

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="text-center">
            <CardContent className="pt-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
              >
                <CheckCircle className="w-8 h-8 text-green-600" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
              <p className="text-gray-600 mb-6">
                Your response has been submitted successfully. We appreciate your feedback!
              </p>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Submit Another Response</span>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
          </div>
          
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-6 h-6" />
                <span>{form.title}</span>
              </CardTitle>
              <CardDescription className="text-blue-100">
                {form.questions.length} questions • {form.responsesCount} responses
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ResponseForm />
        </motion.div>
      </div>
    </div>
  );
};

export default FormViewPage; 