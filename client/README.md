# FeedbackHub Frontend

A modern, responsive React frontend for the Feedback Collection Platform built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

### **Admin Features**

- **Authentication**: Secure login/register with JWT
- **Dashboard**: Overview with form statistics and management
- **Form Builder**: Create forms with 3-5 questions (text/multiple-choice)
- **Analytics**: View response summaries and statistics
- **Export**: Download responses as CSV

### **Public Features**

- **Form Access**: Public URLs for form submission
- **Response Submission**: No registration required
- **Mobile Responsive**: Perfect on all devices

### **Technical Features**

- **Modern UI**: Beautiful, intuitive interface
- **Animations**: Smooth transitions with Framer Motion
- **Form Validation**: Comprehensive client-side validation
- **Real-time Feedback**: Toast notifications
- **Type Safety**: Full TypeScript support

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

## 📦 Installation

### Prerequisites

- Node.js (>=18)
- npm or yarn
- Backend server running (see server README)

### Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment configuration**
   Create `.env.local` in the client directory:

   ```ini
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_APP_NAME=FeedbackHub
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗 Project Structure

```bash
client/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Admin dashboard
│   ├── forms/            # Form management
│   ├── login/            # Authentication
│   ├── register/         # User registration
│   └── globals.css       # Global styles
├── components/           # Reusable components
│   ├── ui/              # Base UI components
│   └── layout/          # Layout components
├── contexts/            # React contexts
├── lib/                 # Utilities and API
└── types/               # TypeScript types
```

## 🎨 Design System

### **Color Palette**

- **Primary**: Blue gradient (#3B82F6 to #8B5CF6)
- **Secondary**: Gray scale
- **Success**: Green (#10B981)
- **Error**: Red (#EF4444)
- **Warning**: Yellow (#F59E0B)

### **Typography**

- **Font**: Inter (Google Fonts)
- **Weights**: 400, 500, 600, 700
- **Sizes**: Responsive scale

### **Components**

- **Buttons**: Multiple variants (default, outline, gradient)
- **Cards**: Consistent styling with hover effects
- **Forms**: Validated inputs with error states
- **Modals**: Overlay dialogs for actions

## 🔧 Development

### **Available Scripts**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### **Code Style**

- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js recommended config
- **Prettier**: Consistent formatting
- **Husky**: Pre-commit hooks

### **Testing**

```bash
npm test             # Run tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
```

## 📱 Responsive Design

### **Breakpoints**

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### **Features**

- **Mobile-first**: Responsive by default
- **Touch-friendly**: Optimized for mobile
- **Progressive enhancement**: Works on all devices

## 🔐 Authentication

### **Flow**

1. User registers/logs in
2. JWT token stored in localStorage
3. Token automatically attached to API requests
4. Automatic logout on token expiration

### **Protected Routes**

- `/dashboard` - Admin dashboard
- `/forms/create` - Form builder
- `/forms/[id]/responses` - Response viewer

### **Public Routes**

- `/` - Landing page
- `/login` - Login page
- `/register` - Registration page
- `/forms/[id]` - Public form view

## 📊 API Integration

### **Endpoints Used**

- **Auth**: `/api/auth/*`
- **Forms**: `/api/forms/*`
- **Responses**: `/api/forms/*/responses`

### **Error Handling**

- **Network errors**: Toast notifications
- **Validation errors**: Inline form errors
- **Auth errors**: Redirect to login

## 🎯 Key Features

### **Form Builder**

- **Dynamic questions**: Add/remove questions
- **Question types**: Text and multiple-choice
- **Validation**: Real-time form validation
- **Preview**: Live form preview

### **Dashboard**

- **Statistics**: Form and response counts
- **Quick actions**: Create, view, export forms
- **Responsive grid**: Adapts to screen size

### **Public Forms**

- **No registration**: Anyone can submit
- **Mobile optimized**: Touch-friendly interface
- **Success feedback**: Confirmation messages

## 🚀 Deployment

### **Vercel (Recommended)**

1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

### **Environment Variables**

```ini
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
NEXT_PUBLIC_APP_NAME=FeedbackHub
```

### **Build Optimization**

- **Code splitting**: Automatic route-based splitting
- **Image optimization**: Next.js Image component
- **Bundle analysis**: Built-in analyzer

## 🔧 Configuration

### **Tailwind CSS**

- **Custom colors**: Design system colors
- **Animations**: Custom keyframes
- **Utilities**: Responsive helpers

### **Next.js**

- **App Router**: Latest routing system
- **TypeScript**: Strict configuration
- **ESLint**: Next.js rules

## 📈 Performance

### **Optimizations**

- **Code splitting**: Route-based
- **Image optimization**: WebP format
- **Font loading**: Google Fonts optimization
- **Bundle size**: Tree shaking enabled

### **Metrics**

- **Lighthouse**: 90+ scores
- **Core Web Vitals**: Optimized
- **Accessibility**: WCAG compliant

## 🤝 Contributing

### **Development Workflow**

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

### **Code Standards**

- **TypeScript**: Strict mode
- **ESLint**: No warnings
- **Prettier**: Consistent formatting
- **Tests**: 80%+ coverage

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For issues and questions:

- **GitHub Issues**: Bug reports and feature requests
- **Documentation**: Comprehensive guides
- **Community**: Active development community

---
