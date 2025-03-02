"use client"

import { Card, CardBody, Skeleton, Button } from '@heroui/react'
import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import { Icon } from "@iconify/react"

const images = [
    {
        src: "/hero-images/Charismatic Young Man with a Warm Smile and Stylish Tousled Hair.jpeg",
        alt: "Charismatic Young Man with a Warm Smile"
    },
    {
        src: "/hero-images/Confident Businesswoman on Turquoise Backdrop.jpeg",
        alt: "Confident Businesswoman on Turquoise Backdrop"
    },
    {
        src: "/hero-images/Confident Woman in Red Outfit.jpeg",
        alt: "Confident Woman in Red Outfit"
    },
    {
        src: "/hero-images/Confident Woman in Urban Setting.jpeg",
        alt: "Confident Woman in Urban Setting"
    },
]

function GeneratedImages() {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: 'center',
        skipSnaps: false,
        containScroll: 'trimSnaps',
        slidesToScroll: 1,
    })

    const [selectedIndex, setSelectedIndex] = useState(0)
    const [loadedImages, setLoadedImages] = useState<{ [key: string]: boolean }>({})
    const [canScrollPrev, setCanScrollPrev] = useState(false)
    const [canScrollNext, setCanScrollNext] = useState(false)

    useEffect(() => {
        if (!emblaApi) return

        emblaApi.on('select', () => {
            setSelectedIndex(emblaApi.selectedScrollSnap())
            setCanScrollPrev(emblaApi.canScrollPrev())
            setCanScrollNext(emblaApi.canScrollNext())
        })

        // Initial state
        setCanScrollPrev(emblaApi.canScrollPrev())
        setCanScrollNext(emblaApi.canScrollNext())

        // Recompute on resize
        window.addEventListener('resize', () => emblaApi.reInit())

        return () => {
            window.removeEventListener('resize', () => emblaApi.reInit())
        }
    }, [emblaApi])

    const handleImageLoad = (src: string) => {
        setLoadedImages(prev => ({ ...prev, [src]: true }))
    }

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

    if (images.length === 0) {
        return (
            <Card className='w-full max-w-2xl'>
                <CardBody className='flex aspect-square items-center justify-center p-6 text-2xl font-semibold'>
                    No Images Generated
                </CardBody>
            </Card>
        )
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="relative group flex items-center gap-2">
                <Button
                    isIconOnly
                    className="hover:scale-105 shrink-0 bg-content1"
                    disabled={!canScrollPrev}
                    size="md"
                    variant="flat"
                    onPress={scrollPrev}
                >
                    <Icon 
                        className="w-5 h-5 text-content1-foreground" 
                        icon="solar:arrow-left-linear"
                    />
                </Button>

                <div ref={emblaRef} className="overflow-hidden flex-1">
                    <div className="flex touch-pan-y select-none">
                        {images.map((image, index) => (
                            <div key={index} className="flex-[0_0_100%] min-w-0 relative pl-4">
                                <Card className="w-full">
                                    <CardBody className="relative aspect-square">
                                        {!loadedImages[image.src] && (
                                            <div className="absolute inset-0 z-10">
                                                <Skeleton className="w-full h-full rounded-lg animate-pulse" />
                                            </div>
                                        )}
                                        <Image
                                            fill
                                            alt={image.alt}
                                            className={`object-cover rounded-lg transition-opacity duration-300 ${
                                                loadedImages[image.src] ? 'opacity-100' : 'opacity-0'
                                            }`}
                                            draggable={false}
                                            priority={index === 0}
                                            quality={90}
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            src={image.src}
                                            onLoad={() => handleImageLoad(image.src)}
                                        />
                                    </CardBody>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>

                <Button
                    isIconOnly
                    className="hover:scale-105 ml-4 shrink-0 bg-content1"
                    disabled={!canScrollNext}
                    size="md"
                    variant="flat"
                    onPress={scrollNext}
                >
                    <Icon 
                        className="w-5 h-5 text-content1-foreground" 
                        icon="solar:arrow-right-linear"
                    />
                </Button>

                {/* Dots */}
                <div className="absolute left-0 right-0 -bottom-6 flex justify-center gap-2">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all ${index === selectedIndex ? 'bg-content4 w-4' : 'bg-content4-foreground'}`}
                            onClick={() => emblaApi?.scrollTo(index)}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default GeneratedImages
