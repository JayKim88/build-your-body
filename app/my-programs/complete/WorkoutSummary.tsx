"use client";

import axios from "axios";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Cropper } from "react-cropper";
import { useDropzone } from "react-dropzone";
import "cropperjs/dist/cropper.css";

import { useProgressStore } from "@/app/store";
import Terrible from "@/public/workout-complete-icon/terrible.svg";
import NotSatisfied from "@/public/workout-complete-icon/not-satisfied.svg";
import Soso from "@/public/workout-complete-icon/soso.svg";
import Happy from "@/public/workout-complete-icon/happy.svg";
import Lol from "@/public/workout-complete-icon/lol.svg";
import { useBodySnackbar } from "@/app/hook/useSnackbar";
import { Button } from "@/app/component/Button";
import { ConfirmModal } from "@/app/component/ConfirmModal";
import { savePerformance } from "@/app/api/program-complete/savePerformance";
import { editProgram } from "@/app/api/programs/edit";
import Summary from "@/public/workout-complete-icon/summary.svg";
import { ProgramHistoryDetailModal } from "@/app/component/ProgramHistoryDetailModal";
import { MyStat } from "@/app/api/types";
import Loading from "@/app/loading";

export type SatisfiedStatus =
  | "terrible"
  | "notSatisfied"
  | "soso"
  | "happy"
  | "lol";
type ConfirmTypes = "exit" | "save";
type PngIconProps = {
  name: string;
  className?: string;
};

const validImageTypes = ["jpeg", "png", "jpg"];

const formattedDuration = (value: number) => {
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const seconds = value % 60;

  return `${hours ? `${hours} h ` : ""}${minutes ? `${minutes} m ` : ""}${
    seconds ? `${seconds} s` : ""
  }`;
};

export const PngIcon = ({ name, className }: PngIconProps) => (
  <div className={`relative w-12 h-12 ${className}`}>
    <Image
      className="object-contain"
      src={`/workout-complete-icon/${name}.png`}
      alt={name}
      fill
    />
  </div>
);

const SatisfiedStatusList = ({
  status,
  onSetStatus,
}: {
  status: SatisfiedStatus;
  onSetStatus: (v: SatisfiedStatus) => void;
}) => {
  return (
    <span className="flex items-center gap-x-4 w-[400px] justify-between [&>svg]:cursor-pointer">
      <Terrible
        className={`${status === "terrible" ? "fill-yellow" : "fill-gray6"}`}
        onClick={() => onSetStatus("terrible")}
      />
      <NotSatisfied
        className={`${
          status === "notSatisfied" ? "fill-yellow" : "fill-gray6"
        }`}
        onClick={() => onSetStatus("notSatisfied")}
      />
      <Soso
        className={`${status === "soso" ? "fill-yellow" : "fill-gray6"}`}
        onClick={() => onSetStatus("soso")}
      />
      <Happy
        className={`${status === "happy" ? "fill-yellow" : "fill-gray6"}`}
        onClick={() => onSetStatus("happy")}
      />
      <Lol
        className={`${status === "lol" ? "fill-yellow" : "fill-gray6"}`}
        onClick={() => onSetStatus("lol")}
      />
    </span>
  );
};

