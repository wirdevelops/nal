enum AssetType {
    MEDIA = 'media',
    GRAPHIC = 'graphic',
    AUDIO = 'audio',
    DOCUMENT = 'document',
    THREE_D_MODEL = '3d-model'
  }
  
  enum AssetCategory {
    PRE_PRODUCTION = 'pre-production',
    PRODUCTION = 'production',
    POST_PRODUCTION = 'post-production'
  }
  
  enum AssetStatus {
      DRAFT = 'draft',
      IN_REVIEW = 'in-review',
      APPROVED = 'approved',
      ARCHIVED = 'archived',
      REJECTED = 'rejected'
  }

  enum AssetLicense {
    STANDARD = 'standard',
    EXTENDED = 'extended',
    CUSTOM = 'custom',
    RESTRICTED = 'restricted'
  }

  interface AssetVersion {
    version: number
    createdAt: string
    createdBy: string
    changes: string
    fileUrl: string
    action: string
    timestamp: string
  }
  
  interface AssetComment {
    id: string
    userId: string
    userName: string
    content: string
    timestamp: string
    resolvedAt?: string
  }
  
  interface AssetMetadata {
    fileSize: number
    dimensions?: string
    duration?: string
    format: string
    resolution?: string
  }
  
  interface Asset {
    id: string
    name: string
    type: AssetType
    category: AssetCategory
    version: number
    versions: AssetVersion[]
    status: AssetStatus
    lastModified: string
    url: string
    description?: string
    tags: string[]
    license: AssetLicense
    expiryDate?: string
    territories: string[]
    metadata: AssetMetadata
    comments: AssetComment[]
    assignedTo?: string
    reviewers: string[]
    downloadCount: number
    isLocked: boolean
    history: AssetVersion[]
  }
  
  interface AssetRequest {
    id: string
    type: 'creation' | 'modification' | 'deletion'
    assetId?: string
    requestedBy: string
    requestedAt: string
    status: 'pending' | 'approved' | 'rejected' | 'in-progress'
    description: string
    priority: 'low' | 'medium' | 'high'
    dueDate?: string
  }
  
  interface AssetManagementProps {
    isAdmin: boolean
    projectStatus: 'active' | 'completed'
    projectId: string
    onAssetUpdate?: (asset: Asset) => void
    onError?: (error: Error) => void
  }

export { AssetType, AssetCategory, AssetStatus, AssetLicense }
export type { Asset, AssetRequest, AssetVersion, AssetComment, AssetMetadata }
