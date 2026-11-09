// Typed site content — source of truth is content/site-content.md (transcribed from the brochure).
// Do not invent services, clients, figures or testimonials. Anything not in the brochure is marked TODO(content).

export type IconName =
  | "globe" | "cloud-cog" | "shield-check" | "users" | "telescope" | "target" | "lightbulb"
  | "search" | "puzzle" | "code" | "trending-up" | "settings" | "pie-chart" | "laptop" | "network"
  | "rocket" | "user" | "headset" | "bar-chart" | "monitor-cog" | "contact" | "excavator" | "truck"
  | "workflow" | "app-window" | "mouse-pointer" | "building" | "ship" | "forklift" | "shopping-cart"
  | "factory" | "shopping-bag" | "concierge" | "briefcase" | "building-2" | "shapes" | "sliders"
  | "handshake" | "layout-dashboard" | "message-circle" | "mail" | "database" | "lock" | "user-plus"
  | "help-circle" | "megaphone" | "messages" | "line-chart" | "key" | "receipt" | "plug" | "phone"
  | "map-pin" | "box" | "zap" | "layers" | "server" | "smartphone" | "refresh" | "wallet" | "calendar"
  | "file-text" | "wrench" | "clipboard-check" | "alert-triangle" | "route" | "fuel" | "package-check"
  | "warehouse" | "gauge" | "map" | "badge-check" | "funnel" | "infinity" | "sprout";

export type Feature = { title: string; text: string; icon?: IconName };

// ---------------------------------------------------------------- Company
export const company = {
  legalName: "HEVINKA Technologies Private Limited",
  shortName: "HEVINKA",
  subline: "Technologies Private Limited",
  positioning: "Digital Transformation & Business Technology Solutions",
  tagline: ["Innovate.", "Integrate.", "Elevate."] as const,
  strapline: "Technology that empowers tomorrow.",
  footprint: ["India", "UAE", "Beyond"] as const,
  serviceKeywords: ["ERP", "CRM", "Software", "Automation", "Logistics", "Asset Rental", "Web", "Digital"],
  microLabels: {
    peopleTech: ["People", "Technology", "Possibilities"],
    peopleTechGrowth: ["People", "Technology", "Possibilities", "Growth"],
    smarterTogether: ["A smarter", "tomorrow", "together"],
    buildingSmarter: ["Building", "a smarter", "tomorrow"],
    brighter: ["Technology", "for a brighter", "tomorrow"],
    ideas: ["Ideas", "Systems", "Better tomorrow"],
    movement: ["People", "Movement", "Business", "Growth"],
    fleets: "Connected fleets. Smarter business.",
  },
} as const;

export const contact = {
  phones: [
    { display: "+91 787 9642 135", href: "tel:+917879642135" },
    { display: "+91 906 1977 166", href: "tel:+919061977166" },
  ],
  whatsapp: "https://wa.me/917879642135",
  email: "info@hevinka.com",
  address: {
    lines: ["Building No 66/44, 3rd Floor,", "JC Chambers, Panampilly Nagar,", "Ernakulam – 682036, Kerala, India"],
    street: "Building No 66/44, 3rd Floor, JC Chambers, Panampilly Nagar",
    locality: "Ernakulam",
    region: "Kerala",
    postalCode: "682036",
    country: "IN",
  },
  web: { display: "www.hevinka.com", href: "https://www.hevinka.com" },
} as const;

// ---------------------------------------------------------------- Global solutions (p.3)
export const globalSolutions = {
  title: ["Global Solutions", "for a Connected World"],
  intro:
    "HEVINKA develops technology solutions designed to support modern businesses operating across markets, teams, locations and business functions.",
  pillars: [
    { title: "Global mindset, local understanding.", icon: "globe" },
    { title: "Technology that adapts across borders and industries.", icon: "cloud-cog" },
    { title: "Reliable, secure and future-ready solutions you can trust.", icon: "shield-check" },
    { title: "Partnering for long-term impact and shared success.", icon: "users" },
  ] satisfies { title: string; icon: IconName }[],
};

