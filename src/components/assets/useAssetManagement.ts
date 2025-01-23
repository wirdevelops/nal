import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Asset, AssetRequest, AssetComment, AssetType, AssetCategory, AssetStatus, AssetLicense } from "@/types/assets";

export function useAssetManagement(apiClient: any, storageClient: any, projectId: string, onAssetUpdate?: (asset: Asset) => void, onError?: (error: Error) => void) {
  const { toast } = useToast();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetRequests, setAssetRequests] = useState<AssetRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [assetComments, setAssetComments] = useState<AssetComment[]>([]);

  const loadAssets = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedAssets = await apiClient.getAssets(projectId);
      setAssets(fetchedAssets);
    } catch (error: any) {
      toast({ title: "Error fetching Assets", description: error.message, variant: "destructive" });
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [apiClient, projectId, onError, toast]);

  const loadAssetRequests = useCallback(async () => {
    try {
      const fetchedRequests = await apiClient.getAssetRequests(projectId);
      setAssetRequests(fetchedRequests);
    } catch (error: any) {
      toast({ title: "Error fetching Asset Requests", description: error.message, variant: "destructive" });
      onError?.(error);
    }
  }, [apiClient, projectId, onError, toast]);

  const handleCreateAsset = useCallback(async (values: { name: string; type: AssetType; category: AssetCategory; description?: string; file?: File }) => {
    setLoading(true);
    try {
      const fileUrl = values.file ? await storageClient.uploadFile(values.file, projectId) : "/placeholder.svg";
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
        metadata: { fileSize: values.file?.size || 0, format: values.file?.type || "Unknown" },
        license: AssetLicense.STANDARD,
        territories: [],
        comments: [],
        downloadCount: 0,
        isLocked: false,
        description: values.description,
        reviewers: [],
        history: [], // Add the `history` property
      };
      await apiClient.createAsset(newAsset, projectId);
      setAssets((prev) => [...prev, newAsset]);
      toast({ title: "Asset Created", description: `${newAsset.name} was added successfully!` });
      onAssetUpdate?.(newAsset);
    } catch (error: any) {
      toast({ title: "Error Creating Asset", description: error.message, variant: "destructive" });
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [apiClient, storageClient, projectId, onAssetUpdate, onError, toast]);

  const handleUpdateAsset = useCallback(async (asset: Asset, updates: Partial<Asset>) => {
    setLoading(true);
    try {
      const updatedAsset = { ...asset, ...updates };
      await apiClient.updateAsset(updatedAsset, projectId);
      setAssets((prev) => prev.map((a) => (a.id === asset.id ? updatedAsset : a)));
      if (selectedAsset?.id === asset.id) setSelectedAsset(updatedAsset);
      toast({ title: "Asset Updated", description: `${asset.name} has been updated.` });
      onAssetUpdate?.(updatedAsset);
    } catch (error: any) {
      toast({ title: "Error Updating Asset", description: error.message, variant: "destructive" });
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [apiClient, projectId, onAssetUpdate, onError, toast, selectedAsset?.id]);

  const handleDeleteAsset = useCallback(async (asset: Asset) => {
    setLoading(true);
    try {
      await apiClient.deleteAsset(asset.id, projectId);
      setAssets((prev) => prev.filter((a) => a.id !== asset.id));
      toast({ title: "Asset Deleted", description: `${asset.name} has been deleted.` });
    } catch (error: any) {
      toast({ title: "Error Deleting Asset", description: error.message, variant: "destructive" });
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [apiClient, projectId, onError, toast]);

  return {
    assets,
    assetRequests,
    loading,
    selectedAsset,
    assetComments,
    setSelectedAsset,
    setAssetComments,
    loadAssets,
    loadAssetRequests,
    handleCreateAsset,
    handleUpdateAsset,
    handleDeleteAsset,
  };
}