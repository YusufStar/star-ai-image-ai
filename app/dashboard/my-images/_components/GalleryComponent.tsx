"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Skeleton,
  Button,
  Select,
  SelectItem,
  Input,
  Badge,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "usehooks-ts";
import { DateRangePicker } from "@heroui/react";
import React from "react";

import GalleryDetailModal from "./GalleryDetailModal";

import { Tables } from "@/database.type";
import { getImages } from "@/actions/image-actions";
import { cn } from "@/lib/utils";

type ImageProps = {
  url: string | undefined;
} & Tables<"generated_images">;

interface GalleryProps {
  images: ImageProps[];
}

type SortOption = "newest" | "oldest";

// Define a simplified date range type that works with our component
type DateRange = {
  startDate: Date | null;
  endDate: Date | null;
};

type FilterState = {
  searchTerm: string;
  dateRange: DateRange;
};

const GalleryComponent = ({ images }: GalleryProps) => {
  const [loadedImages, setLoadedImages] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [selectedImage, setSelectedImage] = useState<ImageProps | null>(null);
  const [realImages, setRealImages] = useState<ImageProps[]>(images);
  const [mounted, setMounted] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  // Filter states
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    dateRange: {
      startDate: null,
      endDate: null,
    },
  });

  // Create a ref for the DateRangePicker
  const datePickerRef = React.useRef<any>(null);

  // Get unique models from images
  const uniqueModels = Array.from(
    new Set(realImages.map((img) => img.model || "Unknown"))
  ).filter(Boolean);

  const handleImageLoad = (src: string | undefined) => {
    if (src) {
      setLoadedImages((prev) => ({ ...prev, [src]: true }));
    }
  };

  const refetchImages = async () => {
    const { data: images } = await getImages();

    if (!images) return;
    setRealImages(images);
  };

  const handleCloseDrawer = () => {
    setSelectedImage(null);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value as SortOption);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      searchTerm: e.target.value,
    }));
  };

  const handleDateRangeChange = (range: any) => {
    // Convert the DateRangePicker format to our format
    setFilters((prev) => ({
      ...prev,
      dateRange: {
        startDate: range?.start ? new Date(range.start) : null,
        endDate: range?.end ? new Date(range.end) : null,
      },
    }));
  };

  const handleModelChange = (value: string) => {
    // Removed model filter functionality
  };

  const clearFilter = (filterType: keyof FilterState) => {
    if (filterType === "dateRange") {
      setFilters((prev) => ({
        ...prev,
        dateRange: {
          startDate: null,
          endDate: null,
        },
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [filterType]: "",
      }));
    }
  };

  const clearAllFilters = () => {
    // Reset all filters
    setFilters({
      searchTerm: "",
      dateRange: {
        startDate: null,
        endDate: null,
      },
    });
    
    // Reset the DateRangePicker if the ref is available
    if (datePickerRef.current && datePickerRef.current.reset) {
      datePickerRef.current.reset();
    }
  };

  // Apply filters and sorting
  const filteredAndSortedImages = [...realImages]
    // Filter by search term (prompt)
    .filter((image) => {
      if (!filters.searchTerm) return true;
      return image.prompt
        ?.toLowerCase()
        .includes(filters.searchTerm.toLowerCase());
    })
    // Filter by date range
    .filter((image) => {
      if (!filters.dateRange.startDate || !filters.dateRange.endDate)
        return true;

      const imageDate = new Date(image.created_at);
      return (
        imageDate >= filters.dateRange.startDate &&
        imageDate <= filters.dateRange.endDate
      );
    })
    // Sort by date
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();

      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

  // Check if any filters are active
  const hasActiveFilters =
    filters.searchTerm ||
    filters.dateRange.startDate ||
    filters.dateRange.endDate;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (realImages.length === 0) {
    return (
      <div className="custom-container mx-auto py-16 flex flex-col items-center justify-center min-h-[400px] text-center">
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
          Start creating amazing AI-generated images to fill your gallery with
          stunning artwork.
        </p>
        <Button color="primary" href="/dashboard/create" variant="solid">
          Create New Image
        </Button>
      </div>
    );
  }

  return (
    <section className="mx-auto">
      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-4">
        <div
          className={`grid gap-3 ${isTablet ? "grid-cols-1" : "grid-cols-3"}`}
        >
          {/* Search Input */}
          <div className={isTablet ? "col-span-1" : "col-span-1"}>
            <Input
              placeholder="Search by prompt..."
              startContent={
                <Icon
                  icon="solar:magnifer-linear"
                  className="text-foreground-500"
                />
              }
              value={filters.searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          {/* Date Range Filter */}
          <div className={isTablet ? "col-span-1" : "col-span-1"}>
            <DateRangePicker 
              onChange={handleDateRangeChange} 
              ref={datePickerRef}
            />
          </div>

          {/* Sort By */}
          <div className={isTablet ? "col-span-1" : "col-span-1"}>
            <Select
              placeholder="Sort by"
              selectedKeys={[sortBy]}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <SelectItem key="newest">Newest First</SelectItem>
              <SelectItem key="oldest">Oldest First</SelectItem>
            </Select>
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 items-center mt-2">
            <span className="text-sm text-foreground-500 mr-1">Active filters:</span>

            {filters.searchTerm && (
              <div className="bg-primary-100 text-primary-700 rounded-full px-3 py-1 flex items-center gap-1 shadow-sm">
                <span className="text-xs font-medium">
                  Search: {filters.searchTerm}
                </span>
                <button
                  className="ml-1 p-0.5 rounded-full hover:bg-primary-200 transition-colors"
                  onClick={() => clearFilter("searchTerm")}
                >
                  <Icon icon="solar:close-circle-bold" className="w-4 h-4" />
                </button>
              </div>
            )}

            {filters.dateRange.startDate && filters.dateRange.endDate && (
              <div className="bg-primary-100 text-primary-700 rounded-full px-3 py-1 flex items-center gap-1 shadow-sm">
                <span className="text-xs font-medium">
                  Date: {filters.dateRange.startDate.toLocaleDateString()} -{" "}
                  {filters.dateRange.endDate.toLocaleDateString()}
                </span>
                <button
                  className="ml-1 p-0.5 rounded-full hover:bg-primary-200 transition-colors"
                  onClick={() => clearFilter("dateRange")}
                >
                  <Icon icon="solar:close-circle-bold" className="w-4 h-4" />
                </button>
              </div>
            )}

            <Button
              size="sm"
              variant="flat"
              color="default"
              className="h-7 px-2 text-xs font-medium"
              startContent={<Icon icon="solar:refresh-linear" className="w-3.5 h-3.5" />}
              onClick={clearAllFilters}
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Gallery */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 3xl:columns-5 gap-4">
        <AnimatePresence>
          {filteredAndSortedImages.length > 0 ? (
            filteredAndSortedImages.map((image) => {
              return (
                <motion.div
                  key={image.id}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-4 break-inside-avoid"
                  exit={{ opacity: 0, scale: 0.9 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  layout="position"
                  style={{
                    width: "100%",
                    aspectRatio: image.width! / image.height!,
                  }}
                  transition={{
                    opacity: { duration: 0.3 },
                    layout: { duration: 0.3 },
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
                          className={`object-cover rounded transition-opacity duration-300 ${loadedImages[image.url!] ? "opacity-100" : "opacity-0"}`}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                          src={image.url!}
                          style={{ objectFit: "cover" }}
                          onLoad={() => handleImageLoad(image.url)}
                        />
                      </div>
                      {loadedImages[image.url!] && (
                        <div
                          className={cn(
                            "absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-t from-black/60 via-transparent to-transparent",
                            isMobile
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          )}
                        >
                          <div className="flex items-center gap-2 self-end">
                            <button
                              className="bg-black/50 backdrop-blur-sm rounded-full p-2 hover:bg-black/70 transition-colors"
                              onClick={() => setSelectedImage(image)}
                            >
                              <Icon
                                className="w-5 h-5 text-white"
                                icon="solar:eye-bold"
                              />
                            </button>
                          </div>
                          <div className="text-white text-sm">
                            {new Date(image.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </div>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full w-full">
              <Card className="w-full shadow-md">
                <CardBody className="py-16 flex flex-col items-center justify-center min-h-[300px] text-center">
                  <Icon
                    className="w-16 h-16 text-foreground-400 mb-4"
                    icon="solar:magnifer-linear"
                  />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No matching images found
                  </h3>
                  <p className="text-foreground-500 mb-6 max-w-md">
                    Try adjusting your filters to find what you're looking for.
                  </p>
                  <Button
                    size="md"
                    variant="flat"
                    color="primary"
                    onClick={clearAllFilters}
                  >
                    Clear all filters
                  </Button>
                </CardBody>
              </Card>
            </div>
          )}
        </AnimatePresence>
      </div>

      <GalleryDetailModal
        image={selectedImage}
        isOpen={!!selectedImage}
        onClose={handleCloseDrawer}
        onDelete={() => refetchImages()}
      />
    </section>
  );
};

export default GalleryComponent;
