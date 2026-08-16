export type Template = {
  id: string;
  name: string;
  image: string;
  description: string;
  category: string;
  type: 'CV' | 'Letter';
  characteristics: string[];
  isNew?: boolean;
  hasComponent?: boolean;
};