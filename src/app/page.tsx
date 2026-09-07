import Board from "@/components/Board";
import SetupNotice from "@/components/SetupNotice";
import { getNotes } from "@/lib/notes";
import type { Note } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Page() {
  let notes: Note[];

  try {
    notes = await getNotes();
  } catch (err) {
    console.error(err);
    const missingUrl = err instanceof Error && err.message.includes("DATABASE_URL is not set");
    return <SetupNotice missingUrl={missingUrl} />;
  }

  return <Board notes={notes} />;
}
