import type { TemplateItem } from "../types";
import { mockTemplates } from "../constants/mockTemplates";

export class TemplateService {
  private static delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static async getAll(): Promise<TemplateItem[]> {
    await this.delay(300);
    return [...mockTemplates];
  }

  static async getById(id: number): Promise<TemplateItem | null> {
    await this.delay(200);
    return mockTemplates.find((t) => t.id === id) || null;
  }

  static async create(data: Omit<TemplateItem, "id">): Promise<TemplateItem> {
    await this.delay(500);
    const newId = Math.max(...mockTemplates.map((t) => t.id), 0) + 1;
    const newTemplate: TemplateItem = { ...data, id: newId };
    return newTemplate;
  }

  static async update(
    id: number,
    data: Partial<TemplateItem>,
  ): Promise<TemplateItem | null> {
    await this.delay(400);
    const template = mockTemplates.find((t) => t.id === id);
    if (!template) return null;
    return { ...template, ...data };
  }

  static async delete(): Promise<boolean> {
    await this.delay(300);
    return true;
  }

  static async toggleActive(id: number): Promise<TemplateItem | null> {
    await this.delay(200);
    const template = mockTemplates.find((t) => t.id === id);
    if (!template) return null;
    return { ...template, isActive: !template.isActive };
  }

  static async uploadFile(file: File): Promise<string> {
    await this.delay(1000);
    return `/uploads/templates/${Date.now()}_${file.name}`;
  }

  static async downloadTemplate(
    template: TemplateItem,
    lang: "vi" | "en",
  ): Promise<Blob | null> {
    await this.delay(500);
    if (lang === "vi" && template.fileVI) {
      return null;
    }
    if (lang === "en" && template.fileEN) {
      return null;
    }
    return null;
  }
}
