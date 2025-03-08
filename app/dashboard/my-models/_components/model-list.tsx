"use client";

import {
  Button,
  Card,
  CardBody,
  Link,
  Chip,
  Avatar,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  addToast,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { formatDistance } from "date-fns";
import { useState, useEffect, useRef } from "react";

import { Database } from "@/database.type";
import { NotFoundDataCard } from "@/components/not-found-data-card";
import { deleteModel, fetchModels } from "@/actions/model-actions";

type ModelType = {
  error: string | null;
  success: boolean;
  data: Database["public"]["Tables"]["models"]["Row"][] | null;
  count: number;
};

interface ModelsListProps {
  initialData: ModelType;
}

const ModelList = ({ initialData }: ModelsListProps) => {
  const { data, success, error } = initialData;
  const [models, setModels] = useState(data);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedModel, setSelectedModel] = useState<
    Database["public"]["Tables"]["models"]["Row"] | null
  >(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const refetchModels = async () => {
    const { data, success, error } = await fetchModels();

    if (success) {
      setModels(data);
    }
    if (error) {
      addToast({
        title: "Error fetching models.",
        description: error,
        color: "danger",
      });
    }
  };

  useEffect(() => {
    const startPolling = () => {
      // Clear any existing interval
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }

      // Check if any model is in training state
      const hasTrainingModel = models?.some(
        (model) =>
          model.training_status === "starting" ||
          model.training_status === "processing"
      );

      // Set interval based on training status (2s if training, 5s otherwise)
      const intervalTime = hasTrainingModel ? 2000 : 5000;

      pollingIntervalRef.current = setInterval(() => {
        refetchModels();
      }, intervalTime);
    };

    // Start polling
    startPolling();

    // Cleanup on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [models]); // Re-run when models change

  if (models?.length === 0) {
    return (
      <NotFoundDataCard
        customButton={
          <Link className="pt-2" href="/dashboard/train-model">
            <Button color="primary" radius="md" size="sm" variant="solid">
              <Icon className="mr-1" icon="mdi:plus" />
              Create Model
            </Button>
          </Link>
        }
        subTitle="Start building amazing AI models"
        title="No models found"
      />
    );
  }

  const handleDeleteClick = (
    model: Database["public"]["Tables"]["models"]["Row"]
  ) => {
    if (
      model.training_status !== "succeeded" &&
      model.training_status !== "failed" &&
      model.training_status !== "canceled"
    ) {
      addToast({
        title: "Model is still training, please wait for it to finish.",
        description: "You can delete the model later.",
        color: "danger",
      });
    } else {
      setSelectedModel(model);
      onOpen();
    }
  };

  const handleConfirmDelete = async () => {
    const { error, success } = await deleteModel(selectedModel?.id!);

    if (success) {
      addToast({
        title: "Model deleted successfully.",
        color: "success",
      });
    }
    if (error) {
      addToast({
        title: "Error deleting model.",
        description: error,
        color: "danger",
      });
    }
    refetchModels();
    onClose();
  };

  const getStatusBadge = (
    status:
      | "succeeded"
      | "failed"
      | "canceled"
      | "starting"
      | "processing"
      | null
  ) => {
    if (!status) return null;

    const statusMap: Record<
      string,
      { color: "success" | "danger" | "warning" | "primary"; label: string }
    > = {
      succeeded: { color: "success", label: "Succeeded" },
      failed: { color: "danger", label: "Failed" },
      canceled: { color: "warning", label: "Canceled" },
    };

    const statusInfo = statusMap[status] || {
      color: "primary",
      label: "Training",
    };
    const isTraining = !statusMap[status];

    return (
      <Chip
        className="text-xs font-medium h-7 px-2"
        color={statusInfo.color}
        radius="full"
        size="sm"
        startContent={
          isTraining ? (
            <Spinner className="mr-1" color="primary" size="sm" />
          ) : (
            <Icon
              className="text-xs mr-1"
              icon={
                status === "succeeded"
                  ? "mdi:check-circle"
                  : status === "failed"
                    ? "mdi:alert-circle"
                    : "mdi:clock-outline"
              }
            />
          )
        }
        variant="flat"
      >
        {statusInfo.label}
      </Chip>
    );
  };

  return (
    <>
      <div
        className="grid gap-2 sm:gap-3 md:gap-4 
                      grid-cols-1 
                      xs:grid-cols-1 
                      sm:grid-cols-2 
                      md:grid-cols-2 
                      lg:grid-cols-2 
                      xl:grid-cols-3 
                      2xl:grid-cols-4 
                      3xl:grid-cols-6 
                      4xl:grid-cols-8"
      >
        {models?.map((model) => (
          <Card
            key={model.id}
            className="group relative flex flex-col overflow-hidden border border-default-100 shadow-sm hover:shadow-md transition-all duration-200 hover:border-primary-200"
            radius="lg"
          >
            <CardBody className="p-3 sm:p-4">
              {/* Header Section */}
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Avatar
                    className="bg-primary-50 text-primary-600 hidden xs:flex"
                    color="primary"
                    name={model.model_name || ""}
                    size="sm"
                  />
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold line-clamp-1">
                      {model.model_name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-default-400 mt-1">
                      <Icon className="text-xs" icon="mdi:calendar-clock" />
                      <span>
                        {formatDistance(
                          new Date(model.created_at),
                          new Date(),
                          {
                            addSuffix: true,
                          }
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(model.training_status)}
                  <Button
                    isIconOnly
                    className="min-w-0 h-7 w-7 rounded-full"
                    color="danger"
                    isDisabled={
                      !model.training_status ||
                      ["starting", "processing"].includes(model.training_status)
                    }
                    size="sm"
                    variant="light"
                    onPress={() => handleDeleteClick(model)}
                  >
                    <Icon className="text-sm" icon="mdi:trash-outline" />
                  </Button>
                </div>
              </div>

              {/* Info Section */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="rounded-md bg-default-50 px-2 sm:px-3 py-1.5 sm:py-2 border border-default-100">
                  <div className="flex items-center gap-1 text-xs sm:text-sm text-default-500">
                    <Icon
                      className="text-primary-500 text-xs sm:text-sm"
                      icon="mdi:clock-outline"
                    />
                    <span>Duration</span>
                  </div>
                  <p className="mt-1 font-medium text-xs sm:text-sm text-default-700">
                    {Math.round(Number(model.training_time) / 60) || 0} mins
                  </p>
                </div>

                <div className="rounded-md bg-default-50 px-2 sm:px-3 py-1.5 sm:py-2 border border-default-100">
                  <div className="flex items-center gap-1 text-xs sm:text-sm text-default-500">
                    <Icon
                      className="text-primary-500 text-xs sm:text-sm"
                      icon="mdi:gender-male-female"
                    />
                    <span>Gender</span>
                  </div>
                  <p className="mt-1 font-medium text-xs sm:text-sm text-default-700 capitalize">
                    {model.gender || "Not specified"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center">
                <Button
                  className="min-w-0 h-6 sm:h-8 px-2 sm:px-3 text-default-500"
                  color="default"
                  size="sm"
                  startContent={
                    <Icon
                      className="text-xs sm:text-sm"
                      icon="mdi:eye-outline"
                    />
                  }
                  variant="light"
                >
                  <span className="text-xs sm:text-sm">Details</span>
                </Button>

                <Link
                  href={`/dashboard/generate-image?model_id=${model.model_id}:${model.version}`}
                  isDisabled={model.training_status !== "succeeded"}
                >
                  <Button
                    className="min-w-0 h-6 sm:h-8 px-2 sm:px-4"
                    color="primary"
                    isDisabled={model.training_status !== "succeeded"}
                    size="sm"
                    startContent={
                      <Icon className="text-xs sm:text-sm" icon="mdi:play" />
                    }
                    variant="solid"
                  >
                    <span className="text-xs sm:text-sm">Use Model</span>
                  </Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <div className="text-xl font-bold">Delete Model</div>
            <div className="text-sm text-default-500">
              Are you sure you want to delete this model?
            </div>
          </ModalHeader>
          <ModalBody>
            {selectedModel && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar
                    className="bg-primary-50 text-primary-600"
                    color="primary"
                    name={selectedModel.model_name || ""}
                    size="lg"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">
                      {selectedModel.model_name}
                    </h3>
                    <p className="text-sm text-default-500">
                      Created{" "}
                      {formatDistance(
                        new Date(selectedModel.created_at),
                        new Date(),
                        { addSuffix: true }
                      )}
                    </p>
                  </div>
                </div>

                <div className="bg-default-50 p-4 rounded-lg border border-default-200">
                  <h4 className="font-medium mb-2">Model Details</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-default-500">Status</p>
                      <p className="font-medium text-xs">
                        {selectedModel.training_status || "Unknown"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-default-500">Gender</p>
                      <p className="text-xs font-medium capitalize">
                        {selectedModel.gender || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-default-500">Training Time</p>
                      <p className="font-medium text-xs">
                        {Math.round(Number(selectedModel.training_time) / 60) ||
                          0}{" "}
                        mins
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-default-500">Model ID</p>
                      <p className="font-medium text-xs truncate">
                        {selectedModel.model_id || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-danger-50 p-3 rounded-lg border border-danger-200 text-danger-700">
                  <div className="flex items-start gap-2">
                    <Icon className="text-lg mt-0.5" icon="mdi:alert-circle" />
                    <div>
                      <p className="font-medium">Warning</p>
                      <p className="text-sm">
                        This action cannot be undone. The model and all
                        associated data will be permanently deleted.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              className="font-medium"
              color="default"
              variant="flat"
              onPress={onClose}
            >
              Cancel
            </Button>
            <Button
              className="font-medium"
              color="danger"
              variant="solid"
              onPress={handleConfirmDelete}
            >
              Delete Model
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModelList;
