import { sequence } from "astro:middleware";

import auth from "./auth";

export const onRequest = sequence(auth);
