"use client"

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Button,
    Input,
    Textarea,
    Select,
    SelectItem,
    Slider,
    Switch,
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useEffect } from "react";

import useGeneratedStore from "@/store/useGeneratedStore";

const baseSchema = {
    prompt: z.string().min(1, "Prompt is required"),
    aspect_ratio: z.enum(["1:1", "16:9", "21:9", "3:2", "2:3", "4:5", "5:4", "3:4", "4:3", "9:16", "9:21"]),
    prompt_strength: z.number().min(0).max(1),
    num_outputs: z.number().int().min(1).max(4),
    num_inference_steps: z.number().int().superRefine((val, ctx) => {
        const model = (ctx as any).data?.model;

        if (model === "black-forest-labs/flux-schnell" && val > 4) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Maximum 4 steps for Flux Schnell model",
                path: ["num_inference_steps"]
            });
        } else if (model === "black-forest-labs/flux-dev") {
            if (val < 1 || val > 50) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Steps must be between 1 and 50 for Flux Dev model",
                    path: ["num_inference_steps"]
                });
            }
        }
    }),
    guidance: z.number().min(0).max(10),
    output_format: z.enum(["webp", "jpg", "png"]),
    output_quality: z.number().int().min(0).max(100),
    disable_safety_checker: z.boolean(),
    go_fast: z.boolean(),
    megapixels: z.enum(["1", "0.25"])
};

export const ImageGenerationFormSchema = z.object({
    model: z.enum(["black-forest-labs/flux-dev", "black-forest-labs/flux-schnell"]),
    ...baseSchema
});

type FormValues = z.infer<typeof ImageGenerationFormSchema>;

const defaultValues: FormValues = {
    model: "black-forest-labs/flux-dev",
    prompt: "",
    aspect_ratio: "1:1",
    prompt_strength: 0.8,
    num_outputs: 1,
    num_inference_steps: 28,
    guidance: 3,
    output_format: "webp",
    output_quality: 80,
    disable_safety_checker: false,
    go_fast: true,
    megapixels: "1"
};

const tooltipContent = {
    model: "Select the AI model to use for image generation. Different models may produce different styles and qualities.",
    prompt: "Write a detailed description of the image you want to generate. Be specific about style, mood, colors, and composition.",
    aspect_ratio: "Choose the width-to-height ratio of your generated image. Different ratios are better suited for different purposes (e.g., 16:9 for landscapes).",
    prompt_strength: "Controls how closely the AI follows your prompt. Higher values (closer to 1) mean stricter adherence to the prompt.",
    guidance: "Determines how much the AI should prioritize following your prompt vs being creative. Higher values = more prompt-focused.",
    num_outputs: "Number of different variations to generate at once. More outputs = longer generation time.",
    num_inference_steps: "Number of steps in the generation process. More steps = higher quality but longer generation time.",
    output_format: "File format for the generated images. WebP offers best compression, PNG best quality, JPG good balance.",
    output_quality: "Compression quality for the output image. Higher values mean better quality but larger file size.",
    disable_safety_checker: "Disable content filtering. Warning: May generate NSFW or inappropriate content.",
    go_fast: "Enable optimizations for faster generation at slight quality cost.",
    megapixels: "Resolution of the output image. Higher megapixels = more detailed but slower generation."
};

const InfoTooltip = ({ content }: { content: string }) => (
    <Popover placement="top-start">
        <PopoverTrigger>
            <Button
                isIconOnly
                className="text-default-400 hover:text-default-500 !bg-transparent !hover:bg-transparent"
                size="sm"
                variant="light"
            >
                <Icon icon="solar:info-circle-line-duotone" width={18} />
            </Button>
        </PopoverTrigger>
        <PopoverContent>
            <div className="px-1 py-2 max-w-md">
                <p className="text-sm text-default-600">{content}</p>
            </div>
        </PopoverContent>
    </Popover>
);

