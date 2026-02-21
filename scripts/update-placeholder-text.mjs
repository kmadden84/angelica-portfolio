/**
 * Update all Contentful entries with lorem ipsum placeholder text.
 * Run: node scripts/update-placeholder-text.mjs
 */

import contentfulManagement from "contentful-management";
import { config } from "dotenv";

config({ path: ".env.local" });

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const ENVIRONMENT_ID = process.env.CONTENTFUL_ENVIRONMENT || "master";

const client = contentfulManagement.createClient({
  accessToken: MANAGEMENT_TOKEN,
});

async function getEnvironment() {
  const space = await client.getSpace(SPACE_ID);
  return space.getEnvironment(ENVIRONMENT_ID);
}

function richText(...paragraphs) {
  return {
    nodeType: "document",
    data: {},
    content: paragraphs.map((text) => ({
      nodeType: "paragraph",
      data: {},
      content: [{ nodeType: "text", value: text, marks: [], data: {} }],
    })),
  };
}

function richTextWithBullets(intro, bullets, outro) {
  const content = [];
  if (intro) {
    content.push({
      nodeType: "paragraph",
      data: {},
      content: [{ nodeType: "text", value: intro, marks: [], data: {} }],
    });
  }
  content.push({
    nodeType: "unordered-list",
    data: {},
    content: bullets.map((b) => ({
      nodeType: "list-item",
      data: {},
      content: [
        {
          nodeType: "paragraph",
          data: {},
          content: [{ nodeType: "text", value: b, marks: [], data: {} }],
        },
      ],
    })),
  });
  if (outro) {
    content.push({
      nodeType: "paragraph",
      data: {},
      content: [{ nodeType: "text", value: outro, marks: [], data: {} }],
    });
  }
  return { nodeType: "document", data: {}, content };
}

async function updateEntry(env, contentType, fieldUpdates) {
  const entries = await env.getEntries({ content_type: contentType });
  if (entries.items.length === 0) {
    console.log(`  ⚠ No ${contentType} entries found`);
    return;
  }
  for (const entry of entries.items) {
    for (const [key, value] of Object.entries(fieldUpdates)) {
      entry.fields[key] = { "en-US": value };
    }
    const updated = await entry.update();
    await updated.publish();
    const title =
      entry.fields.siteTitle?.["en-US"] ||
      entry.fields.name?.["en-US"] ||
      entry.fields.heading?.["en-US"] ||
      entry.fields.title?.["en-US"] ||
      entry.fields.categoryName?.["en-US"] ||
      entry.fields.program?.["en-US"] ||
      entry.fields.label?.["en-US"] ||
      contentType;
    console.log(`  ✓ ${contentType}: "${title}"`);
  }
}

