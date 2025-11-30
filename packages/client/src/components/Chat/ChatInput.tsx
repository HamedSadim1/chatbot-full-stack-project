import { MoveUp } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";

export type ChatFormData = {
  prompt: string;
};

type Props = {
  onSubmit: (data: ChatFormData) => Promise<void>;
};

const ChatInput = ({ onSubmit }: Props) => {
  const { register, handleSubmit, formState, reset } = useForm<ChatFormData>();

  const handleFormSubmit = handleSubmit((data: ChatFormData) => {
    reset({ prompt: "" });
    onSubmit(data);
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit();
    }
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      onKeyDown={handleKeyDown}
      className="glass-panel flex flex-col gap-3 rounded-[28px] border border-white/10 px-4 py-4 shadow-lg"
    >
      <textarea
        {...register("prompt", {
          required: true,
          minLength: 5,
          maxLength: 1000,
          validate: (value) => value.trim().length > 0,
        })}
        className="w-full resize-none border-0 bg-transparent text-base text-white placeholder-white/50 focus:outline-none"
        placeholder="Vertel me je idee of vraag..."
        maxLength={1000}
        minLength={5}
        autoFocus
        rows={3}
      />
      <Button
        disabled={!formState.isValid}
        className="h-12 w-12 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-[0_10px_30px_rgba(14,165,233,0.45)] transition hover:scale-105 disabled:opacity-40"
      >
        <MoveUp />
      </Button>
    </form>
  );
};

export default ChatInput;
