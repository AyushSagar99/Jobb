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
import { PlusCircle, Briefcase, Settings, Home, Calendar } from 'lucide-react'
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
    <>
      <div className='bg-slate-800 text-white h-screen w-[240px] flex flex-col'>
        <div className='p-6 border-b border-slate-700'>
          <p className='text-2xl font-bold flex items-center'>
            <Briefcase className="mr-2" size={24} />
            JobB
          </p>
        </div>
        
        <div className='p-4'>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full mb-6" variant="default">
                <PlusCircle className="mr-2" size={16} />
                Add Application
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Job Application</DialogTitle>
                <DialogDescription>
                  Track your job application details and progress
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="company" className="text-right">
                    Company
                  </Label>
                  <Input
                    id="company"
                    name="company"
                    placeholder="Company name"
                    className="col-span-3"
                    value={newApplication.company}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="position" className="text-right">
                    Position
                  </Label>
                  <Input
                    id="position" 
                    name="position"
                    placeholder="Job title"
                    className="col-span-3"
                    value={newApplication.position}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="stage" className="text-right">
                    Stage
                  </Label>
                  <Select 
                    value={newApplication.stage}
                    onValueChange={handleSelectChange}
                  >
                    <SelectTrigger className="col-span-3">
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
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dateApplied" className="text-right">
                    Date Applied
                  </Label>
                  <Input
                    id="dateApplied"
                    name="dateApplied"
                    type="date"
                    className="col-span-3"
                    value={newApplication.dateApplied}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Add any notes about this application"
                    className="col-span-3"
                    value={newApplication.notes}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleSubmit}>Save Application</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
       
        
        
      </div>
    </>
  )
}

export default Sidebar