// ---------------------------------------------------------------- Vision & approach (p.2)
export const vision = {
  title: ["Our", "Vision & Approach"],
  intro: "Guided by a clear vision and a practical approach, we build technology solutions that create real business impact.",
  cards: [
    {
      key: "Vision",
      icon: "telescope",
      statement: "Enable businesses to operate with greater clarity, control and confidence through connected technology.",
      number: "01",
      outcome: "Greater clarity",
      tone: "navy",
    },
    {
      key: "Mission",
      icon: "target",
      statement:
        "Design, develop and implement practical digital solutions that improve workflows, integrate information and support sustainable business growth.",
      number: "02",
      outcome: "Sustainable growth",
      tone: "royal",
    },
    {
      key: "Core Philosophy",
      icon: "lightbulb",
      statement: "Start with the business process, build around the real requirement, and keep the system ready to evolve.",
      number: "03",
      outcome: "People · Process · Progress",
      tone: "sky",
    },
  ] satisfies { key: string; icon: IconName; statement: string; number: string; outcome: string; tone: "navy" | "royal" | "sky" }[],
  operatingModel: {
    title: ["Our Connected", "Operating Model"],
    steps: [
      { title: "Discover", text: "Understand business goals and workflows", icon: "search" },
      { title: "Design", text: "Create practical, scalable solution architectures", icon: "puzzle" },
      { title: "Develop", text: "Build, integrate and configure with quality and agility", icon: "code" },
      { title: "Deploy", text: "Implement smoothly with minimal disruption", icon: "trending-up" },
      { title: "Evolve", text: "Continuously improve and adapt to business change", icon: "settings" },
    ] satisfies Feature[],
  },
};

// ---------------------------------------------------------------- Industries (p.4)
export const industries = {
  title: ["Technology Adapted to", "Different Business Environments"],
  intro: "The same technology principles can be configured around different operating models, workflows and information needs.",
  // TODO(content): the brochure only names the industries. The one-line "how it applies" texts and the
  // related-solution mapping below were composed from the brochure's own module lists — needs client review.
  items: [
    { title: "Construction & Engineering", icon: "building", text: "Connect projects, procurement, equipment and site teams — with job tracking, asset management and reporting in one system.", solutions: ["erp-enterprise-solutions", "equipment-asset-rental-management", "logistics-fleet-transport-solutions"] },
    { title: "Marine & Offshore", icon: "ship", text: "Keep equipment, maintenance schedules, inspection records and multi-location operations in one operating picture.", solutions: ["erp-enterprise-solutions", "equipment-asset-rental-management", "custom-software-applications"] },
    { title: "Logistics & Transportation", icon: "truck", text: "Plan trips, dispatch vehicles, track deliveries and fleet maintenance, and bill accurately — from one connected platform.", solutions: ["logistics-fleet-transport-solutions", "business-automation-integration", "erp-enterprise-solutions"] },
    { title: "Equipment Rental", icon: "forklift", text: "Track availability, bookings, contracts, deposits, inspections and utilization across the complete rental lifecycle.", solutions: ["equipment-asset-rental-management", "erp-enterprise-solutions", "crm-customer-solutions"] },
    { title: "Trading & Distribution", icon: "shopping-cart", text: "Connect sales, inventory, procurement and accounting so stock, orders and payments stay in step.", solutions: ["erp-enterprise-solutions", "crm-customer-solutions", "web-ecommerce-solutions"] },
    { title: "Manufacturing", icon: "factory", text: "Bring procurement, inventory, jobs and reporting together, with automated approvals and operational flows.", solutions: ["erp-enterprise-solutions", "business-automation-integration", "custom-software-applications"] },
    { title: "Retail", icon: "shopping-bag", text: "Unify online sales, inventory and customer engagement — with WhatsApp and email communication connected.", solutions: ["web-ecommerce-solutions", "crm-customer-solutions", "digital-growth-optimization"] },
    { title: "Hospitality", icon: "concierge", text: "Connect customer communication, operations and reporting so service stays consistent across every touchpoint.", solutions: ["crm-customer-solutions", "custom-software-applications", "digital-growth-optimization"] },
    { title: "Professional Services", icon: "briefcase", text: "Manage clients, projects and billing with role-based portals and automated workflows.", solutions: ["crm-customer-solutions", "erp-enterprise-solutions", "business-automation-integration"] },
    { title: "Real Estate & Facilities", icon: "building-2", text: "Track properties, assets, maintenance and contracts with centralized visibility and control.", solutions: ["erp-enterprise-solutions", "equipment-asset-rental-management", "custom-software-applications"] },
    { title: "Other Specialized Businesses", icon: "shapes", text: "Where off-the-shelf software does not fit, we start with the business process and build around the real requirement.", solutions: ["custom-software-applications", "business-automation-integration", "erp-enterprise-solutions"] },
  ] satisfies { title: string; icon: IconName; text: string; solutions: string[] }[],
};

