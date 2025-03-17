import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the JobApplication type
interface JobApplication {
  id: number;
  company: string;
  position: string;
  stage: string;
  dateApplied: string;
  notes: string;
}

// Define the context type
interface JobApplicationContextType {
  jobApplications: JobApplication[];
  addJobApplication: (application: Omit<JobApplication, 'id'>) => void;
  updateJobApplication: (application: JobApplication) => void;
  deleteJobApplication: (id: number) => void;
}

// Create the context
const JobApplicationContext = createContext<JobApplicationContextType | undefined>(undefined);

// Empty initial state - no hardcoded applications
const initialApplications: JobApplication[] = [];

interface JobApplicationProviderProps {
  children: ReactNode;
}

// Create the provider component
export const JobApplicationProvider: React.FC<JobApplicationProviderProps> = ({ children }) => {
  const [jobApplications, setJobApplications] = useState<JobApplication[]>(initialApplications);

  const addJobApplication = (application: Omit<JobApplication, 'id'>) => {
    const newApplication = {
      ...application,
      id: jobApplications.length > 0 
        ? Math.max(...jobApplications.map(app => app.id)) + 1 
        : 1
    };
    
    setJobApplications([...jobApplications, newApplication]);
  };

  const updateJobApplication = (updatedApplication: JobApplication) => {
    setJobApplications(
      jobApplications.map(app => 
        app.id === updatedApplication.id ? updatedApplication : app
      )
    );
  };

  const deleteJobApplication = (id: number) => {
    setJobApplications(jobApplications.filter(app => app.id !== id));
  };

  return (
    <JobApplicationContext.Provider 
      value={{ 
        jobApplications, 
        addJobApplication, 
        updateJobApplication, 
        deleteJobApplication 
      }}
    >
      {children}
    </JobApplicationContext.Provider>
  );
};

// Create a custom hook for using the context
export const useJobApplications = () => {
  const context = useContext(JobApplicationContext);
  if (context === undefined) {
    throw new Error('useJobApplications must be used within a JobApplicationProvider');
  }
  return context;
};