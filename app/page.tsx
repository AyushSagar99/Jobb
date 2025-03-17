'use client';

import React, { useState } from "react";
import { useJobApplications } from "@/context/job-context";
import { PlusCircle, ChevronRight, ChevronLeft, Menu, MoveRight, MoveLeft } from "lucide-react";
import Sidebar from "./components/sidebar";

export default function Home() {
  const { jobApplications, updateJobApplication } = useJobApplications();
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  // Define stages for the Kanban columns
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

  // Group applications by stage
  const getApplicationsByStage = (stage: string) => {
    return jobApplications.filter(app => app.stage === stage);
  };

  // Format date in a consistent way that doesn't depend on locale
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    return `${month} ${day}, ${year}`;
  };

  // Navigation for mobile
  const goToNextStage = () => {
    if (currentStageIndex < applicationStages.length - 1) {
      setCurrentStageIndex(currentStageIndex + 1);
    }
  };

  const goToPrevStage = () => {
    if (currentStageIndex > 0) {
      setCurrentStageIndex(currentStageIndex - 1);
    }
  };

  // Move application to a different stage
  const moveApplication = (appId: number, direction: 'next' | 'prev') => {
    const application = jobApplications.find(app => app.id === appId);
    if (!application) return;

    const currentStageIndex = applicationStages.indexOf(application.stage);
    
    if (direction === 'next' && currentStageIndex < applicationStages.length - 1) {
      const updatedApplication = {
        ...application,
        stage: applicationStages[currentStageIndex + 1]
      };
      updateJobApplication(updatedApplication);
    } else if (direction === 'prev' && currentStageIndex > 0) {
      const updatedApplication = {
        ...application,
        stage: applicationStages[currentStageIndex - 1]
      };
      updateJobApplication(updatedApplication);
    }
  };

  // Empty state when no applications exist
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
      <div className="bg-gray-50 p-6 md:p-12 rounded-lg shadow-sm border border-gray-200 w-full max-w-md">
        <div className="bg-blue-100 rounded-full p-4 inline-flex mb-6">
          <PlusCircle size={32} className="text-blue-600" />
        </div>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">No applications yet</h2>
        <p className="text-gray-600 mb-6">
          Start tracking your job search by adding your first application using the &quot;Add Application&quot; button in the sidebar.
        </p>
        <div className="flex items-center text-sm text-gray-500 justify-center">
          <div className="mr-2 w-4 h-4 bg-green-100 rounded-full"></div>
          <p>Use stages to track your progress</p>
        </div>
      </div>
    </div>
  );

  // Drag and drop handlers for desktop
  const handleDragStart = (id: number) => {
    setDraggingId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Allow drop
  };

  const handleDrop = (e: React.DragEvent, targetStage: string) => {
    e.preventDefault();
    if (draggingId === null) return;

    const application = jobApplications.find(app => app.id === draggingId);
    if (!application) return;

    // Only update if the stage is actually changing
    if (application.stage !== targetStage) {
      const updatedApplication = {
        ...application,
        stage: targetStage
      };
      updateJobApplication(updatedApplication);
    }

    setDraggingId(null);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-100">
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-800 text-white p-4 flex justify-between items-center">
        <button 
          onClick={() => setShowSidebar(true)}
          className="text-white p-2"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold">JobB</h1>
        <div className="w-8"></div> {/* Empty space for balance */}
      </div>
      
      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 bg-gray-800 bg-opacity-50 z-40 transition-opacity duration-300 md:hidden ${showSidebar ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
           onClick={() => setShowSidebar(false)}>
        <div 
          className={`absolute top-0 left-0 h-full w-[240px] bg-slate-800 transform transition-transform duration-300 ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Sidebar />
        </div>
      </div>
      
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div className="p-4 md:p-6">
          <div className="mb-4 md:mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Job Application Board</h1>
            <p className="text-gray-600">Track your applications by stage</p>
          </div>
          
          {jobApplications.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Mobile View - Single Column with Navigation */}
              <div className="md:hidden">
                <div className="flex items-center justify-between mb-2">
                  <button 
                    onClick={goToPrevStage}
                    disabled={currentStageIndex === 0}
                    className={`p-2 rounded-full ${currentStageIndex === 0 ? 'text-gray-400' : 'text-gray-800 hover:bg-gray-200'}`}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  <h2 className="font-semibold text-gray-700">
                    {applicationStages[currentStageIndex]} 
                    <span className="text-sm text-gray-500 ml-2">
                      ({currentStageIndex + 1}/{applicationStages.length})
                    </span>
                  </h2>
                  
                  <button 
                    onClick={goToNextStage}
                    disabled={currentStageIndex === applicationStages.length - 1}
                    className={`p-2 rounded-full ${currentStageIndex === applicationStages.length - 1 ? 'text-gray-400' : 'text-gray-800 hover:bg-gray-200'}`}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
                
                {/* Single Stage Column for Mobile */}
                <div className="w-full bg-white rounded-lg shadow-md">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h2 className="font-semibold text-gray-700">{applicationStages[currentStageIndex]}</h2>
                      <div className="text-sm text-gray-500">
                        {getApplicationsByStage(applicationStages[currentStageIndex]).length} applications
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2 overflow-y-auto max-h-[calc(100vh-180px)] min-h-[120px]">
                    {getApplicationsByStage(applicationStages[currentStageIndex]).length > 0 ? (
                      getApplicationsByStage(applicationStages[currentStageIndex]).map((app) => (
                        <div 
                          key={app.id} 
                          className="mb-3 p-3 bg-gray-50 rounded-md border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
                        >
                          <div className="font-medium text-gray-800">{app.company}</div>
                          <div className="text-gray-600">{app.position}</div>
                          <div className="mt-2 flex justify-between items-center">
                            <div className="text-xs text-gray-500">
                              Applied: {formatDate(app.dateApplied)}
                            </div>
                            {app.notes && (
                              <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                Notes
                              </div>
                            )}
                          </div>
                          
                          {/* Mobile Move Controls */}
                          <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between">
                            <button
                              onClick={() => moveApplication(app.id, 'prev')}
                              disabled={applicationStages.indexOf(app.stage) === 0}
                              className={`flex items-center text-xs py-1 px-2 rounded ${
                                applicationStages.indexOf(app.stage) === 0
                                  ? 'text-gray-400 cursor-not-allowed'
                                  : 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                              }`}
                            >
                              <MoveLeft size={14} className="mr-1" />
                              {applicationStages.indexOf(app.stage) > 0
                                ? applicationStages[applicationStages.indexOf(app.stage) - 1]
                                : 'No previous stage'}
                            </button>
                            
                            <button
                              onClick={() => moveApplication(app.id, 'next')}
                              disabled={applicationStages.indexOf(app.stage) === applicationStages.length - 1}
                              className={`flex items-center text-xs py-1 px-2 rounded ${
                                applicationStages.indexOf(app.stage) === applicationStages.length - 1
                                  ? 'text-gray-400 cursor-not-allowed'
                                  : 'text-green-600 bg-green-50 hover:bg-green-100'
                              }`}
                            >
                              {applicationStages.indexOf(app.stage) < applicationStages.length - 1
                                ? applicationStages[applicationStages.indexOf(app.stage) + 1]
                                : 'No next stage'}
                              <MoveRight size={14} className="ml-1" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-center text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-md mt-2 h-24 flex items-center justify-center">
                        No applications in this stage
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Desktop View - Multiple Columns with Drag and Drop */}
              <div className="hidden md:flex space-x-4 overflow-x-auto pb-4">
                {applicationStages.map((stage) => {
                  const stageApplications = getApplicationsByStage(stage);
                  
                  return (
                    <div 
                      key={stage} 
                      className="flex-shrink-0 w-80 bg-white rounded-lg shadow-md"
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, stage)}
                    >
                      <div className="p-4 border-b border-gray-200">
                        <h2 className="font-semibold text-gray-700">{stage}</h2>
                        <div className="text-sm text-gray-500">{stageApplications.length} applications</div>
                      </div>
                      
                      <div className="p-2 max-h-[calc(100vh-220px)] overflow-y-auto min-h-[120px]">
                        {stageApplications.length > 0 ? (
                          stageApplications.map((app) => (
                            <div 
                              key={app.id} 
                              className="mb-3 p-3 bg-gray-50 rounded-md border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all cursor-move"
                              draggable
                              onDragStart={() => handleDragStart(app.id)}
                            >
                              <div className="font-medium text-gray-800">{app.company}</div>
                              <div className="text-gray-600">{app.position}</div>
                              <div className="mt-2 flex justify-between items-center">
                                <div className="text-xs text-gray-500">
                                  Applied: {formatDate(app.dateApplied)}
                                </div>
                                {app.notes && (
                                  <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                    Notes
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-3 text-center text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-md mt-2 h-24 flex items-center justify-center">
                            Drop application here
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}