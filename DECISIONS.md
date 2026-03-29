# Candidate Decisions & Notes

Please use this file to briefly outline your technical choices and the rationale behind them.

## 1. State Management & Architecture

_Why did you structure your state the way you did? Which patterns did you choose for handling the flaky API requests, loading states, and error handling?_

All fetch state (ex. products , loading , error , retry count etc) lives in a custom hook in `useProducts.ts`.This Separates network concers from the UI layer - `App.tsx`.Hook auto retries up to 3 times (1.5s delau) before popping up an error.A manual `retry()` funcion is been exposed for _Try Again_ button after all tries failed.

## 2. Trade-offs and Omissions

_What did you intentionally leave out given the constraints of a take-home assignment? If you had more time, what would you prioritize next?_

- No react query : Added the retry layer manually to keep it simple and the dependencies minimal
- No optimisstic UI for the cart button ,it's decorative just
- Search debounce alone doesnt eliminate race condition.If two requests are in flight simultaneously, a slower earlier request can resolve after a fastter later one, over writing the correct results.It could be solved by `AbortController`.This is not implemented cause our mockApi uses setTimout internally rather than a real `fetch()`.

## 3. AI Usage

_How did you utilize AI tools (ChatGPT, Copilot, Cursor, etc.) during this assignment? Provide a brief summary of how they assisted you._

I used Claude (claude.ai) as a thinking partner throughout this assignment
rather than a code generator.

Specifically:

**Architecture discussions** — I described the flaky API problem and asked
Claude to explain different retry strategies (exponential backoff, fixed delay,
max attempts). I then chose a fixed 1500ms delay with 3 max retries.

**Code scaffolding** — I asked Claude to generate an initial skeleton for
the `useProducts` hook and the ellipsis pagination algorithm. In both cases ,i read every line, identified issues and rewrote the problematic sections myself.

## 4. Edge Cases Identified

_Did you notice any edge cases or bugs that you didn't have time to fix? Please list them here._

- If the user changes page while a retry is in flight, the old response could race with the new fetch.a production fix would use `AbortController`.
- `mockProducts` prices use `Math.random()` at module load time, so prices are stable across renders but differ between dev server restarts.
