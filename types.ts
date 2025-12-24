export interface SubProject {
  id: string;
  title: string;
  videoUrl: string; // Could be YouTube/Vimeo link or direct file
  description?: string;
}

export interface Project {
  id: string;
  title: string;
  client: string;
  year: string;
  category: string;
  thumbnail: string;
  description: string;
  subProjects: SubProject[];
  tags: string[];
}

export interface UserProfile {
  name: string;
  role: string;
  bio: string;
  email: string;
  heroVideoUrl?: string; // For the background loop or showreel button
  socials: {
    instagram?: string;
    vimeo?: string;
    linkedin?: string;
    youtube?: string;
  };
}

// Initial seed data
export const INITIAL_PROFILE: UserProfile = {
  name: "Nguyễn Văn A",
  role: "Visual Alchemist & Editor",
  bio: "Chuyên tạo ra những câu chuyện thị giác đầy cảm xúc. Kết hợp kỹ thuật dựng phim hiện đại với tư duy nghệ thuật độc đáo.",
  email: "contact@visualalchemi.vn",
  heroVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  socials: {
    instagram: "#",
    vimeo: "#",
    linkedin: "#"
  }
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "1",
    title: "Neon City Drifters",
    client: "Urban Wear Co.",
    year: "2023",
    category: "Commercial",
    thumbnail: "https://picsum.photos/800/600?grayscale",
    description: "Một chiến dịch quảng cáo năng động tập trung vào văn hóa đường phố đêm. Sử dụng kỹ thuật glitch và màu neon tương phản cao.",
    tags: ["Editing", "Color Grading", "VFX"],
    subProjects: [
      { id: "s1", title: "Main Commercial (30s)", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
      { id: "s2", title: "Social Cut (15s)", videoUrl: "" }
    ]
  },
  {
    id: "2",
    title: "Ethereal Landscapes",
    client: "Travel Vibes",
    year: "2024",
    category: "Documentary",
    thumbnail: "https://picsum.photos/800/800?blur",
    description: "Loạt phim tài liệu ngắn khám phá những vùng đất chưa được khai phá tại Tây Bắc. Nhịp phim chậm, giàu chất thơ.",
    tags: ["Directing", "Editing", "Sound Design"],
    subProjects: []
  },
  {
    id: "3",
    title: "Cyberpunk Interface",
    client: "TechGiant",
    year: "2023",
    category: "Motion Graphics",
    thumbnail: "https://picsum.photos/800/450",
    description: "Thiết kế giao diện UI/UX tương lai cho phim ngắn khoa học viễn tưởng.",
    tags: ["Motion", "3D", "After Effects"],
    subProjects: []
  }
];