import React, { lazy, Suspense } from "react"
import type { CarouselContent } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Badge } from "@/Components/ui/badge"
import { Button } from "@/Components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/Components/ui/collapsible"
import { ChevronDown, ChevronUp } from "lucide-react"

const LazyEditCarouselContentAlert = lazy(() => import("./EditCarouselContentAlert"))
const LazyDeleteCarouselContentAlert = lazy(() => import("./DeleteCarouselContentAlert"))
const LazyCreateCarouselContentAlert = lazy(() => import("./CreateCarouselContentAlert"))

interface CarouselContentListProps {
  carouselContents: CarouselContent[]
}

export function CarouselContentList({ carouselContents }: CarouselContentListProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Carousel Content
          <div className="flex items-center space-x-2">
            <Suspense
              fallback={
                <Button variant="outline" size="sm" disabled>
                  Create New
                </Button>
              }
            >
              <LazyCreateCarouselContentAlert />
            </Suspense>
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </div>
        </CardTitle>
      </CardHeader>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleContent>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {carouselContents.map((content) => (
              <Card key={content.id} className="overflow-hidden group relative">
                <div className="aspect-video w-full relative">
                  <img
                    src={"storage/" + content.image_url || "/placeholder.svg"}
                    alt={content.tag}
                    className="object-cover w-full h-full"
                  />
                  <Badge
                    className="absolute top-2 right-2"
                    variant={content.status === "active" ? "default" : "secondary"}
                  >
                    {content.status}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <p className="font-semibold">{content.tag}</p>
                  <p className="text-sm text-muted-foreground">Order: {content.order}</p>
                </CardContent>
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex space-x-2">
                    <Suspense
                      fallback={
                        <Button variant="secondary" size="sm" disabled>
                          Edit
                        </Button>
                      }
                    >
                      <LazyEditCarouselContentAlert content={content} />
                    </Suspense>
                    <Suspense
                      fallback={
                        <Button variant="secondary" size="sm" disabled>
                          Delete
                        </Button>
                      }
                    >
                      <LazyDeleteCarouselContentAlert id={content.id} tag={content.tag} />
                    </Suspense>
                  </div>
                </div>
              </Card>
            ))}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}

