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

export function QuestionForm({
  defaultValues,
  submitLabel = "Add question",
  topicOptions = [],
  subTopicOptions = [],
  onSubmit,
  onCancel,
}: QuestionFormProps) {
  const router = useRouter();
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

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(handle)}
        className="flex w-full flex-col items-center gap-[30px] rounded-lg bg-white pb-5"
      >
        <div className="flex w-full justify-end px-[10px] py-0 pt-2">
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
                    <button type="button" className="p-1 hover:bg-gray-100 rounded text-[#6B7180]"><Italic className="size-[12px]" /></button>
                    <button type="button" className="p-1 hover:bg-gray-100 rounded text-[#6B7180]"><Bold className="size-[12px]" /></button>
                    <button type="button" className="p-1 hover:bg-gray-100 rounded text-[#6B7180]"><Underline className="size-[12px]" /></button>
                    <button type="button" className="p-1 hover:bg-gray-100 rounded text-[#6B7180]"><Link className="size-[12px]" /></button>
                  </div>
                  <div className="flex items-center gap-1 rounded bg-white px-1">
                    <button type="button" className="p-1 hover:bg-gray-100 rounded text-[#6B7180]"><AlignLeft className="size-[12px]" /></button>
                    <button type="button" className="p-1 hover:bg-gray-100 rounded text-[#6B7180]"><AlignCenter className="size-[12px]" /></button>
                    <button type="button" className="p-1 hover:bg-gray-100 rounded text-[#6B7180]"><AlignRight className="size-[12px]" /></button>
                  </div>
                </div>
                <div className="flex items-center gap-[8px] bg-[#F8FAFF] px-2 py-1 rounded-lg h-[30px] ml-4">
                  <button type="button" className="p-1 text-gray-700 hover:bg-gray-200 rounded"><Subscript className="size-4" /></button>
                  <button type="button" className="p-1 text-gray-700 hover:bg-gray-200 rounded"><Superscript className="size-4" /></button>
                  <button type="button" className="p-1 text-gray-700 hover:bg-gray-200 rounded"><ImageIcon className="size-4" /></button>
                  <button type="button" className="p-1 text-gray-700 hover:bg-gray-200 rounded"><Code className="size-4" /></button>
                </div>
              </div>
              <textarea
                className="min-h-[176px] w-full resize-none bg-transparent p-[11px_20px] text-sm text-[#111827] placeholder-[#9CA3AF] outline-none rounded-b-lg"
                placeholder="Type here"
                {...methods.register("question")}
              />
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
                      className={`flex size-6 cursor-pointer items-center justify-center rounded-full border-2 ${
                        isSelected ? "border-[#7489FF]" : "border-[#D1D5DB] hover:border-gray-400"
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
              <div className="grid gap-[38px] lg:grid-cols-3">
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
