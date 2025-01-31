// AssetManager.tsx
"use client"

import { useState, useEffect, useCallback } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AssetTable } from "./AssetTable";
import { Badge } from 'lucide-react'
import { FinalDeliverables } from "./FinalDeliverables";
import { UsageRightsTable } from "./UsageRightsTable";
import { VersionControlTable } from "./VersionControlTable";
import { WorkingFilesTable } from "./WorkingFilesTable";
import { AssetRequestsTable } from "./AssetRequestsTable";
import { AssetCategoryTabs } from "./AssetCategoryTabs";
import { AssetForm } from "./AssetForm";
import { Asset, AssetCategory, AssetLicense, AssetStatus, AssetType, AssetRequest, AssetVersion, AssetComment } from '@/types/assets'
import { useToast } from 'others/use-toast';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from "date-fns";


type AssetManagementProps = {
    isAdmin: boolean
    projectStatus: 'active' | 'completed'
    projectId: string
    onAssetUpdate?: (asset: Asset) => void
    onError?: (error: Error) => void
    apiClient: any // Replace with your actual API client
    storageClient: any // Replace with your actual storage client
}


export function AssetManagement({ isAdmin, projectStatus, projectId, onAssetUpdate, onError, apiClient, storageClient }: AssetManagementProps) {
    const { toast } = useToast();
    const [assets, setAssets] = useState<Asset[]>([])
    const [assetRequests, setAssetRequests] = useState<AssetRequest[]>([])
    const [newAssetDialogOpen, setNewAssetDialogOpen] = useState(false)
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [assetComments, setAssetComments] = useState<AssetComment[]>([]);
    const [searchTerm, setSearchTerm] = useState('')
     const [loading, setLoading] = useState(true);
      const [activeTab, setActiveTab] = useState('library')

    // --- Loading and Error Handling ---
    const loadAssets = useCallback(async () => {
      setLoading(true)
      try {
            const fetchedAssets = await apiClient.getAssets(projectId)
            setAssets(fetchedAssets)
            setLoading(false)
        } catch (error: any) {
            toast({
              title: 'Error fetching Assets',
              description: error.message,
                variant: 'destructive'
            })
          onError?.(error);
      }
      finally {
        setLoading(false);
      }
    }, [apiClient, projectId, onError, toast]);


  const loadAssetRequests = useCallback(async () => {
    try {
      const fetchedRequests = await apiClient.getAssetRequests(projectId)
        setAssetRequests(fetchedRequests)
    } catch (error: any) {
      toast({
        title: 'Error fetching Asset Requests',
        description: error.message,
          variant: 'destructive'
      })
      onError?.(error);
    }
  }, [apiClient, projectId, onError, toast]);

    // --- Initial Load ---
    useEffect(() => {
        loadAssets();
        loadAssetRequests()
    }, [loadAssets, loadAssetRequests]);


    // --- Filter Assets ---
    const filteredAssets =  useCallback(()=> {
        if(!searchTerm) return assets;
       return assets.filter(asset =>
          asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [assets, searchTerm])


    // --- Create a New Asset ---
    const handleCreateAsset = useCallback(async (values: { name: string; type: AssetType; category: AssetCategory; description?: string, file?: File }) => {
        try {
            setLoading(true);
          const fileUrl = values.file ? await storageClient.uploadFile(values.file, projectId) : '/placeholder.svg';
          const newAsset: Asset = {
            id: Date.now().toString(),
            name: values.name,
            type: values.type,
            category: values.category,
            version: 1,
            versions: [],
            status: AssetStatus.DRAFT,
            lastModified: new Date().toISOString(),
            url: fileUrl,
            tags: [],
            metadata: {fileSize: values.file?.size || 0, format: values.file?.type || "Unknown"},
            license: AssetLicense.STANDARD,
            territories: [],
            comments: [],
            downloadCount: 0,
            isLocked: false,
            description: values.description,
            history: [],
            reviewers: [] // Added reviewers property
          }
          await apiClient.createAsset(newAsset, projectId);
           setAssets((prevAssets) => [...prevAssets, newAsset]);
            toast({
              title: 'Asset Created',
              description: `${newAsset.name} was added successfully!`
            });
          onAssetUpdate?.(newAsset)
        } catch (error: any) {
            toast({
              title: 'Error Creating Asset',
              description: error.message,
              variant: "destructive"
            })
            onError?.(error);
        } finally {
            setLoading(false);
            setNewAssetDialogOpen(false);
        }
    }, [apiClient, storageClient, projectId, onAssetUpdate, onError, toast]);


    // --- Update Asset ---
    const handleUpdateAsset = useCallback(async (asset: Asset, updates: Partial<Asset>) => {
        try {
           setLoading(true);
          const updatedAsset = { ...asset, ...updates };
          await apiClient.updateAsset(updatedAsset, projectId);
            setAssets(prevAssets => prevAssets.map(a => a.id === asset.id ? updatedAsset : a));
            if(selectedAsset?.id === asset.id) {
                setSelectedAsset(updatedAsset)
            }
             toast({
              title: 'Asset Updated',
              description: `${asset.name} has been updated.`
            })

           onAssetUpdate?.(updatedAsset);
        } catch (error: any) {
            toast({
              title: 'Error Updating Asset',
              description: error.message,
                variant: 'destructive'
            })
            onError?.(error);
        }
        finally {
            setLoading(false)
            setIsEditDialogOpen(false);
        }
    }, [apiClient, projectId, onError, toast, onAssetUpdate, selectedAsset?.id]);

    //--- Handle Delete Asset ---
  const handleDeleteAsset = useCallback(async (asset: Asset) => {
    try {
      setLoading(true);
      await apiClient.deleteAsset(asset.id, projectId);
      setAssets(prevAssets => prevAssets.filter(a => a.id !== asset.id));
        toast({
          title: 'Asset Deleted',
          description: `${asset.name} has been deleted.`
        })
    } catch (error: any) {
      toast({
        title: 'Error Deleting Asset',
        description: error.message,
          variant: 'destructive'
      });
      onError?.(error);
    }
    finally {
        setLoading(false)
    }
  }, [apiClient, projectId, onError, toast]);


    // --- Handle View Asset ---
    const handleViewAsset = useCallback(async (asset: Asset) => {
      setSelectedAsset(asset);
      setIsViewDialogOpen(true)
        try {
            const comments = await apiClient.getAssetComments(asset.id, projectId)
            setAssetComments(comments);
        } catch (error:any) {
          toast({
            title: 'Error fetching Comments',
            description: error.message,
            variant: 'destructive'
          })
        }

    }, [apiClient, projectId, toast]);


    // --- Handle Edit Asset ---
    const handleEditAsset = useCallback((asset: Asset) => {
        setSelectedAsset(asset)
      setIsEditDialogOpen(true)
    }, [])


    // --- Handle Download Asset---
     const handleDownloadAsset = useCallback(async (asset: Asset) => {
         try {
             setLoading(true);
              const url = await apiClient.getAssetUrl(asset.id, projectId)
              window.location.href = url;
             await apiClient.incrementAssetDownloadCount(asset.id, projectId);
              setAssets(prev => prev.map(prevAsset => prevAsset.id === asset.id ? { ...prevAsset, downloadCount: prevAsset.downloadCount + 1} : prevAsset));
               toast({
                   title: 'Download started',
                   description: `Asset ${asset.name} will be downloaded shortly`
               });
          } catch (error: any) {
              toast({
                title: 'Error Downloading Asset',
                description: error.message,
                  variant: "destructive"
              })
                onError?.(error);
           }
          finally {
              setLoading(false)
          }
     }, [apiClient, projectId, onError, toast])


    // --- Handle upload asset version ---
  const handleUploadVersion = useCallback(async (asset:Asset, file: File) => {
    try {
      setLoading(true);
      const fileUrl = await storageClient.uploadFile(file, projectId);
        const newVersion: AssetVersion = {
            version: asset.versions.length + 1,
            createdAt: new Date().toISOString(),
            timestamp: new Date().toISOString(),
            action: "upload",
            createdBy: "User", // TODO get the correct user
            changes: "uploaded new version", // TODO add the ability to add comments on new version
            fileUrl

        }
      const updatedAsset: Asset = {
          ...asset,
          versions: [...asset.versions, newVersion],
          version: newVersion.version,
          lastModified: newVersion.createdAt
      }
        await apiClient.updateAsset(updatedAsset, projectId);
      setAssets(prevAssets => prevAssets.map(a => a.id === asset.id ? updatedAsset : a));
         toast({
          title: 'Asset Updated',
          description: `${asset.name} new version has been uploaded`
        });
    }
    catch (error: any) {
         toast({
                title: 'Error Updating Asset',
                description: error.message,
                variant: 'destructive'
            })
           onError?.(error);
    }
    finally {
        setLoading(false)
    }
  }, [apiClient, storageClient, projectId, onError, toast])

    // ---Handle  View Asset Version---
    const handleViewAssetVersion = (version: AssetVersion) => {
        console.log('view version', version)
    }

      // ---Handle  Restore Asset Version---
    const handleRestoreAssetVersion = async (asset: Asset, version:AssetVersion) => {
        try {
             setLoading(true);
             const updatedAsset: Asset = {
                ...asset,
                version: version.version,
                 lastModified: version.createdAt,
                 url: version.fileUrl
            }
             await apiClient.updateAsset(updatedAsset, projectId);
            setAssets(prevAssets => prevAssets.map(a => a.id === asset.id ? updatedAsset : a));
               toast({
                    title: 'Asset Updated',
                    description: `Asset ${asset.name} has been restored to version: ${version.version}`
                })
        } catch(error: any) {
                toast({
                    title: 'Error Updating Asset',
                    description: error.message,
                    variant: 'destructive'
                })
                 onError?.(error);
        }
        finally {
            setLoading(false)
        }

    }


    // ---Handle Compare Asset Version ---
    const handleCompareAssetVersion = (version1: AssetVersion, version2: AssetVersion) => {
        console.log("compare versions", version1, version2)
    }


    //--- Handle Asset Request Actions ---
   const handleAssetRequestAction = useCallback(async (request: AssetRequest, status: 'approved' | 'rejected' | 'in-progress') => {
     try {
       setLoading(true)
          const updatedRequest = { ...request, status: status };
         await apiClient.updateAssetRequest(updatedRequest, projectId);
          setAssetRequests(prev => prev.map(r => r.id === request.id ? updatedRequest : r));

       toast({
            title: `Request ${status}`,
            description: `Asset request ${request.id} has been ${status} successfully!`
        })
    }
    catch (error: any) {
        toast({
            title: 'Error Updating Request',
            description: error.message,
            variant: 'destructive'
        })
         onError?.(error);
    }
    finally {
      setLoading(false)
    }
  }, [apiClient, projectId, onError, toast])


    const handleViewAssetRequest = (request: AssetRequest) => {
        console.log("view details", request)
    }


    const handleAddComment = useCallback(async (asset:Asset, comment:string) => {
        try {
          setLoading(true)
            const newComment: AssetComment = {
                id: Date.now().toString(),
                userId: "User", // TODO get the current user
                userName: "User", // TODO get the current user name
                content: comment,
                timestamp: new Date().toISOString()
            }
            const updatedAsset: Asset = {
                ...asset,
                comments: [...asset.comments, newComment]
            }
           await apiClient.updateAsset(updatedAsset, projectId)
            setAssets(prevAssets => prevAssets.map(a => a.id === asset.id ? updatedAsset : a));
            if(selectedAsset?.id === asset.id) {
                setSelectedAsset(updatedAsset)
              setAssetComments(prev => [...prev, newComment])
            }

             toast({
                title: 'Comment added',
                description: `Comment has been added successfully!`
            });
        } catch (error: any) {
             toast({
                    title: 'Error Adding Comment',
                    description: error.message,
                    variant: 'destructive'
                })
                onError?.(error);
        }
        finally {
             setLoading(false)
        }
    }, [apiClient, projectId, onError, toast, selectedAsset?.id])

     const handleResolveComment = useCallback(async (asset:Asset, comment: AssetComment) => {
       try {
          setLoading(true)
          const updatedComment = { ...comment, resolvedAt: new Date().toISOString() };
            const updatedAsset = {
                ...asset,
                comments: asset.comments.map(c => c.id === comment.id ? updatedComment : c)
            }
            await apiClient.updateAsset(updatedAsset, projectId);
             setAssets(prevAssets => prevAssets.map(a => a.id === asset.id ? updatedAsset : a));
            if(selectedAsset?.id === asset.id) {
                setSelectedAsset(updatedAsset)
                setAssetComments(prev => prev.map(c => c.id === comment.id ? updatedComment : c))
            }
             toast({
                    title: 'Comment resolved',
                    description: `Comment has been resolved successfully!`
                });
        } catch (error: any) {
            toast({
              title: 'Error Resolving Comment',
              description: error.message,
                variant: 'destructive'
            })
            onError?.(error);
        }
        finally {
            setLoading(false)
        }

    }, [apiClient, projectId, onError, toast, selectedAsset?.id])



    const handleEditRights = useCallback(async (asset: Asset, updates: Partial<Asset>) => {
        await handleUpdateAsset(asset, updates)
    }, [handleUpdateAsset])

    const handleViewHistory = (asset: Asset) => {
        console.log("view history", asset)
    }


    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Asset Management</h2>
            <Tabs defaultValue="library" onValueChange={(value)=> setActiveTab(value)}>
                <TabsList>
                    <TabsTrigger value="library">Asset Library</TabsTrigger>
                    <TabsTrigger value="categories">Asset Categories</TabsTrigger>
                    {isAdmin && <TabsTrigger value="version-control">Version Control</TabsTrigger>}
                    {projectStatus === 'active' && (
                        <>
                            <TabsTrigger value="working-files">Working Files</TabsTrigger>
                            <TabsTrigger value="asset-requests">Asset Requests</TabsTrigger>
                        </>
                    )}
                    {projectStatus === 'completed' && (
                        <>
                            <TabsTrigger value="final-deliverables">Final Deliverables</TabsTrigger>
                            {isAdmin && <TabsTrigger value="usage-rights">Usage Rights</TabsTrigger>}
                        </>
                    )}
                </TabsList>

                <TabsContent value="library">
                    <Card>
                        <CardHeader>
                            <div className='flex items-center justify-between'>
                            <CardTitle>Asset Library</CardTitle>
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search assets..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-8 w-[200px]"
                                    />
                                </div>
                            </div>

                            <CardDescription>View and manage all project assets</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AssetTable
                                assets={filteredAssets()}
                                isLoading={loading}
                                isAdmin={isAdmin}
                                onView={handleViewAsset}
                                onEdit={handleEditAsset}
                                onDelete={handleDeleteAsset}
                                onDownload={handleDownloadAsset}
                            />
                             {isAdmin && (
                                <Dialog open={newAssetDialogOpen} onOpenChange={setNewAssetDialogOpen}>
                                    <AssetForm
                                        open={newAssetDialogOpen}
                                        onOpenChange={setNewAssetDialogOpen}
                                        onSubmit={handleCreateAsset}
                                    />
                                </Dialog>
                            )}
                            {isAdmin && (
                                <Button className="mt-4" onClick={() => setNewAssetDialogOpen(true)}>
                                    Add New Asset
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="categories">
                    <AssetCategoryTabs
                        assets={assets}
                        isAdmin={isAdmin}
                        onView={handleViewAsset}
                        onDownload={handleDownloadAsset}
                    />
                </TabsContent>

                {isAdmin && (
                    <TabsContent value="version-control">
                        <Card>
                            <CardHeader>
                                <CardTitle>Version Control</CardTitle>
                                <CardDescription>Track asset versions and changes</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {selectedAsset ? (
                                    <VersionControlTable
                                        asset={selectedAsset}
                                        onUploadVersion={async (file) => {
                                            await handleUploadVersion(selectedAsset, file)
                                          }}
                                        onViewVersion={handleViewAssetVersion}
                                        onRestoreVersion={(version) => handleRestoreAssetVersion(selectedAsset, version)}
                                        onCompareVersions={handleCompareAssetVersion}
                                    />
                                ) : (
                                    <div className='flex items-center justify-center h-[200px] text-muted-foreground'>
                                        <p>Select an asset to manage versions</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                )}

                {projectStatus === 'active' && (
                    <>
                        <TabsContent value="working-files">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Working Files</CardTitle>
                                    <CardDescription>Current versions and review status</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <WorkingFilesTable
                                        assets={filteredAssets()}
                                        isAdmin={isAdmin}
                                        onView={handleViewAsset}
                                        onEdit={handleEditAsset}
                                        onManageAccess={handleEditAsset}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="asset-requests">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Asset Requests</CardTitle>
                                    <CardDescription>Manage new asset creation and modifications</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <AssetRequestsTable
                                        requests={assetRequests}
                                        isAdmin={isAdmin}
                                        onReview={(request) => handleAssetRequestAction(request, 'in-progress')}
                                        onApprove={(request) => handleAssetRequestAction(request, 'approved')}
                                        onReject={(request) => handleAssetRequestAction(request, 'rejected')}
                                        onViewDetails={handleViewAssetRequest}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </>
                )}

                {projectStatus === 'completed' && (
                    <>
                        <TabsContent value="final-deliverables">
                            <FinalDeliverables
                                assets={filteredAssets()}
                                isAdmin={isAdmin}
                                onDownload={handleDownloadAsset}
                                onView={handleViewAsset}
                                isLoading={loading}
                            />
                        </TabsContent>

                        {isAdmin && (
                            <TabsContent value="usage-rights">
                                <UsageRightsTable
                                    assets={filteredAssets()}
                                    onEditRights={handleEditRights}
                                    onViewHistory={handleViewHistory}
                                     territories={['Worldwide', 'US', 'EU', 'Asia']}
                                />
                            </TabsContent>
                        )}
                    </>
                )}
            </Tabs>
           {/* --- Edit Asset Dialog --- */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Asset</DialogTitle>
                        <DialogDescription>
                            Edit the details of the asset
                        </DialogDescription>
                    </DialogHeader>
                     {selectedAsset && (
                         <AssetForm
                           open={isEditDialogOpen}
                           onOpenChange={setIsEditDialogOpen}
                           onSubmit={(values) => handleUpdateAsset(selectedAsset, { ...values })}
                           />
                            )}
                </DialogContent>
            </Dialog>

               {/* --- View Asset Dialog --- */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className='max-w-4xl'>
                  {selectedAsset && (
                      <div className='space-y-6'>
                       <DialogHeader>
                             <div className='flex justify-between items-center'>
                                  <DialogTitle>{selectedAsset.name}</DialogTitle>
                                  <div className='text-sm text-muted-foreground'>
                                      Added on: {format(new Date(selectedAsset.lastModified), 'PPp')}
                                 </div>
                             </div>

                            <DialogDescription className='text-sm'>{selectedAsset.description}</DialogDescription>
                         </DialogHeader>
                          <div className='flex gap-6'>
                              <div className='flex-1'>
                                  {selectedAsset.type === 'media' && (
                                    <video src={selectedAsset.url} controls className='w-full aspect-video rounded-md'/>
                                   )}
                                   {selectedAsset.type === 'graphic' && (
                                   <img src={selectedAsset.url} alt={selectedAsset.name} className='w-full rounded-md'/>
                                   )}
                                     {selectedAsset.type === 'audio' && (
                                     <audio src={selectedAsset.url} controls className='w-full rounded-md'/>
                                   )}
                                       {(selectedAsset.type === 'document' || selectedAsset.type === '3d-model') && (
                                      <div className='flex items-center justify-center w-full p-8 text-muted-foreground border-2 border-dashed rounded-md'>
                                           <p>No Preview available</p>
                                       </div>
                                   )}
                              </div>

                               <div className='flex-1'>
                                 <div className='flex justify-between items-center'>
                                     <h3 className='text-lg font-medium'>Comments ({assetComments.length})</h3>
                                      <Button variant="outline" onClick={() => console.log("show all comments")} size="sm">All Comments</Button>
                                 </div>
                                   <ScrollArea className='h-[300px]'>
                                    <div className='space-y-4'>
                                            {assetComments.map((comment) => (
                                                 <div key={comment.id} className='rounded-md p-4 shadow-sm bg-muted'>
                                                     <div className='flex justify-between items-center text-sm text-muted-foreground'>
                                                        <p>{comment.userName} - {format(new Date(comment.timestamp), 'PPp')}</p>
                                                        {comment.resolvedAt && (
                                                        <Badge variant="secondary">Resolved {format(new Date(comment.resolvedAt), "PPp")}</Badge>
                                                        )}
                                                     </div>
                                                      <p className='mt-1'>{comment.content}</p>
                                                    {!comment.resolvedAt && (
                                                        <div className='flex justify-end mt-2'>
                                                                <Button size="sm" onClick={()=> handleResolveComment(selectedAsset, comment)}>Resolve</Button>
                                                           </div>
                                                      )}
                                                </div>
                                            ))}
                                   </div>
                                    </ScrollArea>
                                    <div className='mt-4'>
                                         <form onSubmit={(e) => {
                                             e.preventDefault()
                                             const formData = new FormData(e.target as HTMLFormElement)
                                            const comment = formData.get('comment') as string
                                             handleAddComment(selectedAsset, comment)
                                            ;(e.target as HTMLFormElement).reset()
                                        }}
                                        >
                                           <div className='flex gap-2'>
                                            <Input type="text" name='comment' placeholder='Add a comment...'/>
                                            <Button type='submit' size="sm">Add comment</Button>
                                           </div>
                                        </form>
                                     </div>
                               </div>
                          </div>
                      </div>
                     )}
                  </DialogContent>
            </Dialog>
        </div>
    )
}