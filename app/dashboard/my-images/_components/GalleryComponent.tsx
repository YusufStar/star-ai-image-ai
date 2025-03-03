"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { Card, CardBody, Skeleton, Button } from "@heroui/react"
import { Icon } from "@iconify/react"
import { motion, AnimatePresence } from "framer-motion"
import { useMediaQuery } from "usehooks-ts"

import GalleryDetailModal from "./GalleryDetailModal"

import { Tables } from "@/database.type"
import { getImages } from "@/actions/image-actions"
import { cn } from "@/lib/utils"

type ImageProps = {
    url: string | undefined,
} & Tables<'generated_images'>

interface GalleryProps {
    images: ImageProps[]
}

const GalleryComponent = ({ images }: GalleryProps) => {
    const [loadedImages, setLoadedImages] = useState<{ [key: string]: boolean }>({})
    const [selectedImage, setSelectedImage] = useState<ImageProps | null>(null)
    const [realImages, setRealImages] = useState<ImageProps[]>(images)
    const [mounted, setMounted] = useState(false)
    const isMobile = useMediaQuery("(max-width: 768px)");

    const handleImageLoad = (src: string | undefined) => {
        if (src) {
            setLoadedImages(prev => ({ ...prev, [src]: true }))
        }
    }

    const refetchImages = async () => {
        const { data: images } = await getImages()

        if (!images) return
        setRealImages(images)
    }

    const handleCloseDrawer = () => {
        setSelectedImage(null)
    }

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return

    if (realImages.length === 0) {
        return (
            <div className="container mx-auto py-16 flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="mb-6">
                    <Icon
                        className="w-32 h-32 text-foreground-400"
                        icon="solar:gallery-wide-bold"
                    />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                    Your Gallery is Empty
                </h3>
                <p className="text-foreground-500 mb-6 max-w-md">
                    Start creating amazing AI-generated images to fill your gallery with stunning artwork.
                </p>
                <Button
                    color="primary"
                    href="/dashboard/create"
                    variant="solid"
                >
                    Create New Image
                </Button>
            </div>
        )
    }

    return (
        <section className="mx-auto">
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 3xl:columns-5 gap-4">
                <AnimatePresence>
                    {realImages.map((image) => {
                        return (
                            <motion.div
                                key={image.id}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mb-4 break-inside-avoid"
                                exit={{ opacity: 0, scale: 0.9 }}
                                initial={{ opacity: 0, scale: 0.9 }}
                                layout="position"
                                style={{
                                    width: '100%',
                                    aspectRatio: image.width! / image.height!
                                }}
                                transition={{
                                    opacity: { duration: 0.3 },
                                    layout: { duration: 0.3 }
                                }}
                            >
                                <Card className="relative w-full h-full overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl group">
                                    <CardBody className="p-0 relative w-full h-full">
                                        {!loadedImages[image.url!] && (
                                            <div className="absolute inset-0 z-10">
                                                <Skeleton className="w-full h-full rounded-lg animate-pulse" />
                                            </div>
                                        )}
                                        <div className="relative w-full h-full">
                                            <Image
                                                fill
                                                alt={image.prompt!}
                                                className={`object-cover rounded transition-opacity duration-300 ${loadedImages[image.url!] ? 'opacity-100' : 'opacity-0'}`}
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                                src={image.url!}
                                                style={{ objectFit: 'cover' }}
                                                onLoad={() => handleImageLoad(image.url)}
                                            />
                                        </div>
                                        {loadedImages[image.url!] && (
                                            <div className={cn(
                                                "absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-t from-black/60 via-transparent to-transparent",
                                                isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                            )}>
                                                <div className="flex items-center gap-2 self-end">
                                                    <button
                                                        className="bg-black/50 backdrop-blur-sm rounded-full p-2 hover:bg-black/70 transition-colors"
                                                        onClick={() => setSelectedImage(image)}
                                                    >
                                                        <Icon className="w-5 h-5 text-white" icon="solar:eye-bold" />
                                                    </button>
                                                </div>
                                                <div className="text-white text-sm">
                                                    {new Date(image.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </CardBody>
                                </Card>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>
            </div>

            <GalleryDetailModal
                image={selectedImage}
                isOpen={!!selectedImage}
                onClose={handleCloseDrawer}
                onDelete={() => refetchImages()}
            />
        </section>
    )
}

export default GalleryComponent