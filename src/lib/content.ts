/**
 * Static content: what the app already does, and the first round of
 * suggestions that sits pinned at the top of the board.
 */

export const CURRENT_FEATURES = [
  {
    title: "Registration form",
    items: [
      "Full name",
      "Gender",
      "Age group",
      "What describes your visit today?",
      "Do you live in Arusha?",
      "Phone number",
      "Email address",
      "Occupation type",
      "What are you interested in?",
      "How did you hear about IRCA?",
      "How can we pray for you?",
      "What did you like about our service today?",
    ],
  },
  {
    title: "Admin dashboard",
    items: [
      "Password login",
      "Live data from Firebase",
      "Summary counts: total registrations, joining church, salvation, baptism, this month",
      "Quick filter tabs: all members, joining church, salvation, baptism, volunteers",
      "Filters: gender, age group, search by name, phone or email",
      "Member list with expandable details",
      "Export CSV",
      "Refresh",
    ],
  },
];

export type SeedItem = { text: string; sub?: string[] };

export const SEED_AUTHOR = "Kaka Allord";
export const SEED_ID = "allord-seed";

export const SEED_ITEMS: SeedItem[] = [
  {
    text: "**What describes your visit today?** — for “Other”, they should be able to type.",
  },
  {
    text: "**Do you live in Arusha?** — split “No” into two:",
    sub: [
      "No — from another region → region + time of stay in Arusha + how often they visit Arusha",
      "No — from another country → country + time of stay in Arusha + how often they visit Arusha",
    ],
  },
  { text: "**Phone number** — country code, with a flag." },
  {
    text: "**How did you hear about IRCA?** — “Other” should have a typing option. The dashboard should also carry the metrics of this, so the church knows what works more.",
  },
  { text: "Compulsory fields should be enforced to be really compulsory." },
  {
    text: "In the admin dashboard, as filtering parameters are changed it should truly filter in realtime — no need to press Filter every time.",
  },
  {
    text: "Toggle buttons to manage members who needed salvation and are already saved, and members who needed baptism and are already baptised.",
  },
  {
    text: "A way to know the new converts and follow them up in the section of foundation classes after they are saved.",
  },
  {
    text: "Create a page for members. For those whose data is not fully filled in, a way should be found so they can be known and reminded to fill in their information.",
  },
  {
    text: "Make the onboarding process user friendly and not tiresome while still achieving the same value — there is a lot to be filled just for someone to finish the registration.",
  },
  { text: "Add pastors’ contacts." },
];

export const APP_URL = "https://irca.netlify.app/";
