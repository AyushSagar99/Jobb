'use client';

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Briefcase, Settings, Home, Calendar, X } from 'lucide-react'
import { useJobApplications } from '@/context/job-context'

function Sidebar() {
  const { addJobApplication } = useJobApplications();
  
  const [newApplication, setNewApplication] = useState({
    company: "",
    position: "",
    stage: "Applied",
    dateApplied: new Date().toISOString().split('T')[0],
    notes: ""
  });
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewApplication({
      ...newApplication,
      [name]: value
    });
  };
  
  const handleSelectChange = (value: string) => {
    setNewApplication({
      ...newApplication,
      stage: value
    });
  };
  
  const handleSubmit = () => {
    addJobApplication(newApplication);
    
    // Reset form
    setNewApplication({
      company: "",
      position: "",
      stage: "Applied",
      dateApplied: new Date().toISOString().split('T')[0],
      notes: ""
    });
    
    // Close dialog
    setIsDialogOpen(false);
  };
  
  // Application stages for the dropdown
  const applicationStages = [
    "Applied",
    "Resume Screened",
    "Phone Interview",
    "Technical Assessment",
    "Interview",
    "Final Interview",
    "Offer",
    "Accepted",
    "Rejected"
  ];

  return (
    <div className='bg-slate-800 text-white h-full w-full md:w-[240px] flex flex-col'>
      <div className='p-6 border-b border-slate-700 flex justify-between items-center md:block'>
        <p className='text-2xl font-bold flex items-center'>
          <Briefcase className="mr-2" size={24} />
          JobB
        </p>
        <button className="md:hidden text-white">
          <X size={24} />
        </button>
      </div>
      
      <div className='p-4'>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full mb-6" variant="default">
              <PlusCircle className="mr-2" size={16} />
              Add Application
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] w-[95%] max-w-[95%] sm:w-auto">
            <DialogHeader>
              <DialogTitle>Add Job Application</DialogTitle>
              <DialogDescription>
                Track your job application details and progress
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="company" className="text-right md:text-left col-span-4 md:col-span-1">
                  Company
                </Label>
                <Input
                  id="company"
                  name="company"
                  placeholder="Company name"
                  className="col-span-4 md:col-span-3"
                  value={newApplication.company}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="position" className="text-right md:text-left col-span-4 md:col-span-1">
                  Position
                </Label>
                <Input
                  id="position" 
                  name="position"
                  placeholder="Job title"
                  className="col-span-4 md:col-span-3"
                  value={newApplication.position}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="stage" className="text-right md:text-left col-span-4 md:col-span-1">
                  Stage
                </Label>
                <div className="col-span-4 md:col-span-3">
                  <Select 
                    value={newApplication.stage}
                    onValueChange={handleSelectChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {applicationStages.map((stage) => (
                        <SelectItem key={stage} value={stage}>
                          {stage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dateApplied" className="text-right md:text-left col-span-4 md:col-span-1">
                  Date Applied
                </Label>
                <Input
                  id="dateApplied"
                  name="dateApplied"
                  type="date"
                  className="col-span-4 md:col-span-3"
                  value={newApplication.dateApplied}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right md:text-left col-span-4 md:col-span-1">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Add any notes about this application"
                  className="col-span-4 md:col-span-3"
                  value={newApplication.notes}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSubmit} className="w-full md:w-auto">Save Application</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Navigation links */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Button variant="ghost" className="w-full justify-start text-white">
              <Home className="mr-2" size={18} />
              Dashboard
            </Button>
          </li>
          <li>
            <Button variant="ghost" className="w-full justify-start text-white">
              <Briefcase className="mr-2" size={18} />
              Applications
            </Button>
          </li>
          <li>
            <Button variant="ghost" className="w-full justify-start text-white">
              <Calendar className="mr-2" size={18} />
              Interviews
            </Button>
          </li>
        </ul>
      </nav>
      
      {/* Settings at the bottom */}
      <div className="p-4 border-t border-slate-700">
        <Button variant="ghost" className="w-full justify-start text-white">
          <Settings className="mr-2" size={18} />
          Settings
        </Button>
      </div>
    </div>
  )
}

export default Sidebar