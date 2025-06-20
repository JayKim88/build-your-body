import { rest } from "msw";

import { mockExercises } from "../__mocks__/data";

export const handlers = [
  rest.get("/api/exercises", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ data: mockExercises }));
  }),
  // rest.get(
  //   `${process.env.NEXT_PUBLIC_API_URL}/api/my-stats`,
  //   (req, res, ctx) => {
  //     return res(
  //       ctx.status(201),
  //       ctx.json({ data: ["2025-06-13", "2025-06-20"] })
  //     );
  //   }
  // ),
];
