import { Badge } from "@/components/ui/badge";
import { Clock, Eye, CheckCircle, Lock, XCircle } from "lucide-react";
import { AssetStatus } from "@/types/assets";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface StatusBadgeProps {
  status: AssetStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    draft: {
      color: "bg-gray-200 text-gray-700",
      icon: Clock,
      tooltip: "Draft: Asset is not yet ready for review",
    },
    "in-review": {
      color: "bg-yellow-100 text-yellow-800",
      icon: Eye,
      tooltip: "In Review: Asset is currently under review",
    },
    approved: {
      color: "bg-green-100 text-green-800",
      icon: CheckCircle,
      tooltip: "Approved: Asset has been approved and is ready for use",
    },
    archived: {
      color: "bg-purple-100 text-purple-800",
      icon: Lock,
      tooltip: "Archived: Asset is no longer in use",
    },
    rejected: {
      color: "bg-red-100 text-red-800",
      icon: XCircle,
      tooltip: "Rejected: Asset has been rejected and requires changes",
    },
  } as const;

  const config = statusConfig[status];

  if (!config) {
    return <Badge>Unknown Status</Badge>;
  }

  const Icon = config.icon;

  return (
    <Tooltip>
      <TooltipTrigger>
        <Badge className={`${config.color} flex items-center gap-1`}>
          <Icon className="w-3 h-3" />
          {status}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p>{config.tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}