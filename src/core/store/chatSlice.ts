/**
 * @fileoverview Zustand slice for the AI advisor chat feature.
 * Manages the ordered message list and loading state for the conversational chat interface.
 */

import type { StateCreator } from 'zustand';
import type { AppState, ChatMessage, ChatSliceActions, ChatSliceState } from '../../types';
import { APP_CONFIG } from '../../config';

/**
 * Zustand StateCreator for the chat slice.
 * Provides an ordered message array (capped at maxChatMessages) and a loading flag,
 * with actions to append messages, clear the thread, and toggle loading state.
 */
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
