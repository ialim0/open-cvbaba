export type Template = {
  id: string;
  name: string;
  image: string;
  description: string;
  category: string;
  type: 'CV';
  characteristics: string[];
  isNew?: boolean;
  hasComponent?: boolean;
};