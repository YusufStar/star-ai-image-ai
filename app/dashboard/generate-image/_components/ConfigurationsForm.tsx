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
    Tooltip,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useEffect } from "react";

const formSchema = z.object({
    prompt: z.string().min(1, "Prompt is required"),
    image: z.string().url().optional(),
    aspect_ratio: z.enum(["1:1", "16:9", "21:9", "3:2", "2:3", "4:5", "5:4", "3:4", "4:3", "9:16", "9:21"]),
    prompt_strength: z.number().min(0).max(1),
    num_outputs: z.number().int().min(1).max(4),
    num_inference_steps: z.number().int().min(1).max(50),
    guidance: z.number().min(0).max(10),
    seed: z.number().int().optional(),
    output_format: z.enum(["webp", "jpg", "png"]),
    output_quality: z.number().int().min(0).max(100),
    disable_safety_checker: z.boolean(),
    go_fast: z.boolean(),
    megapixels: z.enum(["1", "0.25"])
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
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
    prompt: "Write a detailed description of the image you want to generate. Be specific about style, mood, colors, and composition.",
    image: "Provide a URL to an existing image to use as a starting point. The AI will use this as reference while maintaining your prompt's style.",
    aspect_ratio: "Choose the width-to-height ratio of your generated image. Different ratios are better suited for different purposes (e.g., 16:9 for landscapes).",
    prompt_strength: "Controls how closely the AI follows your prompt. Higher values (closer to 1) mean stricter adherence to the prompt.",
    guidance: "Determines how much the AI should prioritize following your prompt vs being creative. Higher values = more prompt-focused.",
    num_outputs: "Number of different variations to generate at once. More outputs = longer generation time.",
    num_inference_steps: "Number of steps in the generation process. More steps = higher quality but longer generation time.",
    seed: "A number that determines the random starting point. Using the same seed with the same settings will generate the same image.",
    output_format: "File format for the generated images. WebP offers best compression, PNG best quality, JPG good balance.",
    output_quality: "Compression quality for the output image. Higher values mean better quality but larger file size.",
    disable_safety_checker: "Disable content filtering. Warning: May generate NSFW or inappropriate content.",
    go_fast: "Enable optimizations for faster generation at slight quality cost.",
    megapixels: "Resolution of the output image. Higher megapixels = more detailed but slower generation."
};

const InfoTooltip = ({ content }: { content: string }) => (
    <Tooltip content={content} placement="right" className="max-w-xs">
        <Button
            isIconOnly
            size="sm"
            disabled
            variant="light"
            className="text-default-400 hover:text-default-500 -mb-1 !bg-transparent !hover:bg-transparent"
        >
            <Icon icon="solar:info-circle-line-duotone" width={18} />
        </Button>
    </Tooltip>
);

const ConfigurationsForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        reset
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues
    });

    const onSubmit = (data: FormValues) => {
        console.log(data);
        // Handle form submission
    };

    const handleReset = () => {
        reset(defaultValues); // Reset form to default values
    };

    // Set default values when component mounts
    useEffect(() => {
        reset(defaultValues);
    }, [reset]);

    return (
        <form className="space-y-6 p-4 justify-center flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <Card>
                <CardHeader>
                    <h3 className="text-xl font-semibold">Basic Configuration</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                    <div>
                        <div className="flex items-center gap-1 mb-1">
                            <span className="text-sm font-medium">Prompt</span>
                            <InfoTooltip content={tooltipContent.prompt} />
                        </div>
                        <Textarea
                            description="Prompt for generated image"
                            errorMessage={errors.prompt?.message}
                            isInvalid={!!errors.prompt}
                            placeholder="Enter your image prompt"
                            {...register("prompt")}
                        />
                    </div>

                    <div>
                        <div className="flex items-center gap-1 mb-1">
                            <span className="text-sm font-medium">Image URL</span>
                            <InfoTooltip content={tooltipContent.image} />
                        </div>
                        <Input
                            description="Input image for image to image mode"
                            errorMessage={errors.image?.message}
                            isInvalid={!!errors.image}
                            placeholder="https://example.com/image.jpg"
                            type="url"
                            {...register("image")}
                        />
                    </div>

                    <div>
                        <div className="flex items-center gap-1 mb-1">
                            <span className="text-sm font-medium">Aspect Ratio</span>
                            <InfoTooltip content={tooltipContent.aspect_ratio} />
                        </div>
                        <Select
                            defaultSelectedKeys={["1:1"]}
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
                </CardBody>
            </Card>

            <Card>
                <CardHeader>
                    <h3 className="text-xl font-semibold">Advanced Settings</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                    <div>
                        <div className="flex items-center gap-1 mb-1">
                            <span className="text-sm">Prompt Strength: {watch("prompt_strength")}</span>
                            <InfoTooltip content={tooltipContent.prompt_strength} />
                        </div>
                        <Slider
                            className="max-w-md"
                            defaultValue={0.8}
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
                            className="max-w-md"
                            defaultValue={3}
                            maxValue={10}
                            minValue={0}
                            size="sm"
                            step={0.5}
                            onChange={(value) => setValue("guidance", value as number)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div className="flex items-center gap-1 mb-1">
                                <span className="text-sm font-medium">Number of Outputs</span>
                                <InfoTooltip content={tooltipContent.num_outputs} />
                            </div>
                            <Input
                                description="Number of images to generate (1-4)"
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
                                description="Number of denoising steps (1-50)"
                                max={50}
                                min={1}
                                type="number"
                                {...register("num_inference_steps", { valueAsNumber: true })}
                            />
                        </div>

                        <div>
                            <div className="flex items-center gap-1 mb-1">
                                <span className="text-sm font-medium">Seed</span>
                                <InfoTooltip content={tooltipContent.seed} />
                            </div>
                            <Input
                                description="Random seed for reproducible generation"
                                type="number"
                                {...register("seed", { valueAsNumber: true })}
                            />
                        </div>

                        <div>
                            <div className="flex items-center gap-1 mb-1">
                                <span className="text-sm font-medium">Output Format</span>
                                <InfoTooltip content={tooltipContent.output_format} />
                            </div>
                            <Select
                                defaultSelectedKeys={["webp"]}
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
                                placeholder="Select megapixels"
                                onChange={(e) => setValue("megapixels", e.target.value as any)}
                            >
                                <SelectItem key="1">1 MP</SelectItem>
                                <SelectItem key="0.25">0.25 MP</SelectItem>
                            </Select>
                        </div>

                        <div>
                            <div className="flex items-center gap-1 mb-1">
                                <span className="text-sm font-medium">Output Quality</span>
                                <InfoTooltip content={tooltipContent.output_quality} />
                            </div>
                            <Input
                                description="Quality of output images (0-100)"
                                max={100}
                                min={0}
                                type="number"
                                {...register("output_quality", { valueAsNumber: true })}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <Switch
                                defaultSelected={true}
                                {...register("go_fast")}
                            >
                                Enable Fast Mode
                            </Switch>
                            <InfoTooltip content={tooltipContent.go_fast} />
                        </div>

                        <div className="flex items-center gap-2">
                            <Switch
                                defaultSelected={false}
                                {...register("disable_safety_checker")}
                            >
                                Disable Safety Checker
                            </Switch>
                            <InfoTooltip content={tooltipContent.disable_safety_checker} />
                        </div>
                    </div>
                </CardBody>

                <CardFooter className="gap-4">
                    <Button
                        className="w-full"
                        color="danger"
                        type="button"
                        variant="flat"
                        onPress={handleReset}
                    >
                        Reset
                    </Button>
                    <Button className="w-full" color="primary" type="submit">
                        Generate Image
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}

export default ConfigurationsForm