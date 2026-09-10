"use client";

import type { AvailableTopic, RegistrationRequest } from "../types";
import { topicApiService } from "./topic.api";

export const studentTopicService = {
  async getAvailableTopics(): Promise<AvailableTopic[]> {
    const { topics } = await topicApiService.getAvailableTopics();
    return topics;
  },

  async getMyRegistration(): Promise<RegistrationRequest | null> {
    return topicApiService.getMyRegistration();
  },

  async getRegistrationHistory(): Promise<RegistrationRequest[]> {
    const registration = await topicApiService.getMyRegistration();
    return registration ? [registration] : [];
  },

  async registerTopic(
    topicId: string,
  ): Promise<{ success: boolean; message: string }> {
    return topicApiService.registerTopic(Number(topicId));
  },

  async exportConfirmationPdf(registrationId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1500));
  },

  async getGovernanceState() {
    return topicApiService.getGovernanceState();
  },
};
