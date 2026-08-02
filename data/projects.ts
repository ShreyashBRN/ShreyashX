export type Project = {
    id: string;
    category: "App" | "Web" | "Web3";
    title: string;
    description: string;
    tags: string[];
    image: string;
    links: {
      label: "Play Store" | "App Store" | "Visit Site" | "GitHub";
      url: string;
    }[];
  };
  
  export const projects: Project[] = [
    {
      id: "project-1",
      category: "Web",
      title: "Project One",
      description:
        "Short one to two sentence description of what you built and the problem it solved.",
      tags: ["Next.js", "TypeScript", "Tailwind"],
      image: "/image.png",
      links: [{ label: "Visit Site", url: "https://example.com" }],
    },
    {
      id: "project-2",
      category: "App",
      title: "Project Two",
      description:
        "Short one to two sentence description of what you built and the problem it solved.",
      tags: ["React Native", "Firebase"],
      image: "/image copy.png",
      links: [
        { label: "Play Store", url: "https://play.google.com" },
        { label: "App Store", url: "https://apps.apple.com" },
      ],
    },
    {
        id: "projegbct-3",
        category: "App",
        title: "Project 3",
        description:
          "Short one to two sentence description of what you built and the problem it solved.",
        tags: ["React Native", "Firebase"],
        image: "/image copy 2.png",
        links: [
          { label: "Play Store", url: "https://play.google.com" },
          { label: "App Store", url: "https://apps.apple.com" },
        ],
      },
      {
        id: "projgvect-4",
        category: "App",
        title: "Project 4",
        description:
          "Short one to two sentence description of what you built and the problem it solved.",
        tags: ["React Native", "Firebase"],
        image: "/image copy 3.png",
        links: [
          { label: "Play Store", url: "https://play.google.com" },
          { label: "App Store", url: "https://apps.apple.com" },
        ],
      },
      {
        id: "projectj-5",
        category: "App",
        title: "Project 5",
        description:
          "Short one to two sentence description of what you built and the problem it solved.",
        tags: ["React Native", "Firebase"],
        image: "/image copy 4.png",
        links: [
          { label: "Play Store", url: "https://play.google.com" },
          { label: "App Store", url: "https://apps.apple.com" },
        ],
      },
    // Add more projects here following the same shape
  ];