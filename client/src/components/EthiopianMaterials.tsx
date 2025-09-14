import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, DollarSign, Package } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { EthiopianMaterial } from "@shared/schema";

export default function EthiopianMaterials() {
  const { data, isLoading, error } = useQuery<{ success: boolean; materials: EthiopianMaterial[] }>({
    queryKey: ["/api/ethiopian-materials"],
  });

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-destructive">
            🇪🇹 Ethiopian Materials Database - Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Failed to load Ethiopian materials database. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          🇪🇹 Ethiopian Materials Database
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Explore local mineral resources and traditional materials
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-full mb-3" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="ethiopian-materials-list">
            {data?.materials?.map((material) => (
              <MaterialCard key={material.id} material={material} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MaterialCard({ material }: { material: EthiopianMaterial }) {
  const getGradientClass = (name: string) => {
    if (name.toLowerCase().includes('lalibela')) {
      return "bg-gradient-to-br from-ethiopian-green/5 to-ethiopian-yellow/5 border-ethiopian-green/20";
    } else if (name.toLowerCase().includes('tigray')) {
      return "bg-gradient-to-br from-ethiopian-yellow/5 to-ethiopian-red/5 border-ethiopian-yellow/20";
    } else if (name.toLowerCase().includes('gold')) {
      return "bg-gradient-to-br from-ethiopian-red/5 to-ethiopian-green/5 border-ethiopian-red/20";
    }
    return "bg-gradient-to-br from-muted/20 to-muted/40 border-border";
  };

  return (
    <Card className={getGradientClass(material.name)} data-testid={`material-card-${material.id}`}>
      <CardContent className="p-4">
        <h4 className="text-sm font-medium text-foreground mb-2">{material.name}</h4>
        <p className="text-xs text-muted-foreground mb-3">{material.description}</p>
        
        <div className="space-y-2 text-xs">
          {/* Location */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              <span>Location</span>
            </div>
            <span className="font-medium">{material.location}</span>
          </div>

          {/* Availability */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Package className="h-3 w-3 mr-1" />
              <span>Availability</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {material.availability}
            </Badge>
          </div>

          {/* Cost */}
          {material.estimatedCost && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <DollarSign className="h-3 w-3 mr-1" />
                <span>Est. Cost</span>
              </div>
              <span className="font-medium">${material.estimatedCost}/kg</span>
            </div>
          )}

          {/* Main composition elements */}
          {material.composition && typeof material.composition === 'object' && 'elements' in material.composition && (material.composition as any).elements && (
            <div className="mt-3">
              <div className="text-xs text-muted-foreground mb-1">Main Elements:</div>
              <div className="flex flex-wrap gap-1">
                {((material.composition as any).elements as any[])
                  .slice(0, 3)
                  .map((element, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {element.element}: {element.percentage}%
                    </Badge>
                  ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
