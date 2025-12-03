import { useState } from 'react';
import { leadsAPI } from '../services/api';
import { 
  CheckCircle, 
  Mail, 
  Phone, 
  User, 
  MessageSquare,
  Sparkles,
  TrendingUp,
  Users,
  Shield
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';

const LandingPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    source: 'landing-page' // Track where this lead came from
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    // Phone is optional but validate if provided
    if (formData.phone && formData.phone.length < 10) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setLoading(true);
    try {
      await leadsAPI.create(formData);
      setSubmitted(true);
      toast.success('Thank you! We\'ll get back to you soon.');
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          source: 'landing-page'
        });
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(message);
      console.error('Error submitting lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Sparkles,
      title: 'Premium Quality',
      description: 'Get the best service tailored to your needs'
    },
    {
      icon: TrendingUp,
      title: 'Proven Results',
      description: 'Join thousands of satisfied customers'
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Work with industry professionals'
    },
    {
      icon: Shield,
      title: 'Secure & Trusted',
      description: 'Your data is safe with us'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="text-center lg:text-left animate-fade-in">
              <div className="inline-flex items-center px-4 py-2 bg-primary-100 rounded-full mb-6">
                <Sparkles className="w-5 h-5 text-primary-600 mr-2" />
                <span className="text-sm font-semibold text-primary-700">
                  Limited Time Offer
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Transform Your Business
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800">
                  Starting Today
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                Join thousands of successful businesses that trust us to deliver exceptional results. 
                Get started with a free consultation today.
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {feature.title}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  No Credit Card Required
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Free Consultation
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="animate-slide-up">
              <Card className="shadow-2xl">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      Thank You!
                    </h3>
                    <p className="text-gray-600 mb-6">
                      We've received your information and will contact you shortly.
                    </p>
                    <div className="inline-flex items-center justify-center space-x-2 text-sm text-gray-500">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Redirecting...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Get Started Free
                      </h2>
                      <p className="text-gray-600">
                        Fill out the form below and we'll reach out within 24 hours
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="name"
                            placeholder="Your Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={loading}
                            className={`
                              w-full pl-11 pr-4 py-3 border rounded-lg
                              focus:outline-none focus:ring-2 focus:ring-primary-500
                              disabled:bg-gray-100 disabled:cursor-not-allowed
                              ${errors.name ? 'border-red-500' : 'border-gray-300'}
                            `}
                          />
                        </div>
                        {errors.name && (
                          <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>
                        )}
                      </div>

                      <div>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            name="email"
                            placeholder="your.email@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={loading}
                            className={`
                              w-full pl-11 pr-4 py-3 border rounded-lg
                              focus:outline-none focus:ring-2 focus:ring-primary-500
                              disabled:bg-gray-100 disabled:cursor-not-allowed
                              ${errors.email ? 'border-red-500' : 'border-gray-300'}
                            `}
                          />
                        </div>
                        {errors.email && (
                          <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>
                        )}
                      </div>

                      <div>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            name="phone"
                            placeholder="(123) 456-7890 (Optional)"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={loading}
                            className={`
                              w-full pl-11 pr-4 py-3 border rounded-lg
                              focus:outline-none focus:ring-2 focus:ring-primary-500
                              disabled:bg-gray-100 disabled:cursor-not-allowed
                              ${errors.phone ? 'border-red-500' : 'border-gray-300'}
                            `}
                          />
                        </div>
                        {errors.phone && (
                          <p className="mt-1.5 text-sm text-red-600">{errors.phone}</p>
                        )}
                      </div>

                      <div>
                        <div className="relative">
                          <MessageSquare className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                          <textarea
                            name="message"
                            rows="4"
                            placeholder="Tell us about your project or needs... (Optional)"
                            value={formData.message}
                            onChange={handleChange}
                            disabled={loading}
                            className={`
                              w-full pl-11 pr-4 py-3 border rounded-lg
                              focus:outline-none focus:ring-2 focus:ring-primary-500
                              disabled:bg-gray-100 disabled:cursor-not-allowed
                              resize-none
                              ${errors.message ? 'border-red-500' : 'border-gray-300'}
                            `}
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="w-full"
                        loading={loading}
                      >
                        Get My Free Consultation
                      </Button>

                      <p className="text-xs text-center text-gray-500">
                        By submitting this form, you agree to our Terms of Service and Privacy Policy
                      </p>
                    </form>
                  </>
                )}
              </Card>

              {/* Additional Trust Badge */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 flex items-center justify-center">
                  <Shield className="w-4 h-4 mr-2 text-green-600" />
                  Your information is secure and will never be shared
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-primary-200 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-primary-300 rounded-full filter blur-3xl opacity-20"></div>
      </section>

      {/* Social Proof Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by Industry Leaders
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have transformed their business with our services
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex items-center justify-center">
                <div className="w-32 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 font-semibold">Logo {num}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-2">LeadManager</h2>
          <p className="text-gray-400 mb-6">
            Transforming businesses one lead at a time
          </p>
          <div className="flex justify-center space-x-6 mb-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Contact Us
            </a>
            <a href="/login" className="text-gray-400 hover:text-white transition-colors">
              Admin Login
            </a>
          </div>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} LeadManager. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;