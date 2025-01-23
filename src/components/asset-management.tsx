"use client"

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

type Asset = {
  id: string
  name: string
  type: 'media' | 'graphic' | 'audio'
  category: 'pre-production' | 'production' | 'post-production'
  version: number
  status: 'in-review' | 'approved' | 'archived'
  lastModified: string
  url: string
}

type AssetManagementProps = {
  isAdmin: boolean
  projectStatus: 'active' | 'completed'
}

export function AssetManagement({ isAdmin, projectStatus }: AssetManagementProps) {
  const [assets, setAssets] = useState<Asset[]>([
    { id: '1', name: 'Concept Art', type: 'graphic', category: 'pre-production', version: 1, status: 'approved', lastModified: '2023-05-15', url: '/placeholder.svg' },
    { id: '2', name: 'Trailer Music', type: 'audio', category: 'post-production', version: 2, status: 'in-review', lastModified: '2023-05-20', url: '/placeholder.mp3' },
    { id: '3', name: 'Scene 1 Footage', type: 'media', category: 'production', version: 1, status: 'approved', lastModified: '2023-05-18', url: '/placeholder.mp4' },
  ])

  const [newAsset, setNewAsset] = useState<Partial<Asset>>({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewAsset({ ...newAsset, [name]: value })
  }

  const handleAddAsset = () => {
    if (newAsset.name && newAsset.type && newAsset.category) {
      const asset: Asset = {
        id: Date.now().toString(),
        name: newAsset.name,
        type: newAsset.type as 'media' | 'graphic' | 'audio',
        category: newAsset.category as 'pre-production' | 'production' | 'post-production',
        version: 1,
        status: 'in-review',
        lastModified: new Date().toISOString().split('T')[0],
        url: '/placeholder.svg', // This would be replaced with actual file upload logic
      }
      setAssets([...assets, asset])
      setNewAsset({})
      setIsDialogOpen(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Asset Management</h2>
      <Tabs defaultValue="library">
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
              <CardTitle>Asset Library</CardTitle>
              <CardDescription>View and manage all project assets</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Modified</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell>{asset.name}</TableCell>
                      <TableCell>{asset.type}</TableCell>
                      <TableCell>{asset.category}</TableCell>
                      <TableCell>{asset.version}</TableCell>
                      <TableCell>{asset.status}</TableCell>
                      <TableCell>{asset.lastModified}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {isAdmin && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="mt-4">Add New Asset</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Asset</DialogTitle>
                      <DialogDescription>Enter the details for the new asset</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" name="name" value={newAsset.name || ''} onChange={handleInputChange} className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">Type</Label>
                        <Select name="type" onValueChange={(value) => handleInputChange({ target: { name: 'type', value } } as any)}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="media">Media</SelectItem>
                            <SelectItem value="graphic">Graphic</SelectItem>
                            <SelectItem value="audio">Audio</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">Category</Label>
                        <Select name="category" onValueChange={(value) => handleInputChange({ target: { name: 'category', value } } as any)}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pre-production">Pre-production</SelectItem>
                            <SelectItem value="production">Production</SelectItem>
                            <SelectItem value="post-production">Post-production</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button onClick={handleAddAsset}>Add Asset</Button>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Asset Categories</CardTitle>
              <CardDescription>View assets by production phase</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="pre-production">
                <TabsList>
                  <TabsTrigger value="pre-production">Pre-production</TabsTrigger>
                  <TabsTrigger value="production">Production</TabsTrigger>
                  <TabsTrigger value="post-production">Post-production</TabsTrigger>
                </TabsList>
                {['pre-production', 'production', 'post-production'].map((category) => (
                  <TabsContent key={category} value={category}>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Version</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {assets.filter(asset => asset.category === category).map((asset) => (
                          <TableRow key={asset.id}>
                            <TableCell>{asset.name}</TableCell>
                            <TableCell>{asset.type}</TableCell>
                            <TableCell>{asset.version}</TableCell>
                            <TableCell>{asset.status}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="version-control">
            <Card>
              <CardHeader>
                <CardTitle>Version Control</CardTitle>
                <CardDescription>Track asset versions and changes</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Version</TableHead>
                      <TableHead>Last Modified</TableHead>
                      <TableHead>Change Log</TableHead>
                      <TableHead>Approval Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assets.map((asset) => (
                      <TableRow key={asset.id}>
                        <TableCell>{asset.name}</TableCell>
                        <TableCell>{asset.version}</TableCell>
                        <TableCell>{asset.lastModified}</TableCell>
                        <TableCell>
                          <Button variant="outline">View Changes</Button>
                        </TableCell>
                        <TableCell>{asset.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Current Version</TableHead>
                        <TableHead>Review Status</TableHead>
                        {isAdmin && <TableHead>Access Control</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assets.map((asset) => (
                        <TableRow key={asset.id}>
                          <TableCell>{asset.name}</TableCell>
                          <TableCell>{asset.version}</TableCell>
                          <TableCell>{asset.status}</TableCell>
                          {isAdmin && (
                            <TableCell>
                              <Button variant="outline">Manage Access</Button>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
                  <Button className="mb-4">New Asset Request</Button>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Request Type</TableHead>
                        <TableHead>Asset Name</TableHead>
                        <TableHead>Requested By</TableHead>
                        <TableHead>Status</TableHead>
                        {isAdmin && <TableHead>Actions</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>New Creation</TableCell>
                        <TableCell>Character Concept Art</TableCell>
                        <TableCell>John Doe</TableCell>
                        <TableCell>Pending</TableCell>
                        {isAdmin && (
                          <TableCell>
                            <Button variant="outline">Review</Button>
                          </TableCell>
                        )}
                      </TableRow>
                      <TableRow>
                        <TableCell>Modification</TableCell>
                        <TableCell>Main Theme Music</TableCell>
                        <TableCell>Jane Smith</TableCell>
                        <TableCell>In Progress</TableCell>
                        {isAdmin && (
                          <TableCell>
                            <Button variant="outline">Review</Button>
                          </TableCell>
                        )}
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}

        {projectStatus === 'completed' && (
          <>
            <TabsContent value="final-deliverables">
              <Card>
                <CardHeader>
                  <CardTitle>Final Deliverables</CardTitle>
                  <CardDescription>Master files and distribution copies</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Version</TableHead>
                        <TableHead>Format</TableHead>
                        {isAdmin && <TableHead>Actions</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assets.filter(asset => asset.status === 'approved').map((asset) => (
                        <TableRow key={asset.id}>
                          <TableCell>{asset.name}</TableCell>
                          <TableCell>{asset.type}</TableCell>
                          <TableCell>{asset.version}</TableCell>
                          <TableCell>High Resolution</TableCell>
                          {isAdmin && (
                            <TableCell>
                              <Button variant="outline">Download</Button>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {isAdmin && (
              <TabsContent value="usage-rights">
                <Card>
                  <CardHeader>
                    <CardTitle>Usage Rights</CardTitle>
                    <CardDescription>Track licenses and rights for project assets</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Asset Name</TableHead>
                          <TableHead>License Type</TableHead>
                          <TableHead>Expiration Date</TableHead>
                          <TableHead>Territory Rights</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {assets.map((asset) => (
                          <TableRow key={asset.id}>
                            <TableCell>{asset.name}</TableCell>
                            <TableCell>Standard License</TableCell>
                            <TableCell>2025-12-31</TableCell>
                            <TableCell>Worldwide</TableCell>
                            <TableCell>
                              <Button variant="outline">Manage Rights</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </>
        )}
      </Tabs>
    </div>
  )
}
