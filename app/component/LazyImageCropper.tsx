"use client";

import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";
import type CropperJS from "cropperjs";

type LazyImageCropperProps = {
  src: string;
  onInitialized: (instance: any) => void;
  className?: string;
  preview?: string;
  viewMode?: number;
  aspectRatio?: number;
  minCropBoxHeight?: number;
  minCropBoxWidth?: number;
  background?: boolean;
  movable?: boolean;
};

export const LazyImageCropper = ({
  src,
  onInitialized,
  className = "custom-cropper-styles",
  preview = ".img-preview",
  viewMode = 1,
  aspectRatio = 1,
  minCropBoxHeight = 100,
  minCropBoxWidth = 100,
  background = false,
  movable = true,
}: LazyImageCropperProps) => {
  return (
    <Cropper
      className={className}
      preview={preview}
      src={src}
      viewMode={viewMode as CropperJS.ViewMode}
      aspectRatio={aspectRatio}
      minCropBoxHeight={minCropBoxHeight}
      minCropBoxWidth={minCropBoxWidth}
      background={background}
      onInitialized={onInitialized}
      movable={movable}
    />
  );
};
