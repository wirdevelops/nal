import { useEffect, useMemo } from 'react';
import { useProjectStore } from '@/stores/useProjectStore';
import type { NGOProject, ProjectStatus, ProjectCategory, ProjectLocation } from '@/types/ngo/project';
import { ProjectState, ProjectActions } from '@/stores/useNGOProjectStore';
export interface ProjectFilters {
  search?: string;
  status?: ProjectStatus | 'all';
  category?: ProjectCategory | 'all';
  location?: Partial<ProjectLocation>;
  minBeneficiaries?: number;
}

export const useProjects = (filters: ProjectFilters = {}) => {
  const { 
    projects, 
    loading, 
    error, 
    fetchProjects 
  } = useProjectStore() as unknown as ProjectState & ProjectActions;
 
  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = !filters.search || 
        project.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        project.description.toLowerCase().includes(filters.search.toLowerCase());

      const matchesStatus = !filters.status || 
        filters.status === 'all' || 
        project.status === filters.status;

      const matchesCategory = !filters.category || 
        filters.category === 'all' || 
        project.category === filters.category;

      const matchesLocation = !filters.location || 
        (!filters.location.country || project.location.country === filters.location.country) &&
        (!filters.location.city || project.location.city === filters.location.city);

      const matchesBeneficiaries = !filters.minBeneficiaries ||
        project.beneficiaries.reduce((sum, b) => sum + b.count, 0) >= filters.minBeneficiaries;

      return matchesSearch && matchesStatus && matchesCategory && 
             matchesLocation && matchesBeneficiaries;
    });
  }, [projects, filters]);

  const metrics = useMemo(() => ({
    projectCount: filteredProjects.length,
    totalBeneficiaries: filteredProjects.reduce((sum, p) => 
      sum + p.beneficiaries.reduce((bSum, b) => bSum + b.count, 0), 0),
    totalVolunteers: filteredProjects.reduce((sum, p) => sum + p.team.length, 0),
    ongoingProjects: filteredProjects.filter(p => p.status === 'ongoing').length,
  }), [filteredProjects]);

  return {
    projects: filteredProjects,
    metrics,
    loading,
    error,
    isEmpty: filteredProjects.length === 0,
    refresh: fetchProjects,
  };
};
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