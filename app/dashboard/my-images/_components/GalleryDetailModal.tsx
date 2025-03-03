import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter, Button, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, addToast } from "@heroui/react"
import { Icon } from "@iconify/react"
import Image from "next/image"
import { useState } from "react"

import { Tables } from "@/database.type"
import { deleteImage } from "@/actions/image-actions"

type ImageProps = {
    url: string | undefined,
} & Tables<'generated_images'>

interface GalleryDetailModalProps {
    image: ImageProps | null
    isOpen: boolean
    onClose: () => void
    onDelete?: () => void
}

const GalleryDetailModal = ({ image, isOpen, onClose, onDelete }: GalleryDetailModalProps) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    if (!image) return null

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const handleDelete = async () => {
        if (!image || !image.image_name) return

        try {
            setIsDeleting(true)
            const response = await deleteImage(image.id, image.image_name)

            if (!response.success) {
                throw new Error(response.error || "Failed to delete image")
            }

            addToast({
                title: "Success",
                description: "Image has been deleted successfully",
                color: "success",
                icon: <Icon className="w-5 h-5" icon="solar:check-circle-bold" />
            })

            setIsDeleteModalOpen(false)
            onDelete?.()
            onClose()
        } catch (error: any) {
            addToast({
                title: "Error",
                description: error.message || "Failed to delete image",
                color: "danger",
                icon: <Icon className="w-5 h-5" icon="solar:danger-triangle-bold" />
            })
        } finally {
            setIsDeleting(false)
        }
    }

    const handleDownload = async () => {
        if (!image.url) return

        try {
            setIsDownloading(true)
            const response = await fetch(image.url)
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')

            link.href = url
            link.download = image.image_name || 'generated-image.webp'
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)

            addToast({
                title: "Success",
                description: "Image downloaded successfully",
                color: "success",
                icon: <Icon className="w-5 h-5" icon="solar:check-circle-bold" />
            })
        } catch (error) {
            console.error('Download failed:', error)
            addToast({
                title: "Error",
                description: "Failed to download image",
                color: "danger",
                icon: <Icon className="w-5 h-5" icon="solar:danger-triangle-bold" />
            })
        } finally {
            setIsDownloading(false)
        }
    }

    return (
        <>
            <Drawer
                isOpen={isOpen}
                placement="right"
                size="lg"
                onClose={onClose}
            >
                <DrawerContent title="Image Details">
                    <DrawerHeader className="flex flex-col gap-1">
                        Image Details
                    </DrawerHeader>

                    <DrawerBody className="overflow-y-auto">
                        <div className="space-y-6 py-4">
                            {/* Image Preview */}
                            <div
                                className="relative w-full rounded-lg overflow-hidden shadow-lg"
                                style={{
                                    aspectRatio: `${image.width} / ${image.height}`,
                                    maxHeight: "80vh"
                                }}
                            >
                                <Image
                                    fill
                                    priority
                                    alt={image.prompt!}
                                    className="object-contain"
                                    src={image.url!}
                                />
                            </div>

                            {/* Prompt Section */}
                            <div className="space-y-3">
                                <h4 className="text-lg font-semibold flex items-center gap-2">
                                    <Icon className="w-5 h-5" icon="solar:magic-stick-bold" />
                                    Prompt
                                </h4>
                                <p className="text-foreground-600 bg-content2 p-4 rounded-lg">
                                    {image.prompt}
                                </p>
                            </div>

                            {/* Generation Parameters */}
                            <div className="space-y-3">
                                <h4 className="text-lg font-semibold flex items-center gap-2">
                                    <Icon className="w-5 h-5" icon="solar:settings-bold" />
                                    Generation Parameters
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-content2 p-4 rounded-lg">
                                        <p className="text-sm text-foreground-500">Model</p>
                                        <p className="font-medium text-sm">{image.model}</p>
                                    </div>
                                    <div className="bg-content2 p-4 rounded-lg">
                                        <p className="text-sm text-foreground-500">Created At</p>
                                        <p className="font-medium text-sm">{formatDate(image.created_at)}</p>
                                    </div>
                                    <div className="bg-content2 p-4 rounded-lg">
                                        <p className="text-sm text-foreground-500">Dimensions</p>
                                        <p className="font-medium text-sm">{image.width} × {image.height}</p>
                                    </div>
                                    <div className="bg-content2 p-4 rounded-lg">
                                        <p className="text-sm text-foreground-500">Aspect Ratio</p>
                                        <p className="font-medium text-sm">{image.aspect_ratio}</p>
                                    </div>
                                    <div className="bg-content2 col-span-2 p-4 rounded-lg">
                                        <p className="text-sm text-foreground-500">Megapixels</p>
                                        <p className="font-medium text-sm">{image.megapixels}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Advanced Parameters */}
                            <div className="space-y-3">
                                <h4 className="text-lg font-semibold flex items-center gap-2">
                                    <Icon className="w-5 h-5" icon="solar:tuning-bold" />
                                    Advanced Parameters
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    <Chip color="primary" variant="flat">
                                        Guidance: {image.guidance}
                                    </Chip>
                                    <Chip color="primary" variant="flat">
                                        Steps: {image.num_inference_steps}
                                    </Chip>
                                    <Chip color="primary" variant="flat">
                                        Prompt Strength: {image.prompt_strength}
                                    </Chip>
                                    <Chip color="primary" variant="flat">
                                        Quality: {image.output_quality}%
                                    </Chip>
                                    <Chip color="primary" variant="flat">
                                        Format: {image.output_format}
                                    </Chip>
                                    <Chip color="primary" variant="flat">
                                        Outputs: {image.num_outputs}
                                    </Chip>
                                    <Chip color="primary" variant="flat">
                                        Safety Checker: {image.disable_safety_checker ? 'Disabled' : 'Enabled'}
                                    </Chip>
                                    <Chip color="primary" variant="flat">
                                        Fast Mode: {image.go_fast ? 'Enabled' : 'Disabled'}
                                    </Chip>
                                </div>
                            </div>

                            {/* Technical Details */}
                            <div className="space-y-3">
                                <h4 className="text-lg font-semibold flex items-center gap-2">
                                    <Icon className="w-5 h-5" icon="solar:code-square-bold" />
                                    Technical Details
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-content2 p-4 rounded-lg col-span-2">
                                        <p className="text-sm text-foreground-500">Image ID</p>
                                        <p className="font-medium">{image.id}</p>
                                    </div>
                                    <div className="bg-content2 p-4 rounded-lg col-span-2">
                                        <p className="text-sm text-foreground-500">User ID</p>
                                        <p className="font-medium font-mono text-sm">{image.user_id}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DrawerBody>

                    <DrawerFooter>
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="faded"
                                onPress={onClose}
                            >
                                Close
                            </Button>
                            <Button
                                color="danger"
                                startContent={<Icon className="w-4 h-4" icon="solar:trash-bin-trash-bold" />}
                                variant="flat"
                                onPress={() => setIsDeleteModalOpen(true)}
                            >
                                Delete
                            </Button>
                            <Button
                                color="primary"
                                endContent={!isDownloading && <Icon icon="solar:download-bold" />}
                                isLoading={isDownloading}
                                onPress={handleDownload}
                            >
                                {isDownloading ? 'Downloading...' : 'Download Image'}
                            </Button>
                        </div>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                placement="center"
                size="md"
                onClose={() => setIsDeleteModalOpen(false)}
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-danger">
                            <Icon className="w-6 h-6" icon="solar:danger-triangle-bold" />
                            <h3 className="text-xl font-semibold">Delete Image</h3>
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        <div className="space-y-4">
                            <div className="flex gap-4 items-start bg-danger-50 p-4 rounded-lg">
                                <div className="relative w-20 h-20 rounded-md overflow-hidden shrink-0">
                                    <Image
                                        fill
                                        alt={image.prompt!}
                                        className="object-cover"
                                        src={image.url!}
                                    />
                                </div>
                                <div className="space-y-1 flex-1">
                                    <h4 className="font-medium text-danger">Image Details</h4>
                                    <p className="text-sm text-foreground-600 line-clamp-1">
                                        Prompt: {image.prompt}
                                    </p>
                                    <p className="text-sm text-foreground-500">
                                        Created: {formatDate(image.created_at)}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-foreground-600">
                                    You are about to delete this image. This action will:
                                </p>
                                <ul className="list-disc list-inside space-y-1 text-sm text-foreground-600">
                                    <li>Permanently remove the image from your gallery</li>
                                    <li>Delete all associated data and metadata</li>
                                    <li>Free up storage space in your account</li>
                                </ul>
                                <p className="text-danger mt-4 font-medium">
                                    This action cannot be undone.
                                </p>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <div className="flex justify-end gap-3">
                            <Button
                                isDisabled={isDeleting}
                                startContent={<Icon className="w-4 h-4" icon="solar:close-circle-bold" />}
                                variant="light"
                                onPress={() => setIsDeleteModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="danger"
                                isLoading={isDeleting}
                                startContent={<Icon className="w-4 h-4" icon="solar:trash-bin-trash-bold-duotone" />}
                                variant="solid"
                                onPress={handleDelete}
                            >
                                {isDeleting ? "Deleting..." : "Yes, Delete Image"}
                            </Button>
                        </div>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GalleryDetailModal 