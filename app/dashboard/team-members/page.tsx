"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { withAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  RefreshCw, 
  Settings, 
  TrendingUp, 
  UserPlus, 
  UserMinus, 
  Ban, 
  Unlock, 
  Trophy, 
  Star, 
  Shield, 
  X, 
  Save, 
  Calendar,
  Mail,
  Phone,
  MapPin,
  Award,
  Clock
} from "lucide-react"

function AdminTeamMembers() {
  const [searchTerm, setSearchTerm] = useState("")
  const [teamFilter, setTeamFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [isEditMemberOpen, setIsEditMemberOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<any>(null)
  const [isFormSliding, setIsFormSliding] = useState(false)
  const [isEditFormSliding, setIsEditFormSliding] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    teamId: '',
    role: '',
    position: '',
    jerseyNumber: '',
    status: 'active',
    joinDate: '',
    salary: '',
    contractEnd: '',
    emergencyContact: '',
    emergencyPhone: '',
    address: '',
    dateOfBirth: '',
    nationality: '',
    height: '',
    weight: '',
    notes: ''
  })

  // Mock teams data
  const teams = [
    { id: 1, name: "APR FC", category: "Premier League" },
    { id: 2, name: "Rayon Sports", category: "Premier League" },
    { id: 3, name: "Patriots Basketball", category: "Basketball League" },
    { id: 4, name: "Rwanda Volleyball", category: "Volleyball League" }
  ]

  // Mock members data
  const members = [
    {
      id: 1,
      firstName: "Jean",
      lastName: "Baptiste",
      email: "jean.baptiste@aprfc.com",
      phone: "+250 788 123 456",
      teamId: 1,
      teamName: "APR FC",
      role: "player",
      position: "Forward",
      jerseyNumber: "10",
      status: "active",
      joinDate: "2023-01-15",
      salary: 500000,
      contractEnd: "2025-12-31",
      emergencyContact: "Marie Baptiste",
      emergencyPhone: "+250 788 234 567",
      address: "Kigali, Rwanda",
      dateOfBirth: "1995-03-15",
      nationality: "Rwandan",
      height: "180cm",
      weight: "75kg",
      notes: "Team captain, excellent leadership skills"
    },
    {
      id: 2,
      firstName: "Paul",
      lastName: "Kagame",
      email: "paul.kagame@rayonsports.com",
      phone: "+250 788 234 567",
      teamId: 2,
      teamName: "Rayon Sports",
      role: "player",
      position: "Midfielder",
      jerseyNumber: "7",
      status: "active",
      joinDate: "2022-08-20",
      salary: 450000,
      contractEnd: "2024-12-31",
      emergencyContact: "Grace Kagame",
      emergencyPhone: "+250 788 345 678",
      address: "Kigali, Rwanda",
      dateOfBirth: "1993-07-22",
      nationality: "Rwandan",
      height: "175cm",
      weight: "70kg",
      notes: "Creative midfielder, great vision"
    },
    {
      id: 3,
      firstName: "Alice",
      lastName: "Uwimana",
      email: "alice.uwimana@patriots.com",
      phone: "+250 788 345 678",
      teamId: 3,
      teamName: "Patriots Basketball",
      role: "coach",
      position: "Head Coach",
      jerseyNumber: "",
      status: "active",
      joinDate: "2021-06-01",
      salary: 800000,
      contractEnd: "2026-05-31",
      emergencyContact: "John Uwimana",
      emergencyPhone: "+250 788 456 789",
      address: "Kigali, Rwanda",
      dateOfBirth: "1985-11-10",
      nationality: "Rwandan",
      height: "165cm",
      weight: "60kg",
      notes: "Experienced coach, former national team player"
    },
    {
      id: 4,
      firstName: "David",
      lastName: "Nkurunziza",
      email: "david.nkurunziza@volleyball.com",
      phone: "+250 788 456 789",
      teamId: 4,
      teamName: "Rwanda Volleyball",
      role: "player",
      position: "Setter",
      jerseyNumber: "1",
      status: "injured",
      joinDate: "2023-03-10",
      salary: 300000,
      contractEnd: "2025-03-31",
      emergencyContact: "Sarah Nkurunziza",
      emergencyPhone: "+250 788 567 890",
      address: "Huye, Rwanda",
      dateOfBirth: "1998-12-05",
      nationality: "Rwandan",
      height: "190cm",
      weight: "85kg",
      notes: "Currently injured, expected return in 2 months"
    },
    {
      id: 5,
      firstName: "Grace",
      lastName: "Mukamana",
      email: "grace.mukamana@aprfc.com",
      phone: "+250 788 567 890",
      teamId: 1,
      teamName: "APR FC",
      role: "staff",
      position: "Physiotherapist",
      jerseyNumber: "",
      status: "active",
      joinDate: "2022-01-10",
      salary: 400000,
      contractEnd: "2024-12-31",
      emergencyContact: "Peter Mukamana",
      emergencyPhone: "+250 788 678 901",
      address: "Kigali, Rwanda",
      dateOfBirth: "1990-04-18",
      nationality: "Rwandan",
      height: "160cm",
      weight: "55kg",
      notes: "Certified physiotherapist, specializes in sports injuries"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
      case 'injured': return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Injured</Badge>
      case 'suspended': return <Badge className="bg-red-100 text-red-800 border-red-200">Suspended</Badge>
      case 'inactive': return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Inactive</Badge>
      default: return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'player': return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Player</Badge>
      case 'coach': return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Coach</Badge>
      case 'staff': return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Staff</Badge>
      case 'manager': return <Badge className="bg-green-100 text-green-800 border-green-200">Manager</Badge>
      default: return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{role}</Badge>
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCreateMember = () => {
    console.log('Creating member:', formData)
    setIsFormSliding(false)
    setTimeout(() => {
      setIsAddMemberOpen(false)
      setFormData({
        firstName: '', lastName: '', email: '', phone: '', teamId: '', role: '', position: '',
        jerseyNumber: '', status: 'active', joinDate: '', salary: '', contractEnd: '',
        emergencyContact: '', emergencyPhone: '', address: '', dateOfBirth: '', nationality: '',
        height: '', weight: '', notes: ''
      })
    }, 500)
  }

  const openCreateDialog = () => {
    setIsAddMemberOpen(true)
    setTimeout(() => setIsFormSliding(true), 50)
  }

  const closeCreateDialog = () => {
    setIsFormSliding(false)
    setTimeout(() => setIsAddMemberOpen(false), 500)
  }

  const handleEditMember = (member: any) => {
    setEditingMember(member)
    setFormData({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      phone: member.phone,
      teamId: member.teamId.toString(),
      role: member.role,
      position: member.position,
      jerseyNumber: member.jerseyNumber,
      status: member.status,
      joinDate: member.joinDate,
      salary: member.salary.toString(),
      contractEnd: member.contractEnd,
      emergencyContact: member.emergencyContact,
      emergencyPhone: member.emergencyPhone,
      address: member.address,
      dateOfBirth: member.dateOfBirth,
      nationality: member.nationality,
      height: member.height,
      weight: member.weight,
      notes: member.notes
    })
    setIsEditMemberOpen(true)
    setTimeout(() => setIsEditFormSliding(true), 50)
  }

  const closeEditDialog = () => {
    setIsEditFormSliding(false)
    setTimeout(() => {
      setIsEditMemberOpen(false)
      setEditingMember(null)
    }, 500)
  }

  const handleUpdateMember = () => {
    console.log('Updating member:', editingMember?.id, formData)
    setIsEditFormSliding(false)
    setTimeout(() => {
      setIsEditMemberOpen(false)
      setEditingMember(null)
    }, 500)
  }

  const handleDeleteMember = (memberId: number) => {
    console.log('Deleting member:', memberId)
  }

  const handleSuspendMember = (memberId: number) => {
    console.log('Suspending member:', memberId)
  }

  const handleActivateMember = (memberId: number) => {
    console.log('Activating member:', memberId)
  }

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.teamName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTeam = teamFilter === "all" || member.teamId.toString() === teamFilter
    const matchesRole = roleFilter === "all" || member.role === roleFilter
    const matchesStatus = statusFilter === "all" || member.status === statusFilter
    return matchesSearch && matchesTeam && matchesRole && matchesStatus
  })

  const totalMembers = members.length
  const activeMembers = members.filter(m => m.status === 'active').length
  const players = members.filter(m => m.role === 'player').length
  const coaches = members.filter(m => m.role === 'coach').length
  const staff = members.filter(m => m.role === 'staff').length

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Team Members</h1>
            <p className="text-gray-600 mt-1">Manage all team members across all teams</p>
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
            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Members</p>
                  <p className="text-2xl font-bold text-gray-900">{totalMembers}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">+5 this month</span>
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
                  <p className="text-sm font-medium text-gray-600">Active Members</p>
                  <p className="text-2xl font-bold text-gray-900">{activeMembers}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Trophy className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Competing</span>
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
                  <p className="text-sm font-medium text-gray-600">Players</p>
                  <p className="text-2xl font-bold text-gray-900">{players}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Athletes</span>
                  </div>
                </div>
                <Star className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Coaches & Staff</p>
                  <p className="text-2xl font-bold text-gray-900">{coaches + staff}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Support</span>
                  </div>
                </div>
                <Shield className="h-8 w-8 text-green-600" />
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <Select value={teamFilter} onValueChange={setTeamFilter}>
                <SelectTrigger className="w-full bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by team" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200">
                  <SelectItem value="all">All Teams</SelectItem>
                  {teams.map(team => (
                    <SelectItem key={team.id} value={team.id.toString()}>{team.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                  <Shield className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200">
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="player">Player</SelectItem>
                  <SelectItem value="coach">Coach</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                  <Trophy className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="injured">Injured</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('')
                  setTeamFilter('all')
                  setRoleFilter('all')
                  setStatusFilter('all')
                }}
                className="bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Members Table */}
        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardHeader className="bg-white">
            <CardTitle className="text-gray-900">All Members ({filteredMembers.length})</CardTitle>
            <CardDescription className="text-gray-600">Manage team members and their information</CardDescription>
          </CardHeader>
          <CardContent className="bg-white">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-gray-700 font-semibold">Member</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Team & Role</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Position</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Status</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Contact</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Contract</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => (
                    <TableRow key={member.id} className="bg-white hover:bg-gray-50">
                      <TableCell className="text-gray-900">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-green-100 text-green-600 font-bold">
                              {member.firstName[0]}{member.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.firstName} {member.lastName}</p>
                            <p className="text-sm text-gray-500">ID: {member.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-900">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{member.teamName}</p>
                          <div>{getRoleBadge(member.role)}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-900">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{member.position}</p>
                          {member.jerseyNumber && (
                            <Badge variant="outline" className="text-xs bg-gray-100 text-gray-800 border-gray-200">
                              #{member.jerseyNumber}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(member.status)}</TableCell>
                      <TableCell className="text-gray-900">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3 text-green-600" />
                            <span className="truncate max-w-32">{member.email}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Phone className="h-3 w-3 text-green-600" />
                            <span>{member.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-900">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3 text-green-600" />
                            <span>Joined: {member.joinDate}</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            Ends: {member.contractEnd}
                          </div>
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
                            title="Edit Member"
                            onClick={() => handleEditMember(member)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {member.status === 'active' ? (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="hover:bg-red-100 text-red-600" 
                              title="Suspend Member"
                              onClick={() => handleSuspendMember(member.id)}
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="hover:bg-green-100 text-green-600" 
                              title="Activate Member"
                              onClick={() => handleActivateMember(member.id)}
                            >
                              <Unlock className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="hover:bg-red-100 text-red-600" 
                            title="Delete Member"
                            onClick={() => handleDeleteMember(member.id)}
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

            {filteredMembers.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No members found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Member Dialog */}
        <Dialog open={isAddMemberOpen} onOpenChange={(open) => {
          if (!open) closeCreateDialog()
        }}>
          <DialogContent className={`w-[700px] h-full max-w-none bg-white [&>button]:hidden ${
            isFormSliding ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          }`} style={{
            position: 'fixed',
            top: '0',
            right: '0',
            height: '100vh',
            width: '700px',
            transform: isFormSliding
              ? 'translateX(0)'
              : 'translateX(100%)',
            transition: 'transform 700ms ease-out, opacity 700ms ease-out',
            borderRadius: '0',
            border: 'none',
            boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.1)',
            zIndex: 9999,
            margin: '0',
            maxWidth: '700px',
            left: 'auto'
          }}>
            <DialogHeader className="bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-gray-900">Add New Member</DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Add a new member to a team
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
              {/* Personal Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Personal Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-700 font-medium">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="e.g., Jean"
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-700 font-medium">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="e.g., Baptiste"
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g., jean@team.com"
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-700 font-medium">Phone *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g., +250 788 123 456"
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>

              {/* Team Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Team Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="teamId" className="text-gray-700 font-medium">Team *</Label>
                    <Select value={formData.teamId} onValueChange={(value) => handleSelectChange('teamId', value)}>
                      <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                        <SelectValue placeholder="Select team" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200">
                        {teams.map(team => (
                          <SelectItem key={team.id} value={team.id.toString()}>{team.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-gray-700 font-medium">Role *</Label>
                    <Select value={formData.role} onValueChange={(value) => handleSelectChange('role', value)}>
                      <SelectTrigger className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200">
                        <SelectItem value="player">Player</SelectItem>
                        <SelectItem value="coach">Coach</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="position" className="text-gray-700 font-medium">Position</Label>
                    <Input
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      placeholder="e.g., Forward, Head Coach"
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jerseyNumber" className="text-gray-700 font-medium">Jersey Number</Label>
                    <Input
                      id="jerseyNumber"
                      name="jerseyNumber"
                      value={formData.jerseyNumber}
                      onChange={handleInputChange}
                      placeholder="e.g., 10"
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>

              {/* Contract Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Contract Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="joinDate" className="text-gray-700 font-medium">Join Date</Label>
                    <Input
                      id="joinDate"
                      name="joinDate"
                      type="date"
                      value={formData.joinDate}
                      onChange={handleInputChange}
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contractEnd" className="text-gray-700 font-medium">Contract End</Label>
                    <Input
                      id="contractEnd"
                      name="contractEnd"
                      type="date"
                      value={formData.contractEnd}
                      onChange={handleInputChange}
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary" className="text-gray-700 font-medium">Salary (RWF)</Label>
                  <Input
                    id="salary"
                    name="salary"
                    type="number"
                    value={formData.salary}
                    onChange={handleInputChange}
                    placeholder="e.g., 500000"
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Emergency Contact</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact" className="text-gray-700 font-medium">Contact Name</Label>
                    <Input
                      id="emergencyContact"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleInputChange}
                      placeholder="e.g., Marie Baptiste"
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone" className="text-gray-700 font-medium">Contact Phone</Label>
                    <Input
                      id="emergencyPhone"
                      name="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={handleInputChange}
                      placeholder="e.g., +250 788 234 567"
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Additional Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="text-gray-700 font-medium">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nationality" className="text-gray-700 font-medium">Nationality</Label>
                    <Input
                      id="nationality"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleInputChange}
                      placeholder="e.g., Rwandan"
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="height" className="text-gray-700 font-medium">Height</Label>
                    <Input
                      id="height"
                      name="height"
                      value={formData.height}
                      onChange={handleInputChange}
                      placeholder="e.g., 180cm"
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight" className="text-gray-700 font-medium">Weight</Label>
                    <Input
                      id="weight"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      placeholder="e.g., 75kg"
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-gray-700 font-medium">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="e.g., Kigali, Rwanda"
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-gray-700 font-medium">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Additional notes about the member..."
                    rows={3}
                    className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="bg-white border-t border-gray-200 p-6 absolute bottom-0 left-0 right-0">
              <div className="flex gap-3 w-full">
                <Button variant="outline" onClick={closeCreateDialog} className="bg-white border-gray-200 hover:bg-gray-50 flex-1">
                  Cancel
                </Button>
                <Button onClick={handleCreateMember} className="bg-green-600 hover:bg-green-700 text-white flex-1">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Member Dialog - Similar structure but with pre-populated data */}
        <Dialog open={isEditMemberOpen} onOpenChange={(open) => {
          if (!open) closeEditDialog()
        }}>
          <DialogContent className={`w-[700px] h-full max-w-none bg-white [&>button]:hidden ${
            isEditFormSliding ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          }`} style={{
            position: 'fixed',
            top: '0',
            right: '0',
            height: '100vh',
            width: '700px',
            transform: isEditFormSliding
              ? 'translateX(0)'
              : 'translateX(100%)',
            transition: 'transform 700ms ease-out, opacity 700ms ease-out',
            borderRadius: '0',
            border: 'none',
            boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.1)',
            zIndex: 9999,
            margin: '0',
            maxWidth: '700px',
            left: 'auto'
          }}>
            <DialogHeader className="bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-gray-900">Edit Member</DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Update member information and details
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
              {/* Same form structure as Add Member but with edit- prefixed IDs */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Personal Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-firstName" className="text-gray-700 font-medium">First Name *</Label>
                    <Input
                      id="edit-firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="e.g., Jean"
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-lastName" className="text-gray-700 font-medium">Last Name *</Label>
                    <Input
                      id="edit-lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="e.g., Baptiste"
                      className="bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>
                {/* Continue with other fields... */}
              </div>
            </div>
            <DialogFooter className="bg-white border-t border-gray-200 p-6 absolute bottom-0 left-0 right-0">
              <div className="flex gap-3 w-full">
                <Button variant="outline" onClick={closeEditDialog} className="bg-white border-gray-200 hover:bg-gray-50 flex-1">
                  Cancel
                </Button>
                <Button onClick={handleUpdateMember} className="bg-green-600 hover:bg-green-700 text-white flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Update Member
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

export default withAuth(AdminTeamMembers, ['admin'])
