"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { withAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  DollarSign,
  Save,
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  Trash2
} from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"

function EditMatchPage() {
  const router = useRouter()
  const params = useParams()
  const matchId = params.id
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    homeTeam: "",
    awayTeam: "",
    date: "",
    time: "",
    venue: "",
    competition: "",
    sport: "",
    ticketPrice: "",
    totalCapacity: "",
    description: "",
    image: "",
    status: "upcoming"
  })

  useEffect(() => {
    // Simulate loading match data
    const loadMatchData = async () => {
      setIsLoading(true)
      try {
        // Simulate API call to fetch match data
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock data - in real app, this would come from API
        setFormData({
          homeTeam: "APR FC",
          awayTeam: "Rayon Sports",
          date: "2024-03-20",
          time: "16:00",
          venue: "Amahoro Stadium",
          competition: "Rwanda Premier League",
          sport: "football",
          ticketPrice: "5000",
          totalCapacity: "30000",
          description: "Exciting match between two top teams",
          image: "/placeholder.jpg",
          status: "upcoming"
        })
      } catch (error) {
        console.error("Error loading match:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (matchId) {
      loadMatchData()
    }
  }, [matchId])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Redirect to matches list
      router.push("/dashboard/matches")
    } catch (error) {
      console.error("Error updating match:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this match? This action cannot be undone.")) {
      setIsSaving(true)
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Redirect to matches list
        router.push("/dashboard/matches")
      } catch (error) {
        console.error("Error deleting match:", error)
      } finally {
        setIsSaving(false)
      }
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/matches">
              <Button variant="outline" size="sm" className="bg-white border-gray-200 hover:bg-gray-50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Matches
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Match</h1>
              <p className="text-gray-600 mt-1">
                Update match details and settings
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleDelete}
              disabled={isSaving}
              className="bg-white border-red-200 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardHeader className="bg-white">
              <CardTitle className="text-gray-900">Basic Information</CardTitle>
              <CardDescription className="text-gray-600">
                Update the basic details of the match
              </CardDescription>
            </CardHeader>
            <CardContent className="bg-white space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="homeTeam" className="text-gray-700 font-medium">Home Team</Label>
                  <Input
                    id="homeTeam"
                    value={formData.homeTeam}
                    onChange={(e) => handleInputChange("homeTeam", e.target.value)}
                    placeholder="Enter home team name"
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="awayTeam" className="text-gray-700 font-medium">Away Team</Label>
                  <Input
                    id="awayTeam"
                    value={formData.awayTeam}
                    onChange={(e) => handleInputChange("awayTeam", e.target.value)}
                    placeholder="Enter away team name"
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="competition" className="text-gray-700 font-medium">Competition/League</Label>
                  <Input
                    id="competition"
                    value={formData.competition}
                    onChange={(e) => handleInputChange("competition", e.target.value)}
                    placeholder="e.g., Rwanda Premier League"
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sport" className="text-gray-700 font-medium">Sport</Label>
                  <Select value={formData.sport} onValueChange={(value) => handleInputChange("sport", value)}>
                    <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                      <SelectValue placeholder="Select sport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="football">⚽ Football</SelectItem>
                      <SelectItem value="basketball">🏀 Basketball</SelectItem>
                      <SelectItem value="volleyball">🏐 Volleyball</SelectItem>
                      <SelectItem value="events">🎪 Events</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-gray-700 font-medium">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-700 font-medium">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Enter match description..."
                  className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Date & Time */}
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardHeader className="bg-white">
              <CardTitle className="text-gray-900">Date & Time</CardTitle>
              <CardDescription className="text-gray-600">
                Update the match schedule
              </CardDescription>
            </CardHeader>
            <CardContent className="bg-white space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-gray-700 font-medium">Match Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                      className="pl-10 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-gray-700 font-medium">Match Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => handleInputChange("time", e.target.value)}
                      className="pl-10 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Venue & Capacity */}
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardHeader className="bg-white">
              <CardTitle className="text-gray-900">Venue & Capacity</CardTitle>
              <CardDescription className="text-gray-600">
                Update venue and capacity details
              </CardDescription>
            </CardHeader>
            <CardContent className="bg-white space-y-6">
              <div className="space-y-2">
                <Label htmlFor="venue" className="text-gray-700 font-medium">Venue</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="venue"
                    value={formData.venue}
                    onChange={(e) => handleInputChange("venue", e.target.value)}
                    placeholder="Enter venue name"
                    className="pl-10 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="totalCapacity" className="text-gray-700 font-medium">Total Capacity</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="totalCapacity"
                      type="number"
                      value={formData.totalCapacity}
                      onChange={(e) => handleInputChange("totalCapacity", e.target.value)}
                      placeholder="Enter total capacity"
                      className="pl-10 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ticketPrice" className="text-gray-700 font-medium">Ticket Price (RWF)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="ticketPrice"
                      type="number"
                      value={formData.ticketPrice}
                      onChange={(e) => handleInputChange("ticketPrice", e.target.value)}
                      placeholder="Enter ticket price"
                      className="pl-10 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Match Image */}
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardHeader className="bg-white">
              <CardTitle className="text-gray-900">Match Image</CardTitle>
              <CardDescription className="text-gray-600">
                Update the match image
              </CardDescription>
            </CardHeader>
            <CardContent className="bg-white">
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-gray-600 font-medium">Upload new match image</p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                    <Button type="button" variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  )
}

export default withAuth(EditMatchPage, ['admin'])
