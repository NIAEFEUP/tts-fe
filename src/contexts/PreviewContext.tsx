export const previewMap: Record<number, { cur: string; next: string }> = {};

export const setPreview = (id: number, cur: string, next: string) => {
  previewMap[id] = { cur, next };
};

export const getPreview = (id: number) => previewMap[id];

export const getAllPreviews = () => previewMap;