export const WorkoutSummary = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { bodySnackbar } = useBodySnackbar();
  const completedAt = useProgressStore((state) => state.completedAt);
  const savedExercisesStatus = useProgressStore(
    (state) => state.savedExercisesStatus
  );
  const savedWorkoutTime = useProgressStore((state) => state.workoutTime);
  const savedProgramId = useProgressStore((state) => state.programId);
  const savedProgramName = useProgressStore((state) => state.programName);
  const resetProgramInfo = useProgressStore((state) => state.resetProgramInfo);
  const resetWorkoutTime = useProgressStore((state) => state.resetWorkoutTime);
  const resetExercisesStatus = useProgressStore(
    (state) => state.resetExercisesStatus
  );
  const resetCompletedAt = useProgressStore((state) => state.resetCompletedAt);
  const isRegistering = useProgressStore((state) => state.isRegistering);
  const setIsRegistering = useProgressStore((state) => state.setIsRegistering);

  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [cropper, setCropper] = useState<Cropper>();
  const [previewUrl, setPreviewUrl] = useState("");
  const [croppedImg, setCroppedImg] = useState("");
  const [imgFile, setImgFile] = useState<Blob>();
  const [isPublic, setIsPublic] = useState(true);
  const [openConfirm, setOpenConfirm] = useState<ConfirmTypes>();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const [satisfiedStatus, setSatisfiedStatus] =
    useState<SatisfiedStatus>("soso");

  const checkImageFileValid = (file: File) => {
    const fileType = file.type.split("/")[1];
    const fileSize =
      file.size / IMAGE_FILE_SIZE_CALC_FORMULA / IMAGE_FILE_SIZE_CALC_FORMULA;

    if (!validImageTypes.includes(fileType)) {
      return "jpg, jpeg, png 형식이 아닙니다. 확인 후 다시 등록해주세요.";
    } else if (fileSize > MAX_IMAGE_FILE_MB_SIZE) {
      return `${MAX_IMAGE_FILE_MB_SIZE}mb를 초과한 이미지입니다. 확인 후 다시 등록해주세요.`;
    }
  };

  const getCropData = async () => {
    if (typeof cropper === "undefined") return;

    const croppedCanvasElement = cropper.getCroppedCanvas({
      width: IMG_SIZE,
      height: IMG_SIZE,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: "high",
    });

    const resultBlob = (await new Promise((resolve) => {
      croppedCanvasElement.toBlob((blob) => {
        blob && resolve(blob);
      });
    })
      .then((blob) => blob)
      .catch((error) => {
        console.error("Error:", error);
      })) as Blob;

    setImgFile(resultBlob);
    setCroppedImg(croppedCanvasElement.toDataURL());
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const imageFileToUpload = acceptedFiles[0];

      const errorMessage = checkImageFileValid(imageFileToUpload);

      if (errorMessage) {
        bodySnackbar(errorMessage, {
          variant: "error",
        });

        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(imageFileToUpload);
    },
    [bodySnackbar]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const resetImage = () => {
    setCropper(undefined);
    setImgFile(undefined);
    setPreviewUrl("");
    setCroppedImg("");
  };

  const clearPerformanceAndSummary = () => {
    resetProgramInfo();
    resetWorkoutTime();
    resetExercisesStatus();
    resetCompletedAt();
  };

  const goToListAfterCleanup = () => {
    router.replace("/my-programs");
    clearPerformanceAndSummary();
    setLoading(false);
  };

  const uploadImageAndGetImageUrl = async () => {
    const imageName = `${
      session?.user?.name
    }-${savedProgramId}-${new Date().toISOString()}`;

    try {
      const {
        data: { signedUrl, completedUrl },
      } = await axios.get(`/api/image/getSignedUrl`, {
        params: {
          imageName,
        },
      });

      const uploadToGCPBucketResult = await axios.put(signedUrl, imgFile, {
        headers: {
          "Content-Type": imgFile?.type,
        },
      });

      return uploadToGCPBucketResult.status === 200
        ? (completedUrl as string)
        : undefined;
    } catch (error) {
      console.log("Error uploading file", error);
    }
  };

  const saveWorkoutPerformance = async () => {
    setIsRegistering(true);
    setLoading(true);
    const imageUrl = !!imgFile ? await uploadImageAndGetImageUrl() : undefined;

    const inputArgs = {
      savedProgramId,
      savedProgramName,
      savedExercisesStatus,
      savedWorkoutTime,
      completedAt: new Date(completedAt!).toISOString(),
      satisfiedStatus,
      title,
      note,
      isPublic,
      ...(imageUrl && {
        imageUrl,
      }),
    };

    const [savePerformanceResult, lastCompletedAtResult] = await Promise.all([
      savePerformance(inputArgs),
      editProgram({
        programId: savedProgramId,
        lastCompletedAt: new Date(completedAt!).toISOString(),
      }),
    ]);

    return !!savePerformanceResult?.success && !!lastCompletedAtResult?.success;
  };

  const handleConfirm = async (isConfirm: boolean) => {
    const isSave = openConfirm === "save";

    if (isSave) {
      if (isConfirm) {
        const isSuccess = await saveWorkoutPerformance();

        if (!isSuccess) {
          bodySnackbar("에러가 발생했습니다. 재시도 해주세요 :)", {
            variant: "error",
          });
          return;
        }

        if (isSuccess) {
          goToListAfterCleanup();
          return;
        }
      }
      setOpenConfirm(undefined);
      return;
    }

    isConfirm ? goToListAfterCleanup() : setOpenConfirm(undefined);
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (isRegistering) return <Loading isComplete />;

  return (
    <div
      className={`lex flex-col text-gray6 transition-opacity duration-300 ${
        isLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <h1 className="text-[80px] tracking-[8px]">WORKOUT COMPLETE!</h1>
      <div className={`${defaultPageStyles} mt-20 gap-x-[140px]`}>
        <section className="flex flex-col gap-y-[100px]">
          <section className="flex flex-col gap-y-10">
            <div className={defaultRowStyles}>
              <span>Completed At</span>
              <div className="flex gap-x-8">
                <span className="flex gap-x-2 items-center">
                  <PngIcon name="calendar" />
                  {completedAt && format(completedAt, "yyyy/MM/dd")}
                </span>
                <span className="flex gap-x-2 items-center">
                  <PngIcon name="time" />
                  {completedAt && format(completedAt, "hh:mm a")}
                </span>
              </div>
            </div>
            <div className="flex gap-x-[108px] text-[40px] justify-start">
              <span>Summary</span>
              <div className="flex gap-x-8">
                <span className="flex gap-x-2 items-center">
                  <PngIcon name="duration" />
                  {formattedDuration(savedWorkoutTime)}
                </span>
                <span className="flex gap-x-2 items-center">
                  <Summary
                    className="fill-gray6 cursor-pointer hover:fill-yellow"
                    onClick={() => setIsOpen(true)}
                  />
                </span>
              </div>
            </div>
          </section>
          <section className="flex flex-col gap-y-10">
            <div className={defaultRowStyles}>
              <span className="w-[200px]">Satisfaction</span>
              <SatisfiedStatusList
                status={satisfiedStatus}
                onSetStatus={(v) => setSatisfiedStatus(v)}
              />
            </div>
            <div className={`${defaultRowStyles} items-center`}>
              <span>Title</span>
              <input
                className={`${defaultInputStyles} h-[72px] pl-4 pr-4`}
                value={title ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setTitle(value);
                }}
                maxLength={30}
              />
            </div>
            <div className={`${defaultRowStyles} items-start`}>
              <span>Note</span>
              <textarea
                className={`${defaultInputStyles} p-4`}
                value={note ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setNote(value);
                }}
                rows={5}
              />
            </div>
          </section>
        </section>
        <section className="flex flex-col justify-between">
          <div className="flex flex-col gap-y-4">
            <span className="text-[40px] text-softGreen">Upload Photo</span>
            <div
              className={`${
                croppedImg ? "w-[400px]" : "max-w-[400px] max-h-[400px]"
              } 
              border-2 border-softGreen rounded-2xl overflow-hidden`}
            >
              {croppedImg ? (
                <Image
                  src={croppedImg}
                  alt="cropped image"
                  width={400}
                  height={400}
                />
              ) : previewUrl ? (
                <Cropper
                  className="custom-cropper-styles"
                  preview=".img-preview"
                  src={previewUrl}
                  viewMode={1}
                  aspectRatio={1}
                  minCropBoxHeight={100}
                  minCropBoxWidth={100}
                  background={false}
                  onInitialized={(instance) => setCropper(instance)}
                  movable
                />
              ) : (
                <div
                  className="w-[400px] h-[400px] border-2 border-softGreen 
                  rounded-2xl flex items-center justify-center cursor-pointer"
                  {...getRootProps()}
                >
                  <div className="relative w-14 h-14">
                    <Image
                      src="/workout-complete-icon/add.png"
                      alt="add photo"
                      fill
                    />
                  </div>
                  <input {...getInputProps()} />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-x-4">
              {previewUrl && !croppedImg && (
                <Button
                  title="Complete"
                  onClick={getCropData}
                  className={
                    "h-[40px] bg-lightGreen hover:bg-lightGreen hover:text-gray6"
                  }
                />
              )}
              {(previewUrl || croppedImg) && (
                <Button
                  title="Delete"
                  onClick={resetImage}
                  className={"h-[40px] bg-red hover:bg-red hover:text-gray6"}
                />
              )}
            </div>
          </div>
          <div className={`${defaultRowStyles} items-center`}>
            <div className="text-10">Public</div>
            <label className="switch">
              <input
                type="checkbox"
                onChange={(e) => setIsPublic(e.target.checked)}
                checked={isPublic}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </section>
      </div>
      <div className={`${defaultPageStyles} mt-10 mb-6`}>
        <Button
          title="Exit"
          onClick={() => setOpenConfirm("exit")}
          className="text-gray1 bg-red hover:bg-red hover:text-gray1 w-[200px]"
          fontSize={40}
        />
        <Button
          title="SAVE"
          onClick={() => {
            if (!title.trim().length) {
              bodySnackbar("제목을 입력해주세요.", {
                variant: "warning",
              });
              return;
            }

            if (previewUrl && !croppedImg) {
              bodySnackbar("사진 편집을 완료해주세요.", {
                variant: "warning",
              });
              return;
            }

            setOpenConfirm("save");
          }}
          className="text-gray1 bg-softGreen hover:bg-softGreen hover:text-gray1 w-[400px]"
          fontSize={40}
        />
      </div>
      <ConfirmModal
        isOpen={!!openConfirm}
        onClick={handleConfirm}
        content={
          openConfirm === "save"
            ? "운동 기록을\n저장하시겠어요?"
            : `저장없이\n종료하시겠어요?`
        }
        loading={loading}
      />
      <ProgramHistoryDetailModal
        isOpen={isOpen}
        data={
          {
            savedExercisesStatus,
          } as MyStat
        }
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
};

const defaultInputStyles =
  "border-2 border-gray2 w-[400px] rounded-2xl outline-none bg-gray6 text-black text-3xl";
const defaultRowStyles = "flex gap-x-[50px] text-[40px] justify-between";
const defaultPageStyles = "flex justify-between min-w-[1000px]";

const MAX_IMAGE_FILE_MB_SIZE = 5;
const IMAGE_FILE_SIZE_CALC_FORMULA = 1024;
const IMG_SIZE = 400;
