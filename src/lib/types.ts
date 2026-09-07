export type Reply = {
  id: string;
  noteId: string;
  author: string;
  body: string;
  createdAt: string;
};

export type Note = {
  id: string;
  author: string;
  body: string;
  kind: "note" | "seed";
  createdAt: string;
  updatedAt: string;
  replies: Reply[];
};

export type ActionResult = { ok: true } | { ok: false; error: string };