const ConfigurationsForm = () => {
    const generateImage = useGeneratedStore((state) => state.generateImage);
    const loading = useGeneratedStore((state) => state.loading);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        reset,
        trigger
    } = useForm<FormValues>({
        resolver: zodResolver(ImageGenerationFormSchema),
        defaultValues,
        mode: "onChange"
    });

    const selectedModel = watch("model");
    const inferenceSteps = watch("num_inference_steps");

    useEffect(() => {
        if (selectedModel === "black-forest-labs/flux-schnell") {
            // For flux-schnell, always set to 4 steps
            setValue("num_inference_steps", 4);
            trigger("num_inference_steps");
        } else if (selectedModel === "black-forest-labs/flux-dev") {
            // When switching to flux-dev, always set to default 28
            setValue("num_inference_steps", 28);
            trigger("num_inference_steps");
        }
    }, [selectedModel, setValue, trigger]);

    const onSubmit = async (values: FormValues) => {
        await generateImage(values);
    };

    const handleReset = () => {
        reset(defaultValues);
    };

    // Set default values when component mounts
    useEffect(() => {
        reset(defaultValues);
    }, [reset]);

    return (
        <form className="space-y-4 flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <Card className="p-4 bg-content1">
                <CardHeader className="pb-4">
                    <h3 className="text-xl font-semibold">Basic Configuration</h3>
                </CardHeader>
                <CardBody className="space-y-3 py-2">
                    <div>
                        <div className="flex items-center gap-1 mb-1">
                            <span className="text-sm font-medium">Model</span>
                            <InfoTooltip content={tooltipContent.model} />
                        </div>
                        <Select
                            defaultSelectedKeys={["black-forest-labs/flux-dev"]}
                            isDisabled={loading}
                            placeholder="Select model"
                            onChange={(e) => setValue("model", e.target.value as any)}
                        >
                            <SelectItem key="black-forest-labs/flux-dev">Flux Dev</SelectItem>
                            <SelectItem key="black-forest-labs/flux-schnell">Flux Schnell</SelectItem>
                        </Select>
                    </div>

                    <div>
                        <div className="flex items-center gap-1 mb-1">
                            <span className="text-sm font-medium">Prompt</span>
                            <InfoTooltip content={tooltipContent.prompt} />
                        </div>
                        <Textarea
                            description="Prompt for generated image"
                            errorMessage={errors.prompt?.message}
                            isDisabled={loading}
                            isInvalid={!!errors.prompt}
                            placeholder="Enter your image prompt"
                            {...register("prompt")}
                        />
                    </div>

                    <div>
                        <div className="flex items-center gap-1 mb-1">
                            <span className="text-sm font-medium">Aspect Ratio</span>
                            <InfoTooltip content={tooltipContent.aspect_ratio} />
                        </div>
                        <Select
                            defaultSelectedKeys={["1:1"]}
                            isDisabled={loading}
                            placeholder="Select aspect ratio"
                            onChange={(e) => setValue("aspect_ratio", e.target.value as any)}
                        >
                            {["1:1", "16:9", "21:9", "3:2", "2:3", "4:5", "5:4", "3:4", "4:3", "9:16", "9:21"].map((ratio) => (
                                <SelectItem key={ratio}>
                                    {ratio}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>

                    <div>
                        <div className="flex items-center gap-1 mb-1">
                            <span className="text-sm font-medium">Output Quality</span>
                            <InfoTooltip content={tooltipContent.output_quality} />
                        </div>
                        <Input
                            description="Quality of output images (0-100)"
                            isDisabled={loading}
                            max={100}
                            min={0}
                            type="number"
                            {...register("output_quality", { valueAsNumber: true })}
                        />
                    </div>
                </CardBody>
            </Card>

            <Card className="p-2">
                <CardHeader className="pb-2">
                    <h3 className="text-lg font-semibold">Advanced Settings</h3>
                </CardHeader>
                <CardBody className="space-y-3 py-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <div className="flex items-center gap-1 mb-1">
                                <span className="text-sm">Prompt Strength: {watch("prompt_strength")}</span>
                                <InfoTooltip content={tooltipContent.prompt_strength} />
                            </div>
                            <Slider
                                className="w-full"
                                defaultValue={0.8}
                                isDisabled={loading}
                                maxValue={1}
                                minValue={0}
                                size="sm"
                                step={0.1}
                                onChange={(value) => setValue("prompt_strength", value as number)}
                            />
                        </div>

                        <div>
                            <div className="flex items-center gap-1 mb-1">
                                <span className="text-sm">Guidance: {watch("guidance")}</span>
                                <InfoTooltip content={tooltipContent.guidance} />
                            </div>
                            <Slider
                                className="w-full"
                                defaultValue={3}
                                isDisabled={loading}
                                maxValue={10}
                                minValue={0}
                                size="sm"
                                step={0.5}
                                onChange={(value) => setValue("guidance", value as number)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <div className="flex items-center gap-1 mb-1">
                                <span className="text-sm font-medium">Number of Outputs</span>
                                <InfoTooltip content={tooltipContent.num_outputs} />
                            </div>
                            <Input
                                description="Number of images to generate (1-4)"
                                isDisabled={loading}
                                max={4}
                                min={1}
                                type="number"
                                {...register("num_outputs", { valueAsNumber: true })}
                            />
                        </div>

                        <div>
                            <div className="flex items-center gap-1 mb-1">
                                <span className="text-sm font-medium">Inference Steps</span>
                                <InfoTooltip content={tooltipContent.num_inference_steps} />
                            </div>
                            <Input
                                description={`Number of denoising steps (${selectedModel === "black-forest-labs/flux-schnell" ? "max 4" : "1-50"})`}
                                errorMessage={errors.num_inference_steps?.message}
                                isDisabled={loading}
                                isInvalid={!!errors.num_inference_steps}
                                max={selectedModel === "black-forest-labs/flux-schnell" ? 4 : 50}
                                min={1}
                                type="number"
                                value={inferenceSteps?.toString()}
                                onChange={(e) => setValue("num_inference_steps", parseInt(e.target.value))}
                            />
                        </div>

                        <div>
                            <div className="flex items-center gap-1 mb-1">
                                <span className="text-sm font-medium">Output Format</span>
                                <InfoTooltip content={tooltipContent.output_format} />
                            </div>
                            <Select
                                defaultSelectedKeys={["webp"]}
                                isDisabled={loading}
                                placeholder="Select format"
                                onChange={(e) => setValue("output_format", e.target.value as any)}
                            >
                                {["webp", "jpg", "png"].map((format) => (
                                    <SelectItem key={format}>
                                        {format.toUpperCase()}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>

                        <div>
                            <div className="flex items-center gap-1 mb-1">
                                <span className="text-sm font-medium">Megapixels</span>
                                <InfoTooltip content={tooltipContent.megapixels} />
                            </div>
                            <Select
                                defaultSelectedKeys={["1"]}
                                isDisabled={loading}
                                placeholder="Select megapixels"
                                onChange={(e) => setValue("megapixels", e.target.value as any)}
                            >
                                <SelectItem key="1">1 MP</SelectItem>
                                <SelectItem key="0.25">0.25 MP</SelectItem>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                            <Switch
                                defaultSelected={true}
                                isDisabled={loading}
                                size="sm"
                                {...register("go_fast")}
                            >
                                Enable Fast Mode
                            </Switch>
                            <InfoTooltip content={tooltipContent.go_fast} />
                        </div>

                        <div className="flex items-center gap-2">
                            <Switch
                                defaultSelected={false}
                                isDisabled={loading}
                                size="sm"
                                {...register("disable_safety_checker")}
                            >
                                Disable Safety Checker
                            </Switch>
                            <InfoTooltip content={tooltipContent.disable_safety_checker} />
                        </div>
                    </div>
                </CardBody>

                <CardFooter className="flex-col sm:flex-row gap-2 pt-2">
                    <Button
                        className="w-full order-2 sm:order-1"
                        color="danger"
                        isDisabled={loading}
                        size="sm"
                        type="button"
                        variant="flat"
                        onPress={handleReset}
                    >
                        Reset
                    </Button>
                    <Button
                        className="w-full order-1 sm:order-2"
                        color="primary"
                        isLoading={loading}
                        size="sm"
                        type="submit"
                    >
                        Generate Image
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}

export default ConfigurationsForm