async function main() {
  console.log("📝 Updating entries with lorem ipsum text...\n");
  const env = await getEnvironment();

  // --- siteSettings ---
  await updateEntry(env, "siteSettings", {
    siteTitle: "Angelica Guze | Marketing Strategist",
    siteDescription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Portfolio showcasing marketing strategy, brand development, and data-driven campaign management. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  });

  // --- heroSection ---
  await updateEntry(env, "heroSection", {
    greeting: "Hi, I'm",
    name: "Angelica Guze",
    title: "Marketing & Business Strategist",
    subtitle:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Passionate about transforming data into compelling brand narratives.",
    ctaLabel: "View My Work",
    ctaLink: "#projects",
    secondaryCtaLabel: "Download Resume",
  });

  // --- aboutSection ---
  await updateEntry(env, "aboutSection", {
    heading: "About Me",
    bio: richText(
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus, nulla facilisi.",
      "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est."
    ),
    highlights: [
      { label: "Projects", value: "12+" },
      { label: "GPA", value: "3.9" },
      { label: "Certifications", value: "5" },
    ],
  });

  // --- project: delete all, then recreate ---
  const projectEntries = await env.getEntries({ content_type: "project", limit: 100 });
  // Save thumbnail from first existing entry to reuse
  const savedThumbnail = projectEntries.items[0]?.fields.thumbnail;
  for (const entry of projectEntries.items) {
    try {
      if (entry.sys.publishedVersion) await entry.unpublish();
      await entry.delete();
    } catch (err) {
      console.log(`  ⚠ Could not delete project: ${err.message}`);
    }
  }
  console.log(`  ✓ Deleted ${projectEntries.items.length} old project entries`);

  try {
    const proj1 = await env.createEntry("project", {
      fields: {
        title: { "en-US": "Indie Author – Amazon: Books Published" },
        slug: { "en-US": "amazon-books-published" },
        context: {
          "en-US":
            "As an indie author on Amazon, Angelica Rockford writes children's books focused on mental health, emotional intelligence, and family healing. Her work draws on influences from Louise Hay, Eckhart Tolle, and Lao Tzu, blending mindfulness philosophy with approachable storytelling for young readers and their parents.",
        },
        objective: {
          "en-US":
            "Create accessible, bilingual children's literature that normalizes conversations around mental health, teaches emotional resilience, and helps families navigate difficult topics like forgiveness, self-worth, and breaking generational trauma.",
        },
        role: { "en-US": "Author, Content Creator & Self-Publisher" },
        actions: {
          "en-US": richTextWithBullets(
            "Published multiple titles on Amazon (Kindle & paperback) since June 2023:",
            [
              "\"The Sleepy Head & The Three Wishes\" – A whimsical bilingual (English/Spanish) story teaching diversity, inclusion, empathy, and friendship through myths and morals. Enhances emotional intelligence and strong values through spirituality and philosophy.",
              "\"Mistakes Are Not Scary\" (Series: Parts 1 & 2, plus 2-in-1 edition) – An interactive father-and-son story about compassion, forgiveness, and overcoming the fear of mistakes. Helps kids and parents break generational trauma and create a safe space for growth.",
              "\"Yes! I Own My Mistakes, and I Say Sorry\" – A kids' book about taking responsibility and learning from mistakes, with interactive questions to build accountability.",
              "\"Our First Valentine's, My Son\" – A sentimental rhyming book for first-time moms, celebrating the journey from pregnancy to birth with courage and hope.",
              "\"Letters to the Women Who Never Loved Me, My Mom\" – A deeply personal debut exploring healing, self-discovery, and moving forward from painful pasts.",
              "Managed the entire self-publishing pipeline: writing, editing, cover design (Canva), formatting, Amazon KDP publishing, and ongoing marketing.",
              "Built author brand across Amazon with consistent visual identity and SEO-optimized book descriptions.",
            ],
            null
          ),
        },
        results: {
          "en-US": richTextWithBullets(
            "Impact and reach:",
            [
              "Multiple titles published and available on Amazon Kindle and paperback across Amazon.com, Amazon.ca, and international markets.",
              "Bilingual editions (English/Spanish) expanding reach to diverse audiences.",
              "Books address underserved niche: children's mental health, emotional intelligence, and breaking generational trauma.",
              "Established author brand \"Angelica Rockford Books\" with a growing catalog and reader following.",
            ],
            null
          ),
        },
        tags: {
          "en-US": [
            "Self-Publishing",
            "Children's Books",
            "Mental Health",
            "Content Creation",
            "Amazon KDP",
          ],
        },
        externalLink: { "en-US": "https://www.amazon.ca/stores/Angelica-Rockford/author/B0B2R66KKL" },
        featured: { "en-US": true },
        sortOrder: { "en-US": 1 },
        ...(savedThumbnail ? { thumbnail: savedThumbnail } : {}),
      },
    });
    await proj1.publish();
    console.log('  ✓ project: "Indie Author – Amazon: Books Published"');
  } catch (err) {
    console.log(`  ⚠ Project (Amazon Books): ${err.message}`);
  }

  // --- skillCategory: delete all, then recreate exactly 5 ---
  const skillEntries = await env.getEntries({ content_type: "skillCategory", limit: 100 });
  for (const entry of skillEntries.items) {
    try {
      if (entry.sys.publishedVersion) await entry.unpublish();
      await entry.delete();
    } catch (err) {
      console.log(`  ⚠ Could not delete skillCategory: ${err.message}`);
    }
  }
  console.log(`  ✓ Deleted ${skillEntries.items.length} old skillCategory entries`);

  const skillCategories = [
    // --- Strengths section: Professional Strengths ---
    {
      categoryName: "Sales & Leadership",
      section: "strengths",
      skills: [
        { name: "7 Years in Sales, Service & Leadership", icon: "Briefcase" },
        { name: "1 Year Account Management at X (Twitter)", icon: "TrendingUp" },
        { name: "Top Performer, 1-in-4 Conversion Rate", icon: "Award" },
        { name: "Awarded for Creativity & Salesmanship", icon: "Star" },
        { name: "Promoted to Leadership in 2 Years", icon: "Shield" },
        { name: "B2B & B2C Relationship Management", icon: "Users" },
      ],
      sortOrder: 1,
      displayStyle: "bento-large",
    },
    {
      categoryName: "Marketing & Creative",
      section: "strengths",
      skills: [
        { name: "Product Demonstration & Presentations", icon: "Layout" },
        { name: "Social Media Marketing", icon: "Share2" },
        { name: "Content Writing & Storytelling", icon: "PenTool" },
        { name: "Visual Merchandising & Luxury Retail", icon: "Eye" },
        { name: "Negotiation Skills", icon: "MessageSquare" },
      ],
      sortOrder: 2,
      displayStyle: "bento-large",
    },
    {
      categoryName: "Communication & Interpersonal",
      section: "strengths",
      skills: [
        { name: "Strong Communication & Client Interaction", icon: "MessageSquare" },
        { name: "Empathy & Emotional Intelligence", icon: "Heart" },
        { name: "Public Speaking (Toastmasters)", icon: "Mic" },
        { name: "Active Listening & Mentoring", icon: "Users" },
        { name: "Problem-Solving Under Pressure", icon: "Zap" },
        { name: "Team Collaboration & Coordination", icon: "Layout" },
      ],
      sortOrder: 3,
      displayStyle: "bento-large",
    },
    {
      categoryName: "Leadership & Growth Mindset",
      section: "strengths",
      skills: [
        { name: "Decision-Making in Fast-Paced Environments", icon: "Target" },
        { name: "Adaptability & Fast Learning", icon: "Compass" },
        { name: "Creative Thinking & Solution Generation", icon: "Lightbulb" },
        { name: "Leadership Presence & Team Motivation", icon: "Star" },
        { name: "Self-Motivated & Growth-Oriented", icon: "Rocket" },
        { name: "Team Player", icon: "Users" },
      ],
      sortOrder: 4,
      displayStyle: "bento-large",
    },
    // --- Tools section: actual tools & technologies ---
    {
      categoryName: "CRM & Analytics",
      section: "tools",
      skills: [
        { name: "Salesforce CRM", icon: "Database" },
        { name: "Google Analytics", icon: "BarChart3" },
        { name: "Meta Ads Manager", icon: "Megaphone" },
        { name: "LinkedIn Analytics", icon: "TrendingUp" },
        { name: "Marketing Strategy", icon: "Target" },
        { name: "Business & Consumer Psychology", icon: "Lightbulb" },
      ],
      sortOrder: 1,
      displayStyle: "bento-large",
    },
    {
      categoryName: "Design & Content",
      section: "tools",
      skills: [
        { name: "Canva", icon: "Palette" },
        { name: "WordPress / CMS", icon: "Globe" },
        { name: "Graphic Design", icon: "PenTool" },
      ],
      sortOrder: 2,
      displayStyle: "bento-medium",
    },
    {
      categoryName: "Productivity & Office",
      section: "tools",
      skills: [
        { name: "Microsoft Excel", icon: "Table" },
        { name: "Microsoft Word", icon: "PenTool" },
        { name: "Microsoft PowerPoint", icon: "Layout" },
      ],
      sortOrder: 3,
      displayStyle: "bento-medium",
    },
  ];

  for (const cat of skillCategories) {
    try {
      const entry = await env.createEntry("skillCategory", {
        fields: {
          categoryName: { "en-US": cat.categoryName },
          section: { "en-US": cat.section },
          skills: { "en-US": cat.skills },
          sortOrder: { "en-US": cat.sortOrder },
          displayStyle: { "en-US": cat.displayStyle },
        },
      });
      await entry.publish();
      console.log(`  ✓ skillCategory: "${cat.categoryName}"`);
    } catch (err) {
      console.log(`  ⚠ skillCategory "${cat.categoryName}": ${err.message}`);
    }
  }

  // --- experience ---
  // First, delete all existing experience entries so we start fresh
  const expEntries = await env.getEntries({ content_type: "experience" });
  for (const entry of expEntries.items) {
    try {
      if (entry.sys.publishedVersion) {
        await entry.unpublish();
      }
      await entry.delete();
    } catch (err) {
      console.log(`  ⚠ Could not delete experience entry: ${err.message}`);
    }
  }

  // Experience 1: X Ads / Teleperformance
  try {
    const exp1 = await env.createEntry("experience", {
      fields: {
        jobTitle: { "en-US": "B2B Account Manager – X Ads Sales & Marketing (Team Lead)" },
        company: { "en-US": "Teleperformance" },
        dateRange: { "en-US": "2024 – 2025" },
        description: {
          "en-US": richTextWithBullets(
            "Formerly known as Twitter / X Ads Platform.",
            [
              "Client Onboarding & Support: Provided personalized guidance to clients via phone and email, assisting with account creation, Shopify pixel installation, and documentation. Ensured adherence to platform guidelines and educated clients on X Ads features.",
              "Led a team of 8 sales professionals, conducting daily KPI check-ins, morning strategy meetings, and afternoon performance reviews. Team regularly exceeded sales goals and improved campaign quality.",
              "Drove 20%+ account growth through strategic upsell and cross-sell opportunities across X Ads' digital marketing suite.",
              "Optimized campaign performance by analyzing data trends, identifying key insights, and presenting actionable recommendations to improve ROI and reduce churn.",
              "Prospected and developed new business, identifying client pain points and offering tailored ad solutions that improved engagement and conversions.",
              "Delivered consultative sales presentations, overcoming objections and recommending high-performing placements to boost brand presence.",
              "Collaborated with Customer Success Managers to refine creative strategies and messaging based on data-driven insights, aligning campaigns with relevance, resonance, and recency best practices.",
              "Conducted live platform demos, highlighting X Ads' AI-powered campaign automation, audience targeting tools, and creative optimization features.",
              "Built trust-based client relationships through strategic insight, transparent communication, and personalized marketing consultation.",
              "Designed customized campaign structures aligned with each client's business objectives to drive measurable growth and audience engagement.",
              "Utilized CRM and analytics tools to monitor account activity, track KPIs, and refine strategy using X AI-driven insights for improved targeting, sustained partnerships, and ROI.",
            ],
            null
          ),
        },
        tags: {
          "en-US": [
            "B2B Sales",
            "Account Management",
            "Team Leadership",
            "X Ads",
            "CRM",
          ],
        },
        sortOrder: { "en-US": 1 },
      },
    });
    await exp1.publish();
    console.log('  ✓ experience: "B2B Account Manager – X Ads (Teleperformance)"');
  } catch (err) {
    console.log(`  ⚠ Experience (Teleperformance): ${err.message}`);
  }

  // Experience 2: Freelancer – Mental Health Blog & SEO
  try {
    const exp2 = await env.createEntry("experience", {
      fields: {
        jobTitle: { "en-US": "Sales & Marketing Specialist – Freelancer" },
        company: { "en-US": "Self-Employed (Fiverr / Upwork)" },
        dateRange: { "en-US": "2022 – 2023" },
        description: {
          "en-US": richTextWithBullets(
            "Product affiliation in Mental Health, Psychology, and Business Courses. Mental Health Blog Freelancer.",
            [
              "Conducted comprehensive SEO audits and developed actionable strategies, enhancing client websites' search engine performance through analysis of site structure, keyword optimization, and content improvements.",
              "Utilized Canva to design engaging graphics for social media posts, email marketing campaigns, and promotional materials, enhancing visual appeal and brand consistency.",
              "Monitored social media trends and competitor activity to maintain cutting-edge strategies, proactively adjusting approaches to ensure brand relevance.",
              "Collaborated with marketing teams to integrate social media efforts with broader marketing objectives, ensuring cohesive campaigns with consistent brand messaging.",
              "Crafted inspirational content using Canva to attract and engage audiences, fostering a positive brand image and inspiring trust and loyalty.",
              "Oversaw ongoing analysis of marketing campaigns and provided marketing research, data analysis, and trend research.",
              "Helped in creating and monitoring UA/GA4 plans and campaigns.",
            ],
            null
          ),
        },
        tags: {
          "en-US": [
            "SEO",
            "Content Writing",
            "Canva",
            "Social Media",
            "Freelance",
          ],
        },
        sortOrder: { "en-US": 2 },
      },
    });
    await exp2.publish();
    console.log('  ✓ experience: "Sales & Marketing Specialist – Freelancer"');
  } catch (err) {
    console.log(`  ⚠ Experience (Freelancer): ${err.message}`);
  }

  // Experience 3: Social Media Marketing Freelancer
  try {
    const exp3 = await env.createEntry("experience", {
      fields: {
        jobTitle: { "en-US": "Social Media Marketing Freelancer" },
        company: { "en-US": "Scope Media, Toronto / Health-Secret Fitness" },
        dateRange: { "en-US": "2022 – 2023" },
        description: {
          "en-US": richTextWithBullets(
            "Brand Management and content strategy for diverse clients.",
            [
              "Implementation and improvement of SEO strategies. Analyzed market data to determine key target audiences and segments.",
              "Created engaging visual content using Canva to enhance brand presence across platforms.",
              "Developed tailored content strategies for mental health professionals and budding entrepreneurs.",
              "Created compelling articles and blog posts on mental health topics, offering valuable insights and practical advice.",
              "Consulted with startups and small businesses to craft powerful brand narratives highlighting unique value propositions.",
              "Leveraged platforms like Fiverr to deliver high-quality professional content to a global clientele.",
              "Monitored industry trends and best practices to ensure content was current and forward-thinking.",
              "Wrote children's books on the Mental Health niche (Angelica Rockford Books – on Amazon).",
            ],
            null
          ),
        },
        tags: {
          "en-US": [
            "Social Media",
            "Brand Management",
            "SEO",
            "Content Strategy",
            "Canva",
          ],
        },
        sortOrder: { "en-US": 3 },
      },
    });
    await exp3.publish();
    console.log('  ✓ experience: "Social Media Marketing Freelancer"');
  } catch (err) {
    console.log(`  ⚠ Experience (Social Media Freelancer): ${err.message}`);
  }

  // Experience 4: Norwegian Cruise Line
  try {
    const exp4 = await env.createEntry("experience", {
      fields: {
        jobTitle: { "en-US": "Shore Excursion Sales Specialist / Manager Assistant" },
        company: { "en-US": "Norwegian Cruise Line" },
        dateRange: { "en-US": "2014 – 2020" },
        description: {
          "en-US": richTextWithBullets(
            null,
            [
              "Team Leadership & Development (2019–2020): Promoted to Shore Excursions Manager Assistant; guided a diverse team to exceed sales targets and uphold exceptional customer service. Awarded \"Team Lead Inspiration Award, 2020.\"",
              "Generated an average of 60–70 daily sales by approaching 200+ guests per day and delivering personalized excursion recommendations based on guest preferences and local knowledge.",
              "Increased onboard revenue through strategic upselling and cross-selling of excursions, add-ons, and VIP experiences, ensuring profitability and guest satisfaction.",
              "Delivered persuasive presentations and safety briefings to large audiences, clearly communicating features, value, and logistics of excursions – driving booking conversions.",
              "Managed end-to-end excursion logistics for large groups including booking, scheduling, and confirmation – ensuring a seamless guest experience.",
              "Collaborated with local vendors and tour operators to ensure high-quality service delivery and create exclusive guest experiences.",
              "Provided hands-on guest support, answering questions, offering tailored suggestions, and resolving concerns to maintain high satisfaction throughout the customer journey.",
              "Partnered with marketing and guest relations teams to promote last-minute offers and special packages, boosting sales and occupancy rates. Awarded for Outstanding Customer Service and Effective Problem Resolution (English & Spanish, 2019).",
              "Incorporated guest feedback into sales approach, continuously optimizing tactics to improve conversions and strengthen guest relationships.",
            ],
            null
          ),
        },
        tags: {
          "en-US": [
            "Sales",
            "Team Leadership",
            "Customer Service",
            "Upselling",
            "Presentations",
          ],
        },
        sortOrder: { "en-US": 4 },
      },
    });
    await exp4.publish();
    console.log('  ✓ experience: "Shore Excursion Sales – Norwegian Cruise Line"');
  } catch (err) {
    console.log(`  ⚠ Experience (NCL): ${err.message}`);
  }

  // Experience 5: Luxurious Clothing Store, Peru
  try {
    const exp5 = await env.createEntry("experience", {
      fields: {
        jobTitle: { "en-US": "Sales and Operations Manager" },
        company: { "en-US": "Luxurious Clothing Store & Travel, Peru" },
        dateRange: { "en-US": "2011 – 2014" },
        description: {
          "en-US": richText(
            "Managed sales operations and day-to-day business activities for a luxury retail and travel enterprise."
          ),
        },
        tags: {
          "en-US": [
            "Sales Management",
            "Luxury Retail",
            "Operations",
          ],
        },
        sortOrder: { "en-US": 5 },
      },
    });
    await exp5.publish();
    console.log('  ✓ experience: "Sales and Operations Manager – Peru"');
  } catch (err) {
    console.log(`  ⚠ Experience (Peru): ${err.message}`);
  }

  // --- education: delete all, then recreate ---
  const eduEntries = await env.getEntries({ content_type: "education", limit: 100 });
  for (const entry of eduEntries.items) {
    try {
      if (entry.sys.publishedVersion) await entry.unpublish();
      await entry.delete();
    } catch (err) {
      console.log(`  ⚠ Could not delete education: ${err.message}`);
    }
  }
  console.log(`  ✓ Deleted ${eduEntries.items.length} old education entries`);

  const educationEntries = [
    {
      program: "Business Administration – Marketing B158",
      institution: "George Brown College",
      dateRange: "2026 (Current)",
      sortOrder: 1,
    },
    {
      program: "Persuasive Negotiator",
      institution: "Yale University | Coursera",
      dateRange: "2025",
      sortOrder: 2,
    },
    {
      program: "Strategic Sales Management",
      institution: "Coursera",
      dateRange: "2025",
      sortOrder: 3,
    },
    {
      program: "Leadership and Management Training Programs",
      institution: "Dale Carnegie Leadership Training",
      dateRange: "2025",
      sortOrder: 4,
    },
    {
      program: "Heavy in Customer Service and Leadership Program",
      institution: "PCPI",
      dateRange: "2024",
      sortOrder: 5,
    },
    {
      program: "PMP Certification (Project Management Professional)",
      institution: "PMI.org",
      dateRange: "2024",
      sortOrder: 6,
    },
    {
      program: "Successful Negotiation Skills",
      institution: "University of Michigan | Coursera",
      dateRange: "2024",
      sortOrder: 7,
    },
    {
      program: "Canva Graphic Design for Entrepreneurs – Design 11 Projects",
      institution: "Udemy",
      dateRange: "2024",
      sortOrder: 8,
    },
    {
      program: "Attract and Engage Customers with Digital Marketing",
      institution: "Google",
      dateRange: "2023",
      sortOrder: 9,
    },
    {
      program: "Canva Masterclass for Social Media and Content Creation",
      institution: "Udemy",
      dateRange: "2022",
      sortOrder: 10,
    },
    {
      program: "Advanced Digital Marketing and Communication",
      institution: "BrainStation",
      dateRange: "",
      sortOrder: 11,
    },
  ];

  for (const edu of educationEntries) {
    try {
      const entry = await env.createEntry("education", {
        fields: {
          program: { "en-US": edu.program },
          institution: { "en-US": edu.institution },
          dateRange: { "en-US": edu.dateRange },
          sortOrder: { "en-US": edu.sortOrder },
        },
      });
      await entry.publish();
      console.log(`  ✓ education: "${edu.program}"`);
    } catch (err) {
      console.log(`  ⚠ education "${edu.program}": ${err.message}`);
    }
  }

  // --- leadershipActivity: delete all, then recreate ---
  const leaderEntries = await env.getEntries({
    content_type: "leadershipActivity",
    limit: 100,
  });
  for (const entry of leaderEntries.items) {
    try {
      if (entry.sys.publishedVersion) await entry.unpublish();
      await entry.delete();
    } catch (err) {
      console.log(`  ⚠ Could not delete leadershipActivity: ${err.message}`);
    }
  }
  console.log(`  ✓ Deleted ${leaderEntries.items.length} old leadershipActivity entries`);

  const leadershipActivities = [
    {
      title: "Speaker – Toastmasters Yonge and Eglinton",
      organization: "Toastmasters Yonge and Eglinton",
      dateRange: "June 2024 – Present",
      description: richTextWithBullets(
        null,
        [
          "Running as Club President, leading the executive team, and facilitating weekly meetings.",
          "Provide mentorship and feedback to members, fostering growth in public speaking and leadership.",
          "Host events and maintain high member engagement through communication and goal-setting.",
        ],
        null
      ),
      sortOrder: 1,
    },
    {
      title: "Recreational Volleyball & Tennis",
      organization: "Toronto",
      dateRange: "",
      description: richText(
        "Regular weekend participation in team and individual sports, strengthening collaboration, focus, and performance under pressure."
      ),
      sortOrder: 2,
    },
  ];

  for (const act of leadershipActivities) {
    try {
      const entry = await env.createEntry("leadershipActivity", {
        fields: {
          title: { "en-US": act.title },
          organization: { "en-US": act.organization },
          dateRange: { "en-US": act.dateRange },
          description: { "en-US": act.description },
          sortOrder: { "en-US": act.sortOrder },
        },
      });
      await entry.publish();
      console.log(`  ✓ leadershipActivity: "${act.title}"`);
    } catch (err) {
      console.log(`  ⚠ leadershipActivity "${act.title}": ${err.message}`);
    }
  }

  // --- contactSection ---
  await updateEntry(env, "contactSection", {
    heading: "Let's Connect",
    subheading:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. I'm actively seeking internship and junior marketing roles where I can contribute data-driven strategy and creative energy. Ut enim ad minim veniam, let's discuss how we can work together.",
    email: "angelica.guze@email.com",
    linkedinUrl: "https://linkedin.com/in/angelicaguze",
    location: "Mexico City, MX",
    additionalLinks: [
      {
        label: "LinkedIn",
        url: "https://linkedin.com/in/angelicaguze",
        icon: "Linkedin",
      },
    ],
  });

  console.log("\n🎉 All entries updated with placeholder text!");
}

main().catch((err) => {
  console.error("❌ Failed:", err.message || err);
  process.exit(1);
});
