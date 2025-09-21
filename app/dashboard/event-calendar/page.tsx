"use client"

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { withAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, ChevronLeft, ChevronRight, Plus, Filter, Search, Eye, Edit, Trash2, MapPin, Clock, Users, DollarSign, Calendar as CalendarIcon, List, Grid, Settings } from 'lucide-react'

function EventCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')

  // Mock events data
  const events = [
    {
      id: 1,
      title: 'Rwanda Premier League - APR vs Rayon Sports',
      date: '2024-03-25',
      time: '15:00',
      venue: 'Amahoro Stadium',
      category: 'Football',
      status: 'upcoming',
      capacity: 30000,
      sold: 25000,
      price: 5000,
      description: 'Elite derby match between APR and Rayon Sports',
      color: 'bg-blue-500'
    },
    {
      id: 2,
      title: 'Basketball Championship Final',
      date: '2024-03-26',
      time: '18:00',
      venue: 'Kigali Arena',
      category: 'Basketball',
      status: 'upcoming',
      capacity: 5000,
      sold: 3200,
      price: 3000,
      description: 'Championship final match',
      color: 'bg-orange-500'
    },
    {
      id: 3,
      title: 'Volleyball Tournament',
      date: '2024-03-27',
      time: '14:00',
      venue: 'Intare Conference Arena',
      category: 'Volleyball',
      status: 'ongoing',
      capacity: 2000,
      sold: 1800,
      price: 2000,
      description: 'Regional volleyball tournament',
      color: 'bg-green-500'
    },
    {
      id: 4,
      title: 'Tennis Championship',
      date: '2024-03-28',
      time: '10:00',
      venue: 'Kigali Tennis Club',
      category: 'Tennis',
      status: 'upcoming',
      capacity: 1000,
      sold: 750,
      price: 4000,
      description: 'National tennis championship',
      color: 'bg-purple-500'
    },
    {
      id: 5,
      title: 'Athletics Meet',
      date: '2024-03-29',
      time: '08:00',
      venue: 'Huye Stadium',
      category: 'Athletics',
      status: 'completed',
      capacity: 15000,
      sold: 12000,
      price: 1500,
      description: 'Regional athletics competition',
      color: 'bg-red-500'
    },
    {
      id: 6,
      title: 'Swimming Competition',
      date: '2024-03-30',
      time: '16:00',
      venue: 'Kigali Swimming Pool',
      category: 'Swimming',
      status: 'upcoming',
      capacity: 500,
      sold: 300,
      price: 2500,
      description: 'National swimming competition',
      color: 'bg-cyan-500'
    }
  ]

  const categories = ['Football', 'Basketball', 'Volleyball', 'Tennis', 'Athletics', 'Swimming']
  const statuses = ['upcoming', 'ongoing', 'completed', 'cancelled']

  const filteredEvents = events.filter(event => {
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus
    const matchesCategory = filterCategory === 'all' || event.category === filterCategory
    return matchesStatus && matchesCategory
  })

  const getEventsForDate = (date: string) => {
    return filteredEvents.filter(event => event.date === date)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      upcoming: { color: 'bg-blue-100 text-blue-800 border-blue-200', text: 'Upcoming' },
      ongoing: { color: 'bg-green-100 text-green-800 border-green-200', text: 'Ongoing' },
      completed: { color: 'bg-gray-100 text-gray-800 border-gray-200', text: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-800 border-red-200', text: 'Cancelled' }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.upcoming
    return <Badge className={`${config.color} border`}>{config.text}</Badge>
  }

  const getMonthDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }
    
    return days
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const handleEventClick = (event: any) => {
    setSelectedEvent(event)
    setIsEventModalOpen(true)
  }

  const closeEventModal = () => {
    setIsEventModalOpen(false)
    setSelectedEvent(null)
  }

  const getEventStats = () => {
    const totalEvents = events.length
    const upcomingEvents = events.filter(e => e.status === 'upcoming').length
    const ongoingEvents = events.filter(e => e.status === 'ongoing').length
    const totalRevenue = events.reduce((sum, e) => sum + (e.sold * e.price), 0)
    
    return { totalEvents, upcomingEvents, ongoingEvents, totalRevenue }
  }

  const stats = getEventStats()

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Event Calendar</h1>
            <p className="text-gray-600 mt-1">
              Manage and view all your events in calendar format
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
              <Settings className="h-4 w-4 mr-2" />
              Calendar Settings
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Events</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.upcomingEvents}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ongoing</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.ongoingEvents}</p>
                </div>
                <Users className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalRevenue.toLocaleString()} RWF</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and View Controls */}
        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardHeader className="bg-white">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Filter className="h-5 w-5 text-green-600" />
              Filters & View Options
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-white">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">View:</span>
                <div className="flex border border-gray-200 rounded-lg">
                  <Button
                    variant={viewMode === 'month' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('month')}
                    className={viewMode === 'month' ? 'bg-green-600 text-white' : 'bg-white hover:bg-gray-50'}
                  >
                    Month
                  </Button>
                  <Button
                    variant={viewMode === 'week' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('week')}
                    className={viewMode === 'week' ? 'bg-green-600 text-white' : 'bg-white hover:bg-gray-50'}
                  >
                    Week
                  </Button>
                  <Button
                    variant={viewMode === 'day' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('day')}
                    className={viewMode === 'day' ? 'bg-green-600 text-white' : 'bg-white hover:bg-gray-50'}
                  >
                    Day
                  </Button>
                </div>
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-40 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setFilterStatus('all')
                  setFilterCategory('all')
                }}
                className="bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Calendar View */}
        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardHeader className="bg-white">
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('prev')}
                  className="bg-white border-gray-200 hover:bg-gray-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(new Date())}
                  className="bg-white border-gray-200 hover:bg-gray-50"
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('next')}
                  className="bg-white border-gray-200 hover:bg-gray-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="bg-white">
            {viewMode === 'month' && (
              <div className="space-y-4">
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1">
                  {dayNames.map(day => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-gray-700 bg-gray-50 rounded">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {getMonthDays().map((day, index) => {
                    if (!day) {
                      return <div key={index} className="h-24 p-1"></div>
                    }
                    
                    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                    const dayEvents = getEventsForDate(dateStr)
                    const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString()
                    
                    return (
                      <div
                        key={day}
                        className={`h-24 p-1 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 ${
                          isToday ? 'bg-green-50 border-green-200' : 'bg-white'
                        }`}
                      >
                        <div className={`text-sm font-medium mb-1 ${isToday ? 'text-green-700' : 'text-gray-900'}`}>
                          {day}
                        </div>
                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map(event => (
                            <div
                              key={event.id}
                              onClick={() => handleEventClick(event)}
                              className={`text-xs p-1 rounded cursor-pointer text-white truncate ${event.color}`}
                              title={event.title}
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{dayEvents.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {viewMode === 'week' && (
              <div className="space-y-4">
                <div className="text-center text-gray-600">
                  Week view - Coming soon
                </div>
              </div>
            )}

            {viewMode === 'day' && (
              <div className="space-y-4">
                <div className="text-center text-gray-600">
                  Day view - Coming soon
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Events List */}
        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardHeader className="bg-white">
            <CardTitle className="text-gray-900">Upcoming Events ({filteredEvents.filter(e => e.status === 'upcoming').length})</CardTitle>
            <CardDescription className="text-gray-600">
              Events scheduled for the next 30 days
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-white">
            <div className="space-y-4">
              {filteredEvents
                .filter(event => event.status === 'upcoming')
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map(event => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-4 h-4 rounded-full ${event.color}`}></div>
                      <div>
                        <h3 className="font-medium text-gray-900">{event.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4" />
                            {new Date(event.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {event.time}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {event.venue}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        {event.category}
                      </Badge>
                      {getStatusBadge(event.status)}
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {event.sold.toLocaleString()}/{event.capacity.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">tickets sold</div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Event Details Modal */}
        {isEventModalOpen && selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl bg-white border border-gray-200 shadow-lg">
              <CardHeader className="bg-white border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-gray-900">{selectedEvent.title}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {selectedEvent.description}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closeEventModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="bg-white space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Event Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-green-600" />
                        <span className="text-gray-700">
                          {new Date(selectedEvent.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-green-600" />
                        <span className="text-gray-700">{selectedEvent.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-green-600" />
                        <span className="text-gray-700">{selectedEvent.venue}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-600" />
                        <span className="text-gray-700">
                          {selectedEvent.sold.toLocaleString()}/{selectedEvent.capacity.toLocaleString()} tickets sold
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Pricing & Status</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-gray-700">{selectedEvent.price.toLocaleString()} RWF</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          {selectedEvent.category}
                        </Badge>
                        {getStatusBadge(selectedEvent.status)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button className="bg-green-600 hover:bg-green-700 text-white flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50 flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Event
                  </Button>
                  <Button variant="outline" className="bg-white border-gray-200 hover:bg-red-50 text-red-600 flex-1">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default withAuth(EventCalendarPage, ['admin', 'organizer'])
