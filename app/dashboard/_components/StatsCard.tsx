"use client";

import { Database, Tables } from "@/database.type";
import { Card, CardBody, CardFooter, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Define a type that extends the generated_images table with the url property
type ImageWithUrl = Tables<"generated_images"> & {
  url?: string;
};

// Define a type that extends the models table with additional properties
type ModelWithDetails = Tables<"models"> & {
  name?: string;
};

interface StatsCardProps {
  imageCount: number;
  modelCount: number;
  credits: Database["public"]["Tables"]["credits"]["Row"] | null;
  models: ModelWithDetails[];
  images: ImageWithUrl[];
}

export function StatsCard({
  imageCount,
  modelCount,
  credits,
  models,
  images,
}: StatsCardProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
    breakpoints: {
      "(min-width: 768px)": { slidesToScroll: 2 },
      "(min-width: 1024px)": { slidesToScroll: 3 },
    },
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  // Get the most recent model if available
  const latestModel = models.length > 0 ? models[0] : null;

  return (
    <div className="flex flex-col gap-6">
      {/* Top section: Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {/* Total Images Card */}
        <Card className="border-none">
          <CardBody className="flex flex-col gap-2 p-3 md:p-4">
            <div className="flex justify-between items-center">
              <p className="text-default-500 text-sm">Total Images</p>
              <div className="p-2 rounded-full bg-primary/10">
                <Icon
                  icon="solar:gallery-bold"
                  className="text-primary w-5 h-5"
                />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">{imageCount}</h2>
            <p className="text-xs text-default-500">
              Generated images in your account
            </p>
          </CardBody>
        </Card>

        {/* Total Models Card */}
        <Card className="border-none">
          <CardBody className="flex flex-col gap-2 p-3 md:p-4">
            <div className="flex justify-between items-center">
              <p className="text-default-500 text-sm">Total Models</p>
              <div className="p-2 rounded-full bg-primary/10">
                <Icon
                  icon="solar:server-bold"
                  className="text-primary w-5 h-5"
                />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">{modelCount}</h2>
            <p className="text-xs text-default-500">
              Trained models in your account
            </p>
          </CardBody>
        </Card>

        {/* Image Credits Card */}
        <Card className="border-none">
          <CardBody className="flex flex-col gap-2 p-3 md:p-4">
            <div className="flex justify-between items-center">
              <p className="text-default-500 text-sm">Image Credits</p>
              <div className="p-2 rounded-full bg-primary/10">
                <Icon
                  icon="solar:dollar-bold"
                  className="text-primary w-5 h-5"
                />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">
              {credits?.image_generation_count || 0}/
              {credits?.max_image_generation_count || 0}
            </h2>
            <div className="w-full bg-default-100 rounded-full h-1.5 mt-1">
              <div
                className="bg-primary h-1.5 rounded-full"
                style={{
                  width: `${Math.min(100, ((credits?.image_generation_count || 0) / (credits?.max_image_generation_count || 1)) * 100)}%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-default-500">
              Available credits for image generation
            </p>
          </CardBody>
        </Card>

        {/* Training Credits Card */}
        <Card className="border-none">
          <CardBody className="flex flex-col gap-2 p-3 md:p-4">
            <div className="flex justify-between items-center">
              <p className="text-default-500 text-sm">Training Credits</p>
              <div className="p-2 rounded-full bg-primary/10">
                <Icon
                  icon="solar:magic-stick-bold"
                  className="text-primary w-5 h-5"
                />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">
              {credits?.model_training_count || 0}/
              {credits?.max_model_training_count || 0}
            </h2>
            <div className="w-full bg-default-100 rounded-full h-1.5 mt-1">
              <div
                className="bg-primary h-1.5 rounded-full"
                style={{
                  width: `${Math.min(100, ((credits?.model_training_count || 0) / (credits?.max_model_training_count || 1)) * 100)}%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-default-500">
              Available credits for model training
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Bottom section: Recent Generations and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Recent Generations Carousel - Takes 2/3 of the space */}
        <div className="lg:col-span-2">
          <Card className="border-none">
            <CardBody className="p-3 md:p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg md:text-xl font-semibold">
                  Recent Generations
                </h3>
                <Link href="/dashboard/my-images">
                  <Button
                    color="primary"
                    variant="light"
                    size="sm"
                    endContent={
                      <Icon icon="solar:arrow-right-linear" className="ml-1" />
                    }
                  >
                    View All
                  </Button>
                </Link>
              </div>
              <div className="relative">
                <div className="overflow-hidden" ref={emblaRef}>
                  <div className="flex gap-4 md:gap-5">
                    {images.length > 0 ? (
                      images.map((image, index) => (
                        <div
                          key={image.id}
                          className="flex-[0_0_calc(100%-16px)] sm:flex-[0_0_calc(50%-16px)] md:flex-[0_0_calc(33.33%-16px)] min-w-0"
                        >
                          <div className="relative aspect-square rounded-lg overflow-hidden bg-default-100 shadow-sm">
                            {image.url ? (
                              <Image
                                src={image.url}
                                alt={`Generated image ${index + 1}`}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                className="object-cover"
                                style={{ objectFit: "cover" }}
                                priority={index < 3}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Icon
                                  icon="solar:gallery-broken"
                                  className="w-10 h-10 text-default-300"
                                />
                              </div>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t flex items-center justify-between from-black/70 to-transparent p-2">
                              <p className="text-xs text-white truncate">
                                {image.prompt}
                              </p>

                              <p className="text-xs text-default-500">
                                {new Date(
                                  image.created_at
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="w-full p-8 text-center">
                        <Icon
                          icon="solar:gallery-broken"
                          className="w-12 h-12 text-default-300 mx-auto mb-2"
                        />
                        <p className="text-default-500">
                          No images generated yet
                        </p>
                        <Link
                          href="/dashboard/generate-image"
                          className="mt-4 inline-block"
                        >
                          <Button color="primary" size="sm">
                            Generate Your First Image
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
                {images.length > 0 && (
                  <>
                    <button
                      onClick={scrollPrev}
                      className={`absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 dark:bg-black/50 rounded-full p-2 shadow-md z-10 ${
                        !canScrollPrev ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={!canScrollPrev}
                    >
                      <Icon icon="solar:arrow-left-bold" className="w-5 h-5" />
                    </button>
                    <button
                      onClick={scrollNext}
                      className={`absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 dark:bg-black/50 rounded-full p-2 shadow-md z-10 ${
                        !canScrollNext ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={!canScrollNext}
                    >
                      <Icon icon="solar:arrow-right-bold" className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Quick Actions and Latest Model - Takes 1/3 of the space */}
        <div className="lg:col-span-1">
          <div className="grid grid-cols-1 gap-4">
            {/* Quick Actions Card */}
            <Card className="border-none">
              <CardBody className="p-3 md:p-4">
                <h3 className="text-lg md:text-xl font-semibold mb-3">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-1">
                  <Link href="/dashboard/generate-image" className="w-full">
                    <Button
                      className="w-full justify-start gap-2 h-12"
                      color="primary"
                      variant="flat"
                    >
                      <Icon icon="solar:magic-stick-bold" className="w-5 h-5" />
                      <span>Generate Image</span>
                    </Button>
                  </Link>
                  <Link href="/dashboard/train-model" className="w-full">
                    <Button
                      className="w-full justify-start gap-2 h-12"
                      color="secondary"
                      variant="flat"
                    >
                      <Icon icon="solar:server-bold" className="w-5 h-5" />
                      <span>Train Model</span>
                    </Button>
                  </Link>
                  <Link href="/dashboard/my-images" className="w-full">
                    <Button
                      className="w-full justify-start gap-2 h-12"
                      color="success"
                      variant="flat"
                    >
                      <Icon icon="solar:gallery-bold" className="w-5 h-5" />
                      <span>My Gallery</span>
                    </Button>
                  </Link>
                  <Link href="/dashboard/my-models" className="w-full">
                    <Button
                      className="w-full justify-start gap-2 h-12"
                      color="warning"
                      variant="flat"
                    >
                      <Icon icon="solar:server-path-bold" className="w-5 h-5" />
                      <span>My Models</span>
                    </Button>
                  </Link>
                </div>
              </CardBody>
            </Card>

            {/* Latest Model or Upgrade Card */}
            <Card className="border-none">
              <CardBody className="p-3 md:p-4">
                {latestModel ? (
                  <>
                    <h3 className="text-lg md:text-xl font-semibold mb-3">
                      Latest Model
                    </h3>
                    <div className="flex flex-col gap-2">
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-default-100 shadow-sm">
                        <div className="w-full h-full flex flex-col gap-2 items-center justify-center bg-default-100">
                          <Icon
                            icon="solar:server-bold"
                            className="w-10 h-10 text-default-300"
                          />
                          <span>{latestModel.model_name}</span>
                        </div>
                      </div>
                      <h4 className="font-medium">{latestModel.name}</h4>
                      <p className="text-xs text-default-500">
                        Created on{" "}
                        {new Date(latestModel.created_at).toLocaleDateString()}
                      </p>
                      <div className="flex justify-between mt-2">
                        <Link href={`/dashboard/my-models`}>
                          <Button size="sm" color="primary" variant="flat">
                            View Details
                          </Button>
                        </Link>
                        <Link
                          href={`/dashboard/generate-image?model_id=${latestModel.model_id}:${latestModel.version}`}
                        >
                          <Button size="sm" color="secondary" variant="flat">
                            Generate
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg md:text-xl font-semibold mb-3">
                      Upgrade Plan
                    </h3>
                    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 text-center">
                      <Icon
                        icon="solar:star-bold"
                        className="w-12 h-12 text-primary mx-auto mb-2"
                      />
                      <h4 className="font-medium mb-1">Get More Credits</h4>
                      <p className="text-sm text-default-600 mb-3">
                        Upgrade your plan to get more image generation and model
                        training credits
                      </p>
                      <Link href="/dashboard/billing">
                        <Button color="primary" className="w-full">
                          View Plans
                        </Button>
                      </Link>
                    </div>
                  </>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
