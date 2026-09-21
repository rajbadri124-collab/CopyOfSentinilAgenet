export interface YoloDetection {
    classId: number;
    score: number;
    x: number;
    y: number;
    width: number;
    height: number;
}
interface YoloDetectorOptions {
    modelUrl?: string;
    inputSize?: number;
    confidenceThreshold?: number;
    iouThreshold?: number;
}
/** Raw JavaScript class-aware NMS. Coordinates remain in source-image pixels. */
export declare function nonMaximumSuppression(detections: YoloDetection[], iouThreshold?: number): YoloDetection[];
export declare function detectWithYolo(image: Blob, options?: YoloDetectorOptions): Promise<YoloDetection[]>;
export {};
//# sourceMappingURL=yolo-detector.d.ts.map