"use client";

import axios from "axios";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useCallback, useState } from "react";
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

type SatisfiedStatus = "terrible" | "notSatisfied" | "soso" | "happy" | "lol";

const validImageTypes = ["jpeg", "png", "jpg"];

const formattedDuration = (value: number) => {
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const seconds = value % 60;

  return `${hours ? `${hours} h ` : ""}${minutes ? `${minutes} m ` : ""}${
    seconds ? `${seconds} s` : ""
  }`;
};

const PngIcon = ({ name }: { name: string }) => {
  return (
    <div className="relative w-12 h-12">
      <Image
        className="object-contain"
        src={`/workout-complete-icon/${name}.png`}
        alt={name}
        fill
      />
    </div>
  );
};

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
        onClick={() => {
          onSetStatus("terrible");
        }}
      />
      <NotSatisfied
        className={`${
          status === "notSatisfied" ? "fill-yellow" : "fill-gray6"
        }`}
        onClick={() => {
          onSetStatus("notSatisfied");
        }}
      />
      <Soso
        className={`${status === "soso" ? "fill-yellow" : "fill-gray6"}`}
        onClick={() => {
          onSetStatus("soso");
        }}
      />
      <Happy
        className={`${status === "happy" ? "fill-yellow" : "fill-gray6"}`}
        onClick={() => {
          onSetStatus("happy");
        }}
      />
      <Lol
        className={`${status === "lol" ? "fill-yellow" : "fill-gray6"}`}
        onClick={() => {
          onSetStatus("lol");
        }}
      />
    </span>
  );
};

export const WorkoutSummary = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { bodySnackbar } = useBodySnackbar();
  const completedAt = useProgressStore((state) => state.completedAt);
  const savedWorkoutTime = useProgressStore((state) => state.workoutTime);
  const savedProgramId = useProgressStore((state) => state.programId);
  const resetProgramId = useProgressStore((state) => state.resetProgramId);
  const resetWorkoutTime = useProgressStore((state) => state.resetWorkoutTime);
  const resetExercisesStatus = useProgressStore(
    (state) => state.resetExercisesStatus
  );
  const resetCompletedAt = useProgressStore((state) => state.resetCompletedAt);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [cropper, setCropper] = useState<Cropper>();
  const [previewUrl, setPreviewUrl] = useState("");
  const [croppedImg, setCroppedImg] = useState("");
  const [imgFile, setImgFile] = useState<Blob>();

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

  const onDrop = useCallback((acceptedFiles: File[]) => {
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
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const resetImage = () => {
    setCropper(undefined);
    setImgFile(undefined);
    setPreviewUrl("");
    setCroppedImg("");
  };

  const goToListWithoutSave = () => {
    router.replace("/my-programs");
    resetProgramId();
    resetWorkoutTime();
    resetExercisesStatus();
    resetCompletedAt();
  };

  const uploadImageAndGetImageUrl = async () => {
    const imageName = `${session?.user?.name}-${savedProgramId}-${format(
      new Date(),
      "yyyy-MM-dd-hh:mm-a"
    )}`;

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

      return uploadToGCPBucketResult.status === 200 ? completedUrl : undefined;
    } catch (error) {
      console.log("Error uploading file", error);
    }
  };

  if (!completedAt) return <>완료된 프로그램이 없습니다.</>;

  return (
    <div className="flex flex-col text-gray6 gap-y-20">
      <h1 className="text-[80px] tracking-[8px]">WORKOUT COMPLETE!</h1>
      <div className="flex gap-x-[280px]">
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
            <div className="flex gap-x-[174px] text-[40px]">
              <span>TOTAL</span>
              <span className="flex gap-x-2 items-center">
                <PngIcon name="duration" />
                {formattedDuration(savedWorkoutTime)}
              </span>
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
            <span className="text-[40px] text-[#74cf8f]">Upload Photo </span>
            <div
              className={`${
                croppedImg ? "w-[400px]" : "max-w-[400px] max-h-[400px]"
              } 
              border-2 border-[#74cf8f] rounded-2xl overflow-hidden`}
            >
              {croppedImg ? (
                <img
                  style={{ width: "100%" }}
                  src={croppedImg}
                  alt="cropped image"
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
                  className="w-[400px] h-[400px] border-2 border-[#74cf8f] 
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
          <div>
            <div>privtate</div>
            <div>save</div>
          </div>
        </section>
      </div>
      <div>
        <button
          onClick={() => {
            goToListWithoutSave();
          }}
        >
          Exit
        </button>
      </div>
    </div>
  );
};

const defaultInputStyles =
  "border-2 border-gray2 w-[400px] rounded-2xl outline-none bg-gray6 text-black text-3xl";
const defaultRowStyles = "flex gap-x-[50px] text-[40px] justify-between";

const MAX_IMAGE_FILE_MB_SIZE = 5;
const IMAGE_FILE_SIZE_CALC_FORMULA = 1024;
const IMG_SIZE = 400;
