'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { formAPI } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  FileText, 
  CheckSquare, 
  Type,
  ArrowLeft,
  Save
} from 'lucide-react';
import toast from 'react-hot-toast';

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  questions: z.array(z.object({
    questionText: z.string().min(5, 'Question must be at least 5 characters'),
    type: z.enum(['text', 'multiple-choice']),
    options: z.array(z.string()).optional(),
  })).min(3, 'At least 3 questions required').max(5, 'Maximum 5 questions allowed'),
});

type FormData = z.infer<typeof formSchema>;

const CreateFormPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      questions: [
        {
          questionText: '',
          type: 'text',
          options: [],
        },
        {
          questionText: '',
          type: 'multiple-choice',
          options: ['Option 1', 'Option 2'],
        },
        {
          questionText: '',
          type: 'text',
          options: [],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const watchedQuestions = watch('questions');

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await formAPI.createForm(data);
      toast.success('Form created successfully!');
      router.push('/dashboard');
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      toast.error(err.message || 'Failed to create form');
    } finally {
      setIsLoading(false);
    }
  };

  const addQuestion = () => {
    if (fields.length < 5) {
      append({
        questionText: '',
        type: 'text',
        options: [],
      });
    } else {
      toast.error('Maximum 5 questions allowed');
    }
  };

  const removeQuestion = (index: number) => {
    if (fields.length > 3) {
      remove(index);
    } else {
      toast.error('Minimum 3 questions required');
    }
  };

  const addOption = (questionIndex: number) => {
    const currentOptions = watchedQuestions[questionIndex]?.options || [];
    const newOptions = [...currentOptions, `Option ${currentOptions.length + 1}`];
    setValue(`questions.${questionIndex}.options`, newOptions);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const currentOptions = watchedQuestions[questionIndex]?.options || [];
    if (currentOptions.length > 2) {
      const newOptions = currentOptions.filter((_, index) => index !== optionIndex);
      setValue(`questions.${questionIndex}.options`, newOptions);
    } else {
      toast.error('Minimum 2 options required for multiple-choice questions');
    }
  };

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
              onClick={() => router.back()}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Form</h1>
          <p className="text-gray-600">
            Build a custom feedback form with 3-5 questions
          </p>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Form Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Form Details</span>
                </CardTitle>
                <CardDescription>
                  Give your form a clear, descriptive title
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Form Title
                  </label>
                  <Input
                    {...register('title')}
                    placeholder="e.g., Customer Satisfaction Survey"
                    className="w-full"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Questions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
              <Button
                type="button"
                variant="outline"
                onClick={addQuestion}
                disabled={fields.length >= 5}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Question</span>
              </Button>
            </div>

            <AnimatePresence>
              {fields.map((field, index) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-2">
                          <GripVertical className="w-4 h-4 text-gray-400" />
                          <span>Question {index + 1}</span>
                        </CardTitle>
                        {fields.length > 3 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeQuestion(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Question Text */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Question Text
                        </label>
                        <Input
                          {...register(`questions.${index}.questionText`)}
                          placeholder="Enter your question"
                          className="w-full"
                        />
                        {errors.questions?.[index]?.questionText && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.questions[index]?.questionText?.message}
                          </p>
                        )}
                      </div>

                      {/* Question Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Question Type
                        </label>
                        <div className="flex space-x-4">
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              value="text"
                              {...register(`questions.${index}.type`)}
                              className="text-blue-600"
                            />
                            <span className="flex items-center space-x-1">
                              <Type className="w-4 h-4" />
                              <span>Text</span>
                            </span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              value="multiple-choice"
                              {...register(`questions.${index}.type`)}
                              className="text-blue-600"
                            />
                            <span className="flex items-center space-x-1">
                              <CheckSquare className="w-4 h-4" />
                              <span>Multiple Choice</span>
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* Multiple Choice Options */}
                      {watchedQuestions[index]?.type === 'multiple-choice' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-700">
                              Options
                            </label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addOption(index)}
                              className="flex items-center space-x-1"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add Option</span>
                            </Button>
                          </div>
                          
                          <div className="space-y-2">
                            {watchedQuestions[index]?.options?.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center space-x-2">
                                <Input
                                  {...register(`questions.${index}.options.${optionIndex}`)}
                                  placeholder={`Option ${optionIndex + 1}`}
                                  className="flex-1"
                                />
                                {watchedQuestions[index]?.options && watchedQuestions[index].options.length > 2 && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeOption(index, optionIndex)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex justify-end"
          >
            <Button
              type="submit"
              variant="gradient"
              size="lg"
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Create Form</span>
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default CreateFormPage; 