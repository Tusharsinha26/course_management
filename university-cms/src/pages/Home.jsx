import { Link } from 'react-router-dom';
import { BookOpen, Users, GraduationCap, BarChart, CheckCircle, Clock, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-teal-50 to-emerald-50">
      {/* Navbar */}
      <nav className="backdrop-blur-md bg-white/70 border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <GraduationCap className="w-8 h-8 text-teal-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                University CMS
              </span>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link 
                to="/login" 
                className="px-4 py-2 text-teal-600 hover:text-teal-700 font-medium transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="px-6 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Sign Up
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 overflow-hidden">
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
            animate={{
              y: [0, 50, 0],
              x: [0, 30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-40 right-10 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
            animate={{
              y: [0, -50, 0],
              x: [0, -30, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute -bottom-20 left-1/2 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
            animate={{
              y: [0, 30, 0],
              x: [0, -40, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <motion.div 
          className="text-center relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block mb-6"
          >
            <span className="px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-semibold border border-teal-200">
              🎓 #1 University Management Platform
            </span>
          </motion.div>

          <motion.h1 
            className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Modern Course Management
            <span className="block mt-2 bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent">
              Made Simple & Powerful
            </span>
          </motion.h1>

          <motion.p 
            className="text-xl md:text-2xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Transform your educational institution with our comprehensive platform. 
            <span className="font-semibold text-teal-600"> Manage courses, track progress, </span>
            and empower students & instructors—all in one place.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link 
              to="/signup" 
              className="group px-10 py-5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl text-lg font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Get Started Free
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
            </Link>
            <a 
              href="#features" 
              className="px-10 py-5 bg-white text-teal-600 rounded-xl text-lg font-bold hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-teal-200 hover:border-teal-400"
            >
              Explore Features
            </a>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            {[
              { number: "50K+", label: "Active Students" },
              { number: "2K+", label: "Instructors" },
              { number: "500+", label: "Universities" },
              { number: "99.9%", label: "Uptime" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
                whileHover={{ y: -5, scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-2 bg-gradient-to-r from-teal-100 to-emerald-100 text-teal-700 rounded-full text-sm font-bold border border-teal-200">
              ⚡ POWERFUL FEATURES
            </span>
          </motion.div>
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Everything You Need & More
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to transform how you manage your entire institution
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <BookOpen className="w-12 h-12" />,
              title: "Course Management",
              description: "Create, update, and organize courses with ease. Track enrollment and manage course materials effortlessly.",
              gradient: "from-teal-500 to-emerald-600"
            },
            {
              icon: <Users className="w-12 h-12" />,
              title: "Student Portal",
              description: "Students can view courses, track grades, and access learning materials all in one place.",
              gradient: "from-emerald-500 to-teal-600"
            },
            {
              icon: <GraduationCap className="w-12 h-12" />,
              title: "Instructor Dashboard",
              description: "Instructors can manage classes, upload materials, and communicate with students seamlessly.",
              gradient: "from-cyan-500 to-teal-600"
            },
            {
              icon: <BarChart className="w-12 h-12" />,
              title: "Analytics & Reports",
              description: "Get insights with detailed analytics and generate comprehensive reports instantly.",
              gradient: "from-teal-500 to-cyan-600"
            },
            {
              icon: <Clock className="w-12 h-12" />,
              title: "Real-time Updates",
              description: "Stay synchronized with real-time notifications and instant updates across the platform.",
              gradient: "from-emerald-500 to-teal-600"
            },
            {
              icon: <Award className="w-12 h-12" />,
              title: "Grade Management",
              description: "Track student performance, calculate GPAs, and manage grades with our intelligent system.",
              gradient: "from-teal-500 to-emerald-600"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="group relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              <motion.div
                className="relative z-10"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`inline-block p-3 rounded-xl bg-gradient-to-br ${feature.gradient} text-white mb-4`}>
                  {feature.icon}
                </div>
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10">{feature.title}</h3>
              <p className="text-gray-600 relative z-10">{feature.description}</p>
              
              {/* Arrow indicator on hover */}
              <motion.div
                className="absolute bottom-4 right-4 text-teal-600 opacity-0 group-hover:opacity-100"
                initial={{ x: -10 }}
                whileHover={{ x: 0 }}
              >
                →
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Trusted by Educators Worldwide
          </h2>
          <p className="text-xl text-gray-600">See what universities are saying about us</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Dr. Sarah Johnson",
              role: "Dean of Computer Science",
              university: "Tech University",
              comment: "This platform has revolutionized how we manage our courses. The intuitive interface makes it easy for both instructors and students.",
              rating: 5
            },
            {
              name: "Prof. Michael Chen",
              role: "Head of Administration",
              university: "State College",
              comment: "Outstanding system! Real-time analytics help us make data-driven decisions. Highly recommend to any educational institution.",
              rating: 5
            },
            {
              name: "Dr. Emily Rodriguez",
              role: "Director of Online Learning",
              university: "Global Institute",
              comment: "The best investment we've made. Student engagement has increased significantly since we started using this platform.",
              rating: 5
            }
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">⭐</span>
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">"{testimonial.comment}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                  <div className="text-sm text-teal-600">{testimonial.university}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white/50 backdrop-blur-sm py-20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Choose University CMS?
              </h2>
              <div className="space-y-4">
                {[
                  "Role-based access control for Students, Instructors, and Admins",
                  "Secure authentication with Supabase",
                  "Modern, responsive design that works on all devices",
                  "Real-time data synchronization",
                  "Easy to use interface with minimal learning curve"
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    <p className="text-gray-700 text-lg">{benefit}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              className="bg-gradient-to-br from-teal-100 to-emerald-100 p-12 rounded-3xl"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="text-center">
                <div className="text-5xl font-bold text-teal-600 mb-2">100%</div>
                <div className="text-xl text-gray-700 mb-8">Cloud-Based Solution</div>
                <div className="text-5xl font-bold text-emerald-600 mb-2">24/7</div>
                <div className="text-xl text-gray-700 mb-8">Access Anytime</div>
                <div className="text-5xl font-bold text-teal-600 mb-2">∞</div>
                <div className="text-xl text-gray-700">Scalability</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div 
          className="relative bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 rounded-3xl p-16 text-center text-white overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>

          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block mb-6"
            >
              <span className="text-6xl">🚀</span>
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Ready to Transform Your Institution?
            </h2>
            <p className="text-2xl mb-10 opacity-90 max-w-3xl mx-auto">
              Join <span className="font-bold">500+ universities</span> already empowering their students and faculty
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/signup" 
                className="group px-12 py-5 bg-white text-teal-600 rounded-xl text-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                Start Your Free Trial
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </Link>
              <span className="text-white/80 text-sm">
                ✓ No credit card required  •  ✓ 14-day free trial
              </span>
            </div>

            {/* Trust badges */}
            <motion.div
              className="mt-12 flex flex-wrap justify-center gap-6 text-white/70 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>24/7 Support</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <GraduationCap className="w-8 h-8" />
                <span className="text-xl font-bold">University CMS</span>
              </div>
              <p className="text-gray-400">
                Modern course management system for educational institutions.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 University CMS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
