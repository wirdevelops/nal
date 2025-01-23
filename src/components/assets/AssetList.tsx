import { useState, useRef } from 'react';
import { File, ImageIcon, VideoIcon, Search, Upload, RotateCw, Download, Edit, Trash2, X, Check, AlertTriangle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface Asset {
    id: string;
    name: string;
    type: 'image' | 'video' | 'document';
    category: string;
    versions: AssetVersion[]; // Store versions as an array
    currentVersionId: string; // Keep track of the current version
    size: number; // Add file size
    description?: string; // Add optional description
    tags?: string[]; // Add optional tags
    uploader?: string; // Add uploader
    metadata?: Record<string, any>; // Customizable metadata object
}

interface AssetVersion {
  id: string;
    version: number; // Version number
    lastModified: string;
  url: string;
    uploader?: string;
   notes?: string;
   metadata?: Record<string, any>; // Customizable metadata object
}
const initialAssets: Asset[] = [
    {
        id: '1',
        name: 'Concept Art 1',
        type: 'image',
        category: 'Concept Art',
        versions: [{
            id: 'v1-1',
            version: 1,
            lastModified: '2024-07-01',
              url: 'https://images.unsplash.com/photo-1682685797088-588424666999?w=200',
            uploader: 'John Doe'
        }],
        currentVersionId: 'v1-1',
         size: 120000,
        uploader: 'John Doe',
        metadata: {
           artist: 'John Doe',
           createdDate: '2024-07-01',
            format: 'JPEG',
        },
    },
    {
        id: '2',
        name: 'Scene 1 Footage',
        type: 'video',
        category: 'Footage',
       versions: [{
           id: 'v2-1',
           version: 1,
           lastModified: '2024-07-05',
           url: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
             uploader: 'Jane Smith'
       },
           {
               id: 'v2-2',
               version: 2,
               lastModified: '2024-07-07',
               url: 'https://samplelib.com/lib/preview/mp4/sample-15s.mp4',
               notes: 'Updated Color Grade',
               uploader: 'Jane Smith'
           }
       ],
         currentVersionId: 'v2-2',
        size: 500000,
         uploader: 'Jane Smith',
        metadata: {
           director: 'Jane Smith',
           format: 'MP4',
            duration: '15 seconds'
       }
    },
    {
        id: '3',
        name: 'Script Draft 3',
        type: 'document',
        category: 'Scripts',
        versions: [{
            id: 'v3-1',
            version: 1,
            lastModified: '2024-07-10',
             url: '/sample.pdf',
              uploader: 'John Doe'
        }],
        currentVersionId: 'v3-1',
          size: 30000,
        uploader: 'John Doe',
        metadata: {
          writer: 'John Doe',
            version: 3,
           lastEdited: '2024-07-10',
            format: 'PDF'
        }
    },
    {
        id: '4',
        name: 'Character Design 1',
        type: 'image',
        category: 'Character Design',
        versions: [{
             id: 'v4-1',
            version: 1,
            lastModified: '2024-07-12',
             url: 'https://images.unsplash.com/photo-1682685797088-588424666999?w=200',
                uploader: 'Jane Smith'
        }],
        currentVersionId: 'v4-1',
        size: 150000,
         uploader: 'Jane Smith',
        metadata: {
          artist: 'Jane Smith',
          character: 'Main Character',
            format: 'JPEG'
        }
    },
    {
        id: '5',
        name: 'Scene 2 Footage',
        type: 'video',
        category: 'Footage',
         versions: [{
             id: 'v5-1',
             version: 1,
             lastModified: '2024-07-15',
            url: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
             uploader: 'John Doe'
        }],
        currentVersionId: 'v5-1',
        size: 600000,
        uploader: 'John Doe',
        metadata: {
             director: 'John Doe',
            format: 'MP4',
            duration: '5 seconds'
        }
    },
    {
        id: '6',
        name: 'Script Draft 4',
        type: 'document',
        category: 'Scripts',
        versions: [{
             id: 'v6-1',
             version: 1,
             lastModified: '2024-07-18',
               url: '/sample.pdf',
               uploader: 'Jane Smith'
        }],
         currentVersionId: 'v6-1',
        size: 40000,
        uploader: 'Jane Smith',
         metadata: {
            writer: 'Jane Smith',
           version: 4,
            lastEdited: '2024-07-18',
             format: 'PDF'
        }
    },
    {
        id: '7',
        name: 'Location Concept 1',
        type: 'image',
        category: 'Concept Art',
         versions: [{
              id: 'v7-1',
            version: 1,
            lastModified: '2024-07-20',
             url: 'https://images.unsplash.com/photo-1682685797088-588424666999?w=200',
              uploader: 'John Doe'
        }],
         currentVersionId: 'v7-1',
         size: 180000,
         uploader: 'John Doe',
          metadata: {
            artist: 'John Doe',
           location: 'London',
              format: 'JPEG'
          }
    },
    {
        id: '8',
        name: 'Scene 3 Footage',
        type: 'video',
        category: 'Footage',
        versions: [{
            id: 'v8-1',
            version: 1,
            lastModified: '2024-07-22',
           url: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
                uploader: 'Jane Smith'
        },
         {
            id: 'v8-2',
            version: 2,
            lastModified: '2024-07-24',
            url: 'https://samplelib.com/lib/preview/mp4/sample-3s.mp4',
                uploader: 'Jane Smith',
                notes: 'Shortened scene',
                metadata: {
                  duration: '3 seconds'
                }
        }],
         currentVersionId: 'v8-2',
          size: 700000,
        uploader: 'Jane Smith',
           metadata: {
               director: 'Jane Smith',
                format: 'MP4',
              duration: '3 seconds'
           }
    },
    {
        id: '9',
        name: 'Script Draft 5',
        type: 'document',
        category: 'Scripts',
        versions: [{
            id: 'v9-1',
            version: 1,
            lastModified: '2024-07-25',
             url: '/sample.pdf',
             uploader: 'John Doe'
        }],
        currentVersionId: 'v9-1',
        size: 50000,
         uploader: 'John Doe',
        metadata: {
          writer: 'John Doe',
          version: 5,
            lastEdited: '2024-07-25',
            format: 'PDF'
        }
    }
];

interface AssetListProps {
    assets: Asset[];
}

function AssetItem({ asset, onSelect, onBulkSelect, isSelected }: { asset: Asset, onSelect: (asset: Asset) => void, onBulkSelect: (id: string) => void, isSelected: boolean }) {
    const Icon = asset.type === 'image' ? ImageIcon : asset.type === 'video' ? VideoIcon : File;
    const currentVersion = asset.versions.find(v => v.id === asset.currentVersionId)
      const preview = asset.type === 'image' ? <img src={currentVersion?.url || ''} alt={asset.name} className="w-10 h-10 rounded-md object-cover" /> :
        asset.type === 'video' ? <video src={currentVersion?.url || ''} className='w-10 h-10 rounded-md object-cover'/> :
                <File className="w-6 h-6 text-gray-600 dark:text-gray-400" />

    return (
        <div onClick={() => onSelect(asset)} className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center space-x-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${isSelected ? 'border-2 border-primary' : ''}`}>
             <input
                type='checkbox'
                 checked={isSelected}
                onChange={() => onBulkSelect(asset.id)}
                className="rounded-md border-gray-300 dark:border-gray-700 focus:ring-primary focus:border-primary mr-2"
            />
            <div className="w-12 h-12 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                {preview}
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">{asset.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {asset.category} - Version {currentVersion?.version}
                </p>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(currentVersion?.lastModified || '').toLocaleDateString()}
            </div>
        </div>
    );
}

export function AssetList({ assets, onAssetSelect, selectedAssets, onBulkSelect }: { assets: Asset[], onAssetSelect: (asset: Asset) => void, selectedAssets: string[], onBulkSelect: (id: string) => void }) {
    return (
        <div className="space-y-4">
            {assets.map((asset) => (
                <AssetItem key={asset.id} asset={asset} onSelect={onAssetSelect} isSelected={selectedAssets.includes(asset.id)} onBulkSelect={onBulkSelect}/>
            ))}
        </div>
    );
}

// New Components
function AssetDetailModal({ asset, onClose, onAssetUpdate }: { asset: Asset, onClose: () => void, onAssetUpdate: (asset: Asset) => void }) {
    const [editedAsset, setEditedAsset] = useState({...asset})
    const [showVersionHistory, setShowVersionHistory] = useState(false);
     const [selectedVersion, setSelectedVersion] = useState<AssetVersion | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setEditedAsset((prevAsset) => ({ ...prevAsset, [name]: value }));
    };

    const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        const { value } = e.target;
         setEditedAsset((prevAsset) => ({
           ...prevAsset,
             metadata: {
               ...prevAsset.metadata,
               [key]: value
           }
        }));
    };

    const handleSave = () => {
       const updatedAsset = {...editedAsset}
        onAssetUpdate(updatedAsset);
        onClose();
    }

    const handleDownload = () => {
         // Create a link element
          const currentVersion = asset.versions.find(v => v.id === asset.currentVersionId);
        const link = document.createElement('a');

        // Set the href to the asset URL and download attribute
        link.href = currentVersion?.url || '';
        link.download = asset.name;

        // Append the link to the document, trigger click, and remove it
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const handleVersionSelect = (version: AssetVersion) => {
       setSelectedVersion(version);
        setShowVersionHistory(false); // Close version history

    }
    const handleRevert = () => {
       const newAsset = {...editedAsset}
        newAsset.currentVersionId = selectedVersion?.id || '';
        onAssetUpdate(newAsset);
         setSelectedVersion(null);
    }
    const handleRollback = () => {
       const currentVersion = editedAsset.versions.find(v => v.id === editedAsset.currentVersionId);
          const newVersion: AssetVersion = {
            id: uuidv4(),
              version: editedAsset.versions.length + 1,
              lastModified: new Date().toISOString().split('T')[0],
              url: selectedVersion?.url || '',
            uploader: 'Current User',
            notes: 'Rolled back to version ' + selectedVersion?.version,
            metadata: {...selectedVersion?.metadata}
        }
        const newAsset: Asset = {...editedAsset}
         newAsset.versions = [...editedAsset.versions, newVersion];
           newAsset.currentVersionId = newVersion.id;
           onAssetUpdate(newAsset);
        setSelectedVersion(null);
    }

     const currentVersion = asset.versions.find(v => v.id === asset.currentVersionId)
    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/75 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-700 rounded-lg p-6 space-y-4 w-full max-w-2xl relative">
                <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100">
                    <X className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-semibold">{asset.name}</h2>
                <div className='flex items-center space-x-4'>
                   {asset.type === 'image' && <img src={currentVersion?.url || ''} alt={asset.name} className='max-w-md max-h-96 rounded-md' />}
                    {asset.type === 'video' && <video src={currentVersion?.url || ''} controls className='max-w-md max-h-96 rounded-md' />}
                    {asset.type === 'document' && <div className='flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-600 rounded-md'>
                        <File className='w-12 h-12 text-gray-600 dark:text-gray-400' />
                    </div>}
                </div>
                 <div className='flex items-center space-x-2'>
                   <label className='block font-semibold text-gray-900 dark:text-gray-100'>Name:</label>
                   <input type="text" name="name" value={editedAsset.name} onChange={handleInputChange} className='rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 w-full' />
                </div>
                 <div className='flex items-center space-x-2'>
                   <label className='block font-semibold text-gray-900 dark:text-gray-100'>Category:</label>
                    <input type="text" name="category" value={editedAsset.category} onChange={handleInputChange} className='rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 w-full' />
                </div>
                 <div className='flex items-start space-x-2'>
                    <label className='block font-semibold text-gray-900 dark:text-gray-100'>Description:</label>
                     <textarea name="description" value={editedAsset.description || ''} onChange={handleInputChange} className='rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 w-full' />
                </div>
                <div className='space-y-2'>
                   <h3 className='font-semibold text-gray-900 dark:text-gray-100'>Metadata:</h3>
                    {Object.entries(editedAsset.metadata || {}).map(([key, value]) => (
                      <div key={key} className='flex items-center space-x-2'>
                         <label className='block font-semibold text-gray-900 dark:text-gray-100 capitalize'>{key}:</label>
                         <input type='text' value={value} onChange={(e) => handleMetadataChange(e, key)} className='rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 w-full' />
                       </div>
                   ))}
                </div>
              <div className='flex items-center justify-between'>
                    <button
                        onClick={handleDownload}
                        className="flex items-center px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                    >
                        <Download className='w-4 h-4 mr-2' />
                        Download
                    </button>
                 <div className='flex items-center space-x-2'>
                     <button
                           onClick={() => setShowVersionHistory(true)}
                           className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                        >
                           View Versions ({asset.versions.length})
                        </button>
                   <button
                        onClick={handleSave}
                        className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition-colors"
                    >
                        Save
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                    >
                        Cancel
                    </button>
                 </div>
                </div>
                {showVersionHistory && (
                        <div className='bg-gray-100 dark:bg-gray-800 rounded-md p-4 mt-4 max-h-80 overflow-y-auto'>
                            <h4 className='font-semibold text-gray-800 dark:text-gray-200'>Version History</h4>
                             <ul className='space-y-2 mt-2'>
                                {editedAsset.versions.map((version) => (
                                  <li key={version.id}
                                       onClick={() => handleVersionSelect(version)}
                                       className={`p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer ${selectedVersion?.id === version.id ? 'bg-gray-200 dark:bg-gray-700' : ''}`}>
                                    Version {version.version} - {new Date(version.lastModified).toLocaleDateString()} - {version.notes}
                                  </li>
                                ))}
                            </ul>
                           {selectedVersion && (
                                <div className='mt-4 flex justify-end space-x-2'>
                                    <button onClick={handleRevert} className='px-4 py-2 rounded-md bg-yellow-500 text-white hover:bg-yellow-600 transition-colors'>
                                        Revert
                                     </button>
                                     <button onClick={handleRollback} className='px-4 py-2 rounded-md bg-yellow-500 text-white hover:bg-yellow-600 transition-colors'>
                                         Rollback
                                    </button>
                                 </div>
                            )}
                          <button
                               onClick={() => setShowVersionHistory(false)}
                               className="mt-4 px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors w-full"
                           >
                            Close
                          </button>
                      </div>
                 )}
            </div>
        </div>
    )
}

export function AssetManagement() {
    const [assets, setAssets] = useState(initialAssets);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showUploadModal, setShowUploadModal] = useState(false);
     const [uploadQueue, setUploadQueue] = useState<any[]>([])
    const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
    const [showAssetModal, setShowAssetModal] = useState(false)
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
    const [customMetadataFields, setCustomMetadataFields] = useState<string[]>(['artist', 'director', 'writer', 'character', 'location', 'createdDate', 'lastEdited', 'format', 'duration'])

    const fileInputRef = useRef<HTMLInputElement>(null)
    const dragRef = useRef<HTMLDivElement>(null)


    const categories = ['All', ...new Set(initialAssets.map(asset => asset.category))];

    const filteredAssets = assets.filter(asset => {
        const searchMatch = asset.name.toLowerCase().includes(searchQuery.toLowerCase());
        const categoryMatch = selectedCategory === 'All' || asset.category === selectedCategory;
        return searchMatch && categoryMatch;
    });

     const handleAssetSelect = (asset: Asset) => {
        setSelectedAsset(asset);
        setShowAssetModal(true)
     }

     const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
          e.preventDefault()
        if(e.dataTransfer.files) {
            const files = Array.from(e.dataTransfer.files);
             uploadFiles(files)
        }
     }
     const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
         e.preventDefault()
     }


      const uploadFiles = async (files: File[]) => {
         const newUploads = files.map(file => ({id: uuidv4(), file, progress: 0, status: 'pending' }));
         setUploadQueue(prevQueue => [...prevQueue, ...newUploads])
          files.forEach(async (file, index) => {
           try {
              const newAsset: Asset = {
                  id: uuidv4(),
                    name: file.name,
                    type: file.type.startsWith('image') ? 'image' : file.type.startsWith('video') ? 'video' : 'document',
                    category: 'Uploaded',
                  versions: [{
                      id: uuidv4(),
                       version: 1,
                      lastModified: new Date().toISOString().split('T')[0],
                       url: URL.createObjectURL(file),
                       uploader: 'Current User'
                  }],
                    currentVersionId: uuidv4(),
                     size: file.size,
                    uploader: 'Current User',
                     metadata: {}
               };

                 // Initialize the upload
            const fileUploadProgress = (progressEvent: ProgressEvent) => {
                 const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                  setUploadQueue(prevQueue => prevQueue.map(upload => {
                      if (upload.file === file) {
                       return {...upload, progress, status: 'uploading'}
                      }
                        return upload
                    }))
                };

                 const reader = new FileReader()
                 reader.onload = () => {
                      // Simulate progress with a timeout
                         setTimeout(() => {
                            setAssets(prevAssets => [...prevAssets, newAsset]);
                            setUploadQueue(prevQueue => prevQueue.map(upload => {
                                if (upload.file === file) {
                                return {...upload, status: 'completed'}
                                 }
                                 return upload
                             }))
                         }, 1000)
                 }
                reader.onprogress = fileUploadProgress
              reader.readAsDataURL(file)
           } catch (error) {
                 console.error('Error uploading file:', error);
                 setUploadQueue(prevQueue => prevQueue.map(upload => {
                      if (upload.file === file) {
                       return {...upload, status: 'error'}
                       }
                       return upload
                  }))
           }

        });
          setShowUploadModal(false);

     };

   const handleCancelUpload = (id: string) => {
         setUploadQueue(prevQueue => prevQueue.map(upload => {
           if (upload.id === id) {
              return {...upload, status: 'cancelled'}
           }
          return upload
         }))
   }

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.files) {
            const files = Array.from(event.target.files)
            uploadFiles(files)
        }

     };


    const handleAssetUpdate = (updatedAsset: Asset) => {
        setAssets((prevAssets) =>
            prevAssets.map((asset) => (asset.id === updatedAsset.id ? updatedAsset : asset))
        );
        setShowAssetModal(false)
        setSelectedAsset(null)
    };

    const handleBulkSelect = (id: string) => {
      if (selectedAssets.includes(id)) {
           setSelectedAssets(selectedAssets.filter(assetId => assetId !== id));
        } else {
             setSelectedAssets([...selectedAssets, id])
        }
    }
    const handleBulkDelete = () => {
      setAssets(prevAssets => prevAssets.filter(asset => !selectedAssets.includes(asset.id)));
       setSelectedAssets([]);
    }

    const handleBulkDownload = () => {
      selectedAssets.forEach(assetId => {
          const asset = assets.find(asset => asset.id === assetId);
           if(asset) {
               const currentVersion = asset.versions.find(v => v.id === asset.currentVersionId);
                  // Create a link element
                  const link = document.createElement('a');

                  // Set the href to the asset URL and download attribute
                  link.href = currentVersion?.url || '';
                  link.download = asset.name;

                  // Append the link to the document, trigger click, and remove it
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
          }
        })
    }

    const isAssetSelected = (assetId: string) => selectedAssets.includes(assetId);

    return (
        <div className="p-6 space-y-6">
            {/* Toolbar */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search assets..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-primary focus:border-primary"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <Search className="w-4 h-4 text-gray-500" />
                        </div>
                    </div>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800  dark:text-gray-200 focus:ring-primary focus:border-primary"
                    >
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>
                <div className='flex items-center space-x-2'>
                    {selectedAssets.length > 0 &&
                        <div className='flex items-center space-x-2'>
                            <button onClick={handleBulkDownload} className="flex items-center px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                                <Download className='w-4 h-4 mr-2' />
                                Download ({selectedAssets.length})
                            </button>
                           <button
                                onClick={handleBulkDelete}
                                className="flex items-center px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
                           >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete ({selectedAssets.length})
                           </button>
                       </div>
                     }
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/80 transition-colors"
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                    </button>
                </div>
            </div>

            {/* Asset List */}
            <AssetList assets={filteredAssets} onAssetSelect={handleAssetSelect} selectedAssets={selectedAssets} onBulkSelect={handleBulkSelect}/>

           {/* Asset Detail Modal */}
            {showAssetModal && selectedAsset && (
                <AssetDetailModal asset={selectedAsset} onClose={() => setShowAssetModal(false)} onAssetUpdate={handleAssetUpdate} />
            )}

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/75 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-700 rounded-lg p-6 space-y-4">
                        <h2 className="text-xl font-semibold">Upload New Asset</h2>
                         <div className="relative w-full" onDrop={handleDrop} onDragOver={handleDragOver} ref={dragRef}>
                            <input type="file" multiple ref={fileInputRef} onChange={handleFileUpload} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
                                 <div className="relative flex justify-center items-center h-40 bg-gray-100 dark:bg-gray-800 rounded-md border-2 border-dashed border-gray-400 dark:border-gray-600 text-center text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                           <div>
                                                 <Upload className='w-10 h-10 mx-auto' />
                                                 <p>Drag and drop files here or click to select</p>
                                           </div>
                                </div>
                           </div>
                         {uploadQueue.length > 0 && (
                           <div className='mt-4 space-y-2 max-h-60 overflow-y-auto'>
                             {uploadQueue.map((upload) => (
                                 <div key={upload.id} className='flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded-md'>
                                    <div className='flex items-center space-x-2'>
                                        {upload.status === 'completed' && <Check className='w-4 h-4 text-green-500' />}
                                         {upload.status === 'error' && <AlertTriangle className='w-4 h-4 text-red-500' />}
                                       <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>{upload.file.name}</p>
                                   </div>
                                    <div className='flex items-center space-x-2'>
                                    {upload.status === 'uploading' && (
                                        <div className='flex flex-col items-end'>
                                            <p className='text-xs text-gray-500 dark:text-gray-400'>{upload.progress}%</p>
                                              <div className='w-24 h-1 bg-gray-200 dark:bg-gray-600 rounded-full'>
                                               <div className='h-1 bg-green-500 rounded-full' style={{width: `${upload.progress}%`}}></div>
                                            </div>
                                      </div>
                                    )}
                                    {upload.status !== 'completed' && upload.status !== 'error' &&
                                        <button
                                        onClick={() => handleCancelUpload(upload.id)}
                                        className='text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors'
                                        >
                                            <X className='w-4 h-4' />
                                        </button>
                                    }

                                </div>

                                </div>
                             ))}
                           </div>
                         )}
                           <div className="flex justify-end">
                            <button
                                onClick={() => {
                                    setShowUploadModal(false)
                                    setUploadQueue([])
                                 }}
                                className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}