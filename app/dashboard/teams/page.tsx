"use client"

import { useState } from "react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { withAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Trophy, Plus, Search, Filter, Edit, Trash2, Eye, Users, Star, MapPin, Calendar, RefreshCw, Settings, TrendingUp, DollarSign, Ticket, Shield, Award, X, Save, UserPlus, UserMinus, Ban, Unlock } from "lucide-react"

function AdminTeams() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false)
  const [isEditTeamOpen, setIsEditTeamOpen] = useState(false)
  const [editingTeam, setEditingTeam] = useState<any>(null)
  const [isFormSliding, setIsFormSliding] = useState(false)
  const [isEditFormSliding, setIsEditFormSliding] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    sport: '',
    league: '',
    founded: '',
    location: '',
    status: 'active'
  })

  // Mock teams data
  const teams = [
    {
      id: 1,
      name: "APR FC",
      sport: "Football",
      league: "Rwanda Premier League",
      status: "active",
      members: 25,
      founded: "1993",
      location: "Kigali",
      revenue: 15000000,
      ticketsSold: 45000,
      rating: 4.8
    },
    {
      id: 2,
      name: "Rayon Sports",
      sport: "Football",
      league: "Rwanda Premier League",
      status: "active",
      members: 28,
      founded: "1968",
      location: "Kigali",
      revenue: 12000000,
      ticketsSold: 38000,
      rating: 4.6
    },
    {
      id: 3,
      name: "Patriots Basketball",
      sport: "Basketball",
      league: "Rwanda Basketball League",
      status: "pending",
      members: 15,
      founded: "2010",
      location: "Kigali",
      revenue: 8000000,
      ticketsSold: 12000,
      rating: 4.4
    },
    {
      id: 4,
      name: "Rwanda Volleyball",
      sport: "Volleyball",
      league: "Rwanda Volleyball League",
      status: "inactive",
      members: 20,
      founded: "2005",
      location: "Huye",
      revenue: 5000000,
      ticketsSold: 8000,
      rating: 4.2
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>
      case 'inactive': return <Badge className="bg-red-100 text-red-800 border-red-200">Inactive</Badge>
      default: return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCreateTeam = () => {
    console.log('Creating team:', formData)
    setIsFormSliding(false)
    setTimeout(() => {
      setIsAddTeamOpen(false)
      setFormData({ name: '', sport: '', league: '', founded: '', location: '', status: 'active' })
    }, 500)
  }

  const openCreateDialog = () => {
    setIsAddTeamOpen(true)
    setTimeout(() => setIsFormSliding(true), 50)
  }

  const closeCreateDialog = () => {
    setIsFormSliding(false)
    setTimeout(() => setIsAddTeamOpen(false), 500)
  }

  const handleEditTeam = (team: any) => {
    setEditingTeam(team)
    setFormData({
      name: team.name,
      sport: team.sport,
      league: team.league,
      founded: team.founded,
      location: team.location,
      status: team.status
    })
    setIsEditTeamOpen(true)
    setTimeout(() => setIsEditFormSliding(true), 50)
  }

  const closeEditDialog = () => {
    setIsEditFormSliding(false)
    setTimeout(() => {
      setIsEditTeamOpen(false)
      setEditingTeam(null)
    }, 500)
  }

  const handleUpdateTeam = () => {
    console.log('Updating team:', editingTeam?.id, formData)
    setIsEditFormSliding(false)
    setTimeout(() => {
      setIsEditTeamOpen(false)
      setEditingTeam(null)
    }, 500)
  }

  const handleDeleteTeam = (teamId: number) => {
    console.log('Deleting team:', teamId)
  }

  const handleSuspendTeam = (teamId: number) => {
    console.log('Suspending team:', teamId)
  }

  const handleActivateTeam = (teamId: number) => {
    console.log('Activating team:', teamId)
  }

  const getSportIcon = (sport: string) => {
    switch (sport) {
      case 'Football': return '⚽'
      case 'Basketball': return '🏀'
      case 'Volleyball': return '🏐'
      default: return '🏆'
    }
  }

  const filteredTeams = teams.filter(team => {
    const matchesSearch = 
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.sport.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.league.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || team.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalRevenue = teams.reduce((sum, team) => sum + team.revenue, 0)
  const totalTicketsSold = teams.reduce((sum, team) => sum + team.ticketsSold, 0)
  const activeTeams = teams.filter(team => team.status === 'active').length

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
            <p className="text-gray-600 mt-1">Manage all registered teams and organizations</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Link href="/dashboard/teams/create">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Team
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Teams</p>
                  <p className="text-2xl font-bold text-gray-900">{teams.length}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">+12.5%</span>
                  </div>
                </div>
                <Trophy className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Teams</p>
                  <p className="text-2xl font-bold text-gray-900">{activeTeams}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Users className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Competing</span>
                  </div>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{(totalRevenue / 1000000).toFixed(1)}M RWF</p>
                  <div className="flex items-center gap-1 mt-1">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">This season</span>
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tickets Sold</p>
                  <p className="text-2xl font-bold text-gray-900">{totalTicketsSold.toLocaleString()}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Ticket className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Total sold</span>
                  </div>
                </div>
                <Ticket className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sport Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Football Teams</p>
                  <p className="text-2xl font-bold text-gray-900">{teams.filter(t => t.sport === 'Football').length}</p>
                  <p className="text-sm text-gray-500">Most popular sport</p>
                </div>
                <span className="text-3xl">⚽</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Basketball Teams</p>
                  <p className="text-2xl font-bold text-gray-900">{teams.filter(t => t.sport === 'Basketball').length}</p>
                  <p className="text-sm text-gray-500">Indoor sport</p>
                </div>
                <span className="text-3xl">🏀</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Volleyball Teams</p>
                  <p className="text-2xl font-bold text-gray-900">{teams.filter(t => t.sport === 'Volleyball').length}</p>
                  <p className="text-sm text-gray-500">Team sport</p>
                </div>
                <span className="text-3xl">🏐</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardHeader className="bg-white">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Filter className="h-5 w-5 text-green-600" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search teams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200">
                  <SelectItem value="all">All Teams</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('all')
                }}
                className="bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Teams Table */}
        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardHeader className="bg-white">
            <CardTitle className="text-gray-900">All Teams ({filteredTeams.length})</CardTitle>
            <CardDescription className="text-gray-600">Manage and monitor all registered teams</CardDescription>
          </CardHeader>
          <CardContent className="bg-white">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-gray-700 font-semibold">Team</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Sport & League</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Status</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Members</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Revenue</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Tickets Sold</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Rating</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeams.map((team) => (
                    <TableRow key={team.id} className="bg-white hover:bg-gray-50">
                      <TableCell className="text-gray-900">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-green-100 text-green-600 font-bold">
                              {team.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{team.name}</p>
                            <p className="text-sm text-gray-500">Founded {team.founded}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-900">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getSportIcon(team.sport)}</span>
                          <div>
                            <p className="text-sm font-medium">{team.sport}</p>
                            <p className="text-xs text-gray-500">{team.league}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(team.status)}</TableCell>
                      <TableCell className="text-gray-900">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">{team.members}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-900">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">{(team.revenue / 1000000).toFixed(1)}M RWF</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-900">
                        <div className="flex items-center gap-1">
                          <Ticket className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">{team.ticketsSold.toLocaleString()}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-900">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{team.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="hover:bg-gray-100" title="View Details">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="hover:bg-gray-100" 
                            title="Edit Team"
                            onClick={() => handleEditTeam(team)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {team.status === 'active' ? (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="hover:bg-red-100 text-red-600" 
                              title="Suspend Team"
                              onClick={() => handleSuspendTeam(team.id)}
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="hover:bg-green-100 text-green-600" 
                              title="Activate Team"
                              onClick={() => handleActivateTeam(team.id)}
                            >
                              <Unlock className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="hover:bg-red-100 text-red-600" 
                            title="Delete Team"
                            onClick={() => handleDeleteTeam(team.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredTeams.length === 0 && (
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No teams found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Team Dialog */}
        <Dialog open={isAddTeamOpen} onOpenChange={(open) => {
          if (!open) closeCreateDialog()
        }}>
          <DialogContent className={`w-[600px] h-full max-w-none bg-white [&>button]:hidden ${
            isFormSliding ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          }`} style={{
            position: 'fixed',
            top: '0',
            right: '0',
            height: '100vh',
            width: '600px',
            transform: isFormSliding
              ? 'translateX(0)'
              : 'translateX(100%)',
            transition: 'transform 700ms ease-out, opacity 700ms ease-out',
            borderRadius: '0',
            border: 'none',
            boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.1)',
            zIndex: 9999,
            margin: '0',
            maxWidth: '600px',
            left: 'auto'
          }}>
            <DialogHeader className="bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-gray-900">Add New Team</DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Create a new team with the specified details
                  </DialogDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeCreateDialog}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>
            <div className="space-y-6 bg-white overflow-y-auto h-full pb-20">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 font-medium">Team Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., APR FC"
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sport" className="text-gray-700 font-medium">Sport *</Label>
                  <Select value={formData.sport} onValueChange={(value) => handleSelectChange('sport', value)}>
                    <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                      <SelectValue placeholder="Select sport" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200">
                      <SelectItem value="Football">Football</SelectItem>
                      <SelectItem value="Basketball">Basketball</SelectItem>
                      <SelectItem value="Volleyball">Volleyball</SelectItem>
                      <SelectItem value="Tennis">Tennis</SelectItem>
                      <SelectItem value="Rugby">Rugby</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="league" className="text-gray-700 font-medium">League *</Label>
                  <Input
                    id="league"
                    name="league"
                    value={formData.league}
                    onChange={handleInputChange}
                    placeholder="e.g., Rwanda Premier League"
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="founded" className="text-gray-700 font-medium">Founded Year</Label>
                  <Input
                    id="founded"
                    name="founded"
                    value={formData.founded}
                    onChange={handleInputChange}
                    placeholder="e.g., 1993"
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-gray-700 font-medium">Location *</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., Kigali"
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-gray-700 font-medium">Team Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                    <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200">
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Team Settings</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-gray-700 font-medium">Auto-approve matches</Label>
                      <p className="text-sm text-gray-600">
                        Automatically approve match requests for this team
                      </p>
                    </div>
                    <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-gray-700 font-medium">Public team profile</Label>
                      <p className="text-sm text-gray-600">
                        Make team profile visible to all users
                      </p>
                    </div>
                    <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" defaultChecked />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="bg-white border-t border-gray-200 p-6 absolute bottom-0 left-0 right-0">
              <div className="flex gap-3 w-full">
                <Button variant="outline" onClick={closeCreateDialog} className="bg-white border-gray-200 hover:bg-gray-50 flex-1">
                  Cancel
                </Button>
                <Button onClick={handleCreateTeam} className="bg-green-600 hover:bg-green-700 text-white flex-1">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Team
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Team Dialog */}
        <Dialog open={isEditTeamOpen} onOpenChange={(open) => {
          if (!open) closeEditDialog()
        }}>
          <DialogContent className={`w-[600px] h-full max-w-none bg-white [&>button]:hidden ${
            isEditFormSliding ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          }`} style={{
            position: 'fixed',
            top: '0',
            right: '0',
            height: '100vh',
            width: '600px',
            transform: isEditFormSliding
              ? 'translateX(0)'
              : 'translateX(100%)',
            transition: 'transform 700ms ease-out, opacity 700ms ease-out',
            borderRadius: '0',
            border: 'none',
            boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.1)',
            zIndex: 9999,
            margin: '0',
            maxWidth: '600px',
            left: 'auto'
          }}>
            <DialogHeader className="bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-gray-900">Edit Team</DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Update team information and settings
                  </DialogDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeEditDialog}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>
            <div className="space-y-6 bg-white overflow-y-auto h-full pb-20">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name" className="text-gray-700 font-medium">Team Name *</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., APR FC"
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-sport" className="text-gray-700 font-medium">Sport *</Label>
                  <Select value={formData.sport} onValueChange={(value) => handleSelectChange('sport', value)}>
                    <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                      <SelectValue placeholder="Select sport" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200">
                      <SelectItem value="Football">Football</SelectItem>
                      <SelectItem value="Basketball">Basketball</SelectItem>
                      <SelectItem value="Volleyball">Volleyball</SelectItem>
                      <SelectItem value="Tennis">Tennis</SelectItem>
                      <SelectItem value="Rugby">Rugby</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-league" className="text-gray-700 font-medium">League *</Label>
                  <Input
                    id="edit-league"
                    name="league"
                    value={formData.league}
                    onChange={handleInputChange}
                    placeholder="e.g., Rwanda Premier League"
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-founded" className="text-gray-700 font-medium">Founded Year</Label>
                  <Input
                    id="edit-founded"
                    name="founded"
                    value={formData.founded}
                    onChange={handleInputChange}
                    placeholder="e.g., 1993"
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-location" className="text-gray-700 font-medium">Location *</Label>
                  <Input
                    id="edit-location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., Kigali"
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status" className="text-gray-700 font-medium">Team Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                    <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200">
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Team Actions</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-gray-700 font-medium">Reset Team Stats</Label>
                      <p className="text-sm text-gray-600">
                        Reset all team statistics and performance data
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="bg-white border-gray-200 hover:bg-gray-50">
                      Reset Stats
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-gray-700 font-medium">Team Activity</Label>
                      <p className="text-sm text-gray-600">
                        View team's match history and activity
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="bg-white border-gray-200 hover:bg-gray-50">
                      View Activity
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="bg-white border-t border-gray-200 p-6 absolute bottom-0 left-0 right-0">
              <div className="flex gap-3 w-full">
                <Button variant="outline" onClick={closeEditDialog} className="bg-white border-gray-200 hover:bg-gray-50 flex-1">
                  Cancel
                </Button>
                <Button onClick={handleUpdateTeam} className="bg-green-600 hover:bg-green-700 text-white flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Update Team
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

export default withAuth(AdminTeams)
