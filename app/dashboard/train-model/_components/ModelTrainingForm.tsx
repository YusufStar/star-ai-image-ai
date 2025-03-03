"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button, Input, Card, CardBody, CardHeader, CardFooter, RadioGroup, Radio, addToast } from "@heroui/react"
import { Icon } from "@iconify/react"
import { useCallback, useState } from "react"
import { useDropzone, FileRejection } from "react-dropzone"

import { getPresignedStoragUrl } from "@/actions/model-actions"

const ACCEPTED_ZIP_FILES = ["application/x-zip-compressed", "application/zip"]
const MAX_FILE_SIZE = 45 * 1024 * 1024 // 45 MB

const formSchema = z.object({
    modelName: z.string({
        required_error: "Model name is required!"
    }).min(3, "Model name must be at least 3 characters"),
    gender: z.enum(["male", "female"], {
        required_error: "Please select a gender"
    }),
    zipFile: z
        .any()
        .refine((files) => files?.[0] instanceof File, "Please select a valid file")
        .refine((files) => {
            return ACCEPTED_ZIP_FILES.includes(files?.[0]?.type), "Only ZIP files are accepted"
        })
        .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, "Max file size allowed is 45 MB")
})

type FormValues = z.infer<typeof formSchema>

const ModelTrainingForm = () => {
    const [fileError, setFileError] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            modelName: "",
            gender: "male",
            zipFile: undefined
        }
    })

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
        if (rejectedFiles.length > 0) {
            const error = rejectedFiles[0].errors[0]

            if (error.code === "file-invalid-type") {
                setFileError("Only ZIP files are accepted")
            } else if (error.code === "file-too-large") {
                setFileError("File is too large. Maximum size is 45MB")
            } else {
                setFileError(error.message)
            }
            setValue('zipFile', undefined)
        } else {
            setFileError("")
            setValue('zipFile', acceptedFiles)
        }
    }, [setValue])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/zip': ['.zip'],
            'application/x-zip-compressed': ['.zip'],
        },
        maxSize: MAX_FILE_SIZE,
        multiple: false
    })

    const selectedFile = watch('zipFile')?.[0]

    async function onSubmit(values: FormValues) {
        try {
            setIsLoading(true)
            const data = await getPresignedStoragUrl(values.zipFile?.[0].name)

            if (data.error) {
                addToast({
                    title: "Error",
                    description: data.error || "Failed to upload training data!",
                    variant: "flat",
                    color: "danger"
                })
            }

            const fileResponse = await fetch(data.signedUrl, {
                method: "PUT",
                headers: {
                    "Content-Type": values.zipFile?.[0].type,
                },
                body: values.zipFile?.[0]
            })

            if (!fileResponse.ok) {
                throw new Error("Failed to upload training data!")
            }

            const res = await fileResponse.json()

            addToast({
                title: "Success",
                description: "Training data uploaded successfully!",
                variant: "flat",
                color: "success"
            })

            const formData = new FormData()

            formData.append("fileKey", res.Key)
            formData.append("modelName", values.modelName)
            formData.append("gender", values.gender)

            const response = await fetch("/api/train", {
                method: "POST",
                body: formData
            })

            const results = await response.json()

            if (!response.ok) {
                throw new Error(results.error || "Failed to train model!")
            }

            addToast({
                title: "Success",
                description: "Model training started successfully!",
                variant: "flat",
                color: "success"
            })
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Card className="p-4">
                <CardHeader className="pb-2">
                    <h2 className="text-xl font-semibold">Train Your Model</h2>
                </CardHeader>
                <CardBody className="space-y-6">
                    {/* Model Name Input */}
                    <div>
                        <Input
                            errorMessage={errors.modelName?.message}
                            id="modelName"
                            isInvalid={!!errors.modelName}
                            label="Model Name"
                            placeholder="Enter your model name"
                            {...register("modelName")}
                        />
                    </div>

                    {/* Gender Selection */}
                    <div>
                        <RadioGroup
                            defaultValue="male"
                            id="gender-group"
                            label="Please select the gender of the images"
                            orientation="horizontal"
                            {...register("gender")}
                        >
                            <Radio value="male">Male</Radio>
                            <Radio value="female">Female</Radio>
                        </RadioGroup>
                        {errors.gender && (
                            <p className="text-danger text-sm mt-1">{errors.gender.message}</p>
                        )}
                    </div>

                    {/* File Upload */}
                    <div>
                        <div
                            {...getRootProps()}
                            aria-labelledby="file-upload-label"
                            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                                ${isDragActive ? 'border-primary bg-primary/10' : 'border-default-300'}
                                ${(errors.zipFile || fileError) ? 'border-danger bg-danger-50' : ''}`}
                            id="file-upload"
                        >
                            <label className="block text-sm font-medium mb-2" htmlFor="file-upload-input" id="file-upload-label">
                                Training Data (ZIP File)
                            </label>
                            <input {...getInputProps()} aria-describedby="file-error-message" id="file-upload-input" />
                            <div className="flex flex-col items-center gap-2">
                                <Icon
                                    className={`w-8 h-8 ${fileError ? 'text-danger' : 'text-default-400'}`}
                                    icon={selectedFile ? "solar:file-check-bold" : fileError ? "solar:folder-error-bold" : "solar:upload-bold"}
                                />
                                {isDragActive ? (
                                    <p>Drop the ZIP file here</p>
                                ) : (
                                    <p className={fileError ? 'text-danger' : ''}>
                                        {selectedFile
                                            ? `Selected: ${selectedFile.name}`
                                            : 'Drag & drop your ZIP file here, or click to select'}
                                    </p>
                                )}
                            </div>
                        </div>
                        {(errors.zipFile || fileError) && (
                            <p className="text-danger text-sm mt-1" id="file-error-message">
                                {fileError || (errors.zipFile?.message as string)}
                            </p>
                        )}
                    </div>

                    {/* Training Data Requirements */}
                    <Card className="bg-default-50">
                        <CardBody className="space-y-2 text-sm text-default-500">
                            <h3 className="font-medium text-default-700">Training Data Requirements:</h3>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Provide 10, 12 or 15 images in total</li>
                                <li>Ideal breakdown for 12 images:
                                    <ul className="list-disc list-inside ml-4">
                                        <li>6 face closeups</li>
                                        <li>3/4 half body closeups (till stomach)</li>
                                        <li>2/3 full body shots</li>
                                    </ul>
                                </li>
                                <li>No accessories on face/head ideally</li>
                                <li>No other people in images</li>
                                <li>Different expressions, clothing, backgrounds with good lighting</li>
                                <li>Images to be in 1:1 resolution (1048x1048 or higher)</li>
                                <li>Use images of similar age group (ideally within past few months)</li>
                                <li>Provide only ZIP file (under 45MB size)</li>
                            </ul>
                        </CardBody>
                    </Card>
                </CardBody>

                <CardFooter>
                    <Button
                        className="w-full"
                        color="primary"
                        isLoading={isLoading}
                        startContent={!isLoading && <Icon icon="solar:play-bold" />}
                        type="submit"
                    >
                        Start Training
                    </Button>
                </CardFooter>
            </Card>
        </form>
    )
}

export default ModelTrainingForm