// ---------------------------------------------------------------- Why HEVINKA (p.5)
export const why = {
  title: ["Why", "HEVINKA"],
  intro: "The differentiators that drive real business impact.",
  items: [
    { title: "Business-Centric Technology", text: "Solutions designed around real operational requirements.", icon: "target" },
    { title: "Scalable Architecture", text: "Solutions that can evolve as organizations grow.", icon: "bar-chart" },
    { title: "Integrated Systems", text: "Connect ERP, CRM, websites, communications, logistics and other business systems.", icon: "network" },
    { title: "Process Automation", text: "Reduce repetitive manual work and improve workflow efficiency.", icon: "settings" },
    { title: "Centralized Information", text: "Bring critical business information into connected systems and dashboards.", icon: "layout-dashboard" },
    { title: "Flexible Solutions", text: "Adapt workflows, modules and functionality to individual business needs.", icon: "sliders" },
    { title: "Long-Term Technology Partnership", text: "Continuous improvement, not just a one-time software vendor.", icon: "handshake" },
  ] satisfies Feature[],
};

// ---------------------------------------------------------------- Approach (p.6)
export const approach = {
  title: ["Our", "Approach"],
  intro: "A structured and collaborative methodology that ensures clarity, agility and measurable outcomes at every stage.",
  steps: [
    { title: "Discover", text: "Understand the requirement", icon: "search" },
    { title: "Analyze", text: "Map the process", icon: "pie-chart" },
    { title: "Design", text: "Define the solution", icon: "lightbulb" },
    { title: "Develop", text: "Build the system", icon: "code" },
    { title: "Integrate", text: "Connect the workflows", icon: "network" },
    { title: "Deploy", text: "Put it into operation", icon: "rocket" },
    { title: "Train", text: "Enable the users", icon: "user" },
    { title: "Support", text: "Maintain and improve", icon: "headset" },
    { title: "Optimize", text: "Refine for the next stage of growth", icon: "bar-chart" },
  ] satisfies Feature[],
  closing:
    "We follow a proven, scalable approach that ensures every solution we deliver is purpose-built, future-ready and aligned to your business goals.",
};

