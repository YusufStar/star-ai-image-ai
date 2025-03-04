import { Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { ReactElement } from "react";

export const NotFoundDataCard = ({
  title,
  subTitle,
  customButton,
}: {
  title: string;
  subTitle: string;
  customButton?: ReactElement;
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="no-models"
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        style={{ width: "100%", margin: "0 auto" }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative group flex items-center">
          <Card className="w-full h-[450px]">
            <CardBody className="relative flex flex-col items-center justify-center p-8 gap-4">
              <motion.div
                animate={{ scale: 1 }}
                initial={{ scale: 0.8 }}
                style={{ width: "4rem", height: "4rem" }}
                transition={{ delay: 0.1 }}
              >
                <Icon
                  className="w-full h-full text-default-400"
                  icon="solar:folder-error-bold-duotone"
                />
              </motion.div>
              <motion.div
                animate={{ y: 0, opacity: 1 }}
                initial={{ y: 10, opacity: 0 }}
                style={{ textAlign: "center" }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-xl font-semibold text-default-900">
                  {title}
                </h3>
                <p className="text-default-500 mt-1">{subTitle}</p>

                {customButton}
              </motion.div>
            </CardBody>
          </Card>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
