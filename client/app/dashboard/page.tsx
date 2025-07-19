'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { formAPI } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  Plus, 
  BarChart3, 
  FileText, 
  Users, 
  TrendingUp, 
  Copy,
  ExternalLink,
  Download,
  Eye
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

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalForms: 0,
    totalResponses: 0,
    averageResponses: 0,
  });

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await formAPI.getAllForms();
      const formsData = response.forms || [];
      setForms(formsData);
      
      // Calculate stats with null checks
      const totalResponses = formsData.reduce((acc: number, form: Form) => {
        return acc + (form.responses?.length || 0);
      }, 0);
      const averageResponses = formsData.length > 0 ? totalResponses / formsData.length : 0;
      
      setStats({
        totalForms: formsData.length,
        totalResponses,
        averageResponses: Math.round(averageResponses * 10) / 10,
      });
    } catch (error) {
      toast.error('Failed to fetch forms');
    } finally {
      setLoading(false);
    }
  };

  const copyFormLink = async (publicId: string) => {
    const link = `${window.location.origin}/forms/${publicId}`;
    try {
      await navigator.clipboard.writeText(link);
      toast.success('Form link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const exportFormResponses = async (formId: string, title: string) => {
    try {
      const blob = await formAPI.exportFormResponses(formId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title}_responses.csv`;
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
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">
            Manage your feedback forms and view responses
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
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
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-between items-center mb-6"
        >
          <h2 className="text-2xl font-semibold text-gray-900">Your Forms</h2>
          <Link href="/forms/create">
            <Button variant="gradient" className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Create New Form</span>
            </Button>
          </Link>
        </motion.div>

        {/* Forms Grid */}
        {!forms || forms.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-12"
          >
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No forms yet</h3>
            <p className="text-gray-600 mb-6">Create your first feedback form to start collecting responses</p>
            <Link href="/forms/create">
              <Button variant="gradient" size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Form
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form, index) => (
              <motion.div
                key={form._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{form.title}</CardTitle>
                    <CardDescription>
                      {form.questions?.length || 0} questions • {form.responses?.length || 0} responses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Created</span>
                        <span>{new Date(form.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyFormLink(form.publicId)}
                          className="flex items-center space-x-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy Link</span>
                        </Button>
                        
                        <Link href={`/forms/${form.publicId}`} target="_blank">
                          <Button variant="outline" size="sm" className="flex items-center space-x-1">
                            <ExternalLink className="w-3 h-3" />
                            <span>View</span>
                          </Button>
                        </Link>
                        
                        <Link href={`/forms/${form.publicId}/responses`}>
                          <Button variant="outline" size="sm" className="flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>Responses</span>
                          </Button>
                        </Link>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => exportFormResponses(form.publicId, form.title)}
                          className="flex items-center space-x-1"
                        >
                          <Download className="w-3 h-3" />
                          <span>Export</span>
                        </Button>
                      </div>
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

export default DashboardPage; 