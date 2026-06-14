import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2, ChevronDown, Image as ImageIcon, Code, Type, Link, MoreHorizontal, Subscript, Superscript, Underline, Italic, Bold, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { useRouter } from "@tanstack/react-router";

import { questionSchema, type QuestionInput } from "@/features/questions/questions.schema";

const EMPTY: QuestionInput = {
  question: "",
  option1: "",
  option2: "",
  option3: "",
  option4: "",
  correct_option: "option1",
  explanation: "",
  difficulty: "medium",
  topic: "",
  sub_topic: "",
  media_url: "",
};

interface QuestionFormProps {
  defaultValues?: Partial<QuestionInput>;
  submitLabel?: string;
  topicOptions?: { value: string; label: string }[];
  subTopicOptions?: { value: string; label: string }[];
  onSubmit: (values: QuestionInput) => void;
  onCancel?: () => void;
}

import { toast } from "sonner";
import { useRef } from "react";

export function QuestionForm({
  defaultValues,
  submitLabel = "Add question",
  topicOptions = [],
  subTopicOptions = [],
  onSubmit,
  onCancel,
}: QuestionFormProps) {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const methods = useForm<QuestionInput>({
    resolver: zodResolver(questionSchema),
    defaultValues: { ...EMPTY, ...defaultValues },
  });

  const handle = (values: QuestionInput) => {
    onSubmit(values);
    methods.reset(EMPTY);
  };

  const handleExit = () => {
    if (onCancel) onCancel();
    else router.history.back();
  };

  const applyFormat = (formatType: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    let value = methods.getValues("question");
    if (!value || value === "undefined") {
      value = "";
    }
    const selectedText = start !== end ? value.substring(start, end) : "";

    let replacement = "";
    switch (formatType) {
      case "bold":
        replacement = `**${selectedText || "bold text"}**`;
        break;
      case "italic":
        replacement = `*${selectedText || "italic text"}*`;
        break;
      case "underline":
        replacement = `<u>${selectedText || "underlined text"}</u>`;
        break;
      case "link":
        replacement = `[${selectedText || "link text"}](https://example.com)`;
        break;
      case "align-left":
        replacement = `<div align="left">${selectedText || "aligned text"}</div>`;
        break;
      case "align-center":
        replacement = `<div align="center">${selectedText || "aligned text"}</div>`;
        break;
      case "align-right":
        replacement = `<div align="right">${selectedText || "aligned text"}</div>`;
        break;
      case "subscript":
        replacement = `<sub>${selectedText || "subscript"}</sub>`;
        break;
      case "superscript":
        replacement = `<sup>${selectedText || "superscript"}</sup>`;
        break;
      case "code":
        replacement = `\`${selectedText || "code"}\``;
        break;
      default:
        return;
    }

    const newValue = value.substring(0, start) + replacement + value.substring(end);
    methods.setValue("question", newValue);

    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        textarea.setSelectionRange(start, start + replacement.length);
      } else {
        const offset = formatType === "bold" ? 2 : formatType === "italic" ? 1 : formatType === "underline" ? 3 : 1;
        textarea.setSelectionRange(start + offset, start + offset + (replacement.length - offset * 2));
      }
    }, 0);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading("Uploading image to local server...");
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || `Upload failed with status ${res.status}`);
      }

      const data = await res.json();
      if (data.success && data.url) {
        const fullUrl = data.url.startsWith("http") ? data.url : window.location.origin + data.url;
        methods.setValue("media_url", fullUrl);
        toast.success("Image uploaded successfully!", { id: toastId });
      } else {
        throw new Error(data.error || "Invalid response status");
      }
    } catch (err: any) {
      toast.error(`Local upload failed: ${err.message || err}. Using local preview.`, { id: toastId });
      // Fallback: load as local base64 preview so it works in UI session at least
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        methods.setValue("media_url", base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const { ref: questionRef, ...questionRegister } = methods.register("question");

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(handle)}
        className="flex w-full flex-col items-center gap-[30px] rounded-lg px-5 pb-5"
      >
        <div className="flex w-full justify-start px-[10px] py-0 pt-2">
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg bg-[#FFFBFB] px-3 h-8 text-[#FF7F7F] transition-all hover:bg-red-50"
            onClick={() => methods.reset(EMPTY)}
          >
            <Trash2 className="size-4" />
            <span className="text-sm">Delete All Edits</span>
          </button>
        </div>

        <div className="flex w-full flex-col justify-center gap-[30px]">
          {/* Main Question Editor */}
          <div className="flex w-full flex-col gap-[20px]">
            <div className="flex flex-col rounded-lg border-[0.5px] border-[#97BCF0] bg-white">
              <div className="flex h-12 items-center gap-1.5 border-b border-[#E5E7EB] bg-white px-5 py-[6px] rounded-t-lg overflow-x-auto shrink-0">
                <div className="flex items-center gap-[7px]">
                  <div className="flex items-center gap-1 rounded bg-white px-1">
                    <button type="button" onClick={() => applyFormat("italic")} className="p-1 hover:bg-gray-100 rounded text-[#6B7180] cursor-pointer" title="Italic"><Italic className="size-[12px]" /></button>
                    <button type="button" onClick={() => applyFormat("bold")} className="p-1 hover:bg-gray-100 rounded text-[#6B7180] cursor-pointer" title="Bold"><Bold className="size-[12px]" /></button>
                    <button type="button" onClick={() => applyFormat("underline")} className="p-1 hover:bg-gray-100 rounded text-[#6B7180] cursor-pointer" title="Underline"><Underline className="size-[12px]" /></button>
                    <button type="button" onClick={() => applyFormat("link")} className="p-1 hover:bg-gray-100 rounded text-[#6B7180] cursor-pointer" title="Link"><Link className="size-[12px]" /></button>
                  </div>
                  <div className="flex items-center gap-1 rounded bg-white px-1">
                    <button type="button" onClick={() => applyFormat("align-left")} className="p-1 hover:bg-gray-100 rounded text-[#6B7180] cursor-pointer" title="Align Left"><AlignLeft className="size-[12px]" /></button>
                    <button type="button" onClick={() => applyFormat("align-center")} className="p-1 hover:bg-gray-100 rounded text-[#6B7180] cursor-pointer" title="Align Center"><AlignCenter className="size-[12px]" /></button>
                    <button type="button" onClick={() => applyFormat("align-right")} className="p-1 hover:bg-gray-100 rounded text-[#6B7180] cursor-pointer" title="Align Right"><AlignRight className="size-[12px]" /></button>
                  </div>
                </div>
                <div className="flex items-center gap-[8px] bg-[#F8FAFF] px-2 py-1 rounded-lg h-[30px] ml-4">
                  <button type="button" onClick={() => applyFormat("subscript")} className="p-1 text-gray-700 hover:bg-gray-200 rounded cursor-pointer" title="Subscript"><Subscript className="size-4" /></button>
                  <button type="button" onClick={() => applyFormat("superscript")} className="p-1 text-gray-700 hover:bg-gray-200 rounded cursor-pointer" title="Superscript"><Superscript className="size-4" /></button>
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="p-1 text-gray-700 hover:bg-gray-200 rounded cursor-pointer" title="Insert Image"><ImageIcon className="size-4" /></button>
                  <button type="button" onClick={() => applyFormat("code")} className="p-1 text-gray-700 hover:bg-gray-200 rounded cursor-pointer" title="Code"><Code className="size-4" /></button>
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <div className="relative w-full">
                <textarea
                  className="min-h-[176px] w-full resize-none bg-transparent p-[11px_20px] text-sm text-[#111827] placeholder-[#9CA3AF] outline-none rounded-b-lg"
                  placeholder="Type here"
                  {...questionRegister}
                  ref={(e) => {
                    questionRef(e);
                    textareaRef.current = e;
                  }}
                />
                {methods.watch("media_url") && (
                  <div className="relative m-4 max-w-[200px] rounded-lg border border-[#E5E7EB] p-2 bg-gray-50">
                    <img
                      src={methods.watch("media_url")}
                      alt="Uploaded preview"
                      className="max-h-[120px] w-full object-contain rounded"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        methods.setValue("media_url", "");
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="absolute -top-2 -right-2 grid size-6 place-items-center rounded-full bg-red-500 text-white shadow hover:bg-red-600 cursor-pointer"
                      title="Remove image"
                    >
                      &times;
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Options Section */}
          <div className="flex w-full flex-col gap-[14px]">
            <span className="text-base font-medium text-black">Type the options below</span>

            <div className="flex flex-col gap-[15px]">
              {[1, 2, 3, 4].map((num) => {
                const optName = `option${num}` as keyof QuestionInput;
                const isSelected = methods.watch("correct_option") === optName;

                return (
                  <div key={optName} className="flex h-12 w-full items-center gap-[17px]">
                    <div
                      className={`flex size-6 cursor-pointer items-center justify-center rounded-full border-2 ${isSelected ? "border-[#7489FF]" : "border-[#D1D5DB] hover:border-gray-400"
                        }`}
                      onClick={() => methods.setValue("correct_option", optName as any)}
                    >
                      {isSelected && <div className="size-3 rounded-full bg-[#7489FF]" />}
                    </div>
                    <div className="flex h-full flex-1 items-center gap-[10px] rounded-lg border border-[#E5E7EB] bg-white px-5 py-[11px] focus-within:border-blue-400">
                      <input
                        className="flex-1 text-sm text-gray-900 placeholder-[#9CA3AF] outline-none"
                        placeholder="Type Option here"
                        {...methods.register(optName)}
                      />
                      <button
                        type="button"
                        onClick={() => methods.setValue(optName, "")}
                        className="text-[#D1D5DB] hover:text-red-500"
                      >
                        <Trash2 className="size-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add Solution Section */}
          <div className="flex w-full flex-col gap-[10px]">
            <span className="text-base font-medium text-black">Add Solution</span>
            <div className="flex flex-col rounded-lg border border-[#E5E7EB] bg-white">
              <textarea
                className="min-h-[176px] w-full resize-none p-[11px_20px] text-sm text-[#111827] placeholder-[#9CA3AF] outline-none rounded-lg"
                placeholder="Type here"
                {...methods.register("explanation")}
              />
            </div>
          </div>

          {/* Question Settings Section */}
          <div className="flex w-full flex-col gap-[30px] pt-4">
            <span className="text-base font-medium text-[#374151]">Question settings</span>

            <div className="flex flex-col gap-[20px]">
              <div className="flex flex-col gap-[38px] lg:grid-cols-3">
                <div className="flex flex-col gap-[15px]">
                  <span className="text-base font-medium text-[#374151]">Level of Difficulty</span>
                  <div className="relative flex h-12 items-center rounded-lg border-[0.5px] border-[#9CA3AF] bg-white px-4">
                    <select
                      className="w-full appearance-none bg-transparent text-base font-medium text-gray-900 outline-none placeholder-[#D1D5DB]"
                      {...methods.register("difficulty")}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                    <ChevronDown className="absolute right-4 size-5 text-[#6B7180] pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-[15px]">
                  <span className="text-base font-medium text-[#374151]">Topic</span>
                  <div className="relative flex h-12 items-center rounded-lg border-[0.5px] border-[#9CA3AF] bg-white px-4">
                    <select
                      className="w-full appearance-none bg-transparent text-base font-medium text-gray-900 outline-none"
                      {...methods.register("topic")}
                    >
                      <option value="">Select from Drop-down</option>
                      {topicOptions.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 size-5 text-[#6B7180] pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-[15px]">
                  <span className="text-base font-medium text-[#374151]">Sub-topic</span>
                  <div className="relative flex h-12 items-center rounded-lg border-[0.5px] border-[#9CA3AF] bg-white px-4">
                    <select
                      className="w-full appearance-none bg-transparent text-base font-medium text-gray-900 outline-none"
                      {...methods.register("sub_topic")}
                    >
                      <option value="">Select from Drop-down</option>
                      {subTopicOptions.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 size-5 text-[#6B7180] pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex w-full items-center justify-between pt-6 pb-4">
            <button
              type="button"
              className="flex h-12 w-[160px] items-center justify-center rounded-lg bg-[#FF7F7F] text-base font-medium text-white transition-colors hover:bg-red-500"
              onClick={handleExit}
            >
              Exit Test Creation
            </button>

            <button
              type="submit"
              className="flex h-12 w-[200px] items-center justify-center rounded-lg bg-[#7489FF] text-base font-medium text-white transition-colors hover:bg-blue-600"
            >
              Next
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
