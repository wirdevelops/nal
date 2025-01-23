import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

interface SeriesCardProps {
  series: {
    id: number
    title: string
    status: string
    image: string
    description: string
    seasons: number
  }
}

export function SeriesCard({ series }: SeriesCardProps) {
  return (
    <Card className="overflow-hidden">
      <Image
        src={series.image}
        alt={series.title}
        width={400}
        height={200}
        className="w-full h-48 object-cover"
      />
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{series.title}</CardTitle>
          <Badge>{series.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-2">{series.description}</p>
        <p className="font-semibold">Seasons: {series.seasons}</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/tv-series/${series.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}