
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plane, Calendar, Users, Bell, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="container max-w-screen-xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-600 rounded-full shadow-lg">
              <Plane className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Aviation Crew Portal
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Streamline duty assignments and enable seamless crew schedule swapping for aviation professionals
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
              onClick={() => router.push('/login')}
            >
              Sign In
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-3"
              onClick={() => router.push('/register')}
            >
              Create Account
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="text-center">
              <div className="mx-auto p-3 bg-blue-100 rounded-full w-fit mb-4">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Duty Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-600">
                View and manage your assigned flight duties with complete flight information including times, locations, and flight numbers.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="text-center">
              <div className="mx-auto p-3 bg-green-100 rounded-full w-fit mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Crew Swapping</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-600">
                Request duty swaps with other crew members. Send requests and manage approvals seamlessly through our intuitive interface.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="text-center">
              <div className="mx-auto p-3 bg-purple-100 rounded-full w-fit mb-4">
                <Bell className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-600">
                Stay informed about swap requests, approvals, and schedule changes with real-time notifications and updates.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Roles Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Designed for All Aviation Roles
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { role: 'Captain', description: 'Flight commanders managing pilot schedules' },
              { role: 'First Officer', description: 'Co-pilots coordinating duty assignments' },
              { role: 'Purser', description: 'Senior cabin crew managing service duties' },
              { role: 'Cabin Attendant', description: 'Flight attendants handling passenger service' }
            ].map((item, index) => (
              <div key={index} className="text-center p-4">
                <div className="p-3 bg-blue-50 rounded-full w-fit mx-auto mb-3">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.role}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container max-w-screen-xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Plane className="w-6 h-6" />
            <span className="text-lg font-semibold">Aviation Crew Portal</span>
          </div>
          <p className="text-gray-400">
            Professional duty management for aviation crews
          </p>
        </div>
      </footer>
    </div>
  );
}

function User({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      height="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
