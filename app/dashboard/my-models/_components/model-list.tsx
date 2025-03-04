"use client";

import { NotFoundDataCard } from "@/components/not-found-data-card";
import { Database } from "@/database.type";
import { Button, Card, CardBody, CardHeader, Link } from "@heroui/react";
import { useState } from "react";

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

  if (models?.length === 0) {
    return (
      <NotFoundDataCard
        title="No models found"
        subTitle="Start building amazing AI models"
        customButton={
          <Link href="/dashboard/train-model" className="pt-2">
            <Button>Create Model</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid gap-6 grid-cols-3">
      {models?.map((model) => (
        <Card key={model.id} className="relative flex flex-col overflow-hidden">
          <CardHeader>{model.model_name}</CardHeader>
          <CardBody>{JSON.stringify(model)}</CardBody>
        </Card>
      ))}
    </div>
  );
};

export default ModelList;
