# work-study-sim 🧠💸

**work-study-sim** is a gamified productivity simulator that helps you **quantify the value of your time spent focusing on work**. By combining real-time focus tracking with a simulated job economy based on actual salaries and locations, this app keeps you motivated through progress, earnings, and growth.

## 🚀 MVP Features (In Progress)

### ⏱ Focus Timer

- Built-in stopwatch to track focus sessions in real time.
- Manual session entry for missed or offline sessions.
- Support for multiple timing methods (e.g. Pomodoro).
- Session history and stats.
- Leaderboard for total focus time.

### 💰 Simulated Earnings

- Select a preconfigured career and region.
- Earn virtual currency based on your job/location and time worked.
- Bonuses for high-performance jobs (e.g. finance sector overtime).
- Currency value varies by location.
- Earnings leaderboard with filters by job, region, and time.

---

## 📈 Planned Features (Post-MVP)

### 🏦 Stock Market

- Invest your in-game earnings in real-world stocks via a financial data API.
- Track portfolio value and compete on investment leaderboards.

### 🧍‍♂️ Mini-Me (Custom Avatar)

- Create a customizable character to represent yourself.
- Spend virtual money on apartments, outfits, cars, and more.

### 🎓 Job Market & Career Growth

- Start with a low-end role in your selected career path.
- Upload your study material for AI-generated "interviews."
- Pass interviews to earn promotions and salary increases.
- Leaderboards for interviews passed, highest scores, etc.

---

## 🏆 Leaderboards

- Track focus time, earnings, and career progression.
- Filter by time range (weekly, monthly, yearly, all-time), location, or career.
- Users can opt in/out of visibility on public boards.

---

## 🧱 Tech Stack

### Frontend

- **Framework:** Next.js with TypeScript
- **UI:** Tailwind CSS (planned), Origin UI (in use)

### Backend

- **Server:** Go (planned)
- **Database:** PostgreSQL (planned)
- **Auth & Privacy:** Auth.js with opt-in leaderboard visibility

### External Services (Planned)

- Real-time stock data API (e.g., Yahoo Finance, Alpha Vantage)
- OpenAI API for question generation and interview grading

---

## 💡 Why?

Because your time has value.  
**work-study-sim** helps you visualize that value through simulated income, career growth, and leaderboards — turning your study/work hours into a tangible source of motivation.

---

## 📌 Project Status

Currently building the MVP:

- [x] Next.js frontend scaffolding
- [x] Focus timer (manual + stopwatch)
- [ ] Earnings engine based on job/location
- [ ] Leaderboards (focus + earnings)
- [ ] Go API and Postgres integration

---

## 📜 License

Apache-2.0 License.
