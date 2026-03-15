/**
 * Add descriptions to all core competency skills.
 * Run: node scripts/add-skill-descriptions.mjs
 */
import contentfulManagement from "contentful-management";
import { config } from "dotenv";

config({ path: ".env.local" });

const client = contentfulManagement.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

async function main() {
  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
  const env = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT || "master");

  const descriptions = {
    "Sales & Leadership": {
      "7 Years in Sales, Service & Leadership": "Built strong client relationships while consistently exceeding sales targets across retail and service environments.",
      "1 Year Account Management at X (Twitter)": "Managed advertising accounts, onboarding clients and optimizing campaigns for business growth.",
      "Top Performer, 1-in-4 Conversion Rate": "Consistently converted one out of every four client interactions into sales.",
      "Awarded for Creativity & Salesmanship": "Recognized for innovative sales approaches and persuasive client engagement.",
      "Promoted to Leadership in 2 Years": "Advanced quickly to leadership by demonstrating strong results and team support.",
      "B2B & B2C Relationship Management": "Built long-term trust with both business clients and retail customers.",
      "Team Leadership": "Guided teams to meet sales goals through motivation, coaching, and collaboration.",
      "Adaptability and Growth": "Transitioned across industries while quickly mastering new tools and strategies.",
      "Product Demonstration & Presentations": "Delivered engaging product presentations that increased customer interest and conversions.",
      "Cold-Calls & Negotiation Skills": "Prospected new clients and negotiated solutions that secured business opportunities.",
      "KPI Management": "Monitored performance metrics to improve sales efficiency and campaign results.",
      "Performance Coaching": "Mentored team members to strengthen sales techniques and improve performance.",
    },
    "Brand & Retail Marketing": {
      "Visual Merchandising & Luxury Retail": "Designed product displays that elevated brand image and encouraged purchases.",
      "Brand Storytelling": "Communicated brand identity through compelling narratives that connected with customers.",
      "Customer Experience": "Delivered personalized service that strengthened loyalty and repeat purchases.",
      "Sales & Client Relationship": "Built trust with clients by understanding needs and offering tailored solutions.",
      "Product Presentation": "Highlighted product features and styling ideas to inspire customer interest.",
      "Team Collaboration & Coordination": "Worked closely with colleagues to execute store operations and marketing initiatives.",
      "Decision-Making in Fast-Paced Environments": "Made quick decisions during busy retail operations to maintain service quality.",
      "Adaptability & Fast Learning": "Quickly learned new tools, systems, and sales strategies across different roles.",
      "Strong Communication & Client Interaction": "Built rapport with customers through clear, confident communication.",
    },
    "Digital Marketing": {
      "Multi-Channel Campaigns": "Managed marketing initiatives across blogs, social media, referrals, and email.",
      "SEO": "Optimized content to improve search rankings and increase organic traffic.",
      "Content Marketing": "Created educational content that attracted and engaged target audiences.",
      "Social Media Marketing": "Managed content strategies to strengthen brand visibility online.",
      "Content Writing & Storytelling": "Produced compelling blog articles and brand narratives.",
      "Marketing Analytics": "Analyzed campaign data to refine strategy and improve results.",
      "Digital Advertising": "Managed advertising accounts and campaign setups for online platforms.",
      "Audience Targeting": "Identified customer segments to improve marketing effectiveness.",
      "Campaign Optimization": "Adjusted campaigns to increase engagement and conversions.",
      "ROI Strategy": "Evaluated marketing investments to maximize returns.",
      "Affiliate Marketing": "Increased conversions through strategic partnerships and referral campaigns.",
    },
    "Other Skills": {
      "Public Speaking (Toastmasters)": "Delivered structured speeches to strengthen professional communication.",
      "Active Listening & Mentoring": "Supported colleagues and clients by understanding needs and providing guidance.",
      "Problem-Solving Under Pressure": "Resolved operational and client challenges quickly in demanding environments.",
      "Leadership & Growth Mindset": "Continuously improved skills and encouraged development within teams.",
      "Creative Thinking & Solution Generation": "Developed innovative approaches to marketing and sales challenges.",
      "Leadership Presence & Team Motivation": "Inspired teams through clear direction and positive energy.",
      "Self-Motivated & Growth-Oriented": "Proactively pursued opportunities to improve performance and knowledge.",
      "Persuasive Communication": "Influenced decisions through consultative conversations and value-focused messaging.",
      "Empathy & Emotional Intelligence": "Built meaningful relationships by understanding client emotions and perspectives.",
    },
  };

  const entries = await env.getEntries({ content_type: "skillCategory", limit: 100 });
  const strengths = entries.items.filter(e => e.fields.section?.["en-US"] === "strengths");

  for (const entry of strengths) {
    const catName = entry.fields.categoryName?.["en-US"];
    const catDescs = descriptions[catName];
    if (!catDescs) continue;

    const skills = entry.fields.skills?.["en-US"] || [];
    const updated = skills.map(skill => ({
      ...skill,
      description: catDescs[skill.name] || skill.description || undefined,
    }));

    entry.fields.skills = { "en-US": updated };
    const u = await entry.update();
    await u.publish();
    console.log(`✓ ${catName}: ${updated.length} skills updated with descriptions`);
  }

  console.log("\n🎉 All skill descriptions added!");
}

main().catch((err) => {
  console.error("❌ Failed:", err.message || err);
  process.exit(1);
});
