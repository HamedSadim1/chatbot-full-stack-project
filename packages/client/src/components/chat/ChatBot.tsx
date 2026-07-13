import { useEffect, useRef, useState } from "react";
import ChatMessages from "./ChatMessages";
import TypingIndicator from "./TypingIndicator";
import { ChatHeader } from "./ChatHeader";
import { ErrorBanner } from "./ErrorBanner";
import { SuggestedPrompts } from "./SuggestedPrompts";
import { ChatFooter } from "./ChatFooter";
import { playAudioSafe, popAudio, notificationAudio } from "@/lib/audio";
import type { AxiosError } from "axios";
import { apiClient } from "@/lib/api";
import { API, CHAT, TIMING } from "@/lib/constants";
import { NL } from "@/lib/locales/nl";
import type { ChatFormData, ConnectionStatus, Message } from "@/types/chat";

const getFriendlyErrorMessage = (error: unknown): string => {
  if (!(error instanceof Error)) {
    return NL.chat.errorMessage;
  }

  const message = error.message.toLowerCase();

  if (message.includes("ollama") && message.includes("timed out")) {
    return NL.chat.ollamaTimeoutError;
  }

  if (message.includes("ollama") && message.includes("failed to connect")) {
    return NL.chat.ollamaConnectionError;
  }

  return error.message;
};

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const [error, setError] = useState<string>("");
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("checking");
  const [selectedModel, setSelectedModel] = useState<string>(CHAT.defaultModel);

  const conversationId = useRef(crypto.randomUUID()).current;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const scrollFrameRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const checkConnection = async () => {
      try {
        const { data } = await apiClient.get<{
          status: string;
          ollama?: string;
        }>(API.healthEndpoint, {
          timeout: TIMING.healthCheckTimeout,
        });
        if (cancelled) return;

        if (data.status === "UP" && data.ollama === "reachable") {
          setConnectionStatus("online");
        } else {
          setConnectionStatus("offline");
        }
      } catch (error) {
        if (cancelled) return;

        const axiosError = error as AxiosError<{ ollama?: string }>;
        const ollamaStatus = axiosError.response?.data?.ollama;
        if (ollamaStatus === "unreachable") {
          setConnectionStatus("ollama-offline");
        } else {
          setConnectionStatus("offline");
        }
      } finally {
        if (!cancelled) {
          timer = setTimeout(checkConnection, TIMING.healthCheckInterval);
        }
      }
    };

    void checkConnection();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const threshold = 100;
      isNearBottomRef.current =
        container.scrollHeight - container.scrollTop - container.clientHeight <=
        threshold;
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const scrollToBottom = () => {
      scrollFrameRef.current = null;
      if (!isNearBottomRef.current) return;

      const container = scrollContainerRef.current;
      if (!container) return;

      container.scrollTo({
        top: container.scrollHeight,
        behavior: isAssistantTyping ? "auto" : "smooth",
      });
    };

    if (scrollFrameRef.current !== null) {
      cancelAnimationFrame(scrollFrameRef.current);
    }

    scrollFrameRef.current = requestAnimationFrame(scrollToBottom);

    return () => {
      if (scrollFrameRef.current !== null) {
        cancelAnimationFrame(scrollFrameRef.current);
      }
    };
  }, [messages, isAssistantTyping, error]);

  const onSubmit = async ({ prompt }: ChatFormData) => {
    isNearBottomRef.current = true;

    try {
      setError("");
      playAudioSafe(popAudio);

      setMessages((prev) => [
        ...prev,
        { role: "user", content: prompt, timestamp: new Date() },
      ]);
      setIsAssistantTyping(true);

      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      const response = await fetch(`${API.baseUrl}${API.chatEndpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, conversationId, model: selectedModel }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(errorData.error ?? "Failed to send message");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let currentMessage = "";
      let lineBuffer = "";

      if (!reader) {
        throw new Error("No response body");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "", timestamp: new Date() },
      ]);

      const appendChunk = (chunk: string) => {
        currentMessage += chunk;
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          if (!lastMessage || lastMessage.role !== "assistant") {
            return prev;
          }
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            ...lastMessage,
            content: currentMessage,
          };
          return newMessages;
        });
      };

      const parseSSELine = (line: string) => {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data: ")) return;

        let data: { chunk: string } | { done: true } | { error: string };

        try {
          data = JSON.parse(trimmed.slice(6)) as
            { chunk: string } | { done: true } | { error: string };
        } catch (parseError) {
          console.error("Failed to parse SSE line:", trimmed, parseError);
          return;
        }

        if ("error" in data) {
          throw new Error(data.error);
        }

        if ("chunk" in data) {
          appendChunk(data.chunk);
        }
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        lineBuffer += decoder.decode(value, { stream: true });
        const lines = lineBuffer.split("\n");
        lineBuffer = lines.pop() ?? "";

        for (const line of lines) {
          parseSSELine(line);
        }
      }

      parseSSELine(lineBuffer);

      playAudioSafe(notificationAudio);
    } catch (error) {
      console.error(error);
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }
      const friendlyError = getFriendlyErrorMessage(error);
      setError(friendlyError);
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];
        if (
          lastMessage &&
          lastMessage.role === "assistant" &&
          lastMessage.content === ""
        ) {
          return prev.slice(0, -1);
        }
        return prev;
      });
    } finally {
      setIsAssistantTyping(false);
      abortControllerRef.current = null;
    }
  };

  const handleRetry = () => {
    setError("");
    const lastUserMessage = [...messages]
      .reverse()
      .find((msg) => msg.role === "user");
    if (lastUserMessage) {
      void onSubmit({ prompt: lastUserMessage.content, model: selectedModel });
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    void onSubmit({ prompt, model: selectedModel });
  };

  const showSuggestedPrompts =
    messages.length === 0 && !isAssistantTyping && !error;

  return (
    <div className="flex min-h-150 flex-col gap-6 text-text-primary">
      <ChatHeader status={connectionStatus} />

      <section className="glass-panel flex flex-1 flex-col gap-4 rounded-4xl border border-glass-border p-4 sm:p-6">
        <div
          ref={scrollContainerRef}
          className="frosted-scrollbar flex flex-1 flex-col gap-4 overflow-y-auto pr-2"
        >
          <ChatMessages messages={messages} />

          {isAssistantTyping && <TypingIndicator />}
          {error && <ErrorBanner error={error} onRetry={handleRetry} />}

          {showSuggestedPrompts && (
            <SuggestedPrompts
              prompts={CHAT.suggestedPrompts}
              onSelect={handleSuggestedPrompt}
            />
          )}
          <div className="h-px w-full shrink-0" />
        </div>
        <ChatFooter
          onSubmit={onSubmit}
          isLoading={isAssistantTyping}
          disabled={connectionStatus === "ollama-offline"}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
        />
      </section>
    </div>
  );
};

export default ChatBot;