// ---------------------------------------------------------------- Platform (p.8)
export const platform = {
  title: ["A Unified Platform", "for Greater Possibilities"],
  intro:
    "Everything your business needs, connected in one powerful ecosystem. Streamline operations, enhance productivity and drive growth with integrated technology solutions.",
  modules: [
    { title: "Team Collaboration", icon: "users" },
    { title: "User Management", icon: "user-plus" },
    { title: "Data Management", icon: "database" },
    { title: "Support & Helpdesk", icon: "help-circle" },
    { title: "Analytics & Reporting", icon: "bar-chart" },
    { title: "Workflow Automation", icon: "settings" },
    { title: "Security & Compliance", icon: "shield-check" },
    { title: "Cloud Infrastructure", icon: "cloud-cog" },
    { title: "Marketing Automation", icon: "megaphone" },
    { title: "Customer Engagement", icon: "messages" },
    { title: "Business Intelligence", icon: "line-chart" },
    { title: "WhatsApp Integration", icon: "message-circle" },
    { title: "Email Communication", icon: "mail" },
  ] satisfies { title: string; icon: IconName }[],
  banner: ["Technology that connects people,", "processes and possibilities."],
};

// ---------------------------------------------------------------- Ecosystem (p.9)
export const ecosystem = {
  title: ["Connected", "Business Ecosystem"],
  intro: "Integration brings business information and workflows into a clearer operating picture.",
  nodes: [
    { title: "ERP", icon: "monitor-cog" },
    { title: "CRM", icon: "users" },
    { title: "Website / E-Commerce", icon: "globe" },
    { title: "WhatsApp / Communication", icon: "message-circle" },
    { title: "Logistics / Fleet", icon: "truck" },
    { title: "Rental / Asset Management", icon: "key" },
    { title: "Accounting / Payments", icon: "receipt" },
    { title: "External APIs & Business Systems", icon: "plug" },
  ] satisfies { title: string; icon: IconName }[],
};

// ---------------------------------------------------------------- Solutions (p.7, p.10–15)
export type SolutionDetail = {
  microLabel?: string;
  heading: [string, string];
  intro: string[];
  qualities?: Feature[];
  principles?: Feature[];
  modulesTitle?: string;
  modules: Feature[];
  extra?: { title: [string, string]; intro: string; items: Feature[]; closing?: [string, string] };
  benefits?: string[];
  outcomes?: string[];
  covers?: string[];
  banner?: [string, string];
  cycle?: Feature[];
  footerRow?: string[];
  visual: "dashboard" | "rental-ring" | "route-map" | "api-hub" | "growth-engine" | "crm" | "automation" | "web";
  needsReview?: boolean; // TODO(content): page written from one-liners — needs client review
};

export type Solution = {
  slug: string;
  number: string;
  title: string;
  /** Two-tone split for headings: [plain, accent] */
  titleParts: [string, string];
  short: string;
  icon: IconName;
  detail: SolutionDetail;
};

export const solutionsIntro = {
  title: ["Our", "Solutions"],
  intro: "Connected solutions for clearer operations, stronger workflows and scalable growth.",
};

