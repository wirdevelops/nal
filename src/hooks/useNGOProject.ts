// hooks/useNGOProject.ts
import { useCallback, useState } from 'react';
import { useNGOProjectStore } from '@/stores/useNGOProjectStore';
import { 
  NGOProject,
  ProjectMedia,
  TeamMember
} from '@/types/ngo/project';
import { toast } from '@/hooks/use-toast';

export function useNGOProject() {

  const { 
    projects,
    isLoading: storeLoading,
    error,
    calculateMetrics
  } = useNGOProjectStore(state => ({
    projects: state.projects,
    isLoading: state.isLoading,
    error: state.error,
    calculateMetrics: state.calculateMetrics
  }));

  const store = useNGOProjectStore();
  const [, setIsLoading] = useState(false);

  // Updated type to match store's expectation
  const createProject = useCallback(async (projectData: Omit<NGOProject, 'id' | 'createdAt' | 'updatedAt' | 'metrics'>) => {
    setIsLoading(true);
    try {
      store.createProject(projectData);
      toast({ title: 'Success', description: 'Project created successfully' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create project',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [store]);

    // Add media management
    const addProjectMedia = useCallback(async (projectId: string, media: File[]) => {
        try {
        store.addProjectMedia(projectId, media);
        toast({ title: 'Success', description: 'Media added successfully' });
        } catch (error) {
        toast({
            title: 'Error',
            description: 'Failed to add media',
            variant: 'destructive',
        });
        throw error;
        }
    }, [store]);

  const fetchProjects = useCallback(async () => {
    try {
      await store.fetchProjects();
    } catch (error) {
      toast({ variant: 'destructive', ...  error } );
    }
  }, [store]);

  // Add volunteer management
  const addVolunteer = useCallback(async (
    projectId: string,
    volunteer: Omit<TeamMember, 'userId' | 'joinDate' | 'hoursContributed'>
  ) => {
    try {
      store.addVolunteer(projectId, volunteer);
      toast({ title: 'Success', description: 'Volunteer added successfully' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add volunteer',
        variant: 'destructive',
      });
      throw error;
    }
  }, [store]);

  // Update return values
  return {
    projects,
  isLoading: storeLoading,
  error,
  createProject,
  updateProject: store.updateProject,
  deleteProject: store.deleteProject,
  addProjectMilestone: store.addMilestone,
  updateBudget: store.updateBudget,
  addProjectUpdate: store.addUpdate,
  addProjectReport: store.addReport,
  addProjectMedia,
  removeProjectMedia: store.removeProjectMedia,
  updateBeneficiaryCount: store.updateBeneficiaryCount,
  addVolunteer,
  updateVolunteerHours: store.updateVolunteerHours,
  calculateMetrics: calculateMetrics,
  getProjectMetrics: store.getProjectMetrics,
  getProjectById: store.getProjectById,
  getProjectsByStatus: store.getProjectsByStatus,
  getProjectsByLocation: store.getProjectsByLocation,
  fetchProjects
  };
}

// import { useCallback, useState } from 'react';
// import { useNGOProjectStore } from '@/stores/useNGOProjectStore';
// import { Milestone, Budget, Update, Report, NGOProject} from '@/types/ngo';
// import { toast } from '@/hooks/use-toast';

// export function useNGOProject() {
//   const store = useNGOProjectStore();
//   const [isLoading, setIsLoading] = useState(false);

//     /**
//      * Creates a new NGO project.
//      * @param projectData - The data for the new project.
//      */
//   const createProject = useCallback(async (projectData: Omit<NGOProject, 'id' | 'createdAt' | 'updatedAt'>) => {
//     setIsLoading(true);
//     try {
//       // Real API call implementation
//       // const response = await fetch('/api/projects', {
//       //   method: 'POST',
//       //   body: JSON.stringify(projectData),
//       //   headers: {
//       //     'Content-Type': 'application/json',
//       //   },
//       // });
//       // if(!response.ok){
//       //    const message = `An error has occured: ${response.status}`;
//       //   throw new Error(message);
//       // }
//       // const data = await response.json()
//       // store.addProject(data)
//       store.addProject(projectData); // Local state update
//       toast({
//         title: 'Success',
//         description: 'Project created successfully',
//       });
//     } catch (error: any) {
//       toast({
//         title: 'Error',
//         description: 'Failed to create project',
//         variant: 'destructive',
//       });
//        throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);


//   /**
//    * Updates an existing NGO project.
//    * @param id - The ID of the project to update.
//    * @param updates - The updates to apply to the project.
//    */
//   const updateProject = useCallback(async (id: string, updates: Partial<NGOProject>) => {
//     setIsLoading(true);
//     try {
//         // Real API call implementation
//       // const response = await fetch(`/api/projects/${id}`, {
//       //   method: 'PATCH',
//       //   body: JSON.stringify(updates),
//       //    headers: {
//       //     'Content-Type': 'application/json',
//       //   },
//       // });
//        // if(!response.ok){
//       //    const message = `An error has occured: ${response.status}`;
//       //   throw new Error(message);
//       // }
//       // const data = await response.json()
//       // store.updateProject(id, data)
//       store.updateProject(id, updates); // Local state update

//       toast({
//         title: 'Success',
//         description: 'Project updated successfully',
//       });
//     } catch (error: any) {
//       toast({
//         title: 'Error',
//         description: 'Failed to update project',
//         variant: 'destructive',
//       });
//        throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//     /**
//    * Adds a milestone to an existing NGO project.
//    * @param projectId - The ID of the project to add the milestone to.
//    * @param milestone - The milestone data.
//    */
//   const addProjectMilestone = useCallback(async (projectId: string, milestone: Omit<Milestone, 'id'>) => {
//     try {
//         // Real API call implementation
//       // const response = await fetch(`/api/projects/${projectId}/milestones`, {
//       //   method: 'POST',
//       //   body: JSON.stringify(milestone),
//       //    headers: {
//       //     'Content-Type': 'application/json',
//       //   },
//       // });
//        // if(!response.ok){
//       //    const message = `An error has occured: ${response.status}`;
//       //   throw new Error(message);
//       // }
//       // const data = await response.json()
//       // store.addMilestone(projectId, data)
//       store.addMilestone(projectId, milestone); // Local state update
//       toast({
//         title: 'Success',
//         description: 'Milestone added successfully',
//       });
//     } catch (error: any) {
//       toast({
//         title: 'Error',
//         description: 'Failed to add milestone',
//         variant: 'destructive',
//       });
//       throw error;
//     }
//   }, []);

//   /**
//    * Updates the budget of an existing NGO project.
//    * @param projectId - The ID of the project to update.
//    * @param budgetUpdates - The budget updates.
//    */
//   const updateBudget = useCallback(async (projectId: string, budgetUpdates: Partial<Budget>) => {
//     try {
//           // Real API call implementation
//       // const response = await fetch(`/api/projects/${projectId}/budget`, {
//       //   method: 'PATCH',
//       //   body: JSON.stringify(budgetUpdates),
//       //    headers: {
//       //     'Content-Type': 'application/json',
//       //   },
//       // });
//        // if(!response.ok){
//       //    const message = `An error has occured: ${response.status}`;
//       //   throw new Error(message);
//       // }
//       // const data = await response.json()
//       // store.updateBudget(projectId, data)
//       store.updateBudget(projectId, budgetUpdates); // Local state update
//       toast({
//         title: 'Success',
//         description: 'Budget updated successfully',
//       });
//     } catch (error: any) {
//       toast({
//         title: 'Error',
//         description: 'Failed to update budget',
//         variant: 'destructive',
//       });
//       throw error;
//     }
//   }, []);

//   /**
//    * Adds a new update to an NGO project.
//    * @param projectId The ID of the project
//    * @param update the update info
//    */
//   const addProjectUpdate = useCallback(async (projectId: string, update: { content: string; author: string }) => {
//         try {
//              // Real API call implementation
//           // const response = await fetch(`/api/projects/${projectId}/updates`, {
//           //   method: 'POST',
//           //    body: JSON.stringify(update),
//           //    headers: {
//           //     'Content-Type': 'application/json',
//           //   },
//           // });
//            // if(!response.ok){
//           //    const message = `An error has occured: ${response.status}`;
//           //   throw new Error(message);
//           // }
//           // const data = await response.json()
//          //  store.addUpdate(projectId, data)
//          store.addUpdate(projectId, update); // Local state update
//           toast({
//             title: 'Success',
//             description: 'Project update added successfully',
//           });
//         } catch (error: any) {
//           toast({
//             title: 'Error',
//             description: 'Failed to add project update',
//             variant: 'destructive',
//           });
//           throw error;
//         }
//       }, []);

//      /**
//      * Adds a new report to an NGO project.
//      * @param projectId The ID of the project
//      * @param report the report info
//      */
//   const addProjectReport = useCallback(async (projectId: string, report: { title: string; url: string }) => {
//         try {
//             // Real API call implementation
//           // const response = await fetch(`/api/projects/${projectId}/reports`, {
//           //   method: 'POST',
//           //    body: JSON.stringify(report),
//           //    headers: {
//           //     'Content-Type': 'application/json',
//           //   },
//           // });
//            // if(!response.ok){
//           //    const message = `An error has occured: ${response.status}`;
//           //   throw new Error(message);
//           // }
//           // const data = await response.json()
//          // store.addReport(projectId, data)
//          store.addReport(projectId, report); // Local state update
//           toast({
//             title: 'Success',
//             description: 'Project report added successfully',
//           });
//         } catch (error: any) {
//           toast({
//             title: 'Error',
//             description: 'Failed to add project report',
//             variant: 'destructive',
//           });
//           throw error;
//         }
//       }, []);


//   return {
//     projects: store.projects,
//     isLoading,
//     createProject,
//     updateProject,
//     addProjectMilestone,
//     updateBudget,
//     addProjectUpdate,
//     addProjectReport,
//   };
// }