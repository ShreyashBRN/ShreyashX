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
      title: "ZnapWatch",
      description:
       "A luxury watch marketplace where dealers list products via WhatsApp and everything is managed through an integrated Odoo backend — with buyer subscriptions and built-in analytics.",
      tags: ["Odoo", "OWL", "QWeb", "Bootstrap", "Python", "PostgreSQL", "Node.js", "WhatsApp API"],
      image: "/znap.png",
      links: [{ label: "Visit Site", url: "https://www.znapwatch.com" }],
    },
    {
      id: "project-2",
      category: "Web",
      title: "Feriendeals.ch",
      description:
        "A complete transactional email system for a Swiss hotel booking platform — responsive, bilingual (German/English) templates for bookings, receipts, and vouchers that render perfectly across every email client.",
      tags: ["Figma", "HTML Email", "SendGrid", "Bootstrap", "Responsive Design", "Localization"],
      image: "/project-2.png",
      links: [
        // { label: "Play Store", url: "https://play.google.com" },
        // { label: "App Store", url: "https://apps.apple.com" },
        { label: "Visit Site", url: "https://www.feriendeals.ch" },
      ],
    },
    {
        id: "project-3",
        category: "App",
        title: "ShopBiz - Mini ERP System",
        description:
          "A cross-platform POS app for retailers, handling billing, inventory, and financial reporting, with thermal printer support and a Razorpay-powered subscription model.",
        tags: ["Flutter", "Dart", "Firebase Auth", "Razorpay", "PHP", "Android", "iOS"],
        image: "/image copy 6.png",
        links: [
          { label: "Play Store", url: "https://play.google.com/store/apps/details?id=com.conecta.shopbiz&hl=en_IN" },
          { label: "App Store", url: "https://apps.apple.com/us/app/shopbiz/id6740432305" },
        ],
      },
      // {
      //   id: "projgvect-4",
      //   category: "App",
      //   title: "Project 4",
      //   description:
      //     "Short one to two sentence description of what you built and the problem it solved.",
      //   tags: ["React Native", "Firebase"],
      //   image: "/image copy 3.png",
      //   links: [
      //     { label: "Play Store", url: "https://play.google.com" },
      //     { label: "App Store", url: "https://apps.apple.com" },
      //   ],
      // },
      {
        id: "project-5",
        category: "App",
        title: "4. BusTune - Bus Tracking",
        description:
          "A real-time GPS bus tracking and UPI ticketing app for Kerala's private transit network, built with Flutter and Google Maps/Transit APIs.",
        tags: ["Flutter", "Firebase Auth", "Google Maps API", "Node.js", "Android", "iOS"],
        image: "/image copy 5.png",
        links: [
          { label: "Play Store", url: "https://play.google.com/store/apps/details?id=com.bustune.passengerapp" },
          { label: "App Store", url: "https://apps.apple.com/us/app/bustune/id6742829894" },
        ],
      },
    // Add more projects here following the same shape
  ];