export const solutions: Solution[] = [
  {
    slug: "erp-enterprise-solutions",
    number: "01",
    title: "ERP & Enterprise Solutions",
    titleParts: ["ERP &", "Enterprise Solutions"],
    short: "Streamline operations with integrated systems.",
    icon: "monitor-cog",
    detail: {
      microLabel: "Technology for a brighter tomorrow",
      heading: ["Full-Module", "ERP"],
      intro: [
        "HEVINKA designs, develops, customizes and implements business management solutions around the way your organization works.",
        "Our ERP solutions unify people, processes and data — helping you run smarter, faster and more efficiently.",
      ],
      qualities: [
        { title: "Scalable", text: "Grow without limits", icon: "building" },
        { title: "Secure", text: "Your data, our priority", icon: "shield-check" },
        { title: "People-Centric", text: "Built for real business", icon: "users" },
      ],
      principles: [
        { title: "Modular by Design", text: "Configure only what you need and scale as you grow.", icon: "box" },
        { title: "Unified Data Platform", text: "One source of truth across departments and locations.", icon: "database" },
        { title: "Intelligent Workflows", text: "Automate approvals, alerts and operational flows.", icon: "settings" },
      ],
      modulesTitle: "Complete business management, all in one platform",
      modules: [
        { title: "Financial Management", text: "Accounting, budgeting and financial control", icon: "bar-chart" },
        { title: "Sales & CRM Management", text: "Manage leads, sales and customer relationships", icon: "shopping-cart" },
        { title: "Procurement & Supply Chain", text: "Streamline purchasing and supplier management", icon: "truck" },
        { title: "Inventory & Warehouse", text: "Real-time inventory tracking and control", icon: "warehouse" },
        { title: "Project & Job Management", text: "Plan, track and deliver projects efficiently", icon: "line-chart" },
        { title: "HR & Payroll Management", text: "Manage employees, payroll and attendance", icon: "user" },
        { title: "Asset & Fleet Management", text: "Track and maintain your assets and fleet", icon: "users" },
        { title: "Reporting & Analytics", text: "Data-driven insights for better decisions", icon: "file-text" },
        { title: "Mobile Access & Automation", text: "Access anytime, anywhere", icon: "smartphone" },
        { title: "Administration & Security", text: "Role-based access and complete data security", icon: "shield-check" },
      ],
      extra: {
        title: ["Enterprise Visibility,", "Built to Scale"],
        intro: "Bring operational information into connected systems, structured workflows and usable reporting.",
        items: [
          { title: "Expense Management", text: "Track, control and optimize expenses across business units in real time.", icon: "database" },
          { title: "Multi-company Operations", text: "Consolidate and manage multiple companies seamlessly in one system.", icon: "building-2" },
          { title: "Business Reporting", text: "Generate accurate, timely reports for smarter business decisions.", icon: "file-text" },
          { title: "Workflow Management", text: "Automate approvals and processes to improve productivity and compliance.", icon: "settings" },
          { title: "Dashboards & Analytics", text: "Visualize KPIs and trends with interactive dashboards and drill-down insights.", icon: "bar-chart" },
          { title: "System Integration", text: "Integrate with third-party systems and extend capabilities effortlessly.", icon: "network" },
          { title: "Multi-branch Operations", text: "Manage distributed operations with centralized visibility and control.", icon: "map-pin" },
        ],
        closing: ["Scalable. Controlled.", "Built for business efficiency."],
      },
      visual: "dashboard",
    },
  },
  {
    slug: "crm-customer-solutions",
    number: "02",
    title: "CRM & Customer Solutions",
    titleParts: ["CRM &", "Customer Solutions"],
    short: "Build stronger customer relationships.",
    icon: "contact",
    detail: {
      heading: ["CRM &", "Customer Solutions"],
      // TODO(content): intro composed from the brochure one-liner + platform modules; needs client review.
      intro: [
        "Build stronger customer relationships.",
        "Bring leads, sales, customer engagement and communication into one connected view — integrated with your ERP, website, WhatsApp and email.",
      ],
      modules: [
        { title: "Sales & CRM Management", text: "Manage leads, sales and customer relationships", icon: "shopping-cart" },
        { title: "Customer Engagement", text: "TODO(content)", icon: "messages" },
        { title: "WhatsApp Integration", text: "TODO(content)", icon: "message-circle" },
        { title: "Email Communication", text: "TODO(content)", icon: "mail" },
        { title: "Marketing Automation", text: "TODO(content)", icon: "megaphone" },
        { title: "Customer Portals", text: "Self-service portals that simplify user interactions and drive satisfaction.", icon: "user" },
      ],
      visual: "crm",
      needsReview: true,
    },
  },
  {
    slug: "equipment-asset-rental-management",
    number: "03",
    title: "Equipment & Asset Rental Management",
    titleParts: ["Equipment & Asset", "Rental Management"],
    short: "Manage and track equipment and assets efficiently.",
    icon: "excavator",
    detail: {
      heading: ["Equipment & Asset Rental", "Management"],
      intro: ["Streamline your rental operations. Maximize asset utilization. Improve profitability with intelligent rental management."],
      covers: ["Tools", "Tackles", "Cranes", "Machinery", "Equipment"],
      modulesTitle: "Complete rental lifecycle management",
      modules: [
        { title: "Asset Availability", text: "Real-time visibility of available assets across locations.", icon: "calendar" },
        { title: "Booking & Reservation", text: "Manage bookings, notifications and reservation tracking.", icon: "calendar" },
        { title: "Rental Contracts", text: "Create, manage and track rental agreements.", icon: "file-text" },
        { title: "Rental Pricing", text: "Flexible pricing models and rate management.", icon: "wallet" },
        { title: "Rental Scheduling", text: "Plan and schedule rentals efficiently.", icon: "calendar" },
        { title: "Deposit Management", text: "Manage security deposits and refund tracking.", icon: "database" },
        { title: "Rental Invoicing", text: "Automated invoicing and payment tracking.", icon: "receipt" },
        { title: "Asset Tracking", text: "GPS-enabled tracking and real-time location.", icon: "map-pin" },
        { title: "Equipment Maintenance", text: "Schedule maintenance and manage service history.", icon: "wrench" },
        { title: "Inspection Records", text: "Record inspections and ensure compliance.", icon: "clipboard-check" },
        { title: "Damage & Condition Tracking", text: "Track damages and asset condition.", icon: "shield-check" },
        { title: "Utilization Tracking & Rental Revenue Reporting", text: "Monitor utilization and generate revenue insights.", icon: "bar-chart" },
      ],
      benefits: [
        "Higher asset utilization",
        "Reduced downtime",
        "Accurate billing",
        "Better visibility",
        "Improved customer satisfaction",
        "Increased profitability",
      ],
      visual: "rental-ring",
    },
  },
  {
    slug: "logistics-fleet-transport-solutions",
    number: "04",
    title: "Logistics, Fleet & Transport Solutions",
    titleParts: ["Logistics, Fleet &", "Transport Solutions"],
    short: "Optimize fleet operations and transport management.",
    icon: "truck",
    detail: {
      microLabel: "Connected fleets. Smarter business.",
      heading: ["Logistics, Fleet &", "Transport Solutions"],
      intro: [
        "End-to-end logistics and fleet management solutions to streamline operations, reduce costs, and deliver exceptional service across your supply chain.",
      ],
      outcomes: ["Efficient Operations", "Lower Costs", "Greater Visibility", "Reliable Performance"],
      modulesTitle: "Our solutions",
      modules: [
        { title: "Logistics Management", text: "", icon: "clipboard-check" },
        { title: "Transport Management System", text: "", icon: "truck" },
        { title: "Fleet Management", text: "", icon: "truck" },
        { title: "Vehicle Management", text: "", icon: "truck" },
        { title: "Driver Management", text: "", icon: "user" },
        { title: "Trip Management", text: "", icon: "route" },
        { title: "Dispatch Management", text: "", icon: "headset" },
        { title: "Delivery Management", text: "", icon: "package-check" },
        { title: "Route Management", text: "", icon: "map-pin" },
        { title: "Freight Management", text: "", icon: "ship" },
        { title: "Warehouse Management", text: "", icon: "warehouse" },
        { title: "Proof of Delivery", text: "", icon: "file-text" },
        { title: "Fuel Management", text: "", icon: "fuel" },
        { title: "Vehicle & Fleet Maintenance", text: "", icon: "wrench" },
        { title: "Logistics Billing", text: "", icon: "receipt" },
        { title: "Operational Reporting", text: "", icon: "bar-chart" },
      ],
      visual: "route-map",
    },
  },
  {
    slug: "business-automation-integration",
    number: "05",
    title: "Business Automation & Integration",
    titleParts: ["Business Automation", "& Integration"],
    short: "Automate processes and connect your business systems.",
    icon: "workflow",
    detail: {
      heading: ["Business Automation", "& Integration"],
      // TODO(content): composed from brochure differentiators/platform modules; needs client review.
      intro: [
        "Automate processes and connect your business systems.",
        "Reduce repetitive manual work and connect ERP, CRM, websites, communications, logistics and other business systems.",
      ],
      modules: [
        { title: "Process Automation", text: "Reduce repetitive manual work and improve workflow efficiency.", icon: "settings" },
        { title: "Integrated Systems", text: "Connect ERP, CRM, websites, communications, logistics and other business systems.", icon: "network" },
        { title: "Workflow Automation", text: "Automate approvals, alerts and operational flows.", icon: "workflow" },
        { title: "System Integration", text: "Integrate with third-party systems and extend capabilities effortlessly.", icon: "plug" },
        { title: "API Development", text: "Secure and well-documented APIs for seamless integration and extensibility.", icon: "code" },
        { title: "Centralized Information", text: "Bring critical business information into connected systems and dashboards.", icon: "layout-dashboard" },
      ],
      visual: "automation",
      needsReview: true,
    },
  },
  {
    slug: "custom-software-applications",
    number: "06",
    title: "Custom Software & Applications",
    titleParts: ["Custom Software", "& Applications"],
    short: "Tailored software solutions for unique business needs.",
    icon: "code",
    detail: {
      microLabel: "Technology for a brighter tomorrow",
      heading: ["Custom Software", "& Applications"],
      intro: [
        "We craft bespoke software solutions that simplify operations, automate processes, and drive measurable impact across industries. Built for fit, scalable to grow. Secure by design.",
      ],
      modules: [
        { title: "Custom Software Solutions", text: "Tailored platforms built around unique business requirements.", icon: "code" },
        { title: "Enterprise Applications", text: "Robust systems to manage complex operations at scale.", icon: "building-2" },
        { title: "Web Applications", text: "Secure, responsive and high-performance web platforms.", icon: "globe" },
        { title: "Mobile Applications", text: "Native and cross-platform apps for better user engagement and reach.", icon: "smartphone" },
        { title: "SaaS Platforms", text: "Cloud-based solutions with scalable infrastructure and subscription models.", icon: "cloud-cog" },
        { title: "Business Portals", text: "Role-based portals for partners, customers and internal teams.", icon: "users" },
        { title: "Customer Portals", text: "Self-service portals that simplify user interactions and drive satisfaction.", icon: "user" },
        { title: "API Development", text: "Secure and well-documented APIs for seamless integration and extensibility.", icon: "plug" },
        { title: "Database Solutions", text: "Optimized database design, migration and management for peak performance.", icon: "database" },
        { title: "Cloud Applications", text: "Cloud-native applications for agility, reliability and global accessibility.", icon: "cloud-cog" },
        { title: "Bespoke Management Systems", text: "End-to-end business systems for streamlined control and visibility. System modernization.", icon: "sliders" },
      ],
      banner: ["Modular. Scalable.", "Maintainable."],
      qualities: [
        { title: "Modern Architecture", text: "", icon: "box" },
        { title: "Scalable Solutions", text: "", icon: "bar-chart" },
        { title: "Enterprise Security", text: "", icon: "shield-check" },
      ],
      visual: "api-hub",
    },
  },
  {
    slug: "web-ecommerce-solutions",
    number: "07",
    title: "Web & E-Commerce Solutions",
    titleParts: ["Web & E-Commerce", "Solutions"],
    short: "Create powerful digital experiences.",
    icon: "app-window",
    detail: {
      heading: ["Web & E-Commerce", "Solutions"],
      // TODO(content): composed from brochure one-liner + related modules; needs client review.
      intro: [
        "Create powerful digital experiences.",
        "Secure, responsive and high-performance web platforms — connected to your ERP, CRM and communication channels.",
      ],
      modules: [
        { title: "Web Applications", text: "Secure, responsive and high-performance web platforms.", icon: "globe" },
        { title: "Website / E-Commerce", text: "TODO(content)", icon: "shopping-cart" },
        { title: "Website Optimization", text: "Enhance site speed, infrastructure and user experience for better performance.", icon: "gauge" },
        { title: "Customer Portals", text: "Self-service portals that simplify user interactions and drive satisfaction.", icon: "user" },
        { title: "Conversion Optimization", text: "Turn visitors into customers with optimized journeys and effective CRM.", icon: "funnel" },
        { title: "Digital Presence Management", text: "Maintain a consistent, professional and impactful online presence.", icon: "badge-check" },
      ],
      visual: "web",
      needsReview: true,
    },
  },
  {
    slug: "digital-growth-optimization",
    number: "08",
    title: "Digital Growth & Optimization",
    titleParts: ["Digital Growth", "& Optimization"],
    short: "Enhance performance with data-driven strategies.",
    icon: "trending-up",
    detail: {
      microLabel: "Ideas | Systems | Better tomorrow",
      heading: ["Digital Growth", "& Optimization"],
      intro: [
        "We help businesses build a strong digital foundation and optimize every touchpoint for measurable growth. Our integrated approach connects strategy, content, experience, and analytics to deliver sustainable results across the digital ecosystem.",
      ],
      cycle: [
        { title: "Discover", text: "Attract the right audience", icon: "search" },
        { title: "Engage", text: "Build meaningful connections", icon: "users" },
        { title: "Convert", text: "Turn interest into customers", icon: "monitor-cog" },
        { title: "Grow", text: "Sustain engagement & scale success", icon: "user" },
        { title: "Optimize", text: "Improve continuously for greater impact", icon: "bar-chart" },
        { title: "Analyze", text: "Track performance & find opportunities", icon: "line-chart" },
      ],
      modules: [
        { title: "Search Engine Optimization", text: "Improve visibility in search engines and drive high-intent organic traffic.", icon: "search" },
        { title: "Social Media Optimization", text: "Strengthen your brand and engage the right audience across platforms.", icon: "users" },
        { title: "Digital Marketing", text: "Data-driven campaigns that engage your ideal audience and accelerate growth.", icon: "megaphone" },
        { title: "Content Strategy", text: "Create valuable, relevant content that builds trust, authority and long-term engagement.", icon: "file-text" },
        { title: "Website Optimization", text: "Enhance site speed, infrastructure and user experience for better performance.", icon: "gauge" },
        { title: "Conversion Optimization", text: "Turn visitors into customers with optimized journeys and effective CRM.", icon: "funnel" },
        { title: "Digital Presence Management", text: "Maintain a consistent, professional and impactful online presence.", icon: "user" },
        { title: "Analytics & Performance Tracking", text: "Track what matters, uncover insights and make smarter data-backed decisions.", icon: "pie-chart" },
      ],
      footerRow: ["Strategy", "Execution", "Growth", "Long-term value"],
      visual: "growth-engine",
    },
  },
];

export const getSolution = (slug: string) => solutions.find((s) => s.slug === slug);

// ---------------------------------------------------------------- CTA (p.16)
export const cta = {
  title: ["Let's", "Build", "What's", "Next"],
  accent: [1, 3], // indices of electric words
  body: "Bring clarity to your processes. Connect your systems. Build the next stage of your business with technology designed around the way you work.",
  values: [
    { title: "Innovate", icon: "lightbulb" },
    { title: "Integrate", icon: "settings" },
    { title: "Elevate", icon: "bar-chart" },
    { title: "Grow Together", icon: "users" },
  ] satisfies { title: string; icon: IconName }[],
  labels: ["Smarter systems", "Stronger businesses", "A connected tomorrow"],
};

// ---------------------------------------------------------------- Navigation
export const nav = {
  primary: [
    { label: "Solutions", href: "/#solutions" },
    { label: "Industries", href: "/industries" },
    { label: "Approach", href: "/approach" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Our Approach", href: "/approach" },
    { label: "Industries", href: "/industries" },
    { label: "Contact", href: "/contact" },
  ],
} as const;
