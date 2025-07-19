'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { formAPI } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText,
  Calendar,
  Activity
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Form {
  _id: string;
  title: string;
  publicId: string;
  questions: Array<{
    questionText: string;
    type: 'text' | 'multiple-choice';
    options?: string[];
  }>;
  responses: Array<{
    answers: Array<{
      questionIndex: number;
      answer: string;
    }>;
    submittedAt: string;
  }>;
  createdAt: string;
}

const AnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalForms: 0,
    totalResponses: 0,
    averageResponses: 0,
    totalQuestions: 0,
    thisMonthResponses: 0,
    thisWeekResponses: 0,
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await formAPI.getAllForms();
      const formsData = response.forms || [];
      setForms(formsData);
      
      // Calculate comprehensive stats
      const totalResponses = formsData.reduce((acc: number, form: Form) => {
        return acc + (form.responses?.length || 0);
      }, 0);
      
      const totalQuestions = formsData.reduce((acc: number, form: Form) => {
        return acc + (form.questions?.length || 0);
      }, 0);
      
      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const thisMonthResponses = formsData.reduce((acc: number, form: Form) => {
        const monthResponses = form.responses?.filter(response => 
          new Date(response.submittedAt) >= thisMonth
        ) || [];
        return acc + monthResponses.length;
      }, 0);
      
      const thisWeekResponses = formsData.reduce((acc: number, form: Form) => {
        const weekResponses = form.responses?.filter(response => 
          new Date(response.submittedAt) >= thisWeek
        ) || [];
        return acc + weekResponses.length;
      }, 0);
      
      const averageResponses = formsData.length > 0 ? totalResponses / formsData.length : 0;
      
      setStats({
        totalForms: formsData.length,
        totalResponses,
        averageResponses: Math.round(averageResponses * 10) / 10,
        totalQuestions,
        thisMonthResponses,
        thisWeekResponses,
      });
    } catch (error) {
      toast.error('Failed to fetch analytics');
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Analytics Dashboard 📊
          </h1>
          <p className="text-gray-600">
            Comprehensive insights into your feedback collection performance
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Forms</p>
                  <p className="text-3xl font-bold">{stats.totalForms}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Total Responses</p>
                  <p className="text-3xl font-bold">{stats.totalResponses}</p>
                </div>
                <Users className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Avg. Responses</p>
                  <p className="text-3xl font-bold">{stats.averageResponses}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Total Questions</p>
                  <p className="text-3xl font-bold">{stats.totalQuestions}</p>
                </div>
                <Activity className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-pink-500 to-pink-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100">This Month</p>
                  <p className="text-3xl font-bold">{stats.thisMonthResponses}</p>
                </div>
                <Calendar className="w-8 h-8 text-pink-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100">This Week</p>
                  <p className="text-3xl font-bold">{stats.thisWeekResponses}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-indigo-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Performing Forms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Top Performing Forms</h2>
          {forms.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No forms yet</h3>
                  <p className="text-gray-600">Create your first form to see analytics</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {forms
                .sort((a, b) => (b.responses?.length || 0) - (a.responses?.length || 0))
                .slice(0, 6)
                .map((form, index) => (
                  <motion.div
                    key={form._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle className="text-lg">{form.title}</CardTitle>
                        <CardDescription>
                          {form.questions?.length || 0} questions • {form.responses?.length || 0} responses
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>Created</span>
                            <span>{new Date(form.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${Math.min((form.responses?.length || 0) / Math.max(stats.totalResponses, 1) * 100, 100)}%` 
                              }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsPage; 