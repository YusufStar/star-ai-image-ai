"use client"

import { Card, CardBody, Skeleton, Button, addToast } from '@heroui/react'
import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import NextImage from 'next/image'
import { Icon } from "@iconify/react"
import { motion, AnimatePresence } from 'framer-motion'

import useGeneratedStore from '@/store/useGeneratedStore'

async function copyImageToClipboard(imageUrl: string) {
    try {
        // Fetch the image
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        // Convert to PNG using Canvas
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        return new Promise((resolve) => {
            img.onload = async () => {
                // Set canvas size to match image
                canvas.width = img.width;
                canvas.height = img.height;

                // Draw image onto canvas
                ctx?.drawImage(img, 0, 0);

                // Convert to PNG blob
                canvas.toBlob(async (pngBlob) => {
                    if (pngBlob) {
                        try {
                            // Copy PNG to clipboard
                            await navigator.clipboard.write([
                                new ClipboardItem({
                                    'image/png': pngBlob
                                })
                            ]);
                            resolve(true);
                        } catch (error) {
                            addToast({
                                title: "Copying PNG Error!",
                                description: String(error),
                                color: "danger"
                            })
                            resolve(false);
                        }
                    } else {
                        resolve(false);
                    }
                }, 'image/png');
            };

            img.onerror = () => resolve(false);

            img.src = URL.createObjectURL(blob);
        });
    } catch (error) {
        addToast({
            title: "Converting Image Error!",
            description: String(error),
            color: "danger"
        })

        return false;
    }
}

function GeneratedImages() {
    const images = useGeneratedStore((state) => state.images)
    const loading = useGeneratedStore((state) => state.loading)

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

    if (loading) {
        return (
            <AnimatePresence mode="wait">
                <motion.div
                    key="loading"
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    initial={{ opacity: 0 }}
                    style={{ width: '100%', maxWidth: '56rem', margin: '0 auto' }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="relative group flex items-center">
                        <Card className='w-full'>
                            <CardBody
                                className='relative flex flex-col items-center justify-center p-8 gap-4'
                                style={{ aspectRatio: '1 / 1' }}
                            >
                                <motion.div
                                    animate={{ scale: 1 }}
                                    initial={{ scale: 0.8 }}
                                    style={{ width: '4rem', height: '4rem' }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <Skeleton className="w-full h-full rounded-full" />
                                </motion.div>
                                <motion.div
                                    animate={{ y: 0, opacity: 1 }}
                                    initial={{ y: 10, opacity: 0 }}
                                    style={{ width: '100%', maxWidth: '240px' }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="space-y-3">
                                        <h3 className="text-xl font-semibold text-default-900 text-center">Generating Image with AI</h3>
                                        <div className="space-y-3">
                                            <Skeleton className="w-full h-4 rounded-lg" />
                                            <Skeleton className="w-2/3 h-4 rounded-lg mx-auto" />
                                        </div>
                                    </div>
                                </motion.div>
                            </CardBody>
                        </Card>
                    </div>
                </motion.div>
            </AnimatePresence>
        )
    }

    if (images.length === 0) {
        return (
            <AnimatePresence mode="wait">
                <motion.div
                    key="no-images"
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    initial={{ opacity: 0 }}
                    style={{ width: '100%', maxWidth: '56rem', margin: '0 auto' }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="relative group flex items-center">
                        <Card className='w-full'>
                            <CardBody
                                className='relative flex flex-col items-center justify-center p-8 gap-4'
                                style={{ aspectRatio: '1 / 1' }}
                            >
                                <motion.div
                                    animate={{ scale: 1 }}
                                    initial={{ scale: 0.8 }}
                                    style={{ width: '4rem', height: '4rem' }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <Icon className="w-full h-full text-default-400" icon="solar:gallery-wide-linear" />
                                </motion.div>
                                <motion.div
                                    animate={{ y: 0, opacity: 1 }}
                                    initial={{ y: 10, opacity: 0 }}
                                    style={{ textAlign: 'center' }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <h3 className="text-xl font-semibold text-default-900">No Images Generated</h3>
                                    <p className="text-default-500 mt-1">Start generating amazing images with AI</p>
                                </motion.div>
                            </CardBody>
                        </Card>
                    </div>
                </motion.div>
            </AnimatePresence>
        )
    }

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key="carousel"
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                style={{ width: '100%', maxWidth: '56rem', margin: '0 auto' }}
                transition={{ duration: 0.3 }}
            >
                <div className="relative group flex items-center gap-2">
                    <Button
                        isIconOnly
                        className="hover:scale-105 shrink-0 bg-content1 hidden sm:flex"
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
                                <div
                                    key={index}
                                    className="flex-[0_0_100%] min-w-0 relative"
                                >
                                    <Card className="w-full group/card">
                                        <CardBody
                                            className="relative p-0"
                                            style={{
                                                aspectRatio: image.width && image.height ? `${image.width} / ${image.height}` : '1 / 1',
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            {!loadedImages[image.url] && (
                                                <div className="absolute inset-0 z-10">
                                                    <Skeleton className="w-full h-full rounded-lg animate-pulse" />
                                                </div>
                                            )}
                                            <div className="absolute top-2 right-2 z-20 flex gap-2 opacity-0 group-hover/card:opacity-100 transition-opacity">
                                                <Button
                                                    isIconOnly
                                                    className="bg-content1/80 backdrop-blur-md"
                                                    size="sm"
                                                    variant="flat"
                                                    onPress={async () => {
                                                        try {
                                                            const success = await copyImageToClipboard(image.url);

                                                            if (success) {
                                                                addToast({
                                                                    title: "Başarılı!",
                                                                    description: "Görsel panoya kopyalandı.",
                                                                    color: "success"
                                                                });
                                                            } else {
                                                                addToast({
                                                                    title: "Hata!",
                                                                    description: "Görsel kopyalanamadı. Tarayıcı izinlerini kontrol edin.",
                                                                    color: "danger"
                                                                });
                                                            }
                                                        } catch (error) {
                                                            addToast({
                                                                title: "Hata!",
                                                                description: "Görsel kopyalanırken bir hata oluştu.",
                                                                color: "danger"
                                                            });
                                                        }
                                                    }}
                                                >
                                                    <Icon className="w-4 h-4" icon="solar:copy-linear" />
                                                </Button>
                                                <Button
                                                    isIconOnly
                                                    className="bg-content1/80 backdrop-blur-md"
                                                    size="sm"
                                                    variant="flat"
                                                    onPress={() => {
                                                        try {
                                                            const link = document.createElement('a');

                                                            link.href = image.url;
                                                            link.download = 'generated-image.jpg';
                                                            document.body.appendChild(link);
                                                            link.click();
                                                            document.body.removeChild(link);

                                                            addToast({
                                                                title: "Başarılı!",
                                                                description: "Görsel indiriliyor...",
                                                                color: "success"
                                                            });
                                                        } catch (error) {
                                                            addToast({
                                                                title: "Hata!",
                                                                description: "Görsel indirilirken bir hata oluştu.",
                                                                color: "danger"
                                                            });
                                                        }
                                                    }}
                                                >
                                                    <Icon className="w-4 h-4" icon="solar:download-linear" />
                                                </Button>
                                            </div>
                                            <NextImage
                                                fill
                                                alt={image.alt}
                                                className={`object-cover rounded-lg transition-opacity duration-300 ${loadedImages[image.url] ? 'opacity-100' : 'opacity-0'}`}
                                                src={image.url}
                                                onLoad={() => handleImageLoad(image.url)}
                                            />
                                        </CardBody>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button
                        isIconOnly
                        className="hover:scale-105 shrink-0 bg-content1 hidden sm:flex"
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
            </motion.div>
        </AnimatePresence>
    )
}

export default GeneratedImages


