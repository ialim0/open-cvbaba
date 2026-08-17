"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  X,
  Pen,
  Square,
  Eraser,
  Undo,
  Redo,
  Trash2,
  Upload,
  Sparkles,
  Eye,
  Check,
  Layout,
  Columns,
  Image as ImageIcon,
  Loader2,
  FileText
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

interface SketchCanvasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySketch: (imageBase64: string, promptText?: string) => void;
  initialPrompt?: string;
}

type ToolType = "brush" | "rectangle" | "eraser" | "stamp";

interface StampOption {
  label: string;
  icon: React.ReactNode;
  width: number;
  height: number;
  type: string;
}

const STAMP_OPTIONS: StampOption[] = [
  { label: "Header Banner", icon: <Layout className="w-3.5 h-3.5" />, width: 340, height: 50, type: "header" },
  { label: "Left Sidebar", icon: <Columns className="w-3.5 h-3.5" />, width: 110, height: 380, type: "sidebar" },
  { label: "Experience Block", icon: <FileText className="w-3.5 h-3.5" />, width: 220, height: 110, type: "experience" },
  { label: "Skills Tags", icon: <Square className="w-3.5 h-3.5" />, width: 100, height: 80, type: "skills" },
  { label: "Photo Avatar", icon: <ImageIcon className="w-3.5 h-3.5" />, width: 45, height: 45, type: "avatar" },
];

const COLORS = [
  { label: "Dark Slate", value: "#0f172a" },
  { label: "Blueprint Blue", value: "#2563eb" },
  { label: "Amber Accent", value: "#d97706" },
  { label: "Forest Green", value: "#16a34a" },
];

const STROKE_WIDTHS = [
  { label: "Fine", value: 2 },
  { label: "Medium", value: 4 },
  { label: "Bold", value: 8 },
];

