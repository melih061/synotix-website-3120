import { createContactHandler } from "./contact-core";

const handleContactRequest = createContactHandler();

export async function POST(req: Request) {
  return handleContactRequest(req);
}
