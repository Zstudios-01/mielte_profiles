
export type Category = 'Frontend' | 'Backend' | 'Fullstack' | 'AI/ML' | 'Web3' | 'Mobile';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'developer' | 'user';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  category: Category;
  downloadCount: number;
  developer: {
    name: string;
    avatar: string;
  };
  fileSize: string;
  tags: string[];
  isVerified?: boolean;
  // zip_url is required for downloads, and email is used to identify the owner
  zip_url?: string;
  email?: string;
}

export interface UploadFormData {
  title: string;
  description: string;
  category: Category;
  coverImage: File | null;
  zipFile: File | null;
  readme: string;
  envExample?: string;
}