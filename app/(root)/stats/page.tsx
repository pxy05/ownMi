"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import {
  CalendarIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  FilterIcon,
  ClockIcon,
  TrendingUpIcon,
  AwardIcon,
  StarIcon,
} from "lucide-react";
import {
  format,
  startOfDay,
  endOfDay,
  subDays,
  subWeeks,
  subMonths,
} from "date-fns";
import ChartAreaGradient from "@/components/ui-support/focus-chart";
import { useAppUser } from "@/lib/app-user-context";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import FocusHeatChart from "@/components/ui/focus-heatchart";
import { formatDuration as formatDurationUtil } from "@/lib/utils";

interface FocusSession {
  id: string;
  user_id: string;
  session_type: string;
  start_time: string | null;
  end_time: string | null;
  notes: string | null;
  last_heartbeat: string | null;
  duration_seconds: number | null;
  manually_added: boolean;
  created_at: string;
}

interface FilterState {
  minDuration: string;
  maxDuration: string;
  timeFilter: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  manuallyAdded: string;
}

const FocusSessionsPage = () => {
  const {
    focusSessions,
    focusSessionsLoading,
    addFocusSessionLocally,
    addManualFocusSession,
    editFocusSession,
    deleteFocusSession,
    appUser,
    averageFocusTimePerDay,
    averageFocusTimePerWeek,
    averageFocusTimePerMonth,
  } = useAppUser();

  // State management
  const [filters, setFilters] = useState<FilterState>({
    minDuration: "",
    maxDuration: "",
    timeFilter: "all",
    startDate: undefined,
    endDate: undefined,
    manuallyAdded: "all",
  });

  const [editingSession, setEditingSession] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSession, setNewSession] = useState({
    start_time: "",
    end_time: "",
  });

  const [editFormData, setEditFormData] = useState({
    start_time: "",
    end_time: "",
  });

  // Animation states for smooth updates
  const [animatingIds, setAnimatingIds] = useState<Set<string>>(new Set());

  // Career system calculations
  const calculateLevel = (totalXP: number) => {
    // Each level requires more XP: level 1 = 500XP, level 2 = 1200XP, level 3 = 2100XP, etc.
    let level = 1;
    let requiredXP = 500;
    let totalRequired = 0;

    while (totalXP >= totalRequired + requiredXP) {
      totalRequired += requiredXP;
      level++;
      requiredXP = Math.floor(requiredXP * 1.5); // Each level requires 50% more XP
    }

    return {
      level,
      currentXP: totalXP - totalRequired,
      requiredForNext: requiredXP,
      totalXP,
    };
  };

  // Calculate total XP from focus sessions
  const careerData = useMemo(() => {
    if (!focusSessions)
      return { level: 1, currentXP: 0, requiredForNext: 500, totalXP: 0 };

    const totalSeconds = focusSessions.reduce((acc, session) => {
      return acc + (session.duration_seconds || 0);
    }, 0);

    const totalHours = totalSeconds / 3600;
    const totalXP = Math.floor(totalHours * 100); // 100 XP per hour

    return calculateLevel(totalXP);
  }, [focusSessions]);

  // Filter sessions based on current filters
  const filteredSessions = useMemo(() => {
    if (!focusSessions) return [];

    return focusSessions.filter((session) => {
      // Duration filter
      const durationHours = (session.duration_seconds || 0) / 3600;
      if (
        filters.minDuration &&
        durationHours < parseFloat(filters.minDuration)
      )
        return false;
      if (
        filters.maxDuration &&
        durationHours > parseFloat(filters.maxDuration)
      )
        return false;

      // Time filter
      if (filters.timeFilter !== "all") {
        const sessionDate = new Date(session.created_at);
        const now = new Date();

        switch (filters.timeFilter) {
          case "today":
            if (sessionDate < startOfDay(now) || sessionDate > endOfDay(now))
              return false;
            break;
          case "yesterday":
            const yesterday = subDays(now, 1);
            if (
              sessionDate < startOfDay(yesterday) ||
              sessionDate > endOfDay(yesterday)
            )
              return false;
            break;
          case "lastWeek":
            if (sessionDate < subWeeks(now, 1)) return false;
            break;
          case "lastMonth":
            if (sessionDate < subMonths(now, 1)) return false;
            break;
          case "custom":
            if (filters.startDate && sessionDate < filters.startDate)
              return false;
            if (filters.endDate && sessionDate > filters.endDate) return false;
            break;
        }
      }

      // Manually added filter
      if (filters.manuallyAdded === "manual" && !session.manually_added)
        return false;
      if (filters.manuallyAdded === "automatic" && session.manually_added)
        return false;

      return true;
    });
  }, [focusSessions, filters]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const sessionsPerPage = 25;
  const totalPages = Math.ceil(filteredSessions.length / sessionsPerPage);
  const paginatedSessions = filteredSessions.slice(
    (currentPage - 1) * sessionsPerPage,
    currentPage * sessionsPerPage
  );

  // Helper functions
  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "0m";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "MMM dd, yyyy HH:mm");
  };

  // Animation helper
  const animateChange = (sessionId: string) => {
    setAnimatingIds((prev) => new Set([...prev, sessionId]));
    setTimeout(() => {
      setAnimatingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(sessionId);
        return newSet;
      });
    }, 1000);
  };

  // Event handlers
  const handleAddManualSession = async (start_time: Date, end_time: Date) => {
    try {
      const result = await addManualFocusSession(start_time, end_time);
      if (result.success) {
        console.log("Manual session added successfully");
        setIsAddDialogOpen(false);
        setNewSession({ start_time: "", end_time: "" });
        // Animate the new session if we have its ID
        const resultWithData = result as typeof result & {
          data?: { id: string };
        };
        if (resultWithData.data?.id) {
          animateChange(resultWithData.data.id);
        }
      } else {
        console.error("Error:", result.error);
      }
    } catch (error) {
      console.error("Error adding manual session:", error);
    }
  };

  const handleEditSession = async (
    sessionId: string,
    start_time: Date,
    end_time: Date
  ) => {
    try {
      const result = await editFocusSession(sessionId, start_time, end_time);
      if (result.success) {
        console.log("Session updated successfully");
        setIsEditDialogOpen(false);
        setEditingSession(null);
        animateChange(sessionId);
      } else {
        console.error("Error:", result.error);
      }
    } catch (error) {
      console.error("Error updating session:", error);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      const result = await deleteFocusSession(sessionId);
      if (result.success) {
        console.log("Session deleted successfully");
        animateChange(sessionId);
      } else {
        console.error("Error:", result.error);
      }
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };

  const resetFilters = () => {
    setFilters({
      minDuration: "",
      maxDuration: "",
      timeFilter: "all",
      startDate: undefined,
      endDate: undefined,
      manuallyAdded: "all",
    });
    setCurrentPage(1);
  };

  // Update edit form when editing session changes
  useEffect(() => {
    if (editingSession) {
      setEditFormData({
        start_time: editingSession.start_time
          ? format(new Date(editingSession.start_time), "yyyy-MM-dd'T'HH:mm")
          : "",
        end_time: editingSession.end_time
          ? format(new Date(editingSession.end_time), "yyyy-MM-dd'T'HH:mm")
          : "",
      });
    }
  }, [editingSession]);

  if (focusSessionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">
          <ClockIcon className="w-8 h-8 text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Focus Sessions</h1>
          <p className="text-muted-foreground">
            Manage and track your focus sessions
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Session
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-background/60 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle>Add Manual Focus Session</DialogTitle>
              <DialogDescription>
                Add a new focus session with start and end times.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="start-time" className="text-right">
                  Start Time
                </Label>
                <Input
                  id="start-time"
                  type="datetime-local"
                  value={newSession.start_time}
                  onChange={(e) =>
                    setNewSession({ ...newSession, start_time: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="end-time" className="text-right">
                  End Time
                </Label>
                <Input
                  id="end-time"
                  type="datetime-local"
                  value={newSession.end_time}
                  onChange={(e) =>
                    setNewSession({ ...newSession, end_time: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() =>
                  handleAddManualSession(
                    new Date(newSession.start_time),
                    new Date(newSession.end_time)
                  )
                }
                disabled={!newSession.start_time || !newSession.end_time}
              >
                Add Session
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="sessions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="career">Career</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Filters</CardTitle>
                  <CardDescription>Filter your focus sessions</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={resetFilters}>
                  Reset
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label>Min Duration (hours)</Label>
                  <Input
                    type="number"
                    step="0.5"
                    value={filters.minDuration}
                    onChange={(e) =>
                      setFilters({ ...filters, minDuration: e.target.value })
                    }
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Max Duration (hours)</Label>
                  <Input
                    type="number"
                    step="0.5"
                    value={filters.maxDuration}
                    onChange={(e) =>
                      setFilters({ ...filters, maxDuration: e.target.value })
                    }
                    placeholder="Any"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Time Period</Label>
                  <Select
                    value={filters.timeFilter}
                    onValueChange={(value) =>
                      setFilters({ ...filters, timeFilter: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="yesterday">Yesterday</SelectItem>
                      <SelectItem value="lastWeek">Last Week</SelectItem>
                      <SelectItem value="lastMonth">Last Month</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Session Type</Label>
                  <Select
                    value={filters.manuallyAdded}
                    onValueChange={(value) =>
                      setFilters({ ...filters, manuallyAdded: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sessions</SelectItem>
                      <SelectItem value="manual">Manual Only</SelectItem>
                      <SelectItem value="automatic">Automatic Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {filters.timeFilter === "custom" && (
                <div className="grid gap-4 md:grid-cols-2 mt-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.startDate !== undefined ? (
                            format(filters.startDate, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={filters.startDate}
                          onSelect={(date) =>
                            setFilters({ ...filters, startDate: date })
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.endDate !== undefined ? (
                            format(filters.endDate, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={filters.endDate}
                          onSelect={(date) =>
                            setFilters({ ...filters, endDate: date })
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sessions Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Sessions</CardTitle>
                  <CardDescription>
                    {filteredSessions.length} of {focusSessions?.length || 0}{" "}
                    sessions
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>End Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>XP Earned</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedSessions.map((session) => (
                      <TableRow
                        key={session.id}
                        className={`transition-all duration-500 ${
                          animatingIds.has(session.id)
                            ? "bg-green-50 dark:bg-green-950/20 scale-[1.02]"
                            : ""
                        }`}
                      >
                        <TableCell className="font-medium">
                          {session.session_type}
                        </TableCell>
                        <TableCell>
                          {formatDateTime(session.start_time)}
                        </TableCell>
                        <TableCell>
                          {formatDateTime(session.end_time)}
                        </TableCell>
                        <TableCell>
                          {formatDuration(session.duration_seconds)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {Math.floor(
                              ((session.duration_seconds || 0) / 3600) * 100
                            )}{" "}
                            XP
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              session.manually_added ? "default" : "outline"
                            }
                          >
                            {session.manually_added ? "Manual" : "Automatic"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {session.manually_added && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingSession(session);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <EditIcon className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteSession(session.id)}
                            >
                              <TrashIcon className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {/* Pagination Controls - below the table */}
                  </TableBody>
                </Table>
              </div>
              {totalPages > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage((prev) => Math.max(prev - 1, 1));
                        }}
                        isActive={false}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            isActive={page === currentPage}
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(page);
                            }}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          );
                        }}
                        isActive={false}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Focus Analytics</CardTitle>
              <CardDescription>
                Visualize your focus session patterns and progress
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-8">
              <div className="flex flex-col md:flex-row gap-4">
                <ChartAreaGradient
                  userId={String(appUser?.id)}
                  mini={false}
                  reset={0}
                />
                <FocusHeatChart />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="career" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AwardIcon className="w-5 h-5 text-yellow-500" />
                  <CardTitle>Career Progress</CardTitle>
                </div>
                <CardDescription>
                  Level up by completing focus sessions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    Level {careerData.level}
                  </div>
                  <div className="text-muted-foreground">
                    {careerData.totalXP} XP Total
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{careerData.currentXP} XP</span>
                    <span>{careerData.requiredForNext} XP</span>
                  </div>
                  <Progress
                    value={
                      (careerData.currentXP / careerData.requiredForNext) * 100
                    }
                    className="h-3"
                  />
                  <p className="text-xs text-muted-foreground">
                    {careerData.requiredForNext - careerData.currentXP} XP to
                    next level
                  </p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <StarIcon className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">XP Calculation</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Earn 100 XP for every hour of focused work. Each level
                    requires 50% more XP than the previous level.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUpIcon className="w-5 h-5 text-green-500" />
                  <CardTitle>Statistics</CardTitle>
                </div>
                <CardDescription>
                  Your focus session achievements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">
                      {focusSessions?.length || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Total Sessions
                    </div>
                  </div>

                  <div className="p-3 bg-muted rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">
                      {Math.round(
                        ((focusSessions?.reduce(
                          (acc, session) =>
                            acc + (session.duration_seconds || 0),
                          0
                        ) || 0) /
                          3600) *
                          10
                      ) / 10}
                      h
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Total Time
                    </div>
                  </div>

                  <div className="p-3 bg-muted rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">
                      {focusSessions?.filter((s) => s.manually_added).length ||
                        0}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Manual Sessions
                    </div>
                  </div>

                  <div className="p-3 bg-muted rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">
                      {Math.round(
                        (focusSessions?.reduce(
                          (acc, session) =>
                            acc + (session.duration_seconds || 0),
                          0
                        ) || 0) /
                          (focusSessions?.length || 1) /
                          60
                      )}
                      m
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Avg Duration
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Average Focus Time</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg text-center">
                      <div className="text-xl font-bold text-primary">
                        {formatDurationUtil(averageFocusTimePerDay, 'short')}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Per Day
                      </div>
                    </div>

                    <div className="p-3 bg-primary/10 rounded-lg text-center">
                      <div className="text-xl font-bold text-primary">
                        {formatDurationUtil(averageFocusTimePerWeek, 'short')}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Per Week
                      </div>
                    </div>

                    <div className="p-3 bg-primary/10 rounded-lg text-center">
                      <div className="text-xl font-bold text-primary">
                        {formatDurationUtil(averageFocusTimePerMonth, 'short')}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Per Month
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Recent Achievements</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {careerData.level >= 2 && (
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="secondary">🏆</Badge>
                        <span>Reached Level {careerData.level}</span>
                      </div>
                    )}
                    {(focusSessions?.length || 0) >= 10 && (
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="secondary">🎯</Badge>
                        <span>Completed 10+ sessions</span>
                      </div>
                    )}
                    {(focusSessions?.reduce(
                      (acc, session) => acc + (session.duration_seconds || 0),
                      0
                    ) || 0) /
                      3600 >=
                      20 && (
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="secondary">⏱️</Badge>
                        <span>20+ hours of focus</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Session Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Focus Session</DialogTitle>
            <DialogDescription>
              Modify the start and end times for this session.
            </DialogDescription>
          </DialogHeader>
          {editingSession && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-start-time" className="text-right">
                  Start Time
                </Label>
                <Input
                  id="edit-start-time"
                  type="datetime-local"
                  value={editFormData.start_time}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      start_time: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-end-time" className="text-right">
                  End Time
                </Label>
                <Input
                  id="edit-end-time"
                  type="datetime-local"
                  value={editFormData.end_time}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      end_time: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={() => {
                if (
                  editFormData.start_time &&
                  editFormData.end_time &&
                  editingSession
                ) {
                  handleEditSession(
                    editingSession.id,
                    new Date(editFormData.start_time),
                    new Date(editFormData.end_time)
                  );
                }
              }}
              disabled={!editFormData.start_time || !editFormData.end_time}
            >
              Update Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FocusSessionsPage;
