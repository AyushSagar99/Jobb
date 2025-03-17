'use client';

import React, { useState } from "react";
import { useJobApplications } from "@/context/job-context";
import { PlusCircle } from "lucide-react";
import Sidebar from "./components/sidebar";

export default function Home() {
  const { jobApplications, updateJobApplication } = useJobApplications();
  const [draggingId, setDraggingId] = useState<number | null>(null);

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

  // Empty state when no applications exist
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center">
      <div className="bg-gray-50 p-12 rounded-lg shadow-sm border border-gray-200 max-w-md">
        <div className="bg-blue-100 rounded-full p-4 inline-flex mb-6">
          <PlusCircle size={32} className="text-blue-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">No applications yet</h2>
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

  // Drag and drop handlers
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
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar/>
      
      <main className="flex-1 overflow-x-auto overflow-y-auto bg-gray-100 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Job Application Board</h1>
          <p className="text-gray-600">Track your applications by stage</p>
        </div>
        
        {jobApplications.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex space-x-4 overflow-x-auto pb-4">
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
        )}
      </main>
    </div>
  );
}