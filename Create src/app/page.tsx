'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Users, Clock, ArrowLeftRight, Plus, Settings, BarChart3, RefreshCw } from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  position?: string
  isActive: boolean
}

interface Schedule {
  id: string
  date: string
  shiftType: 'DAY_SHIFT' | 'NIGHT_SHIFT'
  startTime: string
  endTime: string
  breakTime?: string
  lunchTime?: string
  teamMemberId: string
  teamMember: TeamMember
}

interface ChangeRequest {
  id: string
  type: 'BREAK_CHANGE' | 'LUNCH_CHANGE'
  requestedTime: string
  reason?: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  teamMemberId: string
  teamMember: TeamMember
  createdAt: string
}

export default function Home() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>([])
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [activeView, setActiveView] = useState<'dashboard' | 'team' | 'requests'>('dashboard')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for demonstration
    const mockTeamMembers: TeamMember[] = [
      { id: '1', name: 'John Smith', position: 'Developer', isActive: true },
      { id: '2', name: 'Jane Doe', position: 'Designer', isActive: true },
      { id: '3', name: 'Mike Johnson', position: 'Manager', isActive: true },
      { id: '4', name: 'Sarah Wilson', position: 'Developer', isActive: true },
      { id: '5', name: 'Tom Brown', position: 'QA', isActive: true },
      { id: '6', name: 'Lisa Davis', position: 'Designer', isActive: true },
      { id: '7', name: 'Chris Lee', position: 'Developer', isActive: true },
      { id: '8', name: 'Amy Chen', position: 'Manager', isActive: true },
      { id: '9', name: 'David Kim', position: 'QA', isActive: true },
      { id: '10', name: 'Emma Taylor', position: 'Developer', isActive: true },
      { id: '11', name: 'Ryan Garcia', position: 'Designer', isActive: true },
      { id: '12', name: 'Sophie Martin', position: 'QA', isActive: true },
    ]

    const mockSchedules: Schedule[] = mockTeamMembers.map((member, index) => ({
      id: `schedule-${index}`,
      date: selectedDate,
      shiftType: index % 3 === 0 ? 'NIGHT_SHIFT' : 'DAY_SHIFT',
      startTime: index % 3 === 0 ? '19:00' : '08:00',
      endTime: index % 3 === 0 ? '10:00' : '17:00',
      breakTime: `${10 + (index % 3)}:30`,
      lunchTime: `${12 + (index % 2)}:00`,
      teamMemberId: member.id,
      teamMember: member,
    }))

    const mockChangeRequests: ChangeRequest[] = [
      {
        id: '1',
        type: 'BREAK_CHANGE',
        requestedTime: '11:00',
        reason: 'Doctor appointment',
        status: 'PENDING',
        teamMemberId: '1',
        teamMember: mockTeamMembers[0],
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'LUNCH_CHANGE',
        requestedTime: '13:30',
        reason: 'Personal errand',
        status: 'APPROVED',
        teamMemberId: '3',
        teamMember: mockTeamMembers[2],
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
    ]

    setTeamMembers(mockTeamMembers)
    setSchedules(mockSchedules)
    setChangeRequests(mockChangeRequests)
    setLoading(false)
  }, [selectedDate])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'APPROVED': return 'bg-green-100 text-green-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading team schedule...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Team Schedule Manager</h1>
            <p className="text-gray-600 mt-1">Manage your team's schedules and change requests</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant={activeView === 'dashboard' ? 'default' : 'outline'}
            onClick={() => setActiveView('dashboard')}
          >
            Dashboard
          </Button>
          <Button
            variant={activeView === 'team' ? 'default' : 'outline'}
            onClick={() => setActiveView('team')}
          >
            Team Members
          </Button>
          <Button
            variant={activeView === 'requests' ? 'default' : 'outline'}
            onClick={() => setActiveView('requests')}
          >
            Change Requests
          </Button>
        </div>

        {activeView === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveView('team')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{teamMembers.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {teamMembers.filter(m => m.isActive).length} active members
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveView('requests')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {changeRequests.filter(r => r.status === 'PENDING').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {changeRequests.filter(r => r.status === 'APPROVED').length} approved today
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Schedule</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{schedules.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {schedules.filter(s => s.shiftType === 'DAY_SHIFT').length} day shifts
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Request Change
              </Button>
              <Button variant="outline">
                <ArrowLeftRight className="h-4 w-4 mr-2" />
                Swap Schedule
              </Button>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule - {new Date(selectedDate).toLocaleDateString()}</CardTitle>
                <CardDescription>
                  Current schedule for all team members with break and lunch times
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Team Member</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Shift</TableHead>
                        <TableHead>Start Time</TableHead>
                        <TableHead>End Time</TableHead>
                        <TableHead>Break Time</TableHead>
                        <TableHead>Lunch Time</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {schedules.map((schedule) => (
                        <TableRow key={schedule.id}>
                          <TableCell className="font-medium">{schedule.teamMember.name}</TableCell>
                          <TableCell>{schedule.teamMember.position}</TableCell>
                          <TableCell>
                            <Badge variant={schedule.shiftType === 'DAY_SHIFT' ? 'default' : 'secondary'}>
                              {schedule.shiftType === 'DAY_SHIFT' ? 'Day Shift' : 'Night Shift'}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatTime(schedule.startTime)}</TableCell>
                          <TableCell>{formatTime(schedule.endTime)}</TableCell>
                          <TableCell>{schedule.breakTime ? formatTime(schedule.breakTime) : 'N/A'}</TableCell>
                          <TableCell>{schedule.lunchTime ? formatTime(schedule.lunchTime) : 'N/A'}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {changeRequests
                                .filter(req => req.teamMemberId === schedule.teamMemberId)
                                .map(req => (
                                  <Badge key={req.id} className={getStatusColor(req.status)}>
                                    {req.type === 'BREAK_CHANGE' ? 'Break' : 'Lunch'}
                                  </Badge>
                                ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Change Requests</CardTitle>
                <CardDescription>
                  Latest break and lunch time change requests from team members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {changeRequests.slice(0, 5).map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium">{request.teamMember.name}</p>
                          <p className="text-sm text-gray-600">
                            {request.type === 'BREAK_CHANGE' ? 'Break' : 'Lunch'} time change to {formatTime(request.requestedTime)}
                          </p>
                          {request.reason && (
                            <p className="text-sm text-gray-500">Reason: {request.reason}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeView === 'team' && (
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                Manage your team members and their information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-600">{member.position || 'N/A'}</p>
                    </div>
                    <Badge variant={member.isActive ? 'default' : 'secondary'}>
                      {member.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeView === 'requests' && (
          <Card>
            <CardHeader>
              <CardTitle>All Change Requests</CardTitle>
              <CardDescription>
                View and manage all break and lunch time change requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {changeRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium">{request.teamMember.name}</p>
                        <p className="text-sm text-gray-600">
                          {request.type === 'BREAK_CHANGE' ? 'Break' : 'Lunch'} time change to {formatTime(request.requestedTime)}
                        </p>
                        {request.reason && (
                          <p className="text-sm text-gray-500">Reason: {request.reason}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