export const SketchCanvasModal: React.FC<SketchCanvasModalProps> = ({
  isOpen,
  onClose,
  onApplySketch,
  initialPrompt = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeTab, setActiveTab] = useState<"draw" | "upload">("draw");
  const [currentTool, setCurrentTool] = useState<ToolType>("brush");
  const [selectedColor, setSelectedColor] = useState<string>("#0f172a");
  const [strokeWidth, setStrokeWidth] = useState<number>(3);
  const [selectedStamp, setSelectedStamp] = useState<StampOption>(STAMP_OPTIONS[0]);

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState<number>(-1);

  // Upload state
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Prompt and Analysis
  const [sketchPrompt, setSketchPrompt] = useState<string>(initialPrompt);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [spatialAST, setSpatialAST] = useState<any | null>(null);

  // Setup canvas resolution and background
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // A4 ratio: 380px x 537px
    canvas.width = 380;
    canvas.height = 537;

    // Fill clean white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw subtle grid dots
    ctx.fillStyle = "#e2e8f0";
    for (let x = 20; x < canvas.width; x += 20) {
      for (let y = 20; y < canvas.height; y += 20) {
        ctx.fillRect(x, y, 1.5, 1.5);
      }
    }

    // Save initial state to history
    const initialData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([initialData]);
    setHistoryStep(0);
  }, []);

  useEffect(() => {
    if (isOpen && activeTab === "draw") {
      setTimeout(initCanvas, 50);
    }
  }, [isOpen, activeTab, initCanvas]);

  const saveHistoryState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(data);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const prevStep = historyStep - 1;
      ctx.putImageData(history[prevStep], 0, 0);
      setHistoryStep(prevStep);
    }
  };

  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const nextStep = historyStep + 1;
      ctx.putImageData(history[nextStep], 0, 0);
      setHistoryStep(nextStep);
    }
  };

  const handleClear = () => {
    initCanvas();
    setSpatialAST(null);
  };

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX = 0;
    let clientY = 0;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    setStartPos(coords);

    if (currentTool === "brush" || currentTool === "eraser") {
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
      ctx.strokeStyle = currentTool === "eraser" ? "#ffffff" : selectedColor;
      ctx.lineWidth = currentTool === "eraser" ? strokeWidth * 4 : strokeWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    } else if (currentTool === "stamp") {
      // Draw stamp immediately
      ctx.save();
      ctx.fillStyle = selectedColor + "15";
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);

      const w = selectedStamp.width;
      const h = selectedStamp.height;
      const x = Math.max(10, Math.min(coords.x - w / 2, canvas.width - w - 10));
      const y = Math.max(10, Math.min(coords.y - h / 2, canvas.height - h - 10));

      if (selectedStamp.type === "avatar") {
        ctx.beginPath();
        ctx.arc(coords.x, coords.y, w / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fillRect(x, y, w, h);
        ctx.strokeRect(x, y, w, h);
      }

      ctx.setLineDash([]);
      ctx.fillStyle = selectedColor;
      ctx.font = "bold 11px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(selectedStamp.label, selectedStamp.type === "avatar" ? coords.x : x + w / 2, selectedStamp.type === "avatar" ? coords.y + 4 : y + h / 2 + 4);
      ctx.restore();

      setIsDrawing(false);
      saveHistoryState();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPos) return;
    const coords = getCanvasCoords(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (currentTool === "brush" || currentTool === "eraser") {
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    } else if (currentTool === "rectangle") {
      // Restore canvas from current history snapshot before redrawing rectangle preview
      if (historyStep >= 0 && history[historyStep]) {
        ctx.putImageData(history[historyStep], 0, 0);
      }
      ctx.save();
      ctx.strokeStyle = selectedColor;
      ctx.fillStyle = selectedColor + "15";
      ctx.lineWidth = strokeWidth;
      ctx.setLineDash([3, 3]);

      const width = coords.x - startPos.x;
      const height = coords.y - startPos.y;
      ctx.fillRect(startPos.x, startPos.y, width, height);
      ctx.strokeRect(startPos.x, startPos.y, width, height);
      ctx.restore();
    }
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setStartPos(null);
      saveHistoryState();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, WebP)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setUploadedImage(result);
      setSpatialAST(null);
    };
    reader.readAsDataURL(file);
  };

  const getCurrentSketchBase64 = (): string | null => {
    if (activeTab === "upload") {
      return uploadedImage;
    }
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.toDataURL("image/png");
  };

  const handleAnalyzeSpatialLayout = async () => {
    const imageBase64 = getCurrentSketchBase64();
    if (!imageBase64) {
      toast.warning("Please draw a sketch or upload a wireframe first");
      return;
    }

    setIsAnalyzing(true);
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
      const response = await axios.post(`${apiBaseUrl}/api/vision/parse-layout`, {
        image_base64: imageBase64,
        user_prompt: sketchPrompt,
      });

      if (response.data) {
        setSpatialAST(response.data);
        toast.success("Mistral Vision analyzed spatial layout!");
      }
    } catch (err: any) {
      console.error("Spatial analysis error:", err);
      toast.error(err.response?.data?.detail || "Could not analyze sketch layout");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApply = () => {
    const imageBase64 = getCurrentSketchBase64();
    if (!imageBase64) {
      toast.warning("Please draw or upload a sketch layout");
      return;
    }
    onApplySketch(imageBase64, sketchPrompt);
    toast.success("📐 Hand-drawn layout attached to prompt!");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-semibold text-lg">
              ✏️
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                Vision-to-Layout Wireframe Studio
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                  Multimodal LangGraph
                </span>
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Draw or upload your napkin sketch. Mistral Vision extracts the exact spatial blueprint for Codestral.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-between px-6 py-2 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("draw")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "draw"
                  ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm border border-zinc-200/80 dark:border-zinc-700"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <Pen className="w-3.5 h-3.5" />
              Draw on Canvas
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "upload"
                  ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm border border-zinc-200/80 dark:border-zinc-700"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Napkin / Photo
            </button>
          </div>

          {activeTab === "draw" && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleUndo}
                disabled={historyStep <= 0}
                title="Undo"
                className="p-1.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <Undo className="w-4 h-4" />
              </button>
              <button
                onClick={handleRedo}
                disabled={historyStep >= history.length - 1}
                title="Redo"
                className="p-1.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <Redo className="w-4 h-4" />
              </button>
              <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-700 mx-1" />
              <button
                onClick={handleClear}
                title="Clear Canvas"
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-y-auto p-6 gap-6">
          {/* Left / Center: Interactive Canvas or Upload */}
          <div className="md:col-span-7 flex flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-950/60 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800/80">
            {activeTab === "draw" ? (
              <div className="relative shadow-lg rounded-md overflow-hidden border border-zinc-300 dark:border-zinc-700 bg-white">
                <canvas
                  ref={canvasRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleMouseDown}
                  onTouchMove={handleMouseMove}
                  onTouchEnd={handleMouseUp}
                  className="cursor-crosshair block touch-none"
                  style={{ width: "340px", height: "480px" }}
                />
                <div className="absolute bottom-2 right-2 text-[10px] text-zinc-400 bg-white/80 dark:bg-zinc-900/80 px-2 py-0.5 rounded backdrop-blur-sm pointer-events-none border border-zinc-200 dark:border-zinc-700">
                  A4 Ratio Canvas (210 × 297mm)
                </div>
              </div>
            ) : (
              <div className="w-full h-full min-h-[380px] flex flex-col items-center justify-center">
                {uploadedImage ? (
                  <div className="relative w-full max-w-[340px] max-h-[460px] rounded-lg overflow-hidden border border-zinc-300 dark:border-zinc-700 shadow-md">
                    <img
                      src={uploadedImage}
                      alt="Uploaded Sketch"
                      className="w-full h-full object-contain bg-white"
                    />
                    <button
                      onClick={() => setUploadedImage(null)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-zinc-900/80 text-white hover:bg-red-600 transition-colors shadow"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full max-w-[360px] h-[360px] border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-400 rounded-xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all bg-white/40 dark:bg-zinc-900/40 hover:bg-blue-50/20"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                      <ImageIcon className="w-7 h-7" />
                    </div>
                    <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                      Upload Napkin Drawing or Wireframe
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-[240px]">
                      Take a photo of your hand-drawn sketch or whiteboard and drop it here.
                    </p>
                    <span className="mt-4 px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                      Browse Files
                    </span>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Right: Controls, Stamps, and AI Spatial Preview */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-4">
            {activeTab === "draw" && (
              <div className="space-y-4 bg-zinc-50 dark:bg-zinc-900/60 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                {/* Tools Selector */}
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-2">
                    Drawing Tools
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    <button
                      onClick={() => setCurrentTool("brush")}
                      className={`flex flex-col items-center justify-center p-2 rounded-lg text-xs font-medium border transition-all ${
                        currentTool === "brush"
                          ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-500"
                          : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100"
                      }`}
                    >
                      <Pen className="w-4 h-4 mb-1" />
                      Pen
                    </button>
                    <button
                      onClick={() => setCurrentTool("rectangle")}
                      className={`flex flex-col items-center justify-center p-2 rounded-lg text-xs font-medium border transition-all ${
                        currentTool === "rectangle"
                          ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-500"
                          : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100"
                      }`}
                    >
                      <Square className="w-4 h-4 mb-1" />
                      Box
                    </button>
                    <button
                      onClick={() => setCurrentTool("stamp")}
                      className={`flex flex-col items-center justify-center p-2 rounded-lg text-xs font-medium border transition-all ${
                        currentTool === "stamp"
                          ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-500"
                          : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100"
                      }`}
                    >
                      <Layout className="w-4 h-4 mb-1" />
                      Stamp
                    </button>
                    <button
                      onClick={() => setCurrentTool("eraser")}
                      className={`flex flex-col items-center justify-center p-2 rounded-lg text-xs font-medium border transition-all ${
                        currentTool === "eraser"
                          ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-500"
                          : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100"
                      }`}
                    >
                      <Eraser className="w-4 h-4 mb-1" />
                      Eraser
                    </button>
                  </div>
                </div>

                {/* Quick Section Stamp Selector */}
                {currentTool === "stamp" && (
                  <div>
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1.5">
                      Choose Stamp Section
                    </label>
                    <div className="grid grid-cols-2 gap-1.5 max-h-[110px] overflow-y-auto">
                      {STAMP_OPTIONS.map((stamp, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedStamp(stamp)}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border text-left transition-all ${
                            selectedStamp.label === stamp.label
                              ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-500 font-semibold"
                              : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700"
                          }`}
                        >
                          {stamp.icon}
                          <span className="truncate">{stamp.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stroke Color & Thickness */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block mb-1">
                      Color
                    </label>
                    <div className="flex items-center gap-1.5">
                      {COLORS.map((c) => (
                        <button
                          key={c.value}
                          onClick={() => setSelectedColor(c.value)}
                          className={`w-6 h-6 rounded-full border-2 transition-transform ${
                            selectedColor === c.value
                              ? "scale-110 border-blue-500 shadow-sm"
                              : "border-transparent opacity-80 hover:opacity-100"
                          }`}
                          style={{ backgroundColor: c.value }}
                          title={c.label}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block mb-1">
                      Stroke
                    </label>
                    <div className="flex items-center gap-1">
                      {STROKE_WIDTHS.map((sw) => (
                        <button
                          key={sw.value}
                          onClick={() => setStrokeWidth(sw.value)}
                          className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-all ${
                            strokeWidth === sw.value
                              ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-transparent"
                              : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700"
                          }`}
                        >
                          {sw.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Prompt Description */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block">
                Additional Instructions (Optional)
              </label>
              <textarea
                value={sketchPrompt}
                onChange={(e) => setSketchPrompt(e.target.value)}
                placeholder="e.g. Turn this two-column wireframe into a modern CV for a Senior Architect..."
                rows={2}
                className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
              />
            </div>

            {/* Spatial Analysis AST Preview */}
            <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  Spatial Wireframe Preview
                </span>
                <button
                  onClick={handleAnalyzeSpatialLayout}
                  disabled={isAnalyzing}
                  className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3" />
                      Inspect AST
                    </>
                  )}
                </button>
              </div>

              {spatialAST ? (
                <div className="space-y-1.5 text-[11px] bg-white dark:bg-zinc-950 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Layout:</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {spatialAST.layout_type} ({spatialAST.column_ratio})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Header:</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {spatialAST.header_style}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Sections:</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-[170px]">
                      {spatialAST.sections_order?.join(", ")}
                    </span>
                  </div>
                  {spatialAST.visual_elements?.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Elements:</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400 truncate max-w-[170px]">
                        {spatialAST.visual_elements?.join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Click "Inspect AST" or apply directly. Mistral Vision will parse columns, headers, and section order.
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all hover:shadow-lg"
              >
                <Check className="w-4 h-4" />
                Apply & Generate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
