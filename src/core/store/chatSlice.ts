import type { StateCreator } from 'zustand';
import type { AppState, ChatMessage, ChatSliceActions, ChatSliceState } from '../../types';
import { APP_CONFIG } from '../../config';

export const createChatSlice: StateCreator<
  AppState,
  [],
  [],
  ChatSliceState & ChatSliceActions
> = (set) => ({
  messages: [],
  isLoading: false,

  addMessage: (msg) =>
    set((state) => {
      const newMsg: ChatMessage = {
        ...msg,
        id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: Date.now(),
      };
      const messages = [...state.messages, newMsg].slice(-APP_CONFIG.maxChatMessages);
      return { messages };
    }),

  clearChat: () => set({ messages: [] }),

  setLoading: (isLoading) => set({ isLoading }